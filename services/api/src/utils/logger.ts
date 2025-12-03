/**
 * Logger structuré pour l'application
 * Supporte différents niveaux de log avec contexte
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogContext {
  [key: string]: any;
}

class Logger {
  private minLevel: LogLevel;
  private context: LogContext = {};

  constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  /**
   * Ajouter un contexte global au logger
   */
  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Créer un logger enfant avec un contexte supplémentaire
   */
  child(additionalContext: LogContext): Logger {
    const child = new Logger(this.minLevel);
    child.context = { ...this.context, ...additionalContext };
    return child;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const contextStr = Object.keys(this.context).length > 0 
      ? ` ${JSON.stringify(this.context)}` 
      : '';
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level}]${contextStr} ${message}${dataStr}`;
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', message, data));
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.formatMessage('INFO', message, data));
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, data));
    }
  }

  error(message: string, error?: Error | any, data?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorData = error instanceof Error 
        ? { 
            name: error.name, 
            message: error.message, 
            stack: error.stack,
            ...data 
          }
        : { error, ...data };
      console.error(this.formatMessage('ERROR', message, errorData));
    }
  }
}

// Logger singleton par défaut
export const logger = new Logger(
  process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO
);

// Export du type pour les tests
export { Logger };

