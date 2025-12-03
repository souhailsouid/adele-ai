/**
 * Service métier pour les tickers
 * Contient la logique métier, utilise le repository pour l'accès aux données
 */

import { TickerRepository } from '../repositories/ticker.repository';
import { Quote, Ownership, Activity, ApiResponse } from '../types/ticker.types';
import { logger } from '../utils/logger';
import { NotFoundError, handleError } from '../utils/errors';

export class TickerService {
  constructor(private repository: TickerRepository) {}

  /**
   * Récupérer le quote d'un ticker
   * Logique : vérifier le cache, sinon appeler l'API et mettre en cache
   */
  async getQuote(ticker: string, forceRefresh: boolean = false): Promise<ApiResponse<Quote>> {
    const log = logger.child({ ticker, operation: 'getQuote' });
    
    return handleError(async () => {
      // Vérifier le cache si pas de force refresh
      if (!forceRefresh) {
        const cached = await this.repository.getCachedQuote(ticker);
        if (cached) {
          log.debug('Quote found in cache');
          return {
            success: true,
            data: cached,
            cached: true,
            timestamp: cached.timestamp,
          };
        }
      }

      // Récupérer depuis l'API
      log.info('Fetching quote from API');
      const quote = await this.repository.fetchQuoteFromAPI(ticker);

      // Mettre en cache
      await this.repository.cacheQuote(ticker, quote);

      return {
        success: true,
        data: quote,
        cached: false,
        timestamp: quote.timestamp,
      };
    }, `Get quote for ${ticker}`);
  }

  /**
   * Récupérer l'ownership d'un ticker
   */
  async getOwnership(ticker: string, limit: number = 100, forceRefresh: boolean = false): Promise<ApiResponse<Ownership[]>> {
    const log = logger.child({ ticker, limit, operation: 'getOwnership' });

    return handleError(async () => {
      // Vérifier le cache si pas de force refresh
      if (!forceRefresh) {
        const cached = await this.repository.getCachedOwnership(ticker, limit);
        if (cached.length > 0) {
          log.debug(`Found ${cached.length} ownership entries in cache`);
          return {
            success: true,
            data: cached,
            cached: true,
            count: cached.length,
            timestamp: new Date().toISOString(),
          };
        }
      }

      // Récupérer depuis l'API
      log.info('Fetching ownership from API');
      const ownership = await this.repository.fetchOwnershipFromAPI(ticker);

      // Mettre en cache
      await this.repository.cacheOwnership(ticker, ownership);

      return {
        success: true,
        data: ownership.slice(0, limit),
        cached: false,
        count: ownership.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get ownership for ${ticker}`);
  }

  /**
   * Récupérer l'activity d'un ticker
   * Optimisé pour éviter les timeouts : limite à 5 institutions max
   */
  async getActivity(
    ticker: string,
    limit: number = 100,
    forceRefresh: boolean = false
  ): Promise<ApiResponse<Activity[]>> {
    const log = logger.child({ ticker, limit, operation: 'getActivity' });

    return handleError(async () => {
      // Vérifier le cache si pas de force refresh
      if (!forceRefresh) {
        const cached = await this.repository.getCachedActivity(ticker, limit);
        if (cached.length > 0) {
          log.debug(`Found ${cached.length} activity entries in cache`);
          return {
            success: true,
            data: cached,
            cached: true,
            count: cached.length,
            timestamp: new Date().toISOString(),
          };
        }
      }

      // Récupérer l'ownership pour obtenir les top institutions
      log.info('Fetching ownership to get top institutions');
      const ownershipResponse = await this.getOwnership(ticker, 100, false);
      
      if (!ownershipResponse.success || ownershipResponse.data.length === 0) {
        log.warn('No ownership data available, returning empty activity');
        return {
          success: true,
          data: [],
          cached: false,
          count: 0,
          timestamp: new Date().toISOString(),
        };
      }

      // Prendre les top 5 institutions pour éviter timeout
      const topInstitutions = ownershipResponse.data
        .sort((a, b) => b.shares - a.shares)
        .slice(0, 5);

      log.info(`Fetching activity for ${topInstitutions.length} institutions`);

      // Récupérer l'activity pour chaque institution
      const allActivities: Activity[] = [];
      for (const inst of topInstitutions) {
        try {
          const activities = await this.repository.fetchActivityForInstitution(inst.name, ticker);
          allActivities.push(...activities);
          
          // Délai de 500ms entre les appels pour respecter les rate limits
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          log.warn(`Failed to fetch activity for ${inst.name}`, error);
          // Continuer même si une institution échoue
        }
      }

      // Mettre en cache
      if (allActivities.length > 0) {
        await this.repository.cacheActivity(ticker, allActivities);
      }

      return {
        success: true,
        data: allActivities.slice(0, limit),
        cached: false,
        count: allActivities.length,
        timestamp: new Date().toISOString(),
      };
    }, `Get activity for ${ticker}`);
  }
}

