/**
 * Types pour les endpoints Quote de FMP
 */

// ========== Stock Quote ==========

export interface StockQuoteQueryParams {
  symbol: string; // Required
}

export interface StockQuote {
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

export type StockQuoteResponse = StockQuote[];

// ========== Stock Quote Short ==========

export interface StockQuoteShortQueryParams {
  symbol: string; // Required
}

export interface StockQuoteShort {
  symbol: string;
  price: number;
  change: number;
  volume: number;
}

export type StockQuoteShortResponse = StockQuoteShort[];

// ========== Aftermarket Trade ==========

export interface AftermarketTradeQueryParams {
  symbol: string; // Required
}

export interface AftermarketTrade {
  symbol: string;
  price: number;
  tradeSize: number;
  timestamp: number;
}

export type AftermarketTradeResponse = AftermarketTrade[];

// ========== Aftermarket Quote ==========

export interface AftermarketQuoteQueryParams {
  symbol: string; // Required
}

export interface AftermarketQuote {
  symbol: string;
  bidSize: number;
  bidPrice: number;
  askSize: number;
  askPrice: number;
  volume: number;
  timestamp: number;
}

export type AftermarketQuoteResponse = AftermarketQuote[];

// ========== Stock Price Change ==========

export interface StockPriceChangeQueryParams {
  symbol: string; // Required
}

export interface StockPriceChange {
  symbol: string;
  "1D": number;
  "5D": number;
  "1M": number;
  "3M": number;
  "6M": number;
  ytd: number;
  "1Y": number;
  "3Y": number;
  "5Y": number;
  "10Y": number;
  max: number;
}

export type StockPriceChangeResponse = StockPriceChange[];

