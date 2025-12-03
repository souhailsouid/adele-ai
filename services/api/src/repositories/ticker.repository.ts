/**
 * Repository pour les données ticker
 * Séparation des responsabilités : accès aux données uniquement
 */

import { Quote, Ownership, Activity } from '../types/ticker.types';
import { CacheService } from '../services/cache.service';
import { ApiClientService, createUnusualWhalesClient, createFMPClient } from '../services/api-client.service';
import { logger } from '../utils/logger';
import { ExternalApiError, handleError } from '../utils/errors';

export class TickerRepository {
  private quoteCache: CacheService;
  private ownershipCache: CacheService;
  private activityCache: CacheService;
  private fmpClient: ApiClientService;
  private uwClient: ApiClientService;

  constructor() {
    this.quoteCache = new CacheService({ tableName: 'ticker_quotes', ttlHours: 1 });
    this.ownershipCache = new CacheService({ tableName: 'ticker_ownership', ttlHours: 24 });
    this.activityCache = new CacheService({ tableName: 'institutional_activity', ttlHours: 24 });
    this.fmpClient = createFMPClient();
    this.uwClient = createUnusualWhalesClient();
  }

  // ========== Quote ==========

  async getCachedQuote(ticker: string): Promise<Quote | null> {
    return this.quoteCache.get<Quote>(ticker);
  }

  async fetchQuoteFromAPI(ticker: string): Promise<Quote> {
    return handleError(async () => {
      const response = await this.fmpClient.get<any[]>(`/quote`, { symbol: ticker.toUpperCase() });

      if (!Array.isArray(response) || response.length === 0) {
        throw new ExternalApiError('FMP', `Quote not found for ticker: ${ticker}`);
      }

      const quoteData = response[0];
      return {
        symbol: quoteData.symbol,
        price: quoteData.price,
        change: quoteData.change,
        changePercent: quoteData.changePercentage || quoteData.changesPercentage || 0,
        volume: quoteData.volume,
        marketCap: quoteData.marketCap,
        timestamp: new Date().toISOString(),
      };
    }, `Fetch quote for ${ticker}`);
  }

  async cacheQuote(ticker: string, quote: Quote): Promise<void> {
    await this.quoteCache.set(ticker, quote);
  }

  // ========== Ownership ==========

  async getCachedOwnership(ticker: string, limit: number = 100): Promise<Ownership[]> {
    return this.ownershipCache.getMany<Ownership>(ticker, 'ticker', limit);
  }

  async fetchOwnershipFromAPI(ticker: string): Promise<Ownership[]> {
    return handleError(async () => {
      const response = await this.uwClient.get<any>(`/ownership/${ticker.toUpperCase()}`);

      // Gérer les différents formats de réponse
      const data = Array.isArray(response) ? response : (response?.data || []);
      
      if (!Array.isArray(data)) {
        throw new ExternalApiError('Unusual Whales', 'Invalid response format for ownership');
      }

      return data.map((item: any) => ({
        name: item.name || item.institution_name,
        shares: parseInt(item.shares || item.units || '0', 10),
        units: parseInt(item.units || item.shares || '0', 10),
        value: parseFloat(item.value || '0'),
        is_hedge_fund: item.is_hedge_fund || false,
        report_date: item.report_date || item.date,
        filing_date: item.filing_date || item.date,
        percentage: item.percentage ? parseFloat(item.percentage) : undefined,
      }));
    }, `Fetch ownership for ${ticker}`);
  }

  async cacheOwnership(ticker: string, ownership: Ownership[]): Promise<void> {
    await this.ownershipCache.setMany(ticker, ownership);
  }

  // ========== Activity ==========

  async getCachedActivity(ticker: string, limit: number = 100): Promise<Activity[]> {
    return this.activityCache.getMany<Activity>(ticker, 'ticker', limit);
  }

  async fetchActivityForInstitution(institutionName: string, ticker: string): Promise<Activity[]> {
    return handleError(async () => {
      const encodedName = encodeURIComponent(institutionName);
      const response = await this.uwClient.get<any>(
        `/institution/${encodedName}/activity`,
        { ticker: ticker.toUpperCase(), limit: '20' }
      );

      const data = Array.isArray(response) ? response : (response?.data || []);
      
      if (!Array.isArray(data)) {
        return [];
      }

      return data
        .filter((item: any) => item.ticker === ticker.toUpperCase())
        .map((item: any) => ({
          institution_name: institutionName,
          units_change: item.units_change || 0,
          change: item.change || item.units_change || 0,
          avg_price: item.avg_price || 0,
          buy_price: item.buy_price || null,
          sell_price: item.sell_price || null,
          filing_date: item.filing_date,
          report_date: item.report_date,
          price_on_filing: item.price_on_filing || 0,
          price_on_report: item.price_on_report || 0,
          close: item.close || 0,
          transaction_type: ((item.units_change || 0) > 0 ? "BUY" : "SELL") as "BUY" | "SELL",
        }));
    }, `Fetch activity for ${institutionName} - ${ticker}`);
  }

  async cacheActivity(ticker: string, activities: Activity[]): Promise<void> {
    await this.activityCache.setMany(ticker, activities);
  }
}

