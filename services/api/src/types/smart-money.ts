/**
 * Types pour le service Smart Money
 */

export interface HedgeFund {
  name: string;
  isHedgeFund: boolean;
  totalValue?: number;
  performance: number; // Performance en %
  period: '1M' | '3M' | '6M' | '1Y';
  holdingsCount?: number;
  topPositions?: TopPosition[];
}

export interface TopPosition {
  ticker: string;
  shares: number;
  value: number;
  weight: number; // % du portefeuille
}

export interface CopyTrade {
  ticker: string;
  institutionName: string;
  tradeType: 'BUY' | 'SELL' | 'HOLD';
  shares: number;
  value: number;
  date: string;
  price: number;
  confidence: number; // 0-100
  pattern: TradingPattern;
  recommendation: 'FOLLOW' | 'AVOID' | 'MONITOR';
}

export interface TradingPattern {
  frequency: number; // Nombre de trades sur la période
  averageSize: number;
  successRate?: number; // Si on peut calculer
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
}

export interface TopHedgeFundsResponse {
  success: boolean;
  data?: {
    funds: HedgeFund[];
    period: '1M' | '3M' | '6M' | '1Y';
    total: number;
  };
  error?: string;
}

export interface CopyTradesResponse {
  success: boolean;
  data?: {
    trades: CopyTrade[];
    institutionName: string;
    ticker: string;
    total: number;
    message?: string; // Message informatif en cas d'erreur ou d'absence de données
  };
  error?: string;
}

