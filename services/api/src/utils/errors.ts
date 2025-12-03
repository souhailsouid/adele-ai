/**
 * Gestion centralisée des erreurs
 * Classes d'erreur personnalisées et helpers
 */

import { logger } from './logger';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public readonly field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    super(
      identifier ? `${resource} with id ${identifier} not found` : `${resource} not found`,
      'NOT_FOUND',
      404
    );
  }
}

export class ExternalApiError extends AppError {
  constructor(
    service: string,
    message: string,
    public readonly originalError?: any
  ) {
    super(
      `External API error (${service}): ${message}`,
      'EXTERNAL_API_ERROR',
      502
    );
  }
}

export class RateLimitError extends AppError {
  constructor(service: string, retryAfter?: number) {
    super(
      `Rate limit exceeded for ${service}${retryAfter ? `. Retry after ${retryAfter}s` : ''}`,
      'RATE_LIMIT_ERROR',
      429
    );
  }
}

export class CacheError extends AppError {
  constructor(message: string, public readonly originalError?: any) {
    super(`Cache error: ${message}`, 'CACHE_ERROR', 500, false);
  }
}

/**
 * Wrapper pour gérer les erreurs de manière cohérente
 */
export async function handleError<T>(
  operation: () => Promise<T>,
  context: string,
  defaultValue?: T
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    logger.error(`Error in ${context}`, error);
    
    // Si c'est une AppError, la re-lancer
    if (error instanceof AppError) {
      throw error;
    }
    
    // Si une valeur par défaut est fournie, la retourner
    if (defaultValue !== undefined) {
      logger.warn(`Using default value for ${context}`, { defaultValue });
      return defaultValue;
    }
    
    // Sinon, wrapper l'erreur dans une AppError
    throw new AppError(
      error instanceof Error ? error.message : String(error),
      'INTERNAL_ERROR',
      500
    );
  }
}

/**
 * Wrapper pour les opérations qui peuvent échouer silencieusement
 */
export async function safeExecute<T>(
  operation: () => Promise<T>,
  context: string,
  defaultValue: T
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    logger.warn(`Silent failure in ${context}`, error);
    return defaultValue;
  }
}

