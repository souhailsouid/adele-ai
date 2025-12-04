/**
 * Types pour les endpoints Insider Trades de FMP
 */

// ========== Latest Insider Trading ==========

export interface LatestInsiderTradingQueryParams {
  date?: string; // YYYY-MM-DD
  page?: number; // default: 0
  limit?: number; // default: 100
}

export interface InsiderTrade {
  symbol: string;
  filingDate: string;
  transactionDate: string;
  reportingCik: string;
  companyCik: string;
  transactionType: string;
  securitiesOwned: number;
  reportingName: string;
  typeOfOwner: string;
  acquisitionOrDisposition: string; // "A" or "D"
  directOrIndirect: string; // "D" or "I"
  formType: string;
  securitiesTransacted: number;
  price: number;
  securityName: string;
  url: string;
}

export type LatestInsiderTradingResponse = InsiderTrade[];

// ========== Search Insider Trades ==========

export interface SearchInsiderTradesQueryParams {
  symbol?: string;
  page?: number; // default: 0
  limit?: number; // default: 100
  reportingCik?: string;
  companyCik?: string;
  transactionType?: string; // e.g., "S-Sale"
}

export type SearchInsiderTradesResponse = InsiderTrade[];

// ========== Search Insider Trades by Reporting Name ==========

export interface SearchInsiderTradesByReportingNameQueryParams {
  name: string; // Required
}

export interface ReportingNameResult {
  reportingCik: string;
  reportingName: string;
}

export type SearchInsiderTradesByReportingNameResponse = ReportingNameResult[];

// ========== All Insider Transaction Types ==========

export interface TransactionType {
  transactionType: string;
}

export type AllInsiderTransactionTypesResponse = TransactionType[];

// ========== Insider Trade Statistics ==========

export interface InsiderTradeStatisticsQueryParams {
  symbol: string; // Required
}

export interface InsiderTradeStatistics {
  symbol: string;
  cik: string;
  year: number;
  quarter: number;
  acquiredTransactions: number;
  disposedTransactions: number;
  acquiredDisposedRatio: number;
  totalAcquired: number;
  totalDisposed: number;
  averageAcquired: number;
  averageDisposed: number;
  totalPurchases: number;
  totalSales: number;
}

export type InsiderTradeStatisticsResponse = InsiderTradeStatistics[];

// ========== Acquisition Ownership ==========

export interface AcquisitionOwnershipQueryParams {
  symbol: string; // Required
  limit?: number; // default: 2000
}

export interface AcquisitionOwnership {
  cik: string;
  symbol: string;
  filingDate: string;
  acceptedDate: string;
  cusip: string;
  nameOfReportingPerson: string;
  citizenshipOrPlaceOfOrganization: string;
  soleVotingPower: string;
  sharedVotingPower: string;
  soleDispositivePower: string;
  sharedDispositivePower: string;
  amountBeneficiallyOwned: string;
  percentOfClass: string;
  typeOfReportingPerson: string;
  url: string;
}

export type AcquisitionOwnershipResponse = AcquisitionOwnership[];

