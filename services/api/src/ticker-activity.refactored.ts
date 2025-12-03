/**
 * Module ticker-activity refactorisé
 * Utilise la nouvelle architecture avec services, repositories, et gestion d'erreurs centralisée
 * 
 * Cette version est un exemple de refactorisation complète
 */

import { TickerService } from './services/ticker.service';
import { TickerRepository } from './repositories/ticker.repository';
import { ApiResponse } from './types/ticker.types';
import { Quote, Ownership, Activity } from './types/ticker.types';
import { logger } from './utils/logger';

// Instance singleton du service
const tickerRepository = new TickerRepository();
const tickerService = new TickerService(tickerRepository);

/**
 * Récupérer le quote d'un ticker
 * Version refactorisée avec gestion d'erreurs et logging
 */
export async function getTickerQuote(ticker: string): Promise<ApiResponse<Quote>> {
  const log = logger.child({ ticker, function: 'getTickerQuote' });
  log.info('Getting ticker quote');
  
  try {
    return await tickerService.getQuote(ticker, false);
  } catch (error) {
    log.error('Failed to get ticker quote', error);
    throw error; // Le router gère l'erreur
  }
}

/**
 * Récupérer l'ownership d'un ticker
 */
export async function getTickerOwnership(
  ticker: string,
  limit: number = 100
): Promise<ApiResponse<Ownership[]>> {
  const log = logger.child({ ticker, limit, function: 'getTickerOwnership' });
  log.info('Getting ticker ownership');
  
  try {
    return await tickerService.getOwnership(ticker, limit, false);
  } catch (error) {
    log.error('Failed to get ticker ownership', error);
    throw error;
  }
}

/**
 * Récupérer l'activity d'un ticker
 */
export async function getTickerActivity(
  ticker: string,
  limit: number = 100,
  forceRefresh: boolean = false
): Promise<ApiResponse<Activity[]>> {
  const log = logger.child({ ticker, limit, forceRefresh, function: 'getTickerActivity' });
  log.info('Getting ticker activity');
  
  try {
    return await tickerService.getActivity(ticker, limit, forceRefresh);
  } catch (error) {
    log.error('Failed to get ticker activity', error);
    throw error;
  }
}

// TODO: Refactoriser les autres fonctions (getTickerHedgeFunds, getTickerInsiders, etc.)
// en utilisant la même architecture

