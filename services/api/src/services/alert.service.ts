/**
 * Service d'alertes multi-signaux
 * Crée et gère des alertes basées sur plusieurs conditions
 */

import { logger } from '../utils/logger';
import { handleError } from '../utils/errors';
import * as uw from '../unusual-whales';
import type {
  MultiSignalAlertConfig,
  Alert,
  AlertCondition,
  AlertLogic,
  AlertResponse,
  AlertListResponse,
  AlertTestResponse,
  AlertTrigger,
} from '../types/alerts';
import { v4 as uuidv4 } from 'uuid';

// Stockage en mémoire (à remplacer par DynamoDB plus tard)
const userAlerts = new Map<string, Alert>();
const alertTriggers = new Map<string, AlertTrigger[]>();

export class AlertService {
  /**
   * Créer une alerte multi-signaux
   */
  async createAlert(config: MultiSignalAlertConfig): Promise<AlertResponse> {
    return handleError(async () => {
      const log = logger.child({
        userId: config.userId,
        ticker: config.ticker,
        operation: 'createAlert',
      });
      log.info('Creating multi-signal alert', { name: config.name });

      const alert: Alert = {
        id: uuidv4(),
        userId: config.userId,
        ticker: config.ticker?.toUpperCase(),
        name: config.name,
        description: config.description,
        conditions: config.conditions,
        logic: config.logic || 'AND',
        notificationChannels: config.notificationChannels || ['webhook'],
        active: config.active !== false,
        createdAt: new Date(),
      };

      userAlerts.set(alert.id, alert);
      alertTriggers.set(alert.id, []);

      log.info('Alert created', { alertId: alert.id });

      return {
        success: true,
        data: { alert },
      };
    });
  }

  /**
   * Récupérer toutes les alertes d'un utilisateur
   */
  async getAlerts(userId: string): Promise<AlertListResponse> {
    return handleError(async () => {
      const log = logger.child({ userId, operation: 'getAlerts' });
      log.info('Fetching alerts');

      const userAlertList = Array.from(userAlerts.values()).filter(
        (a) => a.userId === userId
      );

      return {
        success: true,
        data: {
          alerts: userAlertList,
          total: userAlertList.length,
        },
      };
    });
  }

  /**
   * Récupérer une alerte par ID
   */
  async getAlert(alertId: string, userId: string): Promise<AlertResponse> {
    return handleError(async () => {
      const log = logger.child({ alertId, userId, operation: 'getAlert' });
      log.info('Fetching alert');

      const alert = userAlerts.get(alertId);
      if (!alert) {
        throw new Error('Alert not found');
      }

      if (alert.userId !== userId) {
        throw new Error('Unauthorized');
      }

      return {
        success: true,
        data: { alert },
      };
    });
  }

  /**
   * Mettre à jour une alerte
   */
  async updateAlert(
    alertId: string,
    userId: string,
    updates: Partial<MultiSignalAlertConfig>
  ): Promise<AlertResponse> {
    return handleError(async () => {
      const log = logger.child({ alertId, userId, operation: 'updateAlert' });
      log.info('Updating alert');

      const alert = userAlerts.get(alertId);
      if (!alert) {
        throw new Error('Alert not found');
      }

      if (alert.userId !== userId) {
        throw new Error('Unauthorized');
      }

      const updatedAlert: Alert = {
        ...alert,
        ...(updates.name && { name: updates.name }),
        ...(updates.description !== undefined && {
          description: updates.description,
        }),
        ...(updates.conditions && { conditions: updates.conditions }),
        ...(updates.logic && { logic: updates.logic }),
        ...(updates.notificationChannels && {
          notificationChannels: updates.notificationChannels,
        }),
        ...(updates.active !== undefined && { active: updates.active }),
      };

      userAlerts.set(alertId, updatedAlert);

      log.info('Alert updated', { alertId });

      return {
        success: true,
        data: { alert: updatedAlert },
      };
    });
  }

  /**
   * Supprimer une alerte
   */
  async deleteAlert(alertId: string, userId: string): Promise<AlertResponse> {
    return handleError(async () => {
      const log = logger.child({ alertId, userId, operation: 'deleteAlert' });
      log.info('Deleting alert');

      const alert = userAlerts.get(alertId);
      if (!alert) {
        throw new Error('Alert not found');
      }

      if (alert.userId !== userId) {
        throw new Error('Unauthorized');
      }

      alert.active = false;
      userAlerts.set(alertId, alert);

      log.info('Alert deleted', { alertId });

      return {
        success: true,
        data: { alert },
      };
    });
  }

