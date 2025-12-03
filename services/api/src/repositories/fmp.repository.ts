/**
 * Repository FMP (Financial Modeling Prep)
 * Accès aux données FMP uniquement - pas de logique métier
 */

import { ApiClientService, createFMPClient } from '../services/api-client.service';
import { logger } from '../utils/logger';
import { ExternalApiError, handleError } from '../utils/errors';

export class FMPRepository {
  private client: ApiClientService;

  constructor() {
    this.client = createFMPClient();
  }

  // ========== Quote & Market Data ==========

  async getQuote(symbol: string): Promise<any> {
    return handleError(async () => {
      const response = await this.client.get<any[]>(`/quote`, { symbol: symbol.toUpperCase() });
      if (!Array.isArray(response) || response.length === 0) {
        throw new ExternalApiError('FMP', `Quote not found for symbol: ${symbol}`);
      }
      return response[0];
    }, `Get quote for ${symbol}`);
  }

  async getHistoricalPrice(symbol: string, period: string = '1day'): Promise<any[]> {
    return handleError(async () => {
      const endpoint = period === '1day' ? `/historical-price-full/${symbol}` : `/historical-chart/${period}/${symbol}`;
      const response = await this.client.get<any>(endpoint);
      return Array.isArray(response) ? response : (response?.historical || []);
    }, `Get historical price for ${symbol}`);
  }

  async getMarketCap(symbol: string): Promise<number> {
    return handleError(async () => {
      const quote = await this.getQuote(symbol);
      return quote.marketCap || 0;
    }, `Get market cap for ${symbol}`);
  }

  // ========== Financial Statements ==========

  async getIncomeStatement(symbol: string, period: string = 'annual', limit: number = 5): Promise<any[]> {
    return handleError(async () => {
      const response = await this.client.get<any[]>(`/income-statement/${symbol.toUpperCase()}`, {
        period,
        limit: String(limit),
      });
      return Array.isArray(response) ? response : [];
    }, `Get income statement for ${symbol}`);
  }

  async getBalanceSheet(symbol: string, period: string = 'annual', limit: number = 5): Promise<any[]> {
    return handleError(async () => {
      const response = await this.client.get<any[]>(`/balance-sheet-statement/${symbol.toUpperCase()}`, {
        period,
        limit: String(limit),
      });
      return Array.isArray(response) ? response : [];
    }, `Get balance sheet for ${symbol}`);
  }

  async getCashFlow(symbol: string, period: string = 'annual', limit: number = 5): Promise<any[]> {
    return handleError(async () => {
      const response = await this.client.get<any[]>(`/cash-flow-statement/${symbol.toUpperCase()}`, {
        period,
        limit: String(limit),
      });
      return Array.isArray(response) ? response : [];
    }, `Get cash flow for ${symbol}`);
  }

  // ========== Financial Metrics ==========

  async getKeyMetrics(symbol: string, period: string = 'annual', limit: number = 5): Promise<any[]> {
    return handleError(async () => {
      const response = await this.client.get<any[]>(`/key-metrics/${symbol.toUpperCase()}`, {
        period,
        limit: String(limit),
      });
      return Array.isArray(response) ? response : [];
    }, `Get key metrics for ${symbol}`);
  }

  async getRatios(symbol: string, period: string = 'annual', limit: number = 5): Promise<any[]> {
    return handleError(async () => {
      const response = await this.client.get<any[]>(`/ratios/${symbol.toUpperCase()}`, {
        period,
        limit: String(limit),
      });
      return Array.isArray(response) ? response : [];
    }, `Get ratios for ${symbol}`);
  }

  async getDCF(symbol: string): Promise<any> {
    return handleError(async () => {
      const response = await this.client.get<any[]>(`/discounted-cash-flow/${symbol.toUpperCase()}`);
      if (!Array.isArray(response) || response.length === 0) {
        throw new ExternalApiError('FMP', `DCF not found for symbol: ${symbol}`);
      }
      return response[0];
    }, `Get DCF for ${symbol}`);
  }

  async getEnterpriseValue(symbol: string, period: string = 'annual', limit: number = 5): Promise<any[]> {
    return handleError(async () => {
      const response = await this.client.get<any[]>(`/enterprise-values/${symbol.toUpperCase()}`, {
        period,
        limit: String(limit),
      });
      return Array.isArray(response) ? response : [];
    }, `Get enterprise value for ${symbol}`);
  }

  // ========== Earnings & Estimates ==========

