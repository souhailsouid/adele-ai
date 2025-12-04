/**
 * Types pour les endpoints Indexes de FMP
 */

// ========== Stock Market Indexes List ==========

export interface Index {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
}

export type StockMarketIndexesListResponse = Index[];

// ========== Index Quote ==========

export interface IndexQuoteQueryParams {
  symbol: string; // Required, e.g., "^GSPC"
}

export interface IndexQuote {
  symbol: string;
  name: string;
  price: number;
  changePercentage: number;
  change: number;
  volume: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  exchange: string;
  open: number;
  previousClose: number;
  timestamp: number;
}

export type IndexQuoteResponse = IndexQuote[];

// ========== Index Short Quote ==========

export interface IndexShortQuoteQueryParams {
  symbol: string; // Required, e.g., "^GSPC"
}

export interface IndexShortQuote {
  symbol: string;
  price: number;
  change: number;
  volume: number;
}

export type IndexShortQuoteResponse = IndexShortQuote[];

// ========== All Index Quotes ==========

export interface AllIndexQuotesQueryParams {
  short?: boolean; // default: false
}

export type AllIndexQuotesResponse = (IndexQuote | IndexShortQuote)[];

// ========== Historical Index Price ==========

export interface HistoricalIndexPriceQueryParams {
  symbol: string; // Required, e.g., "^GSPC"
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
}

export interface HistoricalIndexPriceLight {
  symbol: string;
  date: string;
  price: number;
  volume: number;
}

export type HistoricalIndexPriceLightResponse = HistoricalIndexPriceLight[];

export interface HistoricalIndexPriceFull extends HistoricalIndexPriceLight {
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;
  changePercent: number;
  vwap: number;
}

export type HistoricalIndexPriceFullResponse = HistoricalIndexPriceFull[];

// ========== Historical Index Chart ==========

export interface HistoricalIndexChartQueryParams {
  symbol: string; // Required, e.g., "^GSPC"
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
}

export interface HistoricalIndexChart {
  date: string; // YYYY-MM-DD HH:MM:SS
  open: number;
  low: number;
  high: number;
  close: number;
  volume: number;
}

export type HistoricalIndexChartResponse = HistoricalIndexChart[];

// ========== S&P 500 Index ==========

export interface SP500Constituent {
  symbol: string;
  name: string;
  sector: string;
  subSector: string;
  headQuarter: string;
  dateFirstAdded: string | null;
  cik: string;
  founded: string | null;
}

export type SP500ConstituentResponse = SP500Constituent[];

// ========== Nasdaq Index ==========

export interface NasdaqConstituent {
  symbol: string;
  name: string;
  sector: string;
  subSector: string;
  headQuarter: string;
  dateFirstAdded: string | null;
  cik: string;
  founded: string | null;
}

export type NasdaqConstituentResponse = NasdaqConstituent[];

// ========== Dow Jones ==========

export interface DowJonesConstituent {
  symbol: string;
  name: string;
  sector: string;
  subSector: string;
  headQuarter: string;
  dateFirstAdded: string | null;
  cik: string;
  founded: string | null;
}

export type DowJonesConstituentResponse = DowJonesConstituent[];

// ========== Historical S&P 500 ==========

export interface HistoricalSP500Constituent {
  dateAdded: string;
  addedSecurity: string;
  removedTicker: string | null;
  removedSecurity: string | null;
  date: string;
  symbol: string;
  reason: string;
}

export type HistoricalSP500ConstituentResponse = HistoricalSP500Constituent[];

// ========== Historical Nasdaq ==========

export interface HistoricalNasdaqConstituent {
  dateAdded: string;
  addedSecurity: string;
  removedTicker: string | null;
  removedSecurity: string | null;
  date: string;
  symbol: string;
  reason: string;
}

export type HistoricalNasdaqConstituentResponse = HistoricalNasdaqConstituent[];

// ========== Historical Dow Jones ==========

export interface HistoricalDowJonesConstituent {
  dateAdded: string;
  addedSecurity: string;
  removedTicker: string | null;
  removedSecurity: string | null;
  date: string;
  symbol: string;
  reason: string;
}

export type HistoricalDowJonesConstituentResponse = HistoricalDowJonesConstituent[];

