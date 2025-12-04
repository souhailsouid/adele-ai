/**
 * Tests d'intégration pour l'API FMP
 * Teste les appels réels à l'API FMP pour identifier les problèmes
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import { FMPRepository } from '../../repositories/fmp.repository';
import { createFMPClient } from '../../services/api-client.service';

describe('FMP API Integration Tests', () => {
  let repository: FMPRepository;
  let apiKey: string;

  beforeAll(() => {
    apiKey = process.env.FMP_API_KEY || '';
    if (!apiKey) {
      throw new Error('FMP_API_KEY environment variable is required');
    }
    repository = new FMPRepository();
  });

  describe('Quote Endpoint', () => {
    it('should fetch quote for AAPL', async () => {
      const quote = await repository.getQuote('AAPL');
      expect(quote).toBeDefined();
      expect(quote.symbol).toBe('AAPL');
      expect(quote.price).toBeGreaterThan(0);
    });
  });

  describe('Historical Price Endpoint', () => {
    it('should fetch historical price for AAPL (1day)', async () => {
      try {
        const data = await repository.getHistoricalPrice('AAPL', '1day');
        console.log('Historical Price (1day) response:', JSON.stringify(data).substring(0, 200));
        expect(Array.isArray(data)).toBe(true);
      } catch (error: any) {
        console.error('Historical Price (1day) error:', error.message);
        // Si c'est un tableau vide, c'est probablement un problème d'accès API
        if (error.message.includes('404') || error.message.includes('Not Found')) {
          console.warn('⚠️  Historical Price endpoint may require paid plan');
        }
        throw error;
      }
    });

    it('should fetch historical price for AAPL (1hour)', async () => {
      try {
        const data = await repository.getHistoricalPrice('AAPL', '1hour');
        console.log('Historical Price (1hour) response:', JSON.stringify(data).substring(0, 200));
        expect(Array.isArray(data)).toBe(true);
      } catch (error: any) {
        console.error('Historical Price (1hour) error:', error.message);
        if (error.message.includes('404') || error.message.includes('Not Found')) {
          console.warn('⚠️  Historical Price (1hour) endpoint may require paid plan');
        }
        throw error;
      }
    });
  });

  describe('Financial Statements', () => {
    it('should fetch income statement for AAPL', async () => {
      try {
        const data = await repository.getIncomeStatement('AAPL', 'annual', 5);
        console.log('Income Statement response:', JSON.stringify(data).substring(0, 200));
        expect(Array.isArray(data)).toBe(true);
        if (data.length === 0) {
          console.warn('⚠️  Income Statement returned empty array - may require paid plan');
        }
      } catch (error: any) {
        console.error('Income Statement error:', error.message);
        if (error.message.includes('404') || error.message.includes('Not Found')) {
          console.warn('⚠️  Income Statement endpoint may require paid plan');
        }
        throw error;
      }
    });

    it('should fetch balance sheet for AAPL', async () => {
      try {
        const data = await repository.getBalanceSheet('AAPL', 'annual', 5);
        console.log('Balance Sheet response:', JSON.stringify(data).substring(0, 200));
        expect(Array.isArray(data)).toBe(true);
        if (data.length === 0) {
          console.warn('⚠️  Balance Sheet returned empty array - may require paid plan');
        }
      } catch (error: any) {
        console.error('Balance Sheet error:', error.message);
        if (error.message.includes('404') || error.message.includes('Not Found')) {
          console.warn('⚠️  Balance Sheet endpoint may require paid plan');
        }
        throw error;
      }
    });

    it('should fetch cash flow for AAPL', async () => {
      try {
        const data = await repository.getCashFlow('AAPL', 'annual', 5);
        console.log('Cash Flow response:', JSON.stringify(data).substring(0, 200));
        expect(Array.isArray(data)).toBe(true);
        if (data.length === 0) {
          console.warn('⚠️  Cash Flow returned empty array - may require paid plan');
        }
      } catch (error: any) {
        console.error('Cash Flow error:', error.message);
        if (error.message.includes('404') || error.message.includes('Not Found')) {
          console.warn('⚠️  Cash Flow endpoint may require paid plan');
        }
        throw error;
      }
    });
  });

  describe('Financial Metrics', () => {
    it('should fetch key metrics for AAPL', async () => {
      try {
        const data = await repository.getKeyMetrics('AAPL', 'annual', 5);
        console.log('Key Metrics response:', JSON.stringify(data).substring(0, 200));
        expect(Array.isArray(data)).toBe(true);
        if (data.length === 0) {
          console.warn('⚠️  Key Metrics returned empty array - may require paid plan');
        }
      } catch (error: any) {
        console.error('Key Metrics error:', error.message);
        if (error.message.includes('404') || error.message.includes('Not Found')) {
          console.warn('⚠️  Key Metrics endpoint may require paid plan');
        }
        throw error;
      }
    });

    it('should fetch ratios for AAPL', async () => {
      try {
        const data = await repository.getRatios('AAPL', 'annual', 5);
        console.log('Ratios response:', JSON.stringify(data).substring(0, 200));
        expect(Array.isArray(data)).toBe(true);
        if (data.length === 0) {
          console.warn('⚠️  Ratios returned empty array - may require paid plan');
        }
      } catch (error: any) {
        console.error('Ratios error:', error.message);
        if (error.message.includes('404') || error.message.includes('Not Found')) {
          console.warn('⚠️  Ratios endpoint may require paid plan');
        }
        throw error;
      }
    });

    it('should fetch DCF for AAPL', async () => {
      try {
        const data = await repository.getDCF('AAPL');
        console.log('DCF response:', JSON.stringify(data).substring(0, 200));
        expect(data).toBeDefined();
      } catch (error: any) {
        console.error('DCF error:', error.message);
        if (error.message.includes('404') || error.message.includes('Not Found')) {
          console.warn('⚠️  DCF endpoint may require paid plan');
        }
        throw error;
      }
    });
  });

  describe('Market Data', () => {
    it('should fetch market news', async () => {
      try {
        const data = await repository.getMarketNews(undefined, 5);
        console.log('Market News response:', JSON.stringify(data).substring(0, 200));
        expect(Array.isArray(data)).toBe(true);
        if (data.length === 0) {
          console.warn('⚠️  Market News returned empty array - may require paid plan');
        }
      } catch (error: any) {
        console.error('Market News error:', error.message);
        if (error.message.includes('404') || error.message.includes('Not Found')) {
          console.warn('⚠️  Market News endpoint may require paid plan');
        }
        throw error;
      }
    });

    it('should fetch market news for AAPL', async () => {
      try {
        const data = await repository.getMarketNews('AAPL', 5);
        console.log('Market News (AAPL) response:', JSON.stringify(data).substring(0, 200));
        expect(Array.isArray(data)).toBe(true);
        if (data.length === 0) {
          console.warn('⚠️  Market News (AAPL) returned empty array - may require paid plan');
        }
      } catch (error: any) {
        console.error('Market News (AAPL) error:', error.message);
        if (error.message.includes('404') || error.message.includes('Not Found')) {
          console.warn('⚠️  Market News (AAPL) endpoint may require paid plan');
        }
        throw error;
      }
    });
  });

  describe('Direct API URL Testing', () => {
    it('should test direct API call to historical-price-full', async () => {
      const client = createFMPClient();
      const url = `https://financialmodelingprep.com/stable/historical-price-full/AAPL?apikey=${apiKey}`;
      console.log('Testing URL:', url.replace(apiKey, '***'));
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Direct API response status:', response.status);
        console.log('Direct API response:', JSON.stringify(data).substring(0, 200));
        
        if (response.status === 200 && Array.isArray(data) && data.length === 0) {
          console.warn('⚠️  API returned 200 with empty array - endpoint may require paid plan');
        }
      } catch (error: any) {
        console.error('Direct API call error:', error.message);
      }
    });

    it('should test direct API call to income-statement', async () => {
      const url = `https://financialmodelingprep.com/stable/income-statement/AAPL?apikey=${apiKey}&period=annual&limit=5`;
      console.log('Testing URL:', url.replace(apiKey, '***'));
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Direct API response status:', response.status);
        console.log('Direct API response:', JSON.stringify(data).substring(0, 200));
        
        if (response.status === 200 && Array.isArray(data) && data.length === 0) {
          console.warn('⚠️  API returned 200 with empty array - endpoint may require paid plan');
        }
      } catch (error: any) {
        console.error('Direct API call error:', error.message);
      }
    });
  });
});

