/**
 * Service métier FMP (Financial Modeling Prep)
 * Contient la logique métier, utilise le repository pour l'accès aux données
 */

import { FMPRepository } from '../repositories/fmp.repository';
import { CacheService } from './cache.service';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types/ticker.types';
import { handleError } from '../utils/errors';

export class FMPService {
  private repository: FMPRepository;
  private cache: CacheService;

  constructor() {
    this.repository = new FMPRepository();
    this.cache = new CacheService({ tableName: 'fmp_cache', ttlHours: 24 });
  }

  // ========== Quote & Market Data ==========

  async getQuote(symbol: string, forceRefresh: boolean = false): Promise<ApiResponse<any>> {
    const log = logger.child({ symbol, operation: 'getQuote' });
    
    return handleError(async () => {
      // Vérifier le cache
      if (!forceRefresh) {
        const cached = await this.cache.get<any>(symbol, 'symbol');
        if (cached) {
          log.debug('Quote found in cache');
          return {
            success: true,
            data: cached,
            cached: true,
            timestamp: cached.timestamp || new Date().toISOString(),
          };
        }
      }

      // Récupérer depuis l'API
      log.info('Fetching quote from API');
      const quote = await this.repository.getQuote(symbol);
      const quoteWithTimestamp = { ...quote, timestamp: new Date().toISOString() };

      // Mettre en cache
      await this.cache.set(symbol, quoteWithTimestamp, 'symbol', 1);

      return {
        success: true,
        data: quoteWithTimestamp,
        cached: false,
        timestamp: quoteWithTimestamp.timestamp,
      };
    }, `Get quote for ${symbol}`);
  }

