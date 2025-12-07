/**
 * Service Smart Money - Complément au Institution Tracking
 * Top hedge funds et copy trades
 */

import { logger } from '../utils/logger';
import { handleError } from '../utils/errors';
import * as uw from '../unusual-whales';
import * as fmp from '../fmp';
import type {
  TopHedgeFundsResponse,
  CopyTradesResponse,
  HedgeFund,
  CopyTrade,
  TradingPattern,
} from '../types/smart-money';

export class SmartMoneyService {
  /**
   * Identifier les top hedge funds par performance
   */
  async getTopPerformingHedgeFunds(
    period: '1M' | '3M' | '6M' | '1Y' = '3M'
  ): Promise<TopHedgeFundsResponse> {
    return handleError(async () => {
      const log = logger.child({ operation: 'getTopPerformingHedgeFunds', period });
      log.info('Fetching top performing hedge funds');

      // Récupérer toutes les institutions
      const institutionsResult = await uw.getUWInstitutions({
        order: 'value',
        order_direction: 'desc',
      });

      if (!institutionsResult.success || !institutionsResult.data) {
        log.warn('Failed to fetch institutions');
        return {
          success: true,
          data: {
            funds: [],
            period,
            total: 0,
          },
        };
      }

      const institutions = Array.isArray(institutionsResult.data)
        ? institutionsResult.data
        : [];

      // Filtrer les hedge funds (approximation : institutions avec "fund" dans le nom ou catégorie)
      const hedgeFunds = institutions.filter(
        (inst: any) =>
          inst.name?.toLowerCase().includes('fund') ||
          inst.name?.toLowerCase().includes('capital') ||
          inst.name?.toLowerCase().includes('partners') ||
          inst.category?.toLowerCase().includes('hedge')
      );

      log.info('Hedge funds filtered', { count: hedgeFunds.length });

      // Calculer la performance pour chaque hedge fund
      const performances = await Promise.allSettled(
        hedgeFunds.slice(0, 50).map(async (fund: any) => {
          try {
            const holdingsResult = await uw.getUWInstitutionHoldings(fund.name, {});
            
            if (!holdingsResult.success || !holdingsResult.data) {
              return null;
            }

            const holdings = Array.isArray(holdingsResult.data)
              ? holdingsResult.data
              : [];

            // Calculer la performance basée sur les positions
            const performance = this.calculatePerformance(holdings, period);

            // Top positions
            const topPositions = holdings
              .slice(0, 5)
              .map((h: any) => ({
                ticker: h.ticker || h.ticker_symbol || '',
                shares: h.shares || h.units || 0,
                value: (h.shares || h.units || 0) * (h.price || h.close || 0),
                weight: 0, // Calculé après
              }))
              .filter((p) => p.ticker);

            // Calculer les poids
            const totalValue = topPositions.reduce((sum, p) => sum + p.value, 0);
            topPositions.forEach((p) => {
              p.weight = totalValue > 0 ? (p.value / totalValue) * 100 : 0;
            });

            return {
              name: fund.name,
              isHedgeFund: true,
              totalValue: fund.total_value || fund.value || 0,
              performance,
              period,
              holdingsCount: holdings.length,
              topPositions,
            } as HedgeFund;
          } catch (error) {
            log.error('Error calculating performance for fund', {
              fund: fund.name,
              error,
            });
            return null;
          }
        })
      );

      // Filtrer les nulls et trier par performance
      const validFunds = performances
        .filter((p) => p.status === 'fulfilled' && p.value !== null)
        .map((p) => (p as PromiseFulfilledResult<HedgeFund>).value)
        .sort((a, b) => b.performance - a.performance)
        .slice(0, 10);

      log.info('Top hedge funds calculated', { count: validFunds.length });

      return {
        success: true,
        data: {
          funds: validFunds,
          period,
          total: validFunds.length,
        },
      };
    });
  }

