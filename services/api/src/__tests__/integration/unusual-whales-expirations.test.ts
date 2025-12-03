/**
 * Tests d'intégration pour les endpoints avec expirations[]
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import { UnusualWhalesRepository } from '../../repositories/unusual-whales.repository';
import { ApiClientService } from '../../services/api-client.service';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

describe('Unusual Whales - Expirations[] Integration Tests', () => {
  let repository: UnusualWhalesRepository;
  const apiKey = process.env.UNUSUAL_WHALES_API_KEY || '925866f5-e97f-459d-850d-5d5856fef716';

  beforeAll(() => {
    const client = new ApiClientService({
      baseUrl: 'https://api.unusualwhales.com/api',
      apiKey: apiKey,
      apiKeyHeader: 'Authorization',
    });
    repository = new UnusualWhalesRepository(client);
  });

  describe('ATM Chains - expirations[]', () => {
    it('should successfully fetch ATM chains with multiple expirations', async () => {
      const ticker = 'AAPL';
      const expirations = ['2024-12-20', '2024-12-27'];

      const result = await repository.getATMChains(ticker, { expirations });

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    }, 30000);

    it('should handle single expiration', async () => {
      const ticker = 'AAPL';
      const expirations = ['2024-12-20'];

      const result = await repository.getATMChains(ticker, { expirations });

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    }, 30000);

    it('should throw error when expirations array is empty', async () => {
      const ticker = 'AAPL';
      const expirations: string[] = [];

      await expect(
        repository.getATMChains(ticker, { expirations })
      ).rejects.toThrow(/expirations/);
    });
  });

  describe('Spot Exposures By Strike & Expiry - expirations[]', () => {
    it('should successfully fetch spot exposures with multiple expirations', async () => {
      const ticker = 'AAPL';
      const expirations = ['2025-12-05', '2025-12-12'];

      const result = await repository.getSpotExposureByStrikeAndExpiry(ticker, { expirations });

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    }, 30000);

    it('should handle spot exposures with additional query parameters', async () => {
      const ticker = 'AAPL';
      const expirations = ['2025-12-05', '2025-12-12'];

      const result = await repository.getSpotExposureByStrikeAndExpiry(ticker, {
        expirations,
        limit: 10,
        page: 0,
      });

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    }, 30000);
  });
});