  async getEarnings(symbol: string, limit: number = 10): Promise<any[]> {
    return handleError(async () => {
      const response = await this.client.get<any[]>(`/earnings/${symbol.toUpperCase()}`, {
        limit: String(limit),
      });
      return Array.isArray(response) ? response : [];
    }, `Get earnings for ${symbol}`);
  }

  async getEarningsTranscript(symbol: string, limit: number = 10): Promise<any[]> {
    return handleError(async () => {
      const response = await this.client.get<any[]>(`/earnings-transcript/${symbol.toUpperCase()}`, {
        limit: String(limit),
      });
      return Array.isArray(response) ? response : [];
    }, `Get earnings transcript for ${symbol}`);
  }

  async getEarningsEstimates(symbol: string, period: string = 'annual', limit: number = 10): Promise<any[]> {
    return handleError(async () => {
      const response = await this.client.get<any[]>(`/earnings-estimates/${symbol.toUpperCase()}`, {
        period,
        limit: String(limit),
      });
      return Array.isArray(response) ? response : [];
    }, `Get earnings estimates for ${symbol}`);
  }

  async getEarningsSurprises(symbol: string, limit: number = 10): Promise<any[]> {
    return handleError(async () => {
      const response = await this.client.get<any[]>(`/earnings-surprises/${symbol.toUpperCase()}`, {
        limit: String(limit),
      });
      return Array.isArray(response) ? response : [];
    }, `Get earnings surprises for ${symbol}`);
  }

  async getAnalystEstimates(symbol: string, period: string = 'annual', limit: number = 10): Promise<any[]> {
    return handleError(async () => {
      const response = await this.client.get<any[]>(`/analyst-estimates/${symbol.toUpperCase()}`, {
        period,
        limit: String(limit),
      });
      return Array.isArray(response) ? response : [];
    }, `Get analyst estimates for ${symbol}`);
  }

  // ========== Insider & Institutional ==========

  async getInsiderTrades(symbol: string, limit: number = 100): Promise<any[]> {
    return handleError(async () => {
      const response = await this.client.get<any[]>(`/insider-trading/${symbol.toUpperCase()}`, {
        limit: String(limit),
      });
      return Array.isArray(response) ? response : [];
    }, `Get insider trades for ${symbol}`);
  }

  async getHedgeFundHoldings(symbol: string, limit: number = 100): Promise<any[]> {
    return handleError(async () => {
      const response = await this.client.get<any[]>(`/etf-holder/${symbol.toUpperCase()}`, {
        limit: String(limit),
      });
      return Array.isArray(response) ? response : [];
    }, `Get hedge fund holdings for ${symbol}`);
  }

  // ========== Market Data ==========

  async getMarketNews(symbol?: string, limit: number = 50): Promise<any[]> {
    return handleError(async () => {
      const params: Record<string, string> = { limit: String(limit) };
      if (symbol) {
        params.symbol = symbol.toUpperCase();
      }
      const response = await this.client.get<any[]>(`/stock_news`, params);
      return Array.isArray(response) ? response : [];
    }, `Get market news${symbol ? ` for ${symbol}` : ''}`);
  }

  async getEconomicCalendar(from: string, to: string): Promise<any[]> {
    return handleError(async () => {
      const response = await this.client.get<any[]>(`/economic_calendar`, {
        from,
        to,
      });
      return Array.isArray(response) ? response : [];
    }, `Get economic calendar from ${from} to ${to}`);
  }

  async getEarningsCalendar(from: string, to: string): Promise<any[]> {
    return handleError(async () => {
      const response = await this.client.get<any[]>(`/earnings_calendar`, {
        from,
        to,
      });
      return Array.isArray(response) ? response : [];
    }, `Get earnings calendar from ${from} to ${to}`);
  }

  async getScreener(criteria: Record<string, any>): Promise<any[]> {
    return handleError(async () => {
      const response = await this.client.get<any[]>(`/stock-screener`, criteria);
      return Array.isArray(response) ? response : [];
    }, 'Get screener results');
  }

  // ========== SEC Filings ==========

  async getSECFilings(symbol: string, type?: string, limit: number = 10): Promise<any[]> {
    return handleError(async () => {
      const params: Record<string, string> = { limit: String(limit) };
      if (type) {
        params.type = type;
      }
      const response = await this.client.get<any[]>(`/sec_filings/${symbol.toUpperCase()}`, params);
      return Array.isArray(response) ? response : [];
    }, `Get SEC filings for ${symbol}`);
  }
}

