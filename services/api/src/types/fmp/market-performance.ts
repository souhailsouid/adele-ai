/**
 * Types pour les endpoints Market Performance de FMP
 */

// ========== Market Sector Performance Snapshot ==========

export interface MarketSectorPerformanceSnapshotQueryParams {
  date: string; // Required, YYYY-MM-DD
  exchange?: string; // e.g., "NASDAQ"
  sector?: string; // e.g., "Energy"
}

export interface SectorPerformanceSnapshot {
  date: string;
  sector: string;
  exchange: string;
  averageChange: number;
}

export type MarketSectorPerformanceSnapshotResponse = SectorPerformanceSnapshot[];

// ========== Industry Performance Snapshot ==========

export interface IndustryPerformanceSnapshotQueryParams {
  date: string; // Required, YYYY-MM-DD
  exchange?: string; // e.g., "NASDAQ"
  industry?: string; // e.g., "Biotechnology"
}

export interface IndustryPerformanceSnapshot {
  date: string;
  industry: string;
  exchange: string;
  averageChange: number;
}

export type IndustryPerformanceSnapshotResponse = IndustryPerformanceSnapshot[];

// ========== Historical Market Sector Performance ==========

export interface HistoricalMarketSectorPerformanceQueryParams {
  sector: string; // Required, e.g., "Energy"
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  exchange?: string; // e.g., "NASDAQ"
}

export interface HistoricalSectorPerformance {
  date: string;
  sector: string;
  exchange: string;
  averageChange: number;
}

export type HistoricalMarketSectorPerformanceResponse = HistoricalSectorPerformance[];

// ========== Historical Industry Performance ==========

export interface HistoricalIndustryPerformanceQueryParams {
  industry: string; // Required, e.g., "Biotechnology"
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  exchange?: string; // e.g., "NASDAQ"
}

export interface HistoricalIndustryPerformance {
  date: string;
  industry: string;
  exchange: string;
  averageChange: number;
}

export type HistoricalIndustryPerformanceResponse = HistoricalIndustryPerformance[];

// ========== Sector PE Snapshot ==========

export interface SectorPESnapshotQueryParams {
  date: string; // Required, YYYY-MM-DD
  exchange?: string; // e.g., "NASDAQ"
  sector?: string; // e.g., "Energy"
}

export interface SectorPESnapshot {
  date: string;
  sector: string;
  exchange: string;
  pe: number;
}

export type SectorPESnapshotResponse = SectorPESnapshot[];

// ========== Industry PE Snapshot ==========

export interface IndustryPESnapshotQueryParams {
  date: string; // Required, YYYY-MM-DD
  exchange?: string; // e.g., "NASDAQ"
  industry?: string; // e.g., "Biotechnology"
}

export interface IndustryPESnapshot {
  date: string;
  industry: string;
  exchange: string;
  pe: number;
}

export type IndustryPESnapshotResponse = IndustryPESnapshot[];

// ========== Historical Sector PE ==========

export interface HistoricalSectorPEQueryParams {
  sector: string; // Required, e.g., "Energy"
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  exchange?: string; // e.g., "NASDAQ"
}

export interface HistoricalSectorPE {
  date: string;
  sector: string;
  exchange: string;
  pe: number;
}

export type HistoricalSectorPEResponse = HistoricalSectorPE[];

// ========== Historical Industry PE ==========

export interface HistoricalIndustryPEQueryParams {
  industry: string; // Required, e.g., "Biotechnology"
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  exchange?: string; // e.g., "NASDAQ"
}

export interface HistoricalIndustryPE {
  date: string;
  industry: string;
  exchange: string;
  pe: number;
}

export type HistoricalIndustryPEResponse = HistoricalIndustryPE[];

// ========== Biggest Stock Gainers ==========

export interface BiggestGainer {
  symbol: string;
  price: number;
  name: string;
  change: number;
  changesPercentage: number;
  exchange: string;
}

export type BiggestStockGainersResponse = BiggestGainer[];

// ========== Biggest Stock Losers ==========

export interface BiggestLoser {
  symbol: string;
  price: number;
  name: string;
  change: number;
  changesPercentage: number;
  exchange: string;
}

export type BiggestStockLosersResponse = BiggestLoser[];

// ========== Top Traded Stocks ==========

export interface TopTradedStock {
  symbol: string;
  price: number;
  name: string;
  change: number;
  changesPercentage: number;
  exchange: string;
}

export type TopTradedStocksResponse = TopTradedStock[];