  /**
   * Tester une alerte (vérifier si elle se déclencherait maintenant)
   */
  async testAlert(alertId: string, userId: string): Promise<AlertTestResponse> {
    return handleError(async () => {
      const log = logger.child({ alertId, userId, operation: 'testAlert' });
      log.info('Testing alert');

      const alert = userAlerts.get(alertId);
      if (!alert) {
        throw new Error('Alert not found');
      }

      if (alert.userId !== userId) {
        throw new Error('Unauthorized');
      }

      if (!alert.ticker) {
        throw new Error('Alert must have a ticker to test');
      }

      const result = await this.evaluateAlertConditions(alert);

      return {
        success: true,
        data: result,
      };
    });
  }

  /**
   * Évaluer les conditions d'une alerte
   */
  private async evaluateAlertConditions(
    alert: Alert
  ): Promise<{
    triggered: boolean;
    conditions: Array<{
      condition: AlertCondition;
      met: boolean;
      value: any;
    }>;
    message?: string;
  }> {
    const log = logger.child({ alertId: alert.id, operation: 'evaluateConditions' });
    log.info('Evaluating alert conditions', {
      ticker: alert.ticker,
      conditionCount: alert.conditions.length,
      logic: alert.logic,
    });

    if (!alert.ticker) {
      return {
        triggered: false,
        conditions: [],
        message: 'Alert has no ticker',
      };
    }

    const ticker = alert.ticker.toUpperCase();
    const conditionResults: Array<{
      condition: AlertCondition;
      met: boolean;
      value: any;
    }> = [];

    // Récupérer les données nécessaires dans un ordre fixe
    const dataMap: Record<string, Promise<any>> = {};
    const dataOrder: string[] = [];

    for (const condition of alert.conditions) {
      if (condition.signal === 'options_flow' && !dataMap.optionsFlow) {
        dataMap.optionsFlow = uw
          .getUWRecentFlows(ticker, { min_premium: 50000 })
          .then((r) => (r.success ? r.data : null))
          .catch(() => null);
        dataOrder.push('optionsFlow');
      }
      if (condition.signal === 'insider_activity' && !dataMap.insiders) {
        dataMap.insiders = uw
          .getUWStockInsiderBuySells(ticker, {})
          .then((r) => (r.success ? r.data : null))
          .catch(() => null);
        dataOrder.push('insiders');
      }
      if (condition.signal === 'dark_pool' && !dataMap.darkPool) {
        dataMap.darkPool = uw
          .getUWDarkPoolTrades(ticker, { limit: 50 })
          .then((r) => (r.success ? r.data : null))
          .catch(() => null);
        dataOrder.push('darkPool');
      }
      if (condition.signal === 'short_interest' && !dataMap.shortInterest) {
        dataMap.shortInterest = uw
          .getUWShortInterestAndFloat(ticker)
          .then((r) => (r.success ? r.data : null))
          .catch(() => null);
        dataOrder.push('shortInterest');
      }
    }

    // Récupérer les données dans l'ordre fixe
    const dataArray = await Promise.all(
      dataOrder.map((key) => dataMap[key])
    );
    
    // Créer un map pour accès facile
    const dataIndex: Record<string, any> = {};
    dataOrder.forEach((key, index) => {
      dataIndex[key] = dataArray[index];
    });

    // Évaluer chaque condition
    for (const condition of alert.conditions) {
      const met = await this.evaluateCondition(condition, ticker, dataIndex);
      conditionResults.push({
        condition,
        met,
        value: this.extractValue(condition, ticker, dataIndex),
      });
    }

    // Appliquer la logique (AND ou OR)
    const triggered =
      alert.logic === 'AND'
        ? conditionResults.every((r) => r.met)
        : conditionResults.some((r) => r.met);

    const message = triggered
      ? `Alert triggered: ${conditionResults.filter((r) => r.met).length}/${conditionResults.length} conditions met`
      : `Alert not triggered: ${conditionResults.filter((r) => r.met).length}/${conditionResults.length} conditions met`;

    log.info('Alert evaluation complete', {
      triggered,
      metConditions: conditionResults.filter((r) => r.met).length,
      totalConditions: conditionResults.length,
    });

    return {
      triggered,
      conditions: conditionResults,
      message,
    };
  }

