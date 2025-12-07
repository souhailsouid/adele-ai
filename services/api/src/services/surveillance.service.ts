/**
 * Service de surveillance continue
 * Surveille les tickers et génère des alertes basées sur des seuils
 */

import { logger } from '../utils/logger';
import { handleError } from '../utils/errors';
import * as uw from '../unusual-whales';
import type {
  SurveillanceConfig,
  SurveillanceWatch,
  SurveillanceAlert,
  SurveillanceResponse,
  SurveillanceListResponse,
  SurveillanceAlertsResponse,
  AlertType,
} from '../types/surveillance';
import { v4 as uuidv4 } from 'uuid';

// Stockage en mémoire (à remplacer par DynamoDB plus tard)
const watches = new Map<string, SurveillanceWatch>();
const alerts = new Map<string, SurveillanceAlert[]>();

export class SurveillanceService {
  /**
   * Créer une configuration de surveillance
   */
  async createWatch(
    userId: string,
    config: SurveillanceConfig
  ): Promise<SurveillanceResponse> {
    return handleError(async () => {
      const upperTicker = config.ticker.toUpperCase();
      const log = logger.child({
        userId,
        ticker: upperTicker,
        operation: 'createWatch',
      });
      log.info('Creating surveillance watch');

      const watch: SurveillanceWatch = {
        id: uuidv4(),
        userId,
        ticker: upperTicker,
        config: {
          ...config,
          ticker: upperTicker,
          minPremium: config.minPremium || 50000,
          checkInterval: config.checkInterval || 5,
          active: config.active !== false,
        },
        createdAt: new Date(),
        active: true,
      };

      watches.set(watch.id, watch);
      alerts.set(watch.id, []);

      log.info('Surveillance watch created', { watchId: watch.id });

      return {
        success: true,
        data: { watch },
      };
    });
  }

  /**
   * Récupérer toutes les surveillances d'un utilisateur
   */
  async getWatches(userId: string): Promise<SurveillanceListResponse> {
    return handleError(async () => {
      const log = logger.child({ userId, operation: 'getWatches' });
      log.info('Fetching watches');

      const userWatches = Array.from(watches.values()).filter(
        (w) => w.userId === userId && w.active
      );

      return {
        success: true,
        data: {
          watches: userWatches,
          total: userWatches.length,
        },
      };
    });
  }

  /**
   * Supprimer une surveillance
   */
  async deleteWatch(watchId: string, userId: string): Promise<SurveillanceResponse> {
    return handleError(async () => {
      const log = logger.child({ watchId, userId, operation: 'deleteWatch' });
      log.info('Deleting watch');

      const watch = watches.get(watchId);
      if (!watch) {
        throw new Error('Watch not found');
      }

      if (watch.userId !== userId) {
        throw new Error('Unauthorized');
      }

      watch.active = false;
      watches.set(watchId, watch);

      log.info('Watch deleted', { watchId });

      return {
        success: true,
        data: { watch },
      };
    });
  }

  /**
   * Récupérer les alertes d'une surveillance
   */
  async getAlerts(
    watchId: string,
    userId: string
  ): Promise<SurveillanceAlertsResponse> {
    return handleError(async () => {
      const log = logger.child({ watchId, userId, operation: 'getAlerts' });
      log.info('Fetching alerts');

      const watch = watches.get(watchId);
      if (!watch) {
        throw new Error('Watch not found');
      }

      if (watch.userId !== userId) {
        throw new Error('Unauthorized');
      }

      const watchAlerts = alerts.get(watchId) || [];

      return {
        success: true,
        data: {
          alerts: watchAlerts,
          total: watchAlerts.length,
        },
      };
    });
  }

