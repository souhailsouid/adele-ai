/**
 * Types pour les endpoints Crypto de FMP
 */

// ========== Cryptocurrency List ==========

export interface CryptocurrencyListResponse {
  symbol: string;
  name: string;
  exchange: string;
  icoDate: string | null;
  circulatingSupply: number;
  totalSupply: number | null;
}

// ========== Full Cryptocurrency Quote ==========

export interface CryptocurrencyQuoteQueryParams {
  symbol: string; // Required, e.g., "BTCUSD"
}

export interface CryptocurrencyQuote {
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

export type CryptocurrencyQuoteResponse = CryptocurrencyQuote[];

// ========== Cryptocurrency Quote Short ==========

export interface CryptocurrencyQuoteShortQueryParams {
  symbol: string; // Required, e.g., "BTCUSD"
}

export interface CryptocurrencyQuoteShort {
  symbol: string;
  price: number;
  change: number;
  volume: number;
}

export type CryptocurrencyQuoteShortResponse = CryptocurrencyQuoteShort[];

// ========== Batch Cryptocurrency Quotes ==========

export interface BatchCryptocurrencyQuotesQueryParams {
  short?: boolean; // default: false
}

export type BatchCryptocurrencyQuotesResponse = (CryptocurrencyQuote | CryptocurrencyQuoteShort)[];

// ========== Historical Cryptocurrency Price ==========

export interface HistoricalCryptocurrencyPriceQueryParams {
  symbol: string; // Required, e.g., "BTCUSD"
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
}

export interface HistoricalCryptocurrencyPriceLight {
  symbol: string;
  date: string;
  price: number;
  volume: number;
}

export type HistoricalCryptocurrencyPriceLightResponse = HistoricalCryptocurrencyPriceLight[];

export interface HistoricalCryptocurrencyPriceFull extends HistoricalCryptocurrencyPriceLight {
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;
  changePercent: number;
  vwap: number;
}

export type HistoricalCryptocurrencyPriceFullResponse = HistoricalCryptocurrencyPriceFull[];

// ========== Historical Cryptocurrency Chart ==========

export interface HistoricalCryptocurrencyChartQueryParams {
  symbol: string; // Required, e.g., "BTCUSD"
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
}

export interface HistoricalCryptocurrencyChart {
  date: string; // YYYY-MM-DD HH:MM:SS
  open: number;
  low: number;
  high: number;
  close: number;
  volume: number;
}

export type HistoricalCryptocurrencyChartResponse = HistoricalCryptocurrencyChart[];