  async getHistoricalPrice(symbol: string, period: string = '1day', forceRefresh: boolean = false): Promise<ApiResponse<any[]>> {
    const log = logger.child({ symbol, period, operation: 'getHistoricalPrice' });
    
    return handleError(async () => {
      const cacheKey = `${symbol}_${period}`;
      
      if (!forceRefresh) {
        const cached = await this.cache.get<any[]>(cacheKey, 'cache_key');
        if (cached) {
          log.debug('Historical price found in cache');
          return {
            success: true,
            data: cached,
            cached: true,
            count: cached.length,
            timestamp: new Date().toISOString(),
          };
        }
      }

      log.info('Fetching historical price from API');
      const data = await this.repository.getHistoricalPrice(symbol, period);

      if (data.length > 0) {
        await this.cache.set(cacheKey, data, 'cache_key', 24);
      }

      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get historical price for ${symbol}`);
  }

  // ========== Financial Statements ==========

  async getIncomeStatement(symbol: string, period: string = 'annual', limit: number = 5): Promise<ApiResponse<any[]>> {
    return handleError(async () => {
      const data = await this.repository.getIncomeStatement(symbol, period, limit);
      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get income statement for ${symbol}`);
  }

  async getBalanceSheet(symbol: string, period: string = 'annual', limit: number = 5): Promise<ApiResponse<any[]>> {
    return handleError(async () => {
      const data = await this.repository.getBalanceSheet(symbol, period, limit);
      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get balance sheet for ${symbol}`);
  }

  async getCashFlow(symbol: string, period: string = 'annual', limit: number = 5): Promise<ApiResponse<any[]>> {
    return handleError(async () => {
      const data = await this.repository.getCashFlow(symbol, period, limit);
      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get cash flow for ${symbol}`);
  }

  // ========== Financial Metrics ==========

  async getKeyMetrics(symbol: string, period: string = 'annual', limit: number = 5): Promise<ApiResponse<any[]>> {
    return handleError(async () => {
      const data = await this.repository.getKeyMetrics(symbol, period, limit);
      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get key metrics for ${symbol}`);
  }

  async getRatios(symbol: string, period: string = 'annual', limit: number = 5): Promise<ApiResponse<any[]>> {
    return handleError(async () => {
      const data = await this.repository.getRatios(symbol, period, limit);
      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get ratios for ${symbol}`);
  }

  async getDCF(symbol: string): Promise<ApiResponse<any>> {
    return handleError(async () => {
      const data = await this.repository.getDCF(symbol);
      return {
        success: true,
        data,
        cached: false,
        timestamp: new Date().toISOString(),
      };
    }, `Get DCF for ${symbol}`);
  }

  async getEnterpriseValue(symbol: string, period: string = 'annual', limit: number = 5): Promise<ApiResponse<any[]>> {
    return handleError(async () => {
      const data = await this.repository.getEnterpriseValue(symbol, period, limit);
      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get enterprise value for ${symbol}`);
  }

  // ========== Earnings & Estimates ==========

  async getEarnings(symbol: string, limit: number = 10): Promise<ApiResponse<any[]>> {
    return handleError(async () => {
      const data = await this.repository.getEarnings(symbol, limit);
      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get earnings for ${symbol}`);
  }

  async getEarningsTranscript(symbol: string, limit: number = 10): Promise<ApiResponse<any[]>> {
    return handleError(async () => {
      const data = await this.repository.getEarningsTranscript(symbol, limit);
      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get earnings transcript for ${symbol}`);
  }

  async getEarningsEstimates(symbol: string, period: string = 'annual', limit: number = 10): Promise<ApiResponse<any[]>> {
    return handleError(async () => {
      const data = await this.repository.getEarningsEstimates(symbol, period, limit);
      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get earnings estimates for ${symbol}`);
  }

  async getEarningsSurprises(symbol: string, limit: number = 10): Promise<ApiResponse<any[]>> {
    return handleError(async () => {
      const data = await this.repository.getEarningsSurprises(symbol, limit);
      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get earnings surprises for ${symbol}`);
  }

  async getAnalystEstimates(symbol: string, period: string = 'annual', limit: number = 10): Promise<ApiResponse<any[]>> {
    return handleError(async () => {
      const data = await this.repository.getAnalystEstimates(symbol, period, limit);
      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get analyst estimates for ${symbol}`);
  }

  // ========== Insider & Institutional ==========

  async getInsiderTrades(symbol: string, limit: number = 100): Promise<ApiResponse<any[]>> {
    return handleError(async () => {
      const data = await this.repository.getInsiderTrades(symbol, limit);
      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get insider trades for ${symbol}`);
  }

  async getHedgeFundHoldings(symbol: string, limit: number = 100): Promise<ApiResponse<any[]>> {
    return handleError(async () => {
      const data = await this.repository.getHedgeFundHoldings(symbol, limit);
      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get hedge fund holdings for ${symbol}`);
  }

  // ========== Market Data ==========

  async getMarketNews(symbol?: string, limit: number = 50): Promise<ApiResponse<any[]>> {
    return handleError(async () => {
      const data = await this.repository.getMarketNews(symbol, limit);
      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get market news${symbol ? ` for ${symbol}` : ''}`);
  }

  async getEconomicCalendar(from: string, to: string): Promise<ApiResponse<any[]>> {
    return handleError(async () => {
      const data = await this.repository.getEconomicCalendar(from, to);
      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get economic calendar from ${from} to ${to}`);
  }

  async getEarningsCalendar(from: string, to: string): Promise<ApiResponse<any[]>> {
    return handleError(async () => {
      const data = await this.repository.getEarningsCalendar(from, to);
      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get earnings calendar from ${from} to ${to}`);
  }

  async getScreener(criteria: Record<string, any>): Promise<ApiResponse<any[]>> {
    return handleError(async () => {
      const data = await this.repository.getScreener(criteria);
      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, 'Get screener results');
  }

  // ========== SEC Filings ==========

  async getSECFilings(symbol: string, type?: string, limit: number = 10): Promise<ApiResponse<any[]>> {
    return handleError(async () => {
      const data = await this.repository.getSECFilings(symbol, type, limit);
      return {
        success: true,
        data,
        cached: false,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get SEC filings for ${symbol}`);
  }
}