  /**
   * Vérifier un ticker et générer des alertes si nécessaire
   * Cette méthode est appelée par un Lambda scheduled (EventBridge)
   */
  async checkWatch(watchId: string): Promise<void> {
    const log = logger.child({ watchId, operation: 'checkWatch' });
    log.info('Checking watch');

    const watch = watches.get(watchId);
    if (!watch || !watch.active) {
      log.warn('Watch not found or inactive');
      return;
    }

    const { ticker, config } = watch;

    try {
      // Récupérer les données en parallèle
      const [optionsFlow, darkPool, insiders, shortInterest] =
        await Promise.allSettled([
          uw.getUWRecentFlows(ticker, { min_premium: config.minPremium || 50000 }),
          uw.getUWDarkPoolTrades(ticker, { limit: 50 }),
          uw.getUWStockInsiderBuySells(ticker, {}),
          uw.getUWShortInterestAndFloat(ticker),
        ]);

      const detectedAlerts: SurveillanceAlert[] = [];

      // Vérifier les seuils
      if (optionsFlow.status === 'fulfilled' && optionsFlow.value?.success) {
        const flow = optionsFlow.value.data;
        const callVolume = flow?.reduce(
          (sum: number, f: any) => sum + (f.call_volume || 0),
          0
        );
        const putVolume = flow?.reduce(
          (sum: number, f: any) => sum + (f.put_volume || 0),
          0
        );

        if (
          config.callVolumeThreshold &&
          callVolume > config.callVolumeThreshold
        ) {
          detectedAlerts.push({
            id: uuidv4(),
            watchId,
            ticker,
            type: 'options_flow_spike',
            message: `Call volume spike detected: $${callVolume.toLocaleString()}`,
            data: { callVolume, putVolume },
            triggeredAt: new Date(),
            read: false,
          });
        }
      }

      if (darkPool.status === 'fulfilled' && darkPool.value?.success) {
        const trades = darkPool.value.data || [];
        const totalVolume = trades.reduce(
          (sum: number, t: any) => sum + (t.volume || 0),
          0
        );

        if (
          config.darkPoolVolumeThreshold &&
          totalVolume > config.darkPoolVolumeThreshold
        ) {
          detectedAlerts.push({
            id: uuidv4(),
            watchId,
            ticker,
            type: 'dark_pool_activity',
            message: `High dark pool activity: $${totalVolume.toLocaleString()}`,
            data: { totalVolume, tradeCount: trades.length },
            triggeredAt: new Date(),
            read: false,
          });
        }
      }

      if (shortInterest.status === 'fulfilled' && shortInterest.value?.success) {
        const shortData = shortInterest.value.data;
        const shortRatio = shortData?.[0]?.percent_returned || 0;

        if (
          config.shortInterestThreshold &&
          shortRatio > config.shortInterestThreshold
        ) {
          detectedAlerts.push({
            id: uuidv4(),
            watchId,
            ticker,
            type: 'short_interest_change',
            message: `High short interest: ${shortRatio.toFixed(2)}%`,
            data: { shortRatio },
            triggeredAt: new Date(),
            read: false,
          });
        }
      }

      if (insiders.status === 'fulfilled' && insiders.value?.success) {
        const insiderData = insiders.value.data || [];
        const recentBuys = insiderData.filter(
          (i: any) =>
            i.transaction_code === 'P' &&
            new Date(i.filing_date) >
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );

        if (recentBuys.length > 0) {
          detectedAlerts.push({
            id: uuidv4(),
            watchId,
            ticker,
            type: 'insider_activity',
            message: `${recentBuys.length} recent insider buy(s) detected`,
            data: { buyCount: recentBuys.length, buys: recentBuys },
            triggeredAt: new Date(),
            read: false,
          });
        }
      }

      // Sauvegarder les alertes
      if (detectedAlerts.length > 0) {
        const existingAlerts = alerts.get(watchId) || [];
        alerts.set(watchId, [...existingAlerts, ...detectedAlerts]);

        // Mettre à jour la dernière vérification
        watch.lastChecked = new Date();
        watches.set(watchId, watch);

        log.info('Alerts generated', {
          count: detectedAlerts.length,
          types: detectedAlerts.map((a) => a.type),
        });
      } else {
        watch.lastChecked = new Date();
        watches.set(watchId, watch);
        log.info('No alerts generated');
      }
    } catch (error) {
      log.error('Error checking watch', { error });
      throw error;
    }
  }

  /**
   * Vérifier toutes les surveillances actives
   * À appeler par un Lambda scheduled
   */
  async checkAllWatches(): Promise<void> {
    const log = logger.child({ operation: 'checkAllWatches' });
    log.info('Checking all active watches');

    const activeWatches = Array.from(watches.values()).filter((w) => w.active);

    log.info('Active watches found', { count: activeWatches.length });

    await Promise.allSettled(
      activeWatches.map((watch) => this.checkWatch(watch.id))
    );
  }
}

