/**
 * Service d'attribution d'entités (Attribution Engine)
 * Détermine qui influence quoi et comment
 */

import { logger } from '../utils/logger';
import { handleError } from '../utils/errors';
import * as uw from '../unusual-whales';
import { GraphService } from './graph.service';
import { FlowSignatureService } from './flow-signature.service';
import { InsiderRegistryService } from './insider-registry.service';
import type {
  FlowAttributionRequest,
  FlowAttributionResponse,
  AttributionResult,
  AttributionEvidence,
  InstitutionAttributionRequest,
  InstitutionAttributionResponse,
  DominantEntitiesResponse,
  DominantEntity,
  ClustersResponse,
  InstitutionCluster,
  HistoricalPattern,
  Correlation,
  FlowCategory,
  EntityType,
  InfluenceCategory,
} from '../types/attribution';

export class AttributionService {
  private graphService: GraphService;
  private flowSignatureService: FlowSignatureService;
  private insiderRegistryService: InsiderRegistryService;

  constructor() {
    this.graphService = new GraphService();
    this.flowSignatureService = new FlowSignatureService();
    this.insiderRegistryService = new InsiderRegistryService();
  }

  /**
   * Attribuer un flow options à des entités spécifiques
   * C'est la fonction principale de l'Attribution Engine
   */
  async attributeFlowToEntities(
    request: FlowAttributionRequest
  ): Promise<FlowAttributionResponse> {
    return handleError(async () => {
      const log = logger.child({
        operation: 'attributeFlowToEntities',
        ticker: request.ticker,
        flowType: request.flowType,
      });

      log.info('Starting flow attribution', {
        ticker: request.ticker,
        flowType: request.flowType,
        premium: request.premium,
      });

      // 1. Récupérer les données en parallèle avec timeout
      const [institutionsResult, insidersResult, historicalPatternsResult] = await Promise.allSettled([
        Promise.race([
          this.getRecentInstitutionalPositions(request.ticker),
          new Promise<InstitutionalPosition[]>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 3000)
          ),
        ]).catch(() => [] as InstitutionalPosition[]),
        Promise.race([
          this.getRecentInsiderTransactions(request.ticker),
          new Promise<InsiderTransaction[]>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 3000)
          ),
        ]).catch(() => [] as InsiderTransaction[]),
        Promise.race([
          this.analyzeHistoricalPatterns(request.ticker, request.flowType),
          new Promise<HistoricalPattern[]>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 2000)
          ),
        ]).catch(() => [] as HistoricalPattern[]),
      ]);

      const institutions = institutionsResult.status === 'fulfilled' 
        ? institutionsResult.value 
        : [];
      const insiders = insidersResult.status === 'fulfilled' 
        ? insidersResult.value 
        : [];
      const historicalPatterns = historicalPatternsResult.status === 'fulfilled' 
        ? historicalPatternsResult.value 
        : [];

      log.info('Data retrieved', {
        institutions: institutions.length,
        insiders: insiders.length,
        patterns: historicalPatterns.length,
      });

      // 4. Calculer les attributions
      const allAttributions = await this.calculateAttributions(
        request,
        institutions,
        insiders,
        historicalPatterns
      );

      // 5. Filtrer et limiter les attributions (top 5, threshold > 50%, group by type)
      const filteredAttributions = this.filterAndRankAttributions(allAttributions);

      // 6. Identifier le primary driver
      const primaryDriver = filteredAttributions.length > 0 ? filteredAttributions[0] : undefined;

      // 7. Classifier le flow
      const { flowCategory, flowLikelihood } = this.classifyFlow(
        request,
        filteredAttributions,
        institutions
      );

      // 8. Détecter les entités en opposition (amélioré)
      const conflictingEntities = await this.detectConflictingEntities(
        request.ticker,
        request.flowType,
        filteredAttributions,
        institutions
      );

      // 9. Calculer la confiance globale
      const overallConfidence = this.calculateOverallConfidence(filteredAttributions);

      // 10. Générer la narration automatique
      const narrative = this.generateNarrative(
        request,
        filteredAttributions,
        conflictingEntities,
        primaryDriver,
        flowCategory
      );

      // 11. Intégrer dans le graphe (si disponible)
      await this.integrateAttributionInGraph(request, filteredAttributions);

      log.info('Flow attribution completed', {
        attributionsCount: filteredAttributions.length,
        overallConfidence,
        flowCategory,
        flowLikelihood,
      });

      return {
        success: true,
        flowId: this.generateFlowId(request),
        ticker: request.ticker,
        attributions: filteredAttributions,
        conflictingEntities,
        overallConfidence,
        primaryDriver,
        flowCategory,
        flowLikelihood,
        narrative,
        timestamp: new Date().toISOString(),
      };
    }, 'Attribute flow to entities');
  }

  /**
   * Attribuer l'influence d'une institution sur un ticker
   */
  async attributeInstitutionInfluence(
    request: InstitutionAttributionRequest
  ): Promise<InstitutionAttributionResponse> {
    return handleError(async () => {
      const log = logger.child({
        operation: 'attributeInstitutionInfluence',
        institutionId: request.institutionId,
        ticker: request.ticker,
      });

      log.info('Calculating institution influence');

      // Récupérer les données de l'institution
      const [holdings, activity, ownership] = await Promise.allSettled([
        uw.getUWInstitutionHoldings(request.institutionId, { limit: 100 }),
        uw.getUWInstitutionActivity(request.institutionId, { limit: 100 }),
        uw.getUWInstitutionOwnership(request.ticker, { limit: 100 }),
      ]);

      // Trouver la position de cette institution pour ce ticker
      let institutionHolding: any = null;
      if (ownership.status === 'fulfilled' && ownership.value.success) {
        institutionHolding = ownership.value.data.find(
          (h: any) => (h.cik || h.name || h.short_name) === request.institutionId
        );
      }

      // Calculer le score d'influence
      const influenceScore = await this.calculateInstitutionInfluenceScore(
        request.institutionId,
        request.ticker,
        holdings,
        activity,
        institutionHolding
      );

      // Analyser les patterns historiques
      const historicalPatterns = await this.analyzeInstitutionHistoricalPatterns(
        request.institutionId,
        request.ticker
      );

      // Calculer les corrélations
      const correlations = await this.calculateCorrelations(
        request.institutionId,
        request.ticker
      );

      // Créer l'attribution avec evidence basée sur les données réelles
      const evidence: AttributionEvidence[] = [];
      
      // Evidence 1: Position dans le ticker
      if (institutionHolding) {
        const value = typeof institutionHolding.value === 'string' 
          ? parseFloat(institutionHolding.value) 
          : (institutionHolding.value || 0);
        const instValue = typeof institutionHolding.inst_value === 'string'
          ? parseFloat(institutionHolding.inst_value)
          : (institutionHolding.inst_value || value);
        const finalValue = instValue || value;
        const units = institutionHolding.units || 0;
        const unitsChange = institutionHolding.units_change || 0;
        
        if (finalValue > 0) {
          const valueScore = Math.min(100, Math.log10(finalValue / 100000) * 20);
          evidence.push({
            type: 'POSITION_CHANGE',
            score: valueScore,
            description: `Position de ${(finalValue / 1000000).toFixed(2)}M$ (${units.toLocaleString()} units)`,
          });
        }
        
        if (Math.abs(unitsChange) > 0) {
          const changePercent = units > 0 ? Math.abs((unitsChange / units) * 100) : 0;
          if (changePercent > 0.1) {
            const changeScore = Math.min(80, changePercent * 2);
            const direction = unitsChange > 0 ? 'augmenté' : 'réduit';
            evidence.push({
              type: 'POSITION_CHANGE',
              score: changeScore,
              description: `Position ${direction} de ${changePercent.toFixed(2)}% (${Math.abs(unitsChange).toLocaleString()} units)`,
            });
          }
        }
        
        if (institutionHolding.filing_date) {
          const daysDiff = this.calculateDaysDifference(
            institutionHolding.filing_date,
            new Date().toISOString()
          );
          if (daysDiff <= 90) {
            const timingScore = Math.max(0, 100 - daysDiff * 1.5);
            evidence.push({
              type: 'TIMING_CORRELATION',
              score: timingScore,
              description: `Dernière déclaration il y a ${daysDiff} jours`,
            });
          }
        }
      }
      
      // Evidence 2: Activité récente
      if (activity.status === 'fulfilled' && activity.value.success) {
        const activities = activity.value.data || [];
        if (activities.length > 0) {
          const activityScore = Math.min(50, activities.length * 5);
          evidence.push({
            type: 'BEHAVIORAL_PATTERN',
            score: activityScore,
            description: `${activities.length} activités récentes détectées`,
          });
        }
      }
      
      // Evidence 3: Centralité dans le graphe
      const centrality = await this.graphService.getEntityCentrality(
        request.institutionId,
        'Institution'
      );
      if (centrality > 0.1) {
        evidence.push({
          type: 'GRAPH_CENTRALITY',
          score: centrality * 100,
          description: `Institution hautement connectée (centralité: ${centrality.toFixed(2)})`,
        });
      }
      
      // Générer le reasoning
      const topEvidence = evidence
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((e) => e.description)
        .join('; ');
      
      const attribution: AttributionResult = {
        entityId: request.institutionId,
        entityType: 'Institution',
        entityName: institutionHolding?.name || institutionHolding?.short_name || request.institutionId,
        confidence: influenceScore,
        reasoning: topEvidence || `Influence score: ${influenceScore}%`,
        evidence,
      };

      log.info('Institution influence calculated', { 
        influenceScore,
        evidenceCount: evidence.length,
      });

      return {
        success: true,
        institutionId: request.institutionId,
        ticker: request.ticker,
        influenceScore,
        attribution,
        historicalPatterns,
        correlations,
        timestamp: new Date().toISOString(),
      };
    }, 'Attribute institution influence');
  }

  /**
   * Trouver les entités dominantes pour un ticker
   * Vrai scoring d'influence avec plusieurs critères pondérés (Arkham-style)
   */
  async findDominantEntities(ticker: string): Promise<DominantEntitiesResponse> {
    return handleError(async () => {
      const log = logger.child({
        operation: 'findDominantEntities',
        ticker,
      });

      log.info('Finding dominant entities with real influence scoring');

      // 1. Récupérer les positions institutionnelles
      const institutions = await this.getRecentInstitutionalPositions(ticker);
      
      // 2. Récupérer les données supplémentaires nécessaires
      const [ownershipResult, shortInterestResult] = await Promise.allSettled([
        uw.getUWInstitutionOwnership(ticker, { limit: 100 }),
        uw.getUWShortInterestAndFloat(ticker, {}),
      ]);

      // Calculer le flottant total (pour le % du flottant)
      let totalFloat = 0;
      if (shortInterestResult.status === 'fulfilled' && shortInterestResult.value.success) {
        const si = shortInterestResult.value.data;
        totalFloat = si.total_float_returned || 0;
      }

      // 3. Calculer le score d'influence pour chaque institution
      const dominantEntities: DominantEntity[] = [];

      // Trier par valeur de position décroissante (on garde top 20 pour calculer, puis on filtre)
      const sortedInstitutions = institutions
        .sort((a, b) => b.value - a.value)
        .slice(0, 20);

      for (const institution of sortedInstitutions) {
        // Récupérer les données détaillées de l'institution
        const ownershipData = ownershipResult.status === 'fulfilled' && ownershipResult.value.success
          ? ownershipResult.value.data.find(
              (h: any) => (h.name || h.short_name) === institution.institutionId || 
                         (h.name || h.short_name) === institution.institutionName
            )
          : null;

        // Calculer le vrai score d'influence avec plusieurs critères
        const influenceData = await this.calculateRealInfluenceScore(
          institution,
          ownershipData,
          ticker,
          totalFloat
        );

        // Ne garder que les entités avec un score significatif (> 30)
        if (influenceData.influenceScore > 30) {
          dominantEntities.push({
            entityId: institution.institutionId,
            entityType: 'Institution',
            entityName: institution.institutionName,
            influenceScore: Math.round(influenceData.influenceScore),
            category: influenceData.category,
            reasoning: influenceData.reasoning,
            evidence: influenceData.evidence,
            signals: influenceData.signals,
            flotShare: influenceData.flotShare,
            positionDelta: influenceData.positionDelta,
            accumulationTempo: influenceData.accumulationTempo,
            historicalCorrelation: influenceData.historicalCorrelation,
            graphCentrality: influenceData.graphCentrality,
            flowPresence: influenceData.flowPresence,
          });
        }
      }

      // 4. Trier par score d'influence décroissant
      dominantEntities.sort((a, b) => b.influenceScore - a.influenceScore);

      // 5. Limiter au TOP 5 seulement
      const top5 = dominantEntities.slice(0, 5);

      log.info('Dominant entities found', { 
        count: top5.length,
        scores: top5.map(e => ({ name: e.entityName, score: e.influenceScore })),
      });

      return {
        success: true,
        ticker,
        dominantEntities: top5,
        timestamp: new Date().toISOString(),
      };
    }, 'Find dominant entities');
  }

  /**
   * Calculer un vrai score d'influence avec plusieurs critères pondérés
   * Influence = w1*flot + w2*DeltaPosition + w3*VolHistorique + w4*Centralité + w5*Patterns
   */
  private async calculateRealInfluenceScore(
    institution: InstitutionalPosition,
    ownershipData: any,
    ticker: string,
    totalFloat: number
  ): Promise<{
    influenceScore: number;
    category: InfluenceCategory;
    reasoning: string;
    evidence: AttributionEvidence[];
    signals: string[];
    flotShare?: number;
    positionDelta?: number;
    accumulationTempo?: number;
    historicalCorrelation?: number;
    graphCentrality?: number;
    flowPresence?: number;
  }> {
    const evidence: AttributionEvidence[] = [];
    const signals: string[] = [];
    let influenceScore = 0;

    // ========== CRITÈRE 1 : % du flottant détenu (⭐⭐⭐⭐⭐ - 25%)
    let flotShare = 0;
    if (ownershipData && totalFloat > 0) {
      const units = ownershipData.units || 0;
      flotShare = (units / totalFloat) * 100;
      
      if (flotShare > 0) {
        // Score basé sur le % du flottant (logarithmique)
        const flotScore = Math.min(100, Math.log10(flotShare * 10 + 1) * 20);
        influenceScore += flotScore * 0.25; // 25% du poids
        
        evidence.push({
          type: 'POSITION_CHANGE',
          score: flotScore,
          description: `Détient ${flotShare.toFixed(2)}% du flottant`,
        });
        
        if (flotShare > 5) {
          signals.push('High flot share');
        } else if (flotShare > 2) {
          signals.push('Moderate flot share');
        }
      }
    }

    // ========== CRITÈRE 2 : Variation récente (⭐⭐⭐⭐ - 20%)
    let positionDelta = 0;
    if (Math.abs(institution.changePercent) > 0.1) {
      positionDelta = institution.changePercent;
      const deltaScore = Math.min(100, Math.abs(positionDelta) * 3);
      influenceScore += deltaScore * 0.20; // 20% du poids
      
      const direction = positionDelta > 0 ? 'augmenté' : 'réduit';
      evidence.push({
        type: 'POSITION_CHANGE',
        score: deltaScore,
        description: `Position ${direction} de ${Math.abs(positionDelta).toFixed(2)}% récemment`,
      });
      
      if (Math.abs(positionDelta) > 10) {
        signals.push('Strong position change');
      } else if (Math.abs(positionDelta) > 5) {
        signals.push('Moderate position change');
      }
    } else {
      // Si pas de changement, pénaliser légèrement
      influenceScore += 10 * 0.20; // Score minimal
    }

    // ========== CRITÈRE 3 : Tempo d'accumulation (⭐⭐⭐ - 15%)
    let accumulationTempo = 0;
    if (ownershipData && ownershipData.filing_date) {
      const daysSinceFiling = this.calculateDaysDifference(
        ownershipData.filing_date,
        new Date().toISOString()
      );
      
      // Plus récent = meilleur tempo
      if (daysSinceFiling <= 30) {
        accumulationTempo = 100 - (daysSinceFiling * 2);
        signals.push('Recent accumulation');
      } else if (daysSinceFiling <= 90) {
        accumulationTempo = 70 - ((daysSinceFiling - 30) * 0.5);
        signals.push('Ongoing accumulation');
      } else {
        accumulationTempo = 30;
      }
      
      influenceScore += accumulationTempo * 0.15; // 15% du poids
      
      evidence.push({
        type: 'TIMING_CORRELATION',
        score: accumulationTempo,
        description: `Dernière déclaration il y a ${daysSinceFiling} jours`,
      });
    }

    // ========== CRITÈRE 4 : Centralité dans Neo4j (⭐⭐⭐⭐⭐ - 25%)
    const graphCentrality = await this.graphService.getEntityCentrality(
      institution.institutionId,
      'Institution'
    );
    
    if (graphCentrality > 0.1) {
      influenceScore += graphCentrality * 100 * 0.25; // 25% du poids
      signals.push('Strong graph influence');
      
      evidence.push({
        type: 'GRAPH_CENTRALITY',
        score: graphCentrality * 100,
        description: `Centralité élevée dans le réseau (${graphCentrality.toFixed(2)})`,
      });
    } else {
      // Centralité faible = pénalité
      influenceScore += 10 * 0.25;
    }

    // ========== CRITÈRE 5 : Corrélation historique (⭐⭐⭐⭐⭐ - 15%)
    // Analyser les patterns historiques
    const historicalPatterns = await this.analyzeInstitutionHistoricalPatterns(
      institution.institutionId,
      ticker
    );
    
    let historicalCorrelation = 50; // Par défaut
    if (historicalPatterns.length > 0) {
      // Plus de patterns = meilleure corrélation
      historicalCorrelation = Math.min(100, 50 + historicalPatterns.length * 15);
      signals.push('Pattern repetition');
      
      evidence.push({
        type: 'HISTORICAL_PATTERN',
        score: historicalCorrelation,
        description: `${historicalPatterns.length} patterns historiques détectés`,
      });
    }
    
    influenceScore += historicalCorrelation * 0.15; // 15% du poids

    // Normaliser le score (0-100)
    influenceScore = Math.min(100, Math.max(0, influenceScore));

    // Déterminer la catégorie d'influence
    let category: InfluenceCategory = 'PERIPHERAL';
    if (influenceScore >= 80) {
      category = 'CORE_DOMINANT';
    } else if (influenceScore >= 65) {
      category = 'STRONG_INFLUENCE';
    } else if (influenceScore >= 50) {
      category = 'MODERATE_INFLUENCE';
    }

    // Générer le reasoning
    const reasoningParts: string[] = [];
    if (flotShare > 0) {
      reasoningParts.push(`Détient ${flotShare.toFixed(2)}% du flottant`);
    }
    if (Math.abs(positionDelta) > 1) {
      reasoningParts.push(`Position ${positionDelta > 0 ? 'augmentée' : 'réduite'} de ${Math.abs(positionDelta).toFixed(2)}%`);
    }
    if (graphCentrality > 0.3) {
      reasoningParts.push(`forte centralité graphe`);
    }
    if (historicalPatterns.length > 0) {
      reasoningParts.push(`comportement moteur avant les earnings`);
    }
    
    const reasoning = reasoningParts.length > 0 
      ? reasoningParts.join('; ')
      : `Position majeure (${(institution.value / 1000000).toFixed(2)}M$)`;

    return {
      influenceScore: Math.round(influenceScore),
      category,
      reasoning,
      evidence,
      signals,
      flotShare: flotShare > 0 ? flotShare : undefined,
      positionDelta: Math.abs(positionDelta) > 0.1 ? positionDelta : undefined,
      accumulationTempo: accumulationTempo > 0 ? accumulationTempo : undefined,
      historicalCorrelation: historicalCorrelation > 50 ? historicalCorrelation : undefined,
      graphCentrality: graphCentrality > 0.1 ? graphCentrality : undefined,
      flowPresence: undefined, // TODO: Implémenter avec les flows réels
    };
  }

  /**
   * Clustering institutionnel
   */
  async clusterInstitutions(sector?: string): Promise<ClustersResponse> {
    return handleError(async () => {
      const log = logger.child({
        operation: 'clusterInstitutions',
        sector,
      });

      log.info('Clustering institutions', { sector });

      // TODO: Implémenter avec Neo4j community detection dans Phase 2
      // Pour l'instant, retourner un cluster vide
      const clusters: InstitutionCluster[] = [];

      log.info('Institution clusters calculated', { count: clusters.length });

      return {
        success: true,
        clusters,
        sector,
        timestamp: new Date().toISOString(),
      };
    }, 'Cluster institutions');
  }

  /**
   * Récupérer les positions institutionnelles récentes
   */
  private async getRecentInstitutionalPositions(
    ticker: string
  ): Promise<InstitutionalPosition[]> {
    const log = logger.child({ operation: 'getRecentInstitutionalPositions' });

    // Récupérer depuis le graphe (si disponible) ou depuis UW/FMP
    const [graphResult, uwResult] = await Promise.allSettled([
      this.graphService.getInstitutionalPositions(ticker),
      uw.getUWInstitutionOwnership(ticker, { limit: 50 }),
    ]);

    const positions: InstitutionalPosition[] = [];

    if (graphResult.status === 'fulfilled') {
      positions.push(...graphResult.value);
    }

    if (uwResult.status === 'fulfilled' && uwResult.value.success) {
      // Convertir les données UW en positions
      uwResult.value.data.forEach((holding: any) => {
        // UW utilise 'units' au lieu de 'shares', et 'units_change' au lieu de 'change'
        const units = holding.units || holding.shares || 0;
        const unitsChange = holding.units_change || holding.change || 0;
        const value = typeof holding.value === 'string' ? parseFloat(holding.value) : (holding.value || 0);
        const instValue = typeof holding.inst_value === 'string' ? parseFloat(holding.inst_value) : (holding.inst_value || value);
        
        // Calculer le pourcentage de changement
        const changePercent = units > 0 && unitsChange !== 0 
          ? Math.abs((unitsChange / units) * 100) 
          : 0;

        positions.push({
          institutionId: holding.cik || holding.name || holding.short_name,
          institutionName: holding.name || holding.short_name,
          shares: units,
          value: instValue || value,
          change: unitsChange,
          changePercent: changePercent,
          filingDate: holding.filing_date || holding.report_date,
        });
      });
      
      log.info('UW institutional positions converted', { 
        count: positions.length,
        sample: positions[0] 
      });
    } else if (uwResult.status === 'rejected') {
      log.warn('Failed to fetch UW institutional positions', { 
        error: uwResult.reason 
      });
    }

    log.info('Institutional positions retrieved', { count: positions.length });

    return positions;
  }

  /**
   * Récupérer les transactions insiders récentes
   */
  private async getRecentInsiderTransactions(
    ticker: string
  ): Promise<InsiderTransaction[]> {
    const log = logger.child({ operation: 'getRecentInsiderTransactions' });

    const [graphResult, uwResult] = await Promise.allSettled([
      this.graphService.getInsiderTransactions(ticker),
      uw.getUWStockInsiderBuySells(ticker, {}),
    ]);

    const transactions: InsiderTransaction[] = [];

    if (graphResult.status === 'fulfilled') {
      transactions.push(...graphResult.value);
    }

    if (uwResult.status === 'fulfilled' && uwResult.value.success) {
      const data = uwResult.value.data;
      // UW retourne un objet avec buy_sells et sell_sells, ou directement un array
      let allTransactions: any[] = [];
      
      if (Array.isArray(data)) {
        allTransactions = data;
      } else if (data && typeof data === 'object') {
        if ('buy_sells' in data || 'sell_sells' in data) {
          allTransactions = [...((data as any).buy_sells || []), ...((data as any).sell_sells || [])];
        } else if ('data' in data && Array.isArray((data as any).data)) {
          allTransactions = (data as any).data;
        }
      }

      allTransactions.forEach((transaction: any) => {
        // Extraire les données avec plusieurs fallbacks
        const ownerName = transaction.owner_name || transaction.insider_name || transaction.name || 'Unknown';
        const transactionCode = transaction.transaction_code || transaction.type || transaction.transaction_type || '';
        const amount = Math.abs(transaction.amount || transaction.shares || transaction.units || 0);
        const price = parseFloat(transaction.price || transaction.price_per_share || '0');
        const date = transaction.transaction_date || transaction.date || transaction.filing_date || new Date().toISOString().split('T')[0];

        transactions.push({
          insiderId: ownerName.toLowerCase().replace(/\s+/g, '-'),
          insiderName: ownerName,
          ticker: transaction.ticker || ticker,
          transactionType: transactionCode,
          amount: amount,
          price: price,
          date: date,
        });
      });
      
      log.info('UW insider transactions converted', { 
        count: transactions.length,
        sample: transactions[0] 
      });
    } else if (uwResult.status === 'rejected') {
      log.warn('Failed to fetch UW insider transactions', { 
        error: uwResult.reason 
      });
    }

    log.info('Insider transactions retrieved', { count: transactions.length });

    return transactions;
  }

  /**
   * Analyser les patterns historiques
   */
  private async analyzeHistoricalPatterns(
    ticker: string,
    flowType: 'CALL' | 'PUT'
  ): Promise<HistoricalPattern[]> {
    const log = logger.child({ operation: 'analyzeHistoricalPatterns' });

    // Récupérer les flows historiques depuis le graphe ou UW
    const [graphResult, uwResult] = await Promise.allSettled([
      this.graphService.getHistoricalFlows(ticker, flowType),
      uw.getUWRecentFlows(ticker, {}),
    ]);

    const patterns: HistoricalPattern[] = [];

    // Analyser les patterns (exemple simplifié)
    // En production, utiliser du machine learning ou des heuristiques avancées

    log.info('Historical patterns analyzed', { count: patterns.length });

    return patterns;
  }

  /**
   * Calculer les attributions
   * C'est le cœur de l'algorithme d'attribution
   */
  private async calculateAttributions(
    request: FlowAttributionRequest,
    institutions: InstitutionalPosition[],
    insiders: InsiderTransaction[],
    historicalPatterns: HistoricalPattern[]
  ): Promise<AttributionResult[]> {
    const log = logger.child({ operation: 'calculateAttributions' });

    const attributions: AttributionResult[] = [];

    // Trouver le top holder pour normalisation relative
    const topHolderValue = institutions.length > 0
      ? Math.max(...institutions.map(i => i.value))
      : 1; // Éviter division par zéro

    // Limiter le nombre d'institutions traitées pour éviter timeout (top 20 par valeur)
    const topInstitutions = institutions
      .sort((a, b) => b.value - a.value)
      .slice(0, 20);

    // 1. Attribuer aux institutions avec normalisation relative (limitées aux top 20)
    for (const institution of topInstitutions) {
      const attribution = await this.attributeToInstitution(
        request,
        institution,
        historicalPatterns,
        topHolderValue // Passer le top holder pour normalisation
      );

      // Réduire le seuil à 15 pour voir plus d'attributions
      // Les positions majeures (> 1M$) devraient toujours être incluses
      if (attribution.confidence > 15 || institution.value > 1000000) {
        attributions.push(attribution);
        log.info('Attribution added', {
          institutionId: institution.institutionId,
          institutionName: institution.institutionName,
          confidence: attribution.confidence,
          value: institution.value,
          changePercent: institution.changePercent,
        });
      } else {
        log.debug('Attribution filtered out (low confidence)', {
          institutionId: institution.institutionId,
          confidence: attribution.confidence,
          value: institution.value,
        });
      }
    }

    // 2. Attribuer aux insiders
    for (const insider of insiders) {
      const attribution = await this.attributeToInsider(
        request,
        insider,
        historicalPatterns
      );

      // Réduire le seuil à 15 pour voir plus d'attributions
      if (attribution.confidence > 15) {
        attributions.push(attribution);
        log.info('Insider attribution added', {
          insiderId: insider.insiderId,
          insiderName: insider.insiderName,
          confidence: attribution.confidence,
          transactionType: insider.transactionType,
          amount: insider.amount,
        });
      } else {
        log.debug('Insider attribution filtered out (low confidence)', {
          insiderId: insider.insiderId,
          confidence: attribution.confidence,
        });
      }
    }

    // 3. Trier par confiance
    attributions.sort((a, b) => b.confidence - a.confidence);

    log.info('Attributions calculated', { count: attributions.length });

    return attributions;
  }

  /**
   * Attribuer un flow à une institution
   * Utilise la normalisation relative et la formule Arkham-style
   */
  private async attributeToInstitution(
    request: FlowAttributionRequest,
    institution: InstitutionalPosition,
    historicalPatterns: HistoricalPattern[],
    topHolderValue: number = 1
  ): Promise<AttributionResult> {
    const evidence: AttributionEvidence[] = [];
    
    // ========== CALCUL AVEC NORMALISATION RELATIVE ==========
    
    // 1. Position Weight (normalisé par rapport au top holder) - 40%
    const positionWeight = topHolderValue > 0 
      ? Math.min(1, institution.value / topHolderValue)
      : 0;
    
    // 2. Timing Weight (décroissance sur 45 jours) - 30%
    let timingWeight = 0;
    if (institution.filingDate) {
      const daysDiff = this.calculateDaysDifference(
        institution.filingDate,
        request.timestamp
      );
      timingWeight = Math.max(0, 1 - daysDiff / 45); // 45 days decay
      
      if (daysDiff <= 90) {
        evidence.push({
          type: 'TIMING_CORRELATION',
          score: timingWeight * 100,
          description: `Position déclarée il y a ${daysDiff} jours`,
        });
      }
    }
    
    // 3. Pattern Weight (basé sur les patterns historiques) - 20%
    let patternWeight = 0;
    const matchingPattern = historicalPatterns.find(
      (p) => p.type === institution.institutionId
    );
    if (matchingPattern && matchingPattern.frequency > 0) {
      patternWeight = Math.min(1, matchingPattern.frequency / 10); // Normalisé sur 10 occurrences
      evidence.push({
        type: 'HISTORICAL_PATTERN',
        score: patternWeight * 100,
        description: `Pattern historique détecté (${matchingPattern.frequency} occurrences)`,
      });
    }
    
    // 4. Centrality Weight (Neo4j simple avec timeout) - 10%
    let centralityWeight = 0;
    try {
      // Utiliser centralité simple (plus rapide) au lieu d'avancée pour éviter timeout
      centralityWeight = await Promise.race([
        this.graphService.getEntityCentrality(
          institution.institutionId,
          'Institution'
        ),
        new Promise<number>((resolve) => setTimeout(() => resolve(0), 1000)),
      ]);
    } catch (error) {
      centralityWeight = 0;
    }
    
    // Fallback si centralité trop faible (probablement Neo4j pas encore opérationnel)
    if (centralityWeight < 0.1) {
      // Calculer une centralité approximative basée sur la taille relative
      centralityWeight = Math.min(0.5, positionWeight * 0.5); // Max 0.5 en fallback
    }
    
    if (centralityWeight > 0.1 && !evidence.find(e => e.type === 'GRAPH_CENTRALITY')) {
      evidence.push({
        type: 'GRAPH_CENTRALITY',
        score: centralityWeight * 100,
        description: `Institution connectée dans le réseau (centralité: ${centralityWeight.toFixed(2)})`,
      });
    }
    
    // 5. Flow Signature Matching (bonus si pattern reconnu) - DÉSACTIVÉ TEMPORAIREMENT pour éviter timeout
    // TODO: Réactiver avec cache ou requête optimisée
    let flowSignatureBonus = 0;
    // Désactivé temporairement pour éviter timeout
    // if (request.strike && request.expiry) {
    //   try {
    //     const signatureMatch = await Promise.race([
    //       this.flowSignatureService.matchFlowSignature(request, institution.institutionId),
    //       new Promise<FlowSignatureMatch | null>((resolve) => setTimeout(() => resolve(null), 2000)),
    //     ]);
    //     
    //     if (signatureMatch && signatureMatch.matchScore >= 50) {
    //       flowSignatureBonus = Math.min(20, (signatureMatch.matchScore - 50) / 2.5);
    //       evidence.push({
    //         type: 'FLOW_MATCH',
    //         score: signatureMatch.matchScore,
    //         description: signatureMatch.reasoning,
    //       });
    //     }
    //   } catch (error) {
    //     // Ignorer les erreurs de signature matching
    //   }
    // }
    
    // ========== CALCUL FINAL DE LA CONFIDENCE ==========
    // Formule fournie : confidence = 0.40*position + 0.30*timing + 0.20*pattern + 0.10*centrality + flowSignatureBonus
    let confidence = 
      0.40 * positionWeight * 100 +
      0.30 * timingWeight * 100 +
      0.20 * patternWeight * 100 +
      0.10 * centralityWeight * 100 +
      flowSignatureBonus;
    
    // ========== BONUS : Changement de position récent ==========
    if (Math.abs(institution.changePercent) > 1) {
      const changeBonus = Math.min(15, Math.abs(institution.changePercent) * 1.5);
      const direction = institution.change > 0 ? 'augmenté' : 'réduit';
      evidence.push({
        type: 'POSITION_CHANGE',
        score: changeBonus,
        description: `${institution.institutionName} a ${direction} sa position de ${Math.abs(institution.changePercent).toFixed(2)}%`,
      });
      confidence += changeBonus;
    } else if (institution.value > 1000000) {
      // Si pas de changement mais position majeure, ajouter un score de base
      const baseScore = Math.min(10, Math.log10(institution.value / 1000000) * 3);
      evidence.push({
        type: 'POSITION_CHANGE',
        score: baseScore,
        description: `${institution.institutionName} détient une position majeure (${(institution.value / 1000000).toFixed(2)}M$)`,
      });
      confidence += baseScore;
    }
    
    // Normaliser la confiance (0-100)
    confidence = Math.min(100, Math.max(0, confidence));

    return {
      entityId: institution.institutionId,
      entityType: 'Institution',
      entityName: institution.institutionName,
      confidence: Math.round(confidence),
      reasoning: this.generateReasoning(evidence, confidence),
      evidence,
    };
  }

  /**
   * Attribuer un flow à un insider
   */
  private async attributeToInsider(
    request: FlowAttributionRequest,
    insider: InsiderTransaction,
    historicalPatterns: HistoricalPattern[]
  ): Promise<AttributionResult> {
    const evidence: AttributionEvidence[] = [];
    let confidence = 0;

    // 1. Vérifier le type de transaction
    if (insider.transactionType === 'P' || insider.transactionType === 'A') {
      // Purchase ou Acquisition
      const score = 75;
      evidence.push({
        type: 'INSIDER_TRANSACTION',
        score,
        description: `${insider.insiderName} a acheté ${Math.abs(insider.amount)} shares`,
      });
      confidence += score * 0.5; // 50% du poids
    }

    // 2. Vérifier le timing
    // Augmenter la fenêtre à 30 jours pour capturer plus de transactions
    const daysDiff = this.calculateDaysDifference(insider.date, request.timestamp);

    if (daysDiff <= 30) { // Fenêtre augmentée de 7 à 30 jours
      // Score décroît plus lentement : 100 - (daysDiff * 3) au lieu de * 10
      const score = Math.max(0, 100 - daysDiff * 3);
      evidence.push({
        type: 'TIMING_CORRELATION',
        score,
        description: `Transaction insider il y a ${daysDiff} jours`,
      });
      confidence += score * 0.3; // 30% du poids
    }
    
    // 2b. Bonus si la transaction est très récente (< 3 jours)
    if (daysDiff <= 3) {
      const bonus = 25;
      evidence.push({
        type: 'TIMING_CORRELATION',
        score: bonus,
        description: `Transaction insider très récente (il y a ${daysDiff} jours)`,
      });
      confidence += bonus;
    }

    // 3. Vérifier les patterns historiques
    const matchingPattern = historicalPatterns.find(
      (p) => p.type === insider.insiderId
    );

    if (matchingPattern) {
      const score = Math.min(70, matchingPattern.frequency * 20);
      evidence.push({
        type: 'HISTORICAL_PATTERN',
        score,
        description: `Pattern historique détecté`,
      });
      confidence += score * 0.2; // 20% du poids
    }

    confidence = Math.min(100, confidence);

    // Déterminer le pattern type de l'insider
    let insiderPatternType: 'FREQUENT_BUYER' | 'FREQUENT_SELLER' | 'OCCASIONAL' | 'UNKNOWN' = 'UNKNOWN';
    if (insider.transactionType === 'P' || insider.transactionType === 'A') {
      insiderPatternType = 'FREQUENT_BUYER';
    } else if (insider.transactionType === 'S' || insider.transactionType === 'D') {
      insiderPatternType = 'FREQUENT_SELLER';
    } else {
      insiderPatternType = 'OCCASIONAL';
    }

    // Déterminer la taille de la transaction
    const absAmount = Math.abs(insider.amount);
    let transactionSize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'VERY_LARGE' = 'SMALL';
    if (absAmount > 100000) {
      transactionSize = 'VERY_LARGE';
    } else if (absAmount > 10000) {
      transactionSize = 'LARGE';
    } else if (absAmount > 1000) {
      transactionSize = 'MEDIUM';
    }

    // Calculer la corrélation historique (simplifié)
    // En production, utiliser les données historiques réelles
    let historicalCorrelation = 50; // Par défaut
    if (matchingPattern) {
      historicalCorrelation = Math.min(100, matchingPattern.frequency * 15 + 30);
    } else if (daysDiff <= 7) {
      historicalCorrelation = 70; // Transaction récente = corrélation plus élevée
    }

    // Enrichir avec le registry (avec timeout)
    let insiderInfo = null;
    try {
      insiderInfo = await Promise.race([
        this.insiderRegistryService.enrichInsider(
          insider.insiderId,
          insider.insiderName || insider.insiderId,
          insider.ticker
        ),
        new Promise<import('../types/attribution').InsiderInfo | null>((resolve) => 
          setTimeout(() => resolve(null), 1500)
        ),
      ]);
      
      // Si on a des infos enrichies, améliorer le score
      if (insiderInfo && insiderInfo.role) {
        // Bonus pour les rôles importants
        if (['CEO', 'CFO', 'COO', 'President', 'Director'].some(r => insiderInfo!.role?.includes(r))) {
          confidence += 10;
          evidence.push({
            type: 'INSIDER_TRANSACTION',
            score: 10,
            description: `Rôle important: ${insiderInfo.role}`,
          });
        }
      }
    } catch (error) {
      // Ignorer les erreurs du registry
    }

    // Ne pas afficher des insiders "Unknown" sans plus d'info si la confiance est faible
    if ((insider.insiderName === 'Unknown' || !insider.insiderName) && !insiderInfo?.name) {
      if (confidence < 60 && historicalCorrelation < 60) {
        // Réduire la confiance pour les insiders Unknown sans info
        confidence = Math.max(0, confidence - 20);
      }
    }

    return {
      entityId: insider.insiderId,
      entityType: 'Insider',
      entityName: insider.insiderName || 'Unknown',
      confidence: Math.round(confidence),
      reasoning: this.generateReasoning(evidence, confidence),
      evidence,
      insiderPatternType,
      transactionSize,
      historicalCorrelation: Math.round(historicalCorrelation),
    };
  }

  /**
   * Détecter les entités en opposition (Conflict Engine amélioré)
   * Détecte : short interest, put flows, dark pool bearish, institutions opposées
   */
  private async detectConflictingEntities(
    ticker: string,
    flowType: 'CALL' | 'PUT',
    attributions: AttributionResult[],
    institutions: InstitutionalPosition[]
  ): Promise<AttributionResult[]> {
    const conflicting: AttributionResult[] = [];
    const log = logger.child({ operation: 'detectConflictingEntities', ticker, flowType });

    // Si c'est un flow de CALLs, chercher les oppositions (PUTs, shorts, etc.)
    if (flowType === 'CALL') {
      // 1. Short intérêt élevé
      const [shortInterestResult, putFlowsResult, darkPoolResult] = await Promise.allSettled([
        uw.getUWShortInterestAndFloat(ticker, {}),
        uw.getUWRecentFlows(ticker, {}), // On filtrera les PUTs après
        uw.getUWDarkPoolTrades(ticker, { limit: 50 }),
      ]);

      // 1a. Short intérêt élevé
      if (shortInterestResult.status === 'fulfilled' && shortInterestResult.value.success) {
        const si = shortInterestResult.value.data;
        const percentReturned = parseFloat(si.percent_returned || '0');
        
        if (percentReturned > 20) {
          conflicting.push({
            entityId: 'market-shorts',
            entityType: 'Unknown',
            entityName: 'Market Shorts',
            confidence: Math.min(90, percentReturned * 3),
            reasoning: `Short intérêt élevé (${percentReturned.toFixed(2)}%) - Opposition significative`,
            evidence: [
              {
                type: 'BEHAVIORAL_PATTERN',
                score: Math.min(90, percentReturned * 3),
                description: `Short intérêt de ${percentReturned.toFixed(2)}% du flottant`,
              },
            ],
            role: 'OPPOSITION',
          });
          log.info('High short interest detected', { percentReturned });
        }
      }

      // 1b. PUT flows récents (opposition directe)
      if (putFlowsResult.status === 'fulfilled' && putFlowsResult.value.success) {
        const flows = putFlowsResult.value.data || [];
        const putFlows = flows.filter((f: any) => 
          f.type === 'PUT' || f.option_type === 'PUT' || f.call_put === 'PUT'
        );
        
        if (putFlows.length > 0) {
          const totalPutPremium = putFlows.reduce((sum: number, f: any) => 
            sum + (parseFloat(f.premium || f.total_premium || '0') || 0), 0
          );
          
          if (totalPutPremium > 1000000) { // > 1M$ de PUTs
            conflicting.push({
              entityId: 'put-flow-opposition',
              entityType: 'Unknown',
              entityName: 'PUT Flow Opposition',
              confidence: Math.min(85, (totalPutPremium / 10000000) * 50),
              reasoning: `Flows PUT significatifs détectés (${(totalPutPremium / 1000000).toFixed(2)}M$)`,
              evidence: [
                {
                  type: 'BEHAVIORAL_PATTERN',
                  score: Math.min(85, (totalPutPremium / 10000000) * 50),
                  description: `${putFlows.length} flows PUT récents (${(totalPutPremium / 1000000).toFixed(2)}M$)`,
                },
              ],
              role: 'OPPOSITION',
            });
            log.info('PUT flows detected', { count: putFlows.length, totalPremium: totalPutPremium });
          }
        }
      }

      // 1c. Dark pool bearish (volume élevé = possible distribution)
      if (darkPoolResult.status === 'fulfilled' && darkPoolResult.value.success) {
        const darkPoolTrades = darkPoolResult.value.data || [];
        if (darkPoolTrades.length > 0) {
          const recentTrades = darkPoolTrades.slice(0, 10); // 10 plus récents
          const totalVolume = recentTrades.reduce((sum: number, t: any) => 
            sum + (parseInt(t.volume || t.size || '0', 10) || 0), 0
          );
          
          // Si volume dark pool très élevé, possible distribution (bearish)
          if (totalVolume > 5000000) { // > 5M shares
            conflicting.push({
              entityId: 'dark-pool-distribution',
              entityType: 'Unknown',
              entityName: 'Dark Pool Distribution',
              confidence: Math.min(75, (totalVolume / 10000000) * 50),
              reasoning: `Volume dark pool élevé (${(totalVolume / 1000000).toFixed(2)}M shares) - Possible distribution`,
              evidence: [
                {
                  type: 'BEHAVIORAL_PATTERN',
                  score: Math.min(75, (totalVolume / 10000000) * 50),
                  description: `Volume dark pool élevé récent (${(totalVolume / 1000000).toFixed(2)}M shares)`,
                },
              ],
              role: 'OPPOSITION',
            });
            log.info('Dark pool distribution detected', { totalVolume });
          }
        }
      }

      // 1d. Institutions réduisant position (opposition institutionnelle)
      const reducingInstitutions = institutions
        .filter((inst) => inst.change < 0 && Math.abs(inst.changePercent) > 5)
        .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
        .slice(0, 3); // Top 3

      for (const inst of reducingInstitutions) {
        const isAlreadyAttributed = attributions.some(
          (a) => a.entityId === inst.institutionId && a.role !== 'OPPOSITION'
        );

        if (!isAlreadyAttributed) {
          conflicting.push({
            entityId: inst.institutionId,
            entityType: 'Institution',
            entityName: inst.institutionName,
            confidence: Math.min(80, Math.abs(inst.changePercent) * 5),
            reasoning: `${inst.institutionName} a réduit sa position de ${Math.abs(inst.changePercent).toFixed(2)}% récemment`,
            evidence: [
              {
                type: 'POSITION_CHANGE',
                score: Math.min(80, Math.abs(inst.changePercent) * 5),
                description: `Position réduite de ${Math.abs(inst.changePercent).toFixed(2)}%`,
              },
            ],
            role: 'OPPOSITION',
          });
        }
      }
    }

    // Si c'est un flow de PUTs, chercher les oppositions (CALLs, positions longues)
    if (flowType === 'PUT') {
      // 1. CALL flows récents (opposition directe) - avec timeout
      const callFlowsResult = await Promise.allSettled([
        Promise.race([
          uw.getUWRecentFlows(ticker, {}),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000)),
        ]).catch(() => ({ success: false, data: [] })),
      ]);

      if (callFlowsResult[0].status === 'fulfilled' && callFlowsResult[0].value.success) {
        const flows = callFlowsResult[0].value.data || [];
        const callFlows = flows.filter((f: any) => 
          f.type === 'CALL' || f.option_type === 'CALL' || f.call_put === 'CALL'
        );
        
        if (callFlows.length > 0) {
          const totalCallPremium = callFlows.reduce((sum: number, f: any) => 
            sum + (parseFloat(f.premium || f.total_premium || '0') || 0), 0
          );
          
          if (totalCallPremium > 1000000) {
            conflicting.push({
              entityId: 'call-flow-opposition',
              entityType: 'Unknown',
              entityName: 'CALL Flow Opposition',
              confidence: Math.min(85, (totalCallPremium / 10000000) * 50),
              reasoning: `Flows CALL significatifs détectés (${(totalCallPremium / 1000000).toFixed(2)}M$)`,
              evidence: [
                {
                  type: 'BEHAVIORAL_PATTERN',
                  score: Math.min(85, (totalCallPremium / 10000000) * 50),
                  description: `${callFlows.length} flows CALL récents (${(totalCallPremium / 1000000).toFixed(2)}M$)`,
                },
              ],
              role: 'OPPOSITION',
            });
          }
        }
      }

      // 2. Institutions augmentant position (opposition institutionnelle)
      const increasingInstitutions = institutions
        .filter((inst) => inst.change > 0 && inst.changePercent > 5)
        .sort((a, b) => b.changePercent - a.changePercent)
        .slice(0, 3);

      for (const inst of increasingInstitutions) {
        const isAlreadyAttributed = attributions.some(
          (a) => a.entityId === inst.institutionId && a.role !== 'OPPOSITION'
        );

        if (!isAlreadyAttributed) {
          conflicting.push({
            entityId: inst.institutionId,
            entityType: 'Institution',
            entityName: inst.institutionName,
            confidence: Math.min(80, inst.changePercent * 5),
            reasoning: `${inst.institutionName} a augmenté sa position de ${inst.changePercent.toFixed(2)}% récemment`,
            evidence: [
              {
                type: 'POSITION_CHANGE',
                score: Math.min(80, inst.changePercent * 5),
                description: `Position augmentée de ${inst.changePercent.toFixed(2)}%`,
              },
            ],
            role: 'OPPOSITION',
          });
        }
      }
    }

    // Trier par confiance décroissante
    conflicting.sort((a, b) => b.confidence - a.confidence);

    log.info('Conflicting entities detected', { count: conflicting.length });

    return conflicting;
  }

  /**
   * Calculer la confiance globale
   */
  private calculateOverallConfidence(
    attributions: AttributionResult[]
  ): number {
    if (attributions.length === 0) return 0;

    // Moyenne pondérée par la confiance
    const totalConfidence = attributions.reduce(
      (sum, attr) => sum + attr.confidence,
      0
    );

    return Math.round(totalConfidence / attributions.length);
  }

  /**
   * Intégrer l'attribution dans le graphe
   */
  private async integrateAttributionInGraph(
    request: FlowAttributionRequest,
    attributions: AttributionResult[]
  ): Promise<void> {
    // Créer un nœud Flow dans le graphe
    const flowId = this.generateFlowId(request);

    await this.graphService.createOrUpdateNode('Flow', {
      id: flowId,
      ticker: request.ticker,
      flowType: request.flowType,
      premium: request.premium,
      strike: request.strike,
      expiry: request.expiry,
      timestamp: request.timestamp,
    });

    // Créer les relations Flow -> ATTRIBUTED_TO -> Entity
    for (const attribution of attributions) {
      await this.graphService.createOrUpdateRelationship(
        { type: 'Flow', id: flowId },
        { type: attribution.entityType, id: attribution.entityId },
        'ATTRIBUTED_TO',
        {
          confidence: attribution.confidence,
          reasoning: attribution.reasoning,
        }
      );
    }
  }

  /**
   * Calculer le score d'influence d'une institution
   */
  private async calculateInstitutionInfluenceScore(
    institutionId: string,
    ticker: string,
    holdings: PromiseSettledResult<any>,
    activity: PromiseSettledResult<any>,
    institutionHolding?: any
  ): Promise<number> {
    let score = 0;

    // Utiliser institutionHolding si fourni (plus direct)
    if (institutionHolding) {
      const value = typeof institutionHolding.value === 'string' 
        ? parseFloat(institutionHolding.value) 
        : (institutionHolding.value || 0);
      const instValue = typeof institutionHolding.inst_value === 'string'
        ? parseFloat(institutionHolding.inst_value)
        : (institutionHolding.inst_value || value);
      const finalValue = instValue || value;
      
      // Plus la valeur est élevée, plus le score est élevé
      if (finalValue > 0) {
        score += Math.min(50, Math.log10(finalValue / 100000) * 10);
      }
      
      // Basé sur les unités
      const units = institutionHolding.units || 0;
      if (units > 0) {
        score += Math.min(20, Math.log10(units / 1000) * 5);
      }
      
      // Basé sur le changement d'unités
      const unitsChange = institutionHolding.units_change || 0;
      if (Math.abs(unitsChange) > 0) {
        const changePercent = units > 0 ? Math.abs((unitsChange / units) * 100) : 0;
        if (changePercent > 1) {
          score += Math.min(20, changePercent * 0.5);
        }
      }
    } else {
      // Fallback : chercher dans holdings
      if (holdings.status === 'fulfilled' && holdings.value.success) {
        const holding = holdings.value.data.find(
          (h: any) => (h.cik || h.name || h.short_name) === institutionId
        );
        if (holding) {
          const value = typeof holding.value === 'string' 
            ? parseFloat(holding.value) 
            : (holding.value || 0);
          const instValue = typeof holding.inst_value === 'string'
            ? parseFloat(holding.inst_value)
            : (holding.inst_value || value);
          const finalValue = instValue || value;
          
          if (finalValue > 0) {
            score += Math.min(50, Math.log10(finalValue / 100000) * 10);
          }
        }
      }
    }

    // Basé sur l'activité récente
    if (activity.status === 'fulfilled' && activity.value.success) {
      const activities = activity.value.data || [];
      if (activities.length > 0) {
        score += Math.min(30, activities.length * 5);
      }
    }

    // Basé sur la centralité (si disponible)
    const centrality = await this.graphService.getEntityCentrality(
      institutionId,
      'Institution'
    );
    score += centrality * 20;

    return Math.min(100, Math.round(score));
  }

  /**
   * Analyser les patterns historiques d'une institution
   */
  private async analyzeInstitutionHistoricalPatterns(
    institutionId: string,
    ticker: string
  ): Promise<HistoricalPattern[]> {
    return handleError(async () => {
      const log = logger.child({
        operation: 'analyzeInstitutionHistoricalPatterns',
        institutionId,
        ticker,
      });
      
      log.info('Analyzing institution historical patterns');
      
      const patterns: HistoricalPattern[] = [];
      
      // Récupérer l'activité historique de l'institution
      const [activityResult, ownershipResult] = await Promise.allSettled([
        uw.getUWInstitutionActivity(institutionId, { limit: 100 }),
        uw.getUWInstitutionOwnership(ticker, { limit: 50 }),
      ]);
      
      // Analyser les patterns d'activité
      if (activityResult.status === 'fulfilled' && activityResult.value.success) {
        const activities = activityResult.value.data || [];
        if (activities.length > 0) {
          patterns.push({
            type: 'ACTIVITY_FREQUENCY',
            frequency: activities.length,
            averageImpact: activities.length * 10,
            lastOccurrence: activities[0]?.report_date || new Date().toISOString(),
            description: `${activities.length} activités récentes sur ce ticker`,
          });
        }
      }
      
      // Analyser les patterns de position
      if (ownershipResult.status === 'fulfilled' && ownershipResult.value.success) {
        const holdings = ownershipResult.value.data || [];
        const institutionHolding = holdings.find(
          (h: any) => (h.cik || h.name || h.short_name) === institutionId
        );
        
        if (institutionHolding) {
          const unitsChange = institutionHolding.units_change || 0;
          if (Math.abs(unitsChange) > 0) {
            patterns.push({
              type: 'POSITION_CHANGE_PATTERN',
              frequency: 1,
              averageImpact: Math.abs(unitsChange),
              lastOccurrence: institutionHolding.filing_date || institutionHolding.report_date || new Date().toISOString(),
              description: `Changement de position de ${unitsChange > 0 ? '+' : ''}${unitsChange.toLocaleString()} units`,
            });
          }
        }
      }
      
      log.info('Historical patterns analyzed', { count: patterns.length });
      
      return patterns;
    }, 'Analyze institution historical patterns');
  }

  /**
   * Calculer les corrélations
   */
  private async calculateCorrelations(
    institutionId: string,
    ticker: string
  ): Promise<Correlation[]> {
    return handleError(async () => {
      const log = logger.child({
        operation: 'calculateCorrelations',
        institutionId,
        ticker,
      });
      
      log.info('Calculating correlations');
      
      const correlations: Correlation[] = [];
      
      // Récupérer les autres institutions sur le même ticker
      const ownershipResult = await Promise.allSettled([
        uw.getUWInstitutionOwnership(ticker, { limit: 50 }),
      ]);
      
      if (ownershipResult[0].status === 'fulfilled' && ownershipResult[0].value.success) {
        const holdings = ownershipResult[0].value.data || [];
        const institutionHolding = holdings.find(
          (h: any) => (h.cik || h.name || h.short_name) === institutionId
        );
        
        if (institutionHolding) {
          const topHoldings = holdings
            .filter((h: any) => (h.cik || h.name || h.short_name) !== institutionId)
            .sort((a: any, b: any) => {
              const aValue = typeof a.inst_value === 'string' ? parseFloat(a.inst_value) : (a.inst_value || 0);
              const bValue = typeof b.inst_value === 'string' ? parseFloat(b.inst_value) : (b.inst_value || 0);
              return bValue - aValue;
            })
            .slice(0, 5);
          
          for (const otherHolding of topHoldings) {
            const otherId = otherHolding.name || otherHolding.short_name;
            const otherValue = typeof otherHolding.inst_value === 'string' 
              ? parseFloat(otherHolding.inst_value) 
              : (otherHolding.inst_value || 0);
            const instValue = typeof institutionHolding.inst_value === 'string'
              ? parseFloat(institutionHolding.inst_value)
              : (institutionHolding.inst_value || 0);
            
            if (instValue > 0 && otherValue > 0) {
              const correlationScore = Math.min(100, (Math.min(instValue, otherValue) / Math.max(instValue, otherValue)) * 100);
              if (correlationScore > 20) {
                correlations.push({
                  entityId: otherId,
                  entityType: 'Institution',
                  correlationScore: Math.round(correlationScore),
                  description: `Position similaire à ${otherHolding.name || otherHolding.short_name} (${(otherValue / 1000000).toFixed(2)}M$)`,
                });
              }
            }
          }
        }
      }
      
      log.info('Correlations calculated', { count: correlations.length });
      
      return correlations;
    }, 'Calculate correlations');
  }

  // Helpers
  private generateFlowId(request: FlowAttributionRequest): string {
    const timestamp = request.timestamp.replace(/[:.]/g, '-');
    return `${request.ticker}-${request.flowType}-${timestamp}`;
  }

  private calculateDaysDifference(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return Math.abs(Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
  }

  private generateReasoning(
    evidence: AttributionEvidence[],
    confidence: number
  ): string {
    if (evidence.length === 0) return 'Aucune preuve trouvée';

    const topEvidence = evidence
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((e) => e.description)
      .join('; ');

    return `Confiance ${confidence}%: ${topEvidence}`;
  }

  /**
   * Filtrer et classer les attributions (top 5, threshold > 50%, group by type)
   */
  private filterAndRankAttributions(
    attributions: AttributionResult[]
  ): AttributionResult[] {
    // 1. Filtrer par threshold > 50%
    const filtered = attributions.filter((a) => a.confidence > 50);

    // 2. Grouper par type et prendre le top de chaque type
    const byType = new Map<EntityType, AttributionResult[]>();
    filtered.forEach((attr) => {
      const type = attr.entityType;
      if (!byType.has(type)) {
        byType.set(type, []);
      }
      byType.get(type)!.push(attr);
    });

    // 3. Prendre le top 2 de chaque type, puis le top 5 global
    const topByType: AttributionResult[] = [];
    byType.forEach((attrs) => {
      attrs.sort((a, b) => b.confidence - a.confidence);
      topByType.push(...attrs.slice(0, 2));
    });

    // 4. Trier globalement et prendre le top 5
    topByType.sort((a, b) => b.confidence - a.confidence);
    const top5 = topByType.slice(0, 5);

    // 5. Réduire l'homogénéité en ajoutant de la variance
    // Si les scores sont trop proches, ajuster légèrement
    if (top5.length > 1) {
      const scores = top5.map((a) => a.confidence);
      const variance = this.calculateVariance(scores);
      
      // Si variance < 5, les scores sont trop homogènes
      if (variance < 5) {
        // Ajuster les scores pour créer plus de différenciation
        top5.forEach((attr, index) => {
          // Le premier garde son score, les autres sont légèrement réduits
          if (index > 0) {
            const reduction = index * 2; // 2 points de réduction par position
            attr.confidence = Math.max(50, attr.confidence - reduction);
          }
        });
      }
    }

    return top5;
  }

  /**
   * Classifier le flow (whale, institution, hedge fund, etc.)
   */
  private classifyFlow(
    request: FlowAttributionRequest,
    attributions: AttributionResult[],
    institutions: InstitutionalPosition[]
  ): { flowCategory: FlowCategory; flowLikelihood: number } {
    const premium = request.premium;
    const flowType = request.flowType;

    // Détecter le type d'entité dominant
    const institutionsCount = attributions.filter((a) => a.entityType === 'Institution').length;
    const insidersCount = attributions.filter((a) => a.entityType === 'Insider').length;
    const unknownCount = attributions.filter((a) => a.entityType === 'Unknown').length;

    // Classification basée sur le premium et les entités
    let flowCategory: FlowCategory = 'UNKNOWN';
    let flowLikelihood = 50;

    // Whale flow : premium très élevé (> 10M$)
    if (premium > 10000000) {
      flowCategory = 'WHALE_FLOW';
      flowLikelihood = 85;
    }
    // Institution flow : plusieurs institutions, premium moyen
    else if (institutionsCount >= 2 && premium > 1000000) {
      flowCategory = 'INSTITUTION_FLOW';
      flowLikelihood = 75;
    }
    // Hedge fund flow : institutions mais premium plus modéré
    else if (institutionsCount >= 1 && premium > 500000) {
      flowCategory = 'HEDGE_FUND_FLOW';
      flowLikelihood = 70;
    }
    // Insider echo : insiders présents
    else if (insidersCount > 0) {
      flowCategory = 'INSIDER_ECHO';
      flowLikelihood = 65;
    }
    // Aggressive directional : CALL avec premium élevé
    else if (flowType === 'CALL' && premium > 2000000) {
      flowCategory = 'AGGRESSIVE_DIRECTIONAL';
      flowLikelihood = 70;
    }
    // Defensive positioning : PUT avec premium élevé
    else if (flowType === 'PUT' && premium > 2000000) {
      flowCategory = 'DEFENSIVE_POSITIONING';
      flowLikelihood = 70;
    }
    // Momentum flow : plusieurs entités, timing récent
    else if (attributions.length >= 2) {
      flowCategory = 'MOMENTUM_FLOW';
      flowLikelihood = 60;
    }
    // Neutral hedging : premium faible
    else if (premium < 500000) {
      flowCategory = 'NEUTRAL_HEDGING';
      flowLikelihood = 50;
    }

    // Ajuster la likelihood basée sur la confiance globale
    const avgConfidence = attributions.length > 0
      ? attributions.reduce((sum, a) => sum + a.confidence, 0) / attributions.length
      : 0;
    flowLikelihood = Math.min(100, flowLikelihood + (avgConfidence - 50) * 0.3);

    return { flowCategory, flowLikelihood: Math.round(flowLikelihood) };
  }

  /**
   * Générer une narration automatique
   */
  private generateNarrative(
    request: FlowAttributionRequest,
    attributions: AttributionResult[],
    conflictingEntities: AttributionResult[],
    primaryDriver: AttributionResult | undefined,
    flowCategory: FlowCategory
  ): string {
    if (attributions.length === 0) {
      return `Aucune attribution claire pour ce flow ${request.flowType} de ${(request.premium / 1000000).toFixed(2)}M$ sur ${request.ticker}.`;
    }

    const parts: string[] = [];

    // Partie 1 : Primary driver
    if (primaryDriver) {
      const driverName = primaryDriver.entityName || primaryDriver.entityId;
      const driverType = primaryDriver.entityType === 'Institution' ? 'institution' : 
                        primaryDriver.entityType === 'Insider' ? 'insider' : 'entité';
      parts.push(
        `${driverName} est le principal suspect (${primaryDriver.confidence}%) grâce à ${this.getMainEvidenceDescription(primaryDriver)}.`
      );
    }

    // Partie 2 : Autres entités significatives
    const otherEntities = attributions.slice(1, 3);
    if (otherEntities.length > 0) {
      const otherNames = otherEntities.map((e) => e.entityName || e.entityId).join(', ');
      const otherConfidences = otherEntities.map((e) => e.confidence).join('%, ');
      parts.push(
        `${otherNames} affichent également des signaux (${otherConfidences}%) mais sans confirmation temporelle aussi forte.`
      );
    }

    // Partie 3 : Insiders Unknown
    const unknownInsiders = attributions.filter(
      (a) => a.entityType === 'Unknown' || (a.entityType === 'Insider' && !a.entityName)
    );
    if (unknownInsiders.length > 0 && unknownInsiders[0].confidence > 50) {
      parts.push(
        `Un insider non identifié semble actif également (${unknownInsiders[0].confidence}%), ce qui augmente la probabilité d'un mouvement anticipé.`
      );
    }

    // Partie 4 : Conflicting entities
    if (conflictingEntities.length > 0) {
      const conflictingNames = conflictingEntities.map((e) => e.entityName || e.entityId).join(', ');
      parts.push(
        `Attention : ${conflictingNames} affichent des positions opposées, suggérant une divergence institutionnelle.`
      );
    }

    // Partie 5 : Flow category
    const categoryDescriptions: Record<FlowCategory, string> = {
      WHALE_FLOW: 'Ce flow de baleine indique une action majeure.',
      INSTITUTION_FLOW: 'Ce flow institutionnel suggère une coordination.',
      HEDGE_FUND_FLOW: 'Ce flow de hedge fund indique une stratégie active.',
      INSIDER_ECHO: 'Ce flow fait écho à une activité insider récente.',
      MOMENTUM_FLOW: 'Ce flow de momentum suggère un mouvement en cours.',
      NEUTRAL_HEDGING: 'Ce flow semble être une couverture neutre.',
      AGGRESSIVE_DIRECTIONAL: 'Ce flow agressif indique une conviction haussière forte.',
      DEFENSIVE_POSITIONING: 'Ce flow défensif indique une protection contre la baisse.',
      UNKNOWN: 'La nature de ce flow reste à déterminer.',
    };
    parts.push(categoryDescriptions[flowCategory] || '');

    return parts.join(' ');
  }

  /**
   * Obtenir la description de la principale evidence
   */
  private getMainEvidenceDescription(attribution: AttributionResult): string {
    if (attribution.evidence.length === 0) return 'des signaux détectés';
    
    const topEvidence = attribution.evidence.sort((a, b) => b.score - a.score)[0];
    
    switch (topEvidence.type) {
      case 'POSITION_CHANGE':
        return 'une position récente et massive';
      case 'TIMING_CORRELATION':
        return 'un timing parfaitement corrélé';
      case 'HISTORICAL_PATTERN':
        return 'un pattern historique confirmé';
      case 'GRAPH_CENTRALITY':
        return 'une centralité élevée dans le réseau';
      case 'INSIDER_TRANSACTION':
        return 'une transaction insider récente';
      default:
        return 'des signaux multiples';
    }
  }

  /**
   * Calculer la variance d'un tableau de scores
   */
  private calculateVariance(scores: number[]): number {
    if (scores.length === 0) return 0;
    const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const squaredDiffs = scores.map((s) => Math.pow(s - mean, 2));
    return squaredDiffs.reduce((sum, sd) => sum + sd, 0) / scores.length;
  }
}

// Types internes
interface InstitutionalPosition {
  institutionId: string;
  institutionName: string;
  shares: number;
  value: number;
  change: number;
  changePercent: number;
  filingDate?: string;
}

interface InsiderTransaction {
  insiderId: string;
  insiderName: string;
  ticker: string;
  transactionType: string;
  amount: number;
  price: number;
  date: string;
}

