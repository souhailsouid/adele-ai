/**
 * Types pour les endpoints Technical Indicators de FMP
 */

// ========== Common Query Parameters ==========

export interface TechnicalIndicatorQueryParams {
  symbol: string; // Required
  periodLength: number; // e.g., 10
  timeframe: string; // e.g., "1day", "1hour", "5min", etc.
}

// ========== Simple Moving Average (SMA) ==========

export interface SMAResponse {
  date: string;
  sma: number;
}

export type SMAResponseArray = SMAResponse[];

// ========== Exponential Moving Average (EMA) ==========

export interface EMAResponse {
  date: string;
  ema: number;
}

export type EMAResponseArray = EMAResponse[];

// ========== Weighted Moving Average (WMA) ==========

export interface WMAResponse {
  date: string;
  wma: number;
}

export type WMAResponseArray = WMAResponse[];

// ========== Double Exponential Moving Average (DEMA) ==========

export interface DEMAResponse {
  date: string;
  dema: number;
}

export type DEMAResponseArray = DEMAResponse[];

// ========== Triple Exponential Moving Average (TEMA) ==========

export interface TEMAResponse {
  date: string;
  tema: number;
}

export type TEMAResponseArray = TEMAResponse[];

// ========== Relative Strength Index (RSI) ==========

export interface RSIResponse {
  date: string;
  rsi: number;
}

export type RSIResponseArray = RSIResponse[];

// ========== Standard Deviation ==========

export interface StandardDeviationResponse {
  date: string;
  standardDeviation: number;
}

export type StandardDeviationResponseArray = StandardDeviationResponse[];

// ========== Williams ==========

export interface WilliamsResponse {
  date: string;
  williams: number;
}

export type WilliamsResponseArray = WilliamsResponse[];

// ========== Average Directional Index (ADX) ==========

export interface ADXResponse {
  date: string;
  adx: number;
}

export type ADXResponseArray = ADXResponse[];

