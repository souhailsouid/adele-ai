/**
 * Service client API centralisé
 * Gère tous les appels aux APIs externes avec retry, rate limiting, etc.
 */

import { logger } from '../utils/logger';
import { ExternalApiError, RateLimitError, handleError } from '../utils/errors';

export interface ApiClientConfig {
  baseUrl: string;
  apiKey: string;
  apiKeyHeader?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export class ApiClientService {
  constructor(private config: ApiClientConfig) {}

  /**
   * Faire un appel GET à l'API
   */
  async get<T = any>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    return handleError(async () => {
      const url = this.buildUrl(endpoint, params);
      const sanitizedUrl = this.sanitizeUrl(url);
      logger.debug(`API GET request`, { url: sanitizedUrl, endpoint, params });

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: this.config.timeout ? AbortSignal.timeout(this.config.timeout) : undefined,
      });

      return this.handleResponse<T>(response, endpoint);
    }, `API GET ${endpoint}`);
  }

  /**
   * Faire un appel POST à l'API
   */
  async post<T = any>(endpoint: string, body?: any): Promise<T> {
    return handleError(async () => {
      const url = this.buildUrl(endpoint);
      logger.debug(`API POST request`, { url: this.sanitizeUrl(url), endpoint });

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        signal: this.config.timeout ? AbortSignal.timeout(this.config.timeout) : undefined,
      });

      return this.handleResponse<T>(response, endpoint);
    }, `API POST ${endpoint}`);
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number>): string {
    const baseUrl = this.config.baseUrl.endsWith('/') 
      ? this.config.baseUrl.slice(0, -1) 
      : this.config.baseUrl;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    let url = `${baseUrl}${path}`;

    // Ajouter l'API key comme query param si nécessaire (seulement si apiKeyHeader est 'apikey')
    if (this.config.apiKeyHeader && this.config.apiKeyHeader.toLowerCase() === 'apikey') {
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}apikey=${encodeURIComponent(this.config.apiKey)}`;
    }

    // Ajouter les params supplémentaires
    if (params) {
      const paramString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}${paramString}`;
    }

    return url;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain',
    };

    // Si l'API key doit être dans les headers (Authorization Bearer)
    if (this.config.apiKeyHeader && this.config.apiKeyHeader.toLowerCase() === 'authorization') {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    } else if (this.config.apiKeyHeader && this.config.apiKeyHeader.toLowerCase() !== 'apikey') {
      headers[this.config.apiKeyHeader] = this.config.apiKey;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response, endpoint: string): Promise<T> {
    // Construire l'URL complète pour les messages d'erreur
    const fullUrl = this.buildUrl(endpoint);
    const sanitizedUrl = this.sanitizeUrl(fullUrl);

    // Gérer les rate limits
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new RateLimitError(
        this.config.baseUrl,
        retryAfter ? parseInt(retryAfter, 10) : undefined
      );
    }

    // Gérer les erreurs HTTP
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      logger.error(`API error ${response.status}`, {
        endpoint,
        url: sanitizedUrl,
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      throw new ExternalApiError(
        this.config.baseUrl,
        `${response.status} ${response.statusText}: ${errorText} (URL: ${sanitizedUrl})`
      );
    }

    // Parser la réponse
    try {
      // Vérifier le Content-Type pour détecter les fichiers binaires
      const contentType = response.headers.get('content-type') || '';
      const isBinary = 
        contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
        contentType.includes('application/octet-stream') ||
        contentType.includes('application/xlsx') ||
        endpoint.includes('/financial-reports-xlsx');

      if (isBinary) {
        // Pour les fichiers binaires (XLSX), retourner en base64
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        return {
          data: base64,
          contentType: contentType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          format: 'base64',
        } as T;
      }

      // Pour les réponses JSON normales, cloner la réponse au cas où on aurait besoin de la relire
      // (par exemple si c'est en fait un fichier binaire)
      const clonedResponse = response.clone();
      let data: any;
      try {
        data = await response.json();
      } catch (jsonError) {
        // Si le parsing JSON échoue et que c'est l'endpoint XLSX, traiter comme binaire
        if (endpoint.includes('/financial-reports-xlsx') && jsonError instanceof SyntaxError) {
          const errorMessage = jsonError.message || '';
          if (errorMessage.includes("Unexpected token 'P'") || errorMessage.includes('PK')) {
            const arrayBuffer = await clonedResponse.arrayBuffer();
            const base64 = Buffer.from(arrayBuffer).toString('base64');
            return {
              data: base64,
              contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              format: 'base64',
            } as T;
          }
        }
        throw jsonError;
      }
      
      // Vérifier si l'API retourne une erreur dans le body
      if (data && typeof data === 'object' && 'Error Message' in data) {
        const errorMessage = String((data as any)['Error Message'] || 'Unknown error');
        throw new ExternalApiError(
          this.config.baseUrl,
          `${errorMessage} (URL: ${sanitizedUrl})`
        );
      }

      // Pour FMP, vérifier si on reçoit un tableau vide (peut indiquer un endpoint non disponible)
      // Note: On ne lance pas d'erreur car un tableau vide peut être valide, mais on log un warning
      // Note: Les endpoints suivants ont été supprimés car non disponibles avec le plan actuel:
      // - /historical, /income-statement, /balance-sheet, /cash-flow
      // - /key-metrics, /ratios, /earnings, /insider-trading
      // - /stock_news, /economic_calendar, /earnings_calendar, /stock-screener
      const fmpRestrictedEndpoints: string[] = [];
      
      if (Array.isArray(data) && data.length === 0 && 
          fmpRestrictedEndpoints.some(ep => endpoint.includes(ep))) {
        logger.warn(`Empty array response from FMP API`, {
          endpoint,
          url: sanitizedUrl,
          message: 'This endpoint may require a paid plan or the symbol may not have data',
        });
      }

      return data as T;
    } catch (error) {
      if (error instanceof ExternalApiError) {
        throw error;
      }
      
      throw new ExternalApiError(
        this.config.baseUrl,
        `Failed to parse response: ${error instanceof Error ? error.message : String(error)} (URL: ${sanitizedUrl})`
      );
    }
  }

  private sanitizeUrl(url: string): string {
    // Masquer l'API key dans les logs
    return url.replace(new RegExp(`${this.config.apiKeyHeader || 'apikey'}=[^&]+`), `${this.config.apiKeyHeader || 'apikey'}=***`);
  }
}

/**
 * Factory pour créer des clients API préconfigurés
 */
export function createUnusualWhalesClient(): ApiClientService {
  const apiKey = process.env.UNUSUAL_WHALES_API_KEY;
  if (!apiKey) {
    throw new Error('UNUSUAL_WHALES_API_KEY environment variable is required');
  }

  return new ApiClientService({
    baseUrl: 'https://api.unusualwhales.com/api',
    apiKey,
    apiKeyHeader: 'Authorization', // Bearer token dans header Authorization
    timeout: 10000,
    retries: 2,
  });
}

export function createFMPClient(): ApiClientService {
  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) {
    throw new Error('FMP_API_KEY environment variable is required');
  }

  return new ApiClientService({
    baseUrl: 'https://financialmodelingprep.com/stable',
    apiKey,
    apiKeyHeader: 'apikey',
    timeout: 10000,
    retries: 2,
  });
}

