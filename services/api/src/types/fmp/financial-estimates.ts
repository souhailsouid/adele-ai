/**
 * Types pour les endpoints Financial Estimates de FMP
 */

// ========== Financial Estimates ==========

export interface FinancialEstimatesQueryParams {
  symbol: string; // Required
  period: 'annual' | 'quarter'; // Required
  page?: number; // default: 0
  limit?: number; // default: 10
}

export interface FinancialEstimate {
  symbol: string;
  date: string;
  revenueLow: number;
  revenueHigh: number;
  revenueAvg: number;
  ebitdaLow: number;
  ebitdaHigh: number;
  ebitdaAvg: number;
  ebitLow: number;
  ebitHigh: number;
  ebitAvg: number;
  netIncomeLow: number;
  netIncomeHigh: number;
  netIncomeAvg: number;
  sgaExpenseLow: number;
  sgaExpenseHigh: number;
  sgaExpenseAvg: number;
  epsAvg: number;
  epsHigh: number;
  epsLow: number;
  numAnalystsRevenue: number;
  numAnalystsEps: number;
}

export type FinancialEstimatesResponse = FinancialEstimate[];

// ========== Ratings Snapshot ==========

export interface RatingsSnapshotQueryParams {
  symbol: string; // Required
}

export interface RatingSnapshot {
  symbol: string;
  rating: string; // e.g., "A-"
  overallScore: number;
  discountedCashFlowScore: number;
  returnOnEquityScore: number;
  returnOnAssetsScore: number;
  debtToEquityScore: number;
  priceToEarningsScore: number;
  priceToBookScore: number;
}

export type RatingsSnapshotResponse = RatingSnapshot[];

// ========== Historical Ratings ==========

export interface HistoricalRatingsQueryParams {
  symbol: string; // Required
  limit?: number; // default: 1
}

export interface HistoricalRating {
  symbol: string;
  date: string;
  rating: string;
  overallScore: number;
  discountedCashFlowScore: number;
  returnOnEquityScore: number;
  returnOnAssetsScore: number;
  debtToEquityScore: number;
  priceToEarningsScore: number;
  priceToBookScore: number;
}

export type HistoricalRatingsResponse = HistoricalRating[];

// ========== Price Target Summary ==========

export interface PriceTargetSummaryQueryParams {
  symbol: string; // Required
}

export interface PriceTargetSummary {
  symbol: string;
  lastMonthCount: number;
  lastMonthAvgPriceTarget: number;
  lastQuarterCount: number;
  lastQuarterAvgPriceTarget: number;
  lastYearCount: number;
  lastYearAvgPriceTarget: number;
  allTimeCount: number;
  allTimeAvgPriceTarget: number;
  publishers: string; // JSON string array
}

export type PriceTargetSummaryResponse = PriceTargetSummary[];

// ========== Price Target Consensus ==========

export interface PriceTargetConsensusQueryParams {
  symbol: string; // Required
}

export interface PriceTargetConsensus {
  symbol: string;
  targetHigh: number;
  targetLow: number;
  targetConsensus: number;
  targetMedian: number;
}

export type PriceTargetConsensusResponse = PriceTargetConsensus[];

// ========== Stock Grades ==========

export interface StockGradesQueryParams {
  symbol: string; // Required
}

export interface StockGrade {
  symbol: string;
  date: string;
  gradingCompany: string;
  previousGrade: string;
  newGrade: string;
  action: string; // e.g., "maintain", "upgrade", "downgrade"
}

export type StockGradesResponse = StockGrade[];

// ========== Historical Stock Grades ==========

export interface HistoricalStockGradesQueryParams {
  symbol: string; // Required
  limit?: number; // default: 100
}

export interface HistoricalStockGrade {
  symbol: string;
  date: string;
  analystRatingsBuy: number;
  analystRatingsHold: number;
  analystRatingsSell: number;
  analystRatingsStrongSell: number;
}

export type HistoricalStockGradesResponse = HistoricalStockGrade[];

// ========== Stock Grades Summary ==========

export interface StockGradesSummaryQueryParams {
  symbol: string; // Required
}

export interface StockGradesSummary {
  symbol: string;
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
  consensus: string; // e.g., "Buy", "Hold", "Sell"
}

export type StockGradesSummaryResponse = StockGradesSummary[];

