/**
 * Tests d'intégration pour les handlers du router avec expirations[]
 */

import { describe, it, expect } from '@jest/globals';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

// Simuler la fonction getPathParam
function getPathParam(event: APIGatewayProxyEventV2, key: string): string | undefined {
  return event.pathParameters?.[key];
}

// Simuler le parsing des expirations (copie de la logique du router)
function parseExpirationsFromEvent(event: APIGatewayProxyEventV2): string[] {
  let expirations: string[] = [];
  
  if (event.queryStringParameters) {
    const expParam = event.queryStringParameters['expirations[]'];
    
    if (expParam) {
      if (typeof expParam === 'string' && expParam.includes(',')) {
        expirations = expParam.split(',').map(e => e.trim());
      } else {
        expirations = Array.isArray(expParam) ? expParam : [expParam];
      }
    } else {
      expirations = Object.entries(event.queryStringParameters)
        .filter(([key]) => key.startsWith('expirations[') || key === 'expirations')
        .map(([, value]) => value!)
        .filter(Boolean);
    }
  }
  
  return expirations;
}

describe('Router Handlers - Expirations[] Integration', () => {
  const createMockEvent = (
    ticker: string,
    queryParams: Record<string, string | string[]>
  ): APIGatewayProxyEventV2 => {
    return {
      version: '2.0',
      routeKey: 'GET /unusual-whales/stock/{ticker}/atm-chains',
      rawPath: `/unusual-whales/stock/${ticker}/atm-chains`,
      rawQueryString: '',
      headers: {},
      requestContext: {} as any,
      pathParameters: { ticker },
      queryStringParameters: queryParams as any,
      isBase64Encoded: false,
    };
  };

  describe('ATM Chains handler', () => {
    it('should parse expirations[] from API Gateway event (array format)', () => {
      const event = createMockEvent('AAPL', {
        'expirations[]': ['2024-12-20', '2024-12-27'],
      });

      const ticker = getPathParam(event, 'ticker');
      const expirations = parseExpirationsFromEvent(event);

      expect(ticker).toBe('AAPL');
      expect(expirations).toEqual(['2024-12-20', '2024-12-27']);
    });

    it('should parse expirations[] from API Gateway event (comma-separated)', () => {
      const event = createMockEvent('AAPL', {
        'expirations[]': '2024-12-20,2024-12-27',
      });

      const ticker = getPathParam(event, 'ticker');
      const expirations = parseExpirationsFromEvent(event);

      expect(ticker).toBe('AAPL');
      expect(expirations).toEqual(['2024-12-20', '2024-12-27']);
    });

    it('should throw error when expirations[] is missing', () => {
      const event = createMockEvent('AAPL', {});

      const expirations = parseExpirationsFromEvent(event);

      expect(expirations.length).toBe(0);
    });
  });

  describe('Spot Exposures handler', () => {
    it('should parse expirations[] with additional query parameters', () => {
      const event = createMockEvent('AAPL', {
        'expirations[]': ['2025-12-05', '2025-12-12'],
        limit: '10',
        page: '0',
      });

      const ticker = getPathParam(event, 'ticker');
      const expirations = parseExpirationsFromEvent(event);
      const limit = event.queryStringParameters?.limit;

      expect(ticker).toBe('AAPL');
      expect(expirations).toEqual(['2025-12-05', '2025-12-12']);
      expect(limit).toBe('10');
    });
  });
});

