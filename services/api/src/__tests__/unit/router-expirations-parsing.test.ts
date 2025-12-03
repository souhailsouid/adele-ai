/**
 * Tests unitaires pour le parsing des paramètres expirations[] dans le router
 */

import { describe, it, expect } from '@jest/globals';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

/**
 * Fonction de parsing des expirations (copie de la logique du router)
 */
function parseExpirations(queryStringParameters: Record<string, any> | null | undefined): string[] {
  let expirations: string[] = [];
  
  if (queryStringParameters) {
    const expParam = queryStringParameters['expirations[]'];
    
    if (expParam) {
      // Si c'est une seule valeur avec virgules, la split
      if (typeof expParam === 'string' && expParam.includes(',')) {
        expirations = expParam.split(',').map(e => e.trim());
      } else {
        // Sinon, convertir en array
        expirations = Array.isArray(expParam) ? expParam : [expParam];
      }
    } else {
      // Méthode 2: Chercher toutes les clés qui commencent par expirations[
      expirations = Object.entries(queryStringParameters)
        .filter(([key]) => key.startsWith('expirations[') || key === 'expirations')
        .map(([, value]) => value!)
        .filter(Boolean);
    }
  }
  
  return expirations;
}

describe('Router - Expirations[] Parsing', () => {
  describe('parseExpirations', () => {
    it('should parse array of expirations from API Gateway', () => {
      const queryParams = {
        'expirations[]': ['2024-12-20', '2024-12-27'],
      };
      
      const result = parseExpirations(queryParams);
      
      expect(result).toEqual(['2024-12-20', '2024-12-27']);
      expect(result.length).toBe(2);
    });

    it('should parse comma-separated string (API Gateway concatène)', () => {
      const queryParams = {
        'expirations[]': '2024-12-20,2024-12-27',
      };
      
      const result = parseExpirations(queryParams);
      
      expect(result).toEqual(['2024-12-20', '2024-12-27']);
      expect(result.length).toBe(2);
    });

    it('should parse single expiration string', () => {
      const queryParams = {
        'expirations[]': '2024-12-20',
      };
      
      const result = parseExpirations(queryParams);
      
      expect(result).toEqual(['2024-12-20']);
      expect(result.length).toBe(1);
    });

    it('should parse indexed parameters (expirations[0], expirations[1])', () => {
      const queryParams = {
        'expirations[0]': '2024-12-20',
        'expirations[1]': '2024-12-27',
      };
      
      const result = parseExpirations(queryParams);
      
      expect(result).toContain('2024-12-20');
      expect(result).toContain('2024-12-27');
      expect(result.length).toBe(2);
    });

    it('should handle comma-separated with spaces', () => {
      const queryParams = {
        'expirations[]': '2024-12-20, 2024-12-27',
      };
      
      const result = parseExpirations(queryParams);
      
      expect(result).toEqual(['2024-12-20', '2024-12-27']);
    });

    it('should return empty array when no expirations parameter', () => {
      const queryParams = {
        other: 'value',
      };
      
      const result = parseExpirations(queryParams);
      
      expect(result).toEqual([]);
    });

    it('should return empty array when queryParams is null', () => {
      const result = parseExpirations(null);
      
      expect(result).toEqual([]);
    });

    it('should return empty array when queryParams is undefined', () => {
      const result = parseExpirations(undefined);
      
      expect(result).toEqual([]);
    });
  });
});

