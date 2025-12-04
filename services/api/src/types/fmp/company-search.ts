/**
 * Types pour les endpoints FMP Company Search
 */

// ========== Stock Symbol Search ==========
export interface SymbolSearchResult {
  symbol: string;
  name: string;
  currency: string;
  exchangeFullName: string;
  exchange: string;
}

export interface SymbolSearchQueryParams {
  query: string;
  limit?: number;
  exchange?: string;
}

export type SymbolSearchResponse = SymbolSearchResult[];

// ========== Company Name Search ==========
export interface NameSearchResult {
  symbol: string;
  name: string;
  currency: string;
  exchangeFullName: string;
  exchange: string;
}

export interface NameSearchQueryParams {
  query: string;
  limit?: number;
  exchange?: string;
}

export type NameSearchResponse = NameSearchResult[];

// ========== CIK Search ==========
export interface CIKSearchResult {
  symbol: string;
  companyName: string;
  cik: string;
  exchangeFullName: string;
  exchange: string;
  currency: string;
}

export interface CIKSearchQueryParams {
  cik: string;
  limit?: number;
}

export type CIKSearchResponse = CIKSearchResult[];

// ========== CUSIP Search ==========
export interface CUSIPSearchResult {
  symbol: string;
  companyName: string;
  cusip: string;
  marketCap: number;
}

export interface CUSIPSearchQueryParams {
  cusip: string;
}

export type CUSIPSearchResponse = CUSIPSearchResult[];

// ========== ISIN Search ==========
export interface ISINSearchResult {
  symbol: string;
  name: string;
  isin: string;
  marketCap: number;
}

export interface ISINSearchQueryParams {
  isin: string;
}

export type ISINSearchResponse = ISINSearchResult[];

// ========== Stock Screener ==========
export interface StockScreenerResult {
  symbol: string;
  companyName: string;
  marketCap: number;
  sector: string;
  industry: string;
  beta: number;
  price: number;
  lastAnnualDividend: number;
  volume: number;
  exchange: string;
  exchangeShortName: string;
  country: string;
  isEtf: boolean;
  isFund: boolean;
  isActivelyTrading: boolean;
}

export interface FMPStockScreenerQueryParams {
  marketCapMoreThan?: number;
  marketCapLowerThan?: number;
  sector?: string;
  industry?: string;
  betaMoreThan?: number;
  betaLowerThan?: number;
  priceMoreThan?: number;
  priceLowerThan?: number;
  dividendMoreThan?: number;
  dividendLowerThan?: number;
  volumeMoreThan?: number;
  volumeLowerThan?: number;
  exchange?: string;
  country?: string;
  isEtf?: boolean;
  isFund?: boolean;
  isActivelyTrading?: boolean;
  limit?: number;
  includeAllShareClasses?: boolean;
}

export type FMPStockScreenerResponse = StockScreenerResult[];

// ========== Exchange Variants ==========
export interface ExchangeVariantResult {
  symbol: string;
  price: number;
  beta: number;
  volAvg: number;
  mktCap: number;
  lastDiv: number;
  range: string;
  changes: number;
  companyName: string;
  currency: string;
  cik: string;
  isin: string;
  cusip: string;
  exchange: string;
  exchangeShortName: string;
  industry: string;
  website: string;
  description: string;
  ceo: string;
  sector: string;
  country: string;
  fullTimeEmployees: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dcfDiff: number;
  dcf: number;
  image: string;
  ipoDate: string;
  defaultImage: boolean;
  isEtf: boolean;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isFund: boolean;
}

export interface ExchangeVariantsQueryParams {
  symbol: string;
}

export type ExchangeVariantsResponse = ExchangeVariantResult[];