  /**
   * Calculer la performance d'un hedge fund basée sur ses positions
   * Approximation : moyenne des performances des top positions
   */
  private calculatePerformance(
    holdings: any[],
    period: '1M' | '3M' | '6M' | '1Y'
  ): number {
    if (!holdings || holdings.length === 0) {
      return 0;
    }

    // Pour l'instant, on retourne une performance simulée basée sur la valeur totale
    // TODO: Implémenter le calcul réel avec données historiques de prix
    const totalValue = holdings.reduce(
      (sum, h) => sum + ((h.shares || h.units || 0) * (h.price || h.close || 0)),
      0
    );

    // Performance simulée (à remplacer par calcul réel)
    // Basée sur la taille du portefeuille et le nombre de positions
    const basePerformance = Math.min(50, holdings.length * 2);
    const valueBonus = Math.min(30, Math.log10(totalValue / 1000000) * 10);
    
    return Math.round(basePerformance + valueBonus);
  }

  /**
   * Copier les trades d'une institution pour un ticker
   */
  async copyInstitutionTrades(
    institutionName: string,
    ticker: string
  ): Promise<CopyTradesResponse> {
    return handleError(async () => {
      const upperTicker = ticker.toUpperCase();
      // Décoder le nom d'institution (au cas où il serait encodé dans l'URL)
      const decodedName = decodeURIComponent(institutionName);
      const log = logger.child({
        institutionName: decodedName,
        ticker: upperTicker,
        operation: 'copyInstitutionTrades',
      });
      log.info('Analyzing copy trades');

      // Récupérer l'activité de l'institution (l'API UW ne supporte pas le filtre ticker dans les query params)
      let activityResult;
      try {
        activityResult = await uw.getUWInstitutionActivity(decodedName, {
          limit: 500, // Récupérer un maximum de données
        });
      } catch (error: any) {
        // Si l'API UW retourne une erreur 500, c'est probablement un problème avec le nom de l'institution
        log.warn('UW API error for institution activity', {
          institutionName: decodedName,
          error: error?.message || String(error),
          statusCode: error?.statusCode,
        });
        return {
          success: true,
          data: {
            trades: [],
            institutionName: decodedName,
            ticker: upperTicker,
            total: 0,
            message: `Unable to fetch activity for "${decodedName}". The institution name might not be recognized by Unusual Whales API. Try using the CIK (e.g., "0001697748" for Berkshire Hathaway) instead of the institution name.`,
          },
        };
      }

      if (!activityResult.success || !activityResult.data) {
        log.warn('Failed to fetch institution activity', {
          success: activityResult.success,
          hasData: !!activityResult.data,
        });
        return {
          success: true,
          data: {
            trades: [],
            institutionName: decodedName,
            ticker: upperTicker,
            total: 0,
            message: `No activity data found for "${decodedName}". The institution might not exist in Unusual Whales database or the name might be incorrect. Try using the CIK (e.g., "0001697748" for Berkshire Hathaway) instead.`,
          },
        };
      }

      // Filtrer les activités pour le ticker spécifique
      const allActivities = Array.isArray(activityResult.data)
        ? activityResult.data
        : [];
      
      const activities = allActivities.filter((activity: any) => 
        (activity.ticker || '').toUpperCase() === upperTicker
      );

      log.info('Activities filtered for ticker', {
        total: allActivities.length,
        filtered: activities.length,
        ticker: upperTicker,
      });

      // Filtrer les trades récents (30 derniers jours)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentTrades = activities.filter((trade: any) => {
        const tradeDate = new Date(trade.date || trade.filing_date || trade.report_date);
        return tradeDate > thirtyDaysAgo;
      });

      log.info('Recent trades found', { count: recentTrades.length });

      // Analyser les patterns et créer les copy trades
      const copyTrades: CopyTrade[] = recentTrades.map((trade: any) => {
        const shares = Math.abs(trade.units_change || trade.change || trade.shares || 0);
        const price = trade.avg_price || trade.close || trade.price || 0;
        const value = shares * price;
        const isBuy = (trade.units_change || trade.change || 0) > 0;

        return {
          ticker: upperTicker,
          institutionName,
          tradeType: isBuy ? 'BUY' : 'SELL',
          shares,
          value,
          date: trade.date || trade.filing_date || trade.report_date || new Date().toISOString(),
          price,
          confidence: this.calculateConfidence(trade, recentTrades),
          pattern: this.analyzeTradingPattern(recentTrades),
          recommendation: this.generateRecommendation(trade, recentTrades),
        };
      });

      // Trier par date (plus récent en premier)
      copyTrades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      log.info('Copy trades generated', { count: copyTrades.length });

      return {
        success: true,
        data: {
          trades: copyTrades,
          institutionName: decodedName,
          ticker: upperTicker,
          total: copyTrades.length,
        },
      };
    });
  }

  /**
   * Analyser le pattern de trading
   */
  private analyzeTradingPattern(trades: any[]): TradingPattern {
    if (trades.length === 0) {
      return {
        frequency: 0,
        averageSize: 0,
        trend: 'STABLE',
      };
    }

    const sizes = trades.map(
      (t) => Math.abs(t.units_change || t.change || t.shares || 0) * (t.avg_price || t.close || t.price || 0)
    );
    const averageSize = sizes.reduce((sum, s) => sum + s, 0) / sizes.length;

    // Déterminer la tendance (simplifié)
    const recentSizes = sizes.slice(0, Math.min(5, sizes.length));
    const olderSizes = sizes.slice(Math.min(5, sizes.length));
    const recentAvg = recentSizes.reduce((sum, s) => sum + s, 0) / recentSizes.length;
    const olderAvg = olderSizes.length > 0
      ? olderSizes.reduce((sum, s) => sum + s, 0) / olderSizes.length
      : recentAvg;

    let trend: 'INCREASING' | 'DECREASING' | 'STABLE' = 'STABLE';
    if (recentAvg > olderAvg * 1.2) {
      trend = 'INCREASING';
    } else if (recentAvg < olderAvg * 0.8) {
      trend = 'DECREASING';
    }

    return {
      frequency: trades.length,
      averageSize,
      trend,
    };
  }

  /**
   * Calculer la confiance dans un trade
   */
  private calculateConfidence(trade: any, allTrades: any[]): number {
    // Base confidence
    let confidence = 50;

    // Plus le trade est récent, plus la confiance est élevée
    const tradeDate = new Date(trade.date || trade.filing_date || new Date());
    const daysAgo = (Date.now() - tradeDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysAgo < 7) {
      confidence += 20;
    } else if (daysAgo < 14) {
      confidence += 10;
    }

    // Plus le trade est gros, plus la confiance est élevée
    const tradeSize = Math.abs(trade.units_change || trade.change || 0) * (trade.avg_price || trade.close || 0);
    if (tradeSize > 1000000) {
      confidence += 20;
    } else if (tradeSize > 500000) {
      confidence += 10;
    }

    // Si c'est un pattern récurrent, plus de confiance
    if (allTrades.length > 3) {
      confidence += 10;
    }

    return Math.min(100, confidence);
  }

  /**
   * Générer une recommandation
   */
  private generateRecommendation(trade: any, allTrades: any[]): 'FOLLOW' | 'AVOID' | 'MONITOR' {
    const isBuy = (trade.units_change || trade.change || 0) > 0;
    const tradeSize = Math.abs(trade.units_change || trade.change || 0) * (trade.avg_price || trade.close || 0);
    const confidence = this.calculateConfidence(trade, allTrades);

    if (isBuy && tradeSize > 1000000 && confidence > 70) {
      return 'FOLLOW';
    } else if (!isBuy && tradeSize > 1000000) {
      return 'AVOID';
    } else {
      return 'MONITOR';
    }
  }
}

