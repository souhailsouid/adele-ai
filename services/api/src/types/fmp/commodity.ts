/**
 * Types pour les endpoints Commodity de FMP
 */

// ========== Commodities List ==========

export interface CommoditiesListResponse {
  symbol: string;
  name: string;
  exchange: string | null;
  tradeMonth: string;
  currency: string;
}

// ========== Commodities Quote ==========

export interface CommoditiesQuoteQueryParams {
  symbol: string; // e.g., "GCUSD"
}

export interface CommoditiesQuote {
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
  marketCap: number | null;
  priceAvg50: number;
  priceAvg200: number;
  exchange: string;
  open: number;
  previousClose: number;
  timestamp: number;
}

export type CommoditiesQuoteResponse = CommoditiesQuote[];

// ========== Commodities Quote Short ==========

export interface CommoditiesQuoteShortQueryParams {
  symbol: string; // e.g., "GCUSD"
}

export interface CommoditiesQuoteShort {
  symbol: string;
  price: number;
  change: number;
  volume: number;
}

export type CommoditiesQuoteShortResponse = CommoditiesQuoteShort[];

// ========== Batch Commodity Quotes ==========

export interface BatchCommodityQuotesQueryParams {
  short?: boolean; // default: false
}

export type BatchCommodityQuotesResponse = (CommoditiesQuote | CommoditiesQuoteShort)[];

// ========== Historical Price EOD Commodity ==========

export interface HistoricalPriceEODCommodityQueryParams {
  symbol: string; // e.g., "GCUSD"
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
}

export interface HistoricalPriceEODLightCommodity {
  symbol: string;
  date: string;
  price: number;
  volume: number;
}

export type HistoricalPriceEODLightCommodityResponse = HistoricalPriceEODLightCommodity[];

export interface HistoricalPriceEODFullCommodity extends HistoricalPriceEODLightCommodity {
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;
  changePercent: number;
  vwap: number;
}

export type HistoricalPriceEODFullCommodityResponse = HistoricalPriceEODFullCommodity[];

// ========== Historical Chart Commodity ==========

export interface HistoricalChartCommodityQueryParams {
  symbol: string; // e.g., "GCUSD"
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
}

export interface HistoricalChartCommodity {
  date: string; // YYYY-MM-DD HH:MM:SS
  open: number;
  low: number;
  high: number;
  close: number;
  volume: number;
}

export type HistoricalChartCommodityResponse = HistoricalChartCommodity[];
