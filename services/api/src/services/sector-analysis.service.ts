/**
 * Service d'analyse de secteur
 * Combine FMP fundamentals + UW sentiment par secteur
 */

import { logger } from '../utils/logger';
import { handleError } from '../utils/errors';
import * as fmp from '../fmp';
import * as uw from '../unusual-whales';
import type {
  SectorAnalysis,
  SectorAnalysisResponse,
  SectorSentiment,
  ETFFlow,
  SectorTicker,
  SectorRecommendation,
} from '../types/combined-analysis';
import type {
  SectorRotation,
  SectorRotationResponse,
  MarketTideResponse,
  SectorRotationData,
  MarketTideData,
  RotationDirection,
} from '../types/sector-rotation';

export class SectorAnalysisService {
  /**
   * Analyse un secteur : combine FMP fundamentals + UW sentiment
   */
  async analyzeSector(sector: string): Promise<SectorAnalysisResponse> {
    return handleError(async () => {
      const log = logger.child({ sector, operation: 'analyzeSector' });
      log.info('Analyzing sector');

      // Récupération des données UW
      const [sectorTide, sectorTickers] = await Promise.allSettled([
        uw.getUWSectorTide(sector, {}),
        uw.getUWSectorTickers(sector),
      ]);

      log.info('UW sector data fetched', {
        sectorTide: sectorTide.status,
        sectorTickers: sectorTickers.status,
      });

      // Extraire les tickers du secteur
      const tickers: string[] = [];
      if (sectorTickers.status === 'fulfilled' && sectorTickers.value?.success && sectorTickers.value.data) {
        const t = Array.isArray(sectorTickers.value.data) ? sectorTickers.value.data : [];
        // Les tickers sont directement dans un tableau de strings
        tickers.push(...t.slice(0, 20).map((ticker: string) => ticker));
        log.info('Sector tickers extracted', { count: tickers.length });
      } else {
        log.warn('Sector tickers data not available', {
          status: sectorTickers.status,
          hasValue: sectorTickers.status === 'fulfilled' && !!sectorTickers.value,
          hasSuccess: sectorTickers.status === 'fulfilled' && sectorTickers.value?.success,
          hasData: sectorTickers.status === 'fulfilled' && sectorTickers.value?.success && !!sectorTickers.value.data,
        });
      }

      // Récupérer les fundamentals pour chaque ticker
      const fundamentals = await Promise.allSettled(
        tickers.map(ticker => 
          Promise.allSettled([
            fmp.getFMPFinancialRatios({ symbol: ticker, limit: 1 }),
            fmp.getFMPIncomeStatement({ symbol: ticker, limit: 2 }),
            fmp.getFMPStockQuote(ticker),
          ])
        )
      );

      // Calculer les moyennes et stocker les données par ticker
      const peRatios: number[] = [];
      const revenueGrowths: number[] = [];
      const tickerData: Map<string, { pe?: number; price?: number; growth?: number }> = new Map();

      for (let i = 0; i < fundamentals.length && i < tickers.length; i++) {
        const ticker = tickers[i];
        const result = fundamentals[i];
        
        if (result.status === 'fulfilled') {
          const [ratios, income, quote] = result.value;
          const tickerInfo: { pe?: number; price?: number; growth?: number } = {};
          
          if (ratios.status === 'fulfilled' && ratios.value?.success && ratios.value.data?.length > 0) {
            const pe = ratios.value.data[0].priceEarningsRatio;
            if (pe && pe > 0) {
              peRatios.push(pe);
              tickerInfo.pe = pe;
            }
          }

          if (income.status === 'fulfilled' && income.value?.success && income.value.data?.length >= 2) {
            const current = income.value.data[0];
            const previous = income.value.data[1];
            if (current.revenue && previous.revenue) {
              const growth = ((current.revenue - previous.revenue) / previous.revenue) * 100;
              revenueGrowths.push(growth);
              tickerInfo.growth = growth;
            }
          }

          // Extraire le prix depuis la quote
          if (quote.status === 'fulfilled' && quote.value?.success && quote.value.data) {
            const quoteData = Array.isArray(quote.value.data) ? quote.value.data[0] : quote.value.data;
            const price = quoteData?.price || quoteData?.close || quoteData?.lastPrice || quoteData?.currentPrice || 0;
            if (price > 0) {
              tickerInfo.price = price;
            }
          }

          if (Object.keys(tickerInfo).length > 0) {
            tickerData.set(ticker, tickerInfo);
          }
        }
      }

      const averagePE = peRatios.length > 0
        ? peRatios.reduce((sum, pe) => sum + pe, 0) / peRatios.length
        : 0;
      const averageGrowth = revenueGrowths.length > 0
        ? revenueGrowths.reduce((sum, g) => sum + g, 0) / revenueGrowths.length
        : 0;

      // Analyser le sentiment
      const sentiment: SectorSentiment = {
        score: 50,
        tide: 'neutral',
        optionsFlow: 0,
        institutionalActivity: 0,
      };

      if (sectorTide.status === 'fulfilled' && sectorTide.value?.success && sectorTide.value.data) {
        const tide = sectorTide.value.data;
        sentiment.tide = tide.tide || 'neutral';
        sentiment.score = tide.score || 50;
        sentiment.optionsFlow = tide.options_flow || 0;
        sentiment.institutionalActivity = tide.institutional_activity || 0;
      }

      // ETF Flows (simplifié - en réalité il faudrait récupérer les ETFs du secteur)
      const etfFlows: ETFFlow[] = [];

      // Top performers - utiliser les données réelles extraites
      const topPerformers: SectorTicker[] = Array.from(tickerData.entries())
        .map(([ticker, data]) => ({
          ticker,
          name: ticker,
          price: data.price || 0,
          change: 0, // Non disponible sans données historiques
          changePercent: data.growth || 0,
        }))
        .filter(p => p.price > 0 || p.changePercent !== 0) // Filtrer les entrées vides
        .sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0)) // Trier par croissance
        .slice(0, 10);
      
      // Si pas assez de données, ajouter les tickers restants
      if (topPerformers.length < 10) {
        const remainingTickers = tickers
          .filter(t => !tickerData.has(t))
          .slice(0, 10 - topPerformers.length)
          .map(ticker => ({
            ticker,
            name: ticker,
            price: 0,
            change: 0,
            changePercent: 0,
          }));
        topPerformers.push(...remainingTickers);
      }

      // Recommandations
      const recommendations: SectorRecommendation[] = [];
      if (sentiment.score > 70 && averageGrowth > 5) {
        recommendations.push({
          type: 'overweight',
          reasoning: `Secteur ${sector} : Sentiment positif et croissance solide`,
          topPicks: topPerformers.slice(0, 3).map(p => p.ticker),
        });
      } else if (sentiment.score < 30 || averageGrowth < 0) {
        recommendations.push({
          type: 'underweight',
          reasoning: `Secteur ${sector} : Sentiment négatif ou croissance faible`,
          topPicks: [],
        });
      } else {
        recommendations.push({
          type: 'neutral',
          reasoning: `Secteur ${sector} : Sentiment et croissance neutres`,
          topPicks: topPerformers.slice(0, 2).map(p => p.ticker),
        });
      }

      const analysis: SectorAnalysis = {
        sector,
        averagePE: Math.round(averagePE * 10) / 10,
        averageGrowth: Math.round(averageGrowth * 10) / 10,
        sentiment,
        etfFlows,
        topPerformers,
        recommendations,
      };

      return {
        success: true,
        data: analysis,
        cached: false,
        timestamp: new Date().toISOString(),
      };
    }, `Analyze sector ${sector}`);
  }

  /**
   * Identifier les rotations sectorielles
   */
  async detectSectorRotation(): Promise<SectorRotationResponse> {
    return handleError(async () => {
      const log = logger.child({ operation: 'detectSectorRotation' });
      log.info('Detecting sector rotation');

      // Secteurs principaux à analyser
      const SECTORS = [
        'Technology',
        'Healthcare',
        'Financial',
        'Energy',
        'Consumer Cyclical',
        'Consumer Defensive',
        'Industrials',
        'Utilities',
        'Real Estate',
        'Communication Services',
      ];

      // Récupérer les données de tous les secteurs en parallèle
      const [sectorTidesResults, marketTideResult] = await Promise.allSettled([
        Promise.allSettled(
          SECTORS.map((sector) => uw.getUWSectorTide(sector, {}))
        ),
        uw.getUWMarketTide({}),
      ]);

      log.info('Sector data fetched', {
        sectorTides: sectorTidesResults.status,
        marketTide: marketTideResult.status,
      });

      // Analyser les tides des secteurs
      const sectors: SectorRotationData[] = [];
      if (sectorTidesResults.status === 'fulfilled') {
        for (let i = 0; i < SECTORS.length && i < sectorTidesResults.value.length; i++) {
          const sector = SECTORS[i];
          const tideResult = sectorTidesResults.value[i];

          if (tideResult.status === 'fulfilled' && tideResult.value?.success && tideResult.value.data) {
            const tide = tideResult.value.data;
            const currentTide = tide.score || tide.tide_score || 50;
            const previousTide = tide.previous_score || currentTide; // Approximation

            sectors.push({
              sector,
              currentTide: currentTide - 50, // Normaliser -50 à +50
              previousTide: previousTide - 50,
              change: currentTide - previousTide,
              trend: currentTide > 60 ? 'BULLISH' : currentTide < 40 ? 'BEARISH' : 'NEUTRAL',
            });
          }
        }
      }

      // Market tide
      const marketTide: MarketTideData = {
        overall: 50,
        sentiment: 'NEUTRAL',
        volatility: 'MEDIUM',
        sectors: {
          strongest: [],
          weakest: [],
        },
      };

      if (marketTideResult.status === 'fulfilled' && marketTideResult.value?.success && marketTideResult.value.data) {
        // MarketTideResponse.data est un tableau, prendre le dernier élément
        const tideData = Array.isArray(marketTideResult.value.data)
          ? marketTideResult.value.data[marketTideResult.value.data.length - 1]
          : marketTideResult.value.data;

        // Extraire la valeur du tide (string) et la convertir en nombre
        const tideValue = tideData?.tide ? parseFloat(tideData.tide) : 0.5;
        // Convertir de 0-1 à 0-100
        marketTide.overall = Math.round(tideValue * 100);
        marketTide.sentiment = marketTide.overall > 60 ? 'BULLISH' : marketTide.overall < 40 ? 'BEARISH' : 'NEUTRAL';
        marketTide.volatility = 'MEDIUM'; // Non disponible dans la réponse UW
      }

      // Identifier les secteurs les plus forts et faibles
      const sortedSectors = [...sectors].sort((a, b) => b.currentTide - a.currentTide);
      marketTide.sectors.strongest = sortedSectors.slice(0, 3).map((s) => s.sector);
      marketTide.sectors.weakest = sortedSectors.slice(-3).map((s) => s.sector);

      // Déterminer la rotation actuelle
      const currentRotation = this.determineRotation(sectors, marketTide);
      const predictedRotation = this.predictRotation(sectors, marketTide);

      // Générer les recommandations
      const recommendations = this.generateSectorRecommendations(sectors, currentRotation);

      const rotation: SectorRotation = {
        currentRotation,
        predictedRotation,
        sectors,
        marketTide,
        recommendations,
        timestamp: new Date().toISOString(),
      };

      log.info('Sector rotation detected', {
        currentRotation,
        predictedRotation,
        sectorCount: sectors.length,
      });

      return {
        success: true,
        data: rotation,
      };
    });
  }

  /**
   * Récupérer le market tide global
   */
  async getMarketTide(): Promise<MarketTideResponse> {
    return handleError(async () => {
      const log = logger.child({ operation: 'getMarketTide' });
      log.info('Fetching market tide');

      const marketTideResult = await uw.getUWMarketTide({ limit: 1 });

      if (!marketTideResult.success || !marketTideResult.data) {
        log.warn('Failed to fetch market tide');
        return {
          success: true,
          data: {
            overall: 50,
            sentiment: 'NEUTRAL',
            volatility: 'MEDIUM',
            sectors: {
              strongest: [],
              weakest: [],
            },
          },
        };
      }

      // MarketTideResponse.data est un tableau, prendre le dernier élément
      const tideData = Array.isArray(marketTideResult.data)
        ? marketTideResult.data[marketTideResult.data.length - 1]
        : marketTideResult.data;

      // Extraire la valeur du tide (string) et la convertir en nombre
      const tideValue = tideData?.tide ? parseFloat(tideData.tide) : 0.5;
      // Convertir de 0-1 à 0-100
      const overall = Math.round(tideValue * 100);

      const marketTide: MarketTideData = {
        overall,
        sentiment: overall > 60 ? 'BULLISH' : overall < 40 ? 'BEARISH' : 'NEUTRAL',
        volatility: 'MEDIUM', // Non disponible dans la réponse UW
        sectors: {
          strongest: [],
          weakest: [],
        },
      };

      log.info('Market tide extracted', {
        overall,
        sentiment: marketTide.sentiment,
        tideValue,
      });

      return {
        success: true,
        data: marketTide,
      };
    });
  }

  /**
   * Déterminer la direction de rotation actuelle
   */
  private determineRotation(
    sectors: SectorRotationData[],
    marketTide: MarketTideData
  ): RotationDirection {
    if (sectors.length === 0) {
      return 'NEUTRAL';
    }

    // Identifier les secteurs risqués (Tech, Growth) vs défensifs (Utilities, Staples)
    const riskOnSectors = sectors.filter(
      (s) =>
        s.sector === 'Technology' ||
        s.sector === 'Communication Services' ||
        s.sector === 'Consumer Cyclical'
    );
    const riskOffSectors = sectors.filter(
      (s) => s.sector === 'Utilities' || s.sector === 'Consumer Defensive'
    );
    const valueSectors = sectors.filter(
      (s) => s.sector === 'Financial' || s.sector === 'Energy'
    );

    const riskOnAvg = riskOnSectors.length > 0
      ? riskOnSectors.reduce((sum, s) => sum + s.currentTide, 0) / riskOnSectors.length
      : 0;
    const riskOffAvg = riskOffSectors.length > 0
      ? riskOffSectors.reduce((sum, s) => sum + s.currentTide, 0) / riskOffSectors.length
      : 0;
    const valueAvg = valueSectors.length > 0
      ? valueSectors.reduce((sum, s) => sum + s.currentTide, 0) / valueSectors.length
      : 0;

    // Déterminer la rotation
    if (riskOnAvg > riskOffAvg + 10 && riskOnAvg > valueAvg + 5) {
      return 'RISK_ON';
    } else if (riskOffAvg > riskOnAvg + 10) {
      return 'RISK_OFF';
    } else if (valueAvg > riskOnAvg + 5 && valueAvg > riskOffAvg + 5) {
      return 'VALUE';
    } else if (riskOnAvg > valueAvg + 5) {
      return 'GROWTH';
    } else {
      return 'NEUTRAL';
    }
  }

  /**
   * Prédire la rotation future
   */
  private predictRotation(
    sectors: SectorRotationData[],
    marketTide: MarketTideData
  ): RotationDirection {
    // Analyse des tendances (changements)
    const increasingSectors = sectors.filter((s) => s.change > 5);
    const decreasingSectors = sectors.filter((s) => s.change < -5);

    // Si beaucoup de secteurs augmentent, prédire RISK_ON ou GROWTH
    if (increasingSectors.length > decreasingSectors.length + 2) {
      const techSectors = increasingSectors.filter(
        (s) => s.sector === 'Technology' || s.sector === 'Communication Services'
      );
      if (techSectors.length > 0) {
        return 'RISK_ON';
      }
      return 'GROWTH';
    }

    // Si beaucoup de secteurs diminuent, prédire RISK_OFF
    if (decreasingSectors.length > increasingSectors.length + 2) {
      return 'RISK_OFF';
    }

    // Sinon, maintenir la rotation actuelle
    return this.determineRotation(sectors, marketTide);
  }

  /**
   * Générer des recommandations par secteur
   */
  private generateSectorRecommendations(
    sectors: SectorRotationData[],
    rotation: RotationDirection
  ): Array<{
    sector: string;
    action: 'BUY' | 'SELL' | 'HOLD' | 'AVOID';
    confidence: number;
    reasoning: string;
    timeframe?: string;
  }> {
    const recommendations: Array<{
      sector: string;
      action: 'BUY' | 'SELL' | 'HOLD' | 'AVOID';
      confidence: number;
      reasoning: string;
      timeframe?: string;
    }> = [];

    for (const sectorData of sectors) {
      let action: 'BUY' | 'SELL' | 'HOLD' | 'AVOID' = 'HOLD';
      let confidence = 50;
      let reasoning = '';

      // Basé sur le tide
      if (sectorData.currentTide > 20) {
        action = 'BUY';
        confidence = Math.min(90, 50 + sectorData.currentTide);
        reasoning = `Secteur ${sectorData.sector} : Sentiment très positif (tide: ${sectorData.currentTide})`;
      } else if (sectorData.currentTide < -20) {
        action = 'AVOID';
        confidence = Math.min(90, 50 + Math.abs(sectorData.currentTide));
        reasoning = `Secteur ${sectorData.sector} : Sentiment très négatif (tide: ${sectorData.currentTide})`;
      } else {
        action = 'HOLD';
        confidence = 50;
        reasoning = `Secteur ${sectorData.sector} : Sentiment neutre`;
      }

      // Ajuster selon la rotation
      if (rotation === 'RISK_ON' && (sectorData.sector === 'Technology' || sectorData.sector === 'Communication Services')) {
        if (action === 'BUY') {
          confidence = Math.min(95, confidence + 10);
        }
        reasoning += '. Rotation RISK_ON favorable.';
      } else if (rotation === 'RISK_OFF' && (sectorData.sector === 'Utilities' || sectorData.sector === 'Consumer Defensive')) {
        if (action === 'BUY') {
          confidence = Math.min(95, confidence + 10);
        }
        reasoning += '. Rotation RISK_OFF favorable.';
      }

      recommendations.push({
        sector: sectorData.sector,
        action,
        confidence,
        reasoning,
        timeframe: 'short-term',
      });
    }

    return recommendations;
  }
}

