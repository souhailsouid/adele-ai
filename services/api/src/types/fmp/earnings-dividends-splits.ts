/**
 * Types pour les endpoints Earnings, Dividends, Splits de FMP
 */

// ========== Dividends Company ==========

export interface DividendsCompanyQueryParams {
  symbol: string; // Required
}

export interface Dividend {
  symbol: string;
  date: string;
  label: string;
  adjDividend: number;
  dividend: number;
  recordDate: string;
  paymentDate: string;
  declarationDate: string;
}

export type DividendsCompanyResponse = Dividend[];

// ========== Dividends Calendar ==========

export interface DividendsCalendarQueryParams {
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
}

export interface DividendsCalendarEvent {
  symbol: string;
  date: string;
  label: string;
  adjDividend: number;
  dividend: number;
  recordDate: string;
  paymentDate: string;
  declarationDate: string;
}

export type DividendsCalendarResponse = DividendsCalendarEvent[];

// ========== Earnings Report ==========

export interface EarningsReportQueryParams {
  symbol: string; // Required
}

export interface EarningsReport {
  symbol: string;
  date: string;
  revenue: number;
  revenueEstimated: number;
  revenueSurprise: number;
  revenueSurprisePercent: number;
  eps: number;
  epsEstimated: number;
  epsSurprise: number;
  epsSurprisePercent: number;
  time: string; // e.g., "bmo" (before market open), "amc" (after market close)
  updatedFromDate: string;
}

export type EarningsReportResponse = EarningsReport[];

// ========== Earnings Calendar ==========

export interface EarningsCalendarQueryParams {
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
}

export interface EarningsCalendarEvent {
  symbol: string;
  date: string;
  revenue: number | null;
  revenueEstimated: number | null;
  revenueSurprise: number | null;
  revenueSurprisePercent: number | null;
  eps: number | null;
  epsEstimated: number | null;
  epsSurprise: number | null;
  epsSurprisePercent: number | null;
  time: string;
  updatedFromDate: string;
}

export type EarningsCalendarResponse = EarningsCalendarEvent[];

// ========== IPOs Calendar ==========

export interface IPOsCalendarQueryParams {
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
}

export interface IPOCalendarEvent {
  symbol: string;
  name: string;
  ipoDate: string;
  priceRangeLow: number | null;
  priceRangeHigh: number | null;
  currency: string;
  exchange: string;
}

export type IPOsCalendarResponse = IPOCalendarEvent[];

// ========== IPOs Disclosure ==========

export interface IPOsDisclosureQueryParams {
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
}

export interface IPODisclosure {
  symbol: string;
  name: string;
  cik: string;
  filingDate: string;
  acceptedDate: string;
  formType: string;
  link: string;
  finalLink: string;
}

export type IPOsDisclosureResponse = IPODisclosure[];

// ========== IPOs Prospectus ==========

export interface IPOsProspectusQueryParams {
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
}

export interface IPOProspectus {
  symbol: string;
  name: string;
  cik: string;
  filingDate: string;
  acceptedDate: string;
  formType: string;
  publicOfferingPrice: number | null;
  discount: number | null;
  commission: number | null;
  proceedsBeforeExpenses: number | null;
  link: string;
  finalLink: string;
}

export type IPOsProspectusResponse = IPOProspectus[];

// ========== Stock Split Details ==========

export interface StockSplitDetailsQueryParams {
  symbol: string; // Required
}

export interface StockSplit {
  symbol: string;
  date: string;
  label: string;
  numerator: number;
  denominator: number;
}

export type StockSplitDetailsResponse = StockSplit[];

// ========== Stock Splits Calendar ==========

export interface StockSplitsCalendarQueryParams {
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
}

export interface StockSplitsCalendarEvent {
  symbol: string;
  date: string;
  numerator: number;
  denominator: number;
}

export type StockSplitsCalendarResponse = StockSplitsCalendarEvent[];

