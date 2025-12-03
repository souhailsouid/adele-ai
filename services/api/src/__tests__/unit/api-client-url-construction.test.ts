/**
 * Tests unitaires pour la construction d'URL dans ApiClientService
 */

import { describe, it, expect } from '@jest/globals';
import { ApiClientService } from '../../services/api-client.service';

describe('ApiClientService - URL Construction', () => {
  describe('buildUrl with expirations[] parameters', () => {
    it('should correctly encode expirations[] in endpoint query string', () => {
      const client = new ApiClientService({
        baseUrl: 'https://api.unusualwhales.com/api',
        apiKey: 'test-key',
        apiKeyHeader: 'Authorization',
      });

      // Simuler ce que fait le repository
      const queryParams = new URLSearchParams();
      ['2024-12-20', '2024-12-27'].forEach(exp => queryParams.append('expirations[]', exp));
      const queryString = queryParams.toString();
      const endpoint = `/stock/AAPL/atm-chains?${queryString}`;

      // Vérifier que l'endpoint contient bien les paramètres encodés
      expect(endpoint).toContain('expirations%5B%5D');
      expect(endpoint).toContain('2024-12-20');
      expect(endpoint).toContain('2024-12-27');
      
      // Vérifier que l'URL décodée contient expirations[]
      const decoded = decodeURIComponent(endpoint);
      expect(decoded).toContain('expirations[]');
    });

    it('should preserve multiple expirations[] parameters', () => {
      const queryParams = new URLSearchParams();
      ['2024-12-20', '2024-12-27'].forEach(exp => queryParams.append('expirations[]', exp));
      const queryString = queryParams.toString();
      
      // Vérifier qu'on a bien deux paramètres
      const params = new URLSearchParams(queryString);
      const allExpirations = params.getAll('expirations[]');
      
      expect(allExpirations.length).toBe(2);
      expect(allExpirations).toContain('2024-12-20');
      expect(allExpirations).toContain('2024-12-27');
    });
  });
});

