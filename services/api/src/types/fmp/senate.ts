/**
 * Types pour les endpoints Senate de FMP
 */

// ========== Latest Senate Financial Disclosures ==========

export interface LatestSenateFinancialDisclosuresQueryParams {
  page?: number; // default: 0
  limit?: number; // default: 100
}

export interface SenateFinancialDisclosure {
  symbol: string;
  disclosureDate: string;
  transactionDate: string;
  firstName: string;
  lastName: string;
  office: string;
  district: string;
  owner: string;
  assetDescription: string;
  assetType: string;
  type: string; // e.g., "Purchase", "Sale"
  amount: string;
  comment: string;
  link: string;
  capitalGainsOver200USD?: string; // Only for House disclosures
}

export type LatestSenateFinancialDisclosuresResponse = SenateFinancialDisclosure[];

// ========== Latest House Financial Disclosures ==========

export interface LatestHouseFinancialDisclosuresQueryParams {
  page?: number; // default: 0
  limit?: number; // default: 100
}

export type LatestHouseFinancialDisclosuresResponse = SenateFinancialDisclosure[];

// ========== Senate Trading Activity ==========

export interface SenateTradingActivityQueryParams {
  symbol: string; // Required
}

export type SenateTradingActivityResponse = SenateFinancialDisclosure[];

// ========== Senate Trades By Name ==========

export interface SenateTradesByNameQueryParams {
  name: string; // Required
}

export type SenateTradesByNameResponse = SenateFinancialDisclosure[];

// ========== U.S. House Trades ==========

export interface USHouseTradesQueryParams {
  symbol: string; // Required
}

export type USHouseTradesResponse = SenateFinancialDisclosure[];

// ========== House Trades By Name ==========

export interface HouseTradesByNameQueryParams {
  name: string; // Required
}

export type HouseTradesByNameResponse = SenateFinancialDisclosure[];

