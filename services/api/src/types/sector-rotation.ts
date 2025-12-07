/**
 * Types pour les rotations sectorielles
 */

export interface SectorRotation {
  currentRotation: RotationDirection;
  predictedRotation?: RotationDirection;
  sectors: SectorRotationData[];
  marketTide: MarketTideData;
  recommendations: SectorRecommendation[];
  timestamp: string;
}

export type RotationDirection = 
  | 'RISK_ON' // Rotation vers les secteurs risqués (Tech, Growth)
  | 'RISK_OFF' // Rotation vers les secteurs défensifs (Utilities, Consumer Staples)
  | 'VALUE' // Rotation vers la valeur (Financials, Energy)
  | 'GROWTH' // Rotation vers la croissance (Tech, Healthcare)
  | 'NEUTRAL'; // Pas de rotation claire

export interface SectorRotationData {
  sector: string;
  currentTide: number; // -100 à +100
  previousTide?: number;
  change: number; // Changement depuis la dernière mesure
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  etfFlows?: number; // Flux ETF en millions
  topPerformers?: string[]; // Top 5 tickers
}

export interface MarketTideData {
  overall: number; // -100 à +100
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  volatility: 'LOW' | 'MEDIUM' | 'HIGH';
  sectors: {
    strongest: string[];
    weakest: string[];
  };
}

export interface SectorRecommendation {
  sector: string;
  action: 'BUY' | 'SELL' | 'HOLD' | 'AVOID';
  confidence: number; // 0-100
  reasoning: string;
  timeframe?: string;
}

export interface SectorRotationResponse {
  success: boolean;
  data?: SectorRotation;
  error?: string;
}

export interface MarketTideResponse {
  success: boolean;
  data?: MarketTideData;
  error?: string;
}