  /**
   * Évaluer une condition individuelle
   */
  private async evaluateCondition(
    condition: AlertCondition,
    ticker: string,
    dataIndex: Record<string, any>
  ): Promise<boolean> {
    const value = this.extractValue(condition, ticker, dataIndex);
    const threshold = typeof condition.value === 'number' ? condition.value : 0;

    switch (condition.operator) {
      case 'gt':
        return value > threshold;
      case 'gte':
        return value >= threshold;
      case 'lt':
        return value < threshold;
      case 'lte':
        return value <= threshold;
      case 'eq':
        return value === condition.value;
      case 'neq':
        return value !== condition.value;
      default:
        return false;
    }
  }

  /**
   * Extraire la valeur d'un signal
   */
  private extractValue(
    condition: AlertCondition,
    ticker: string,
    dataIndex: Record<string, any>
  ): number {
    const log = logger.child({ signal: condition.signal, operation: 'extractValue' });
    
    try {
      switch (condition.signal) {
        case 'options_flow': {
          const optionsFlow = dataIndex.optionsFlow || [];
          if (Array.isArray(optionsFlow)) {
            const callVolume = optionsFlow.reduce(
              (sum: number, f: any) => sum + (f.call_volume || 0),
              0
            );
            const putVolume = optionsFlow.reduce(
              (sum: number, f: any) => sum + (f.put_volume || 0),
              0
            );
            return condition.params?.type === 'put' ? putVolume : callVolume;
          }
          return 0;
        }
        case 'insider_activity': {
          const insiders = dataIndex.insiders || [];
          if (Array.isArray(insiders)) {
            const recentBuys = insiders.filter(
              (i: any) =>
                i.transaction_code === 'P' &&
                new Date(i.filing_date) >
                  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            );
            return recentBuys.length;
          }
          return 0;
        }
        case 'dark_pool': {
          const darkPool = dataIndex.darkPool || [];
          if (Array.isArray(darkPool)) {
            return darkPool.reduce(
              (sum: number, t: any) => sum + (t.volume || 0),
              0
            );
          }
          return 0;
        }
        case 'short_interest': {
          const shortInterest = dataIndex.shortInterest || [];
          if (Array.isArray(shortInterest) && shortInterest[0]) {
            return shortInterest[0].percent_returned || 0;
          }
          return 0;
        }
        default:
          log.warn('Unknown signal type', { signal: condition.signal });
          return 0;
      }
    } catch (error) {
      log.error('Error extracting value', { error, signal: condition.signal });
      return 0;
    }
  }

  /**
   * Vérifier toutes les alertes actives
   * À appeler par un Lambda scheduled
   */
  async checkAllAlerts(): Promise<void> {
    const log = logger.child({ operation: 'checkAllAlerts' });
    log.info('Checking all active alerts');

    const activeAlerts = Array.from(userAlerts.values()).filter(
      (a) => a.active && a.ticker
    );

    log.info('Active alerts found', { count: activeAlerts.length });

    for (const alert of activeAlerts) {
      try {
        const result = await this.evaluateAlertConditions(alert);
        if (result.triggered) {
          await this.triggerAlert(alert, result);
        }
        alert.lastChecked = new Date();
        userAlerts.set(alert.id, alert);
      } catch (error) {
        log.error('Error checking alert', { alertId: alert.id, error });
      }
    }
  }

  /**
   * Déclencher une alerte
   */
  private async triggerAlert(
    alert: Alert,
    evaluation: {
      triggered: boolean;
      conditions: Array<{
        condition: AlertCondition;
        met: boolean;
        value: any;
      }>;
      message?: string;
    }
  ): Promise<void> {
    const log = logger.child({ alertId: alert.id, operation: 'triggerAlert' });
    log.info('Triggering alert', { ticker: alert.ticker });

    const trigger: AlertTrigger = {
      id: uuidv4(),
      alertId: alert.id,
      ticker: alert.ticker,
      triggeredAt: new Date(),
      data: {
        conditions: evaluation.conditions,
        message: evaluation.message,
      },
      triggeredConditions: evaluation.conditions
        .filter((c) => c.met)
        .map((c) => c.condition),
      read: false,
    };

    const existingTriggers = alertTriggers.get(alert.id) || [];
    alertTriggers.set(alert.id, [...existingTriggers, trigger]);

    alert.lastTriggered = new Date();
    userAlerts.set(alert.id, alert);

    // TODO: Envoyer les notifications via les canaux configurés
    log.info('Alert triggered', {
      alertId: alert.id,
      triggerId: trigger.id,
      channels: alert.notificationChannels,
    });
  }
}

