/**
 * Types pour les endpoints ETF & Mutual Funds de FMP
 */

// ========== ETF & Fund Holdings ==========

export interface ETFFundHoldingsQueryParams {
  symbol: string; // Required, e.g., "SPY"
}

export interface ETFFundHolding {
  symbol: string;
  name: string;
  shares: number;
  weightPercentage: number;
  marketValue: number;
}

export type ETFFundHoldingsResponse = ETFFundHolding[];

// ========== ETF & Mutual Fund Information ==========

export interface ETFMutualFundInfoQueryParams {
  symbol: string; // Required, e.g., "SPY"
}

export interface SectorExposure {
  industry: string;
  exposure: number;
}

export interface ETFMutualFundInfo {
  symbol: string;
  name: string;
  description: string;
  isin: string;
  assetClass: string;
  securityCusip: string;
  domicile: string;
  website: string;
  etfCompany: string;
  expenseRatio: number;
  assetsUnderManagement: number;
  avgVolume: number;
  inceptionDate: string;
  nav: number;
  navCurrency: string;
  holdingsCount: number;
  updatedAt: string;
  sectorsList: SectorExposure[];
}

export type ETFMutualFundInfoResponse = ETFMutualFundInfo[];

// ========== ETF & Fund Country Allocation ==========

export interface ETFFundCountryAllocationQueryParams {
  symbol: string; // Required, e.g., "SPY"
}

export interface CountryAllocation {
  country: string;
  weightPercentage: string; // e.g., "97.29%"
}

export type ETFFundCountryAllocationResponse = CountryAllocation[];

// ========== ETF Asset Exposure ==========

export interface ETFAssetExposureQueryParams {
  symbol: string; // Required, e.g., "AAPL"
}

export interface ETFAssetExposure {
  etfSymbol: string;
  etfName: string;
  shares: number;
  marketValue: number;
  weightPercentage: number;
}

export type ETFAssetExposureResponse = ETFAssetExposure[];

// ========== ETF Sector Weighting ==========

export interface ETFSectorWeightingQueryParams {
  symbol: string; // Required, e.g., "SPY"
}

export interface SectorWeighting {
  symbol: string;
  sector: string;
  weightPercentage: number;
}

export type ETFSectorWeightingResponse = SectorWeighting[];

