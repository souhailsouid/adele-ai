/**
 * Types pour l'Attribution Engine
 * Définit les structures de données pour l'attribution d'entités aux flows et actions
 */

export type EntityType = 'Institution' | 'Insider' | 'Unknown';

export type AttributionEvidenceType =
  | 'POSITION_CHANGE'
  | 'HISTORICAL_PATTERN'
  | 'TIMING_CORRELATION'
  | 'FLOW_MATCH'
  | 'INSIDER_TRANSACTION'
  | 'BEHAVIORAL_PATTERN'
  | 'GRAPH_CENTRALITY'
  | 'CORRELATION';

export interface AttributionEvidence {
  type: AttributionEvidenceType;
  score: number; // 0-100
  description: string;
  timestamp?: string;
  source?: string;
}

export interface AttributionResult {
  entityId: string;
  entityType: EntityType;
  entityName?: string;
  confidence: number; // 0-100
  reasoning: string;
  evidence: AttributionEvidence[];
  role?: 'LEADER' | 'FOLLOWER' | 'OPPOSITION' | 'NEUTRAL';
  // Nouveaux champs pour les insiders
  insiderPatternType?: 'FREQUENT_BUYER' | 'FREQUENT_SELLER' | 'OCCASIONAL' | 'UNKNOWN';
  transactionSize?: 'SMALL' | 'MEDIUM' | 'LARGE' | 'VERY_LARGE';
  historicalCorrelation?: number; // 0-100
}

export interface FlowAttributionRequest {
  ticker: string;
  flowType: 'CALL' | 'PUT';
  premium: number;
  strike?: number;
  expiry?: string;
  timestamp: string;
}

export type FlowCategory =
  | 'WHALE_FLOW'
  | 'INSTITUTION_FLOW'
  | 'HEDGE_FUND_FLOW'
  | 'INSIDER_ECHO'
  | 'MOMENTUM_FLOW'
  | 'NEUTRAL_HEDGING'
  | 'AGGRESSIVE_DIRECTIONAL'
  | 'DEFENSIVE_POSITIONING'
  | 'UNKNOWN';

export interface FlowAttributionResponse {
  success: boolean;
  flowId: string;
  ticker: string;
  attributions: AttributionResult[];
  conflictingEntities?: AttributionResult[];
  overallConfidence: number;
  // Nouveaux champs pour améliorer la lisibilité
  primaryDriver?: AttributionResult;
  flowCategory: FlowCategory;
  flowLikelihood: number; // 0-100
  narrative: string; // Narration automatique
  timestamp: string;
}

export interface InstitutionAttributionRequest {
  institutionId: string;
  ticker: string;
  period?: string; // '1M', '3M', '6M', '1Y'
}

export interface InstitutionAttributionResponse {
  success: boolean;
  institutionId: string;
  ticker: string;
  influenceScore: number; // 0-100
  attribution: AttributionResult;
  historicalPatterns: HistoricalPattern[];
  correlations: Correlation[];
  timestamp: string;
}

export interface HistoricalPattern {
  type: string;
  frequency: number;
  averageImpact: number;
  lastOccurrence: string;
  description: string;
}

export interface Correlation {
  entityId: string;
  entityType: EntityType;
  correlationScore: number; // -100 to 100
  description: string;
}

export interface DominantEntitiesResponse {
  success: boolean;
  ticker: string;
  dominantEntities: DominantEntity[];
  timestamp: string;
}

export type InfluenceCategory = 'CORE_DOMINANT' | 'STRONG_INFLUENCE' | 'MODERATE_INFLUENCE' | 'PERIPHERAL';

export interface DominantEntity {
  entityId: string;
  entityType: EntityType;
  entityName?: string;
  influenceScore: number; // 0-100 (calculé avec plusieurs critères)
  category: InfluenceCategory;
  reasoning: string;
  evidence: AttributionEvidence[];
  signals: string[]; // Signaux détectés (ex: "High flot share", "Strong graph influence")
  // Nouveaux champs pour le scoring réel
  flotShare?: number; // % du flottant détenu
  positionDelta?: number; // Variation récente
  accumulationTempo?: number; // Tempo d'accumulation (0-100)
  historicalCorrelation?: number; // Corrélation des mouvements passés
  graphCentrality?: number; // Centralité dans Neo4j
  flowPresence?: number; // Présence dans les flows (0-100)
}

export interface InstitutionCluster {
  id: string;
  institutions: string[];
  commonBehaviors: string[];
  influenceScore: number;
  topTickers: string[];
}

export interface ClustersResponse {
  success: boolean;
  clusters: InstitutionCluster[];
  sector?: string;
  timestamp: string;
}

// ========== Flow Signature Matching ==========

export interface FlowSignature {
  institutionId: string;
  institutionName: string;
  strikeRange: { min: number; max: number };
  expiryRange: { min: string; max: string }; // Dates ISO
  flowType: 'CALL' | 'PUT';
  frequency: number; // Nombre de fois que ce pattern a été observé
  averagePremium: number;
  lastOccurrence: string;
  matchScore: number; // 0-100
}

export interface FlowSignatureMatch {
  institutionId: string;
  institutionName: string;
  matchScore: number; // 0-100
  signature: FlowSignature;
  reasoning: string;
}

// ========== Insider Registry ==========

export interface InsiderInfo {
  insiderId: string;
  name: string;
  cik?: string;
  role?: string; // CEO, CFO, Director, etc.
  company?: string;
  isLLC?: boolean;
  isTrust?: boolean;
  isBeneficialOwner?: boolean;
  lastSeen?: string;
}

// ========== Advanced Graph Centrality ==========

export interface GraphCentralityMetrics {
  degree: number;
  betweenness: number; // 0-1
  pagerank: number; // 0-1
  closeness: number; // 0-1
  eigenvector: number; // 0-1
  overall: number; // 0-1 (moyenne pondérée)
}

export interface SectorCluster {
  sector: string;
  institutions: string[];
  influenceScore: number;
  topTickers: string[];
  clusterId: string;
}

