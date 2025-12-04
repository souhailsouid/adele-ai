/**
 * Types pour les endpoints SEC Filings de FMP
 */

// ========== Latest 8-K SEC Filings ==========

export interface Latest8KFilingsQueryParams {
  from: string; // YYYY-MM-DD (required)
  to: string; // YYYY-MM-DD (required)
  page?: number; // default: 0
  limit?: number; // default: 100, max: 100
}

export interface SECFiling8K {
  symbol: string;
  cik: string;
  filingDate: string;
  acceptedDate: string;
  formType: string;
  hasFinancials: boolean;
  link: string;
  finalLink: string;
}

export type Latest8KFilingsResponse = SECFiling8K[];

// ========== Latest SEC Filings (Financials) ==========

export interface LatestSECFilingsQueryParams {
  from: string; // YYYY-MM-DD (required)
  to: string; // YYYY-MM-DD (required)
  page?: number; // default: 0
  limit?: number; // default: 100, max: 100
}

export interface SECFilingFinancial {
  symbol: string;
  cik: string;
  filingDate: string;
  acceptedDate: string;
  formType: string;
  hasFinancials: boolean;
  link: string;
  finalLink: string;
}

export type LatestSECFilingsResponse = SECFilingFinancial[];

// ========== SEC Filings By Form Type ==========

export interface SECFilingsByFormTypeQueryParams {
  formType: string; // e.g., "8-K", "10-K", "10-Q" (required)
  from: string; // YYYY-MM-DD (required)
  to: string; // YYYY-MM-DD (required)
  page?: number; // default: 0
  limit?: number; // default: 100, max: 100
}

export interface SECFilingByFormType {
  symbol: string;
  cik: string;
  filingDate: string;
  acceptedDate: string;
  formType: string;
  link: string;
  finalLink: string;
}

export type SECFilingsByFormTypeResponse = SECFilingByFormType[];

// ========== SEC Filings By Symbol ==========

export interface SECFilingsBySymbolQueryParams {
  symbol: string; // e.g., "AAPL" (required)
  from: string; // YYYY-MM-DD (required)
  to: string; // YYYY-MM-DD (required)
  page?: number; // default: 0
  limit?: number; // default: 100, max: 100
}

export interface SECFilingBySymbol {
  symbol: string;
  cik: string;
  filingDate: string;
  acceptedDate: string;
  formType: string;
  link: string;
  finalLink: string;
}

export type SECFilingsBySymbolResponse = SECFilingBySymbol[];

// ========== SEC Filings By CIK ==========

export interface SECFilingsByCIKQueryParams {
  cik: string; // e.g., "0000320193" (required)
  from: string; // YYYY-MM-DD (required)
  to: string; // YYYY-MM-DD (required)
  page?: number; // default: 0
  limit?: number; // default: 100, max: 100
}

export interface SECFilingByCIK {
  symbol: string;
  cik: string;
  filingDate: string;
  acceptedDate: string;
  formType: string;
  link: string;
  finalLink: string;
}

export type SECFilingsByCIKResponse = SECFilingByCIK[];

// ========== SEC Filings By Name (Company Search) ==========

export interface SECFilingsByNameQueryParams {
  company: string; // e.g., "Berkshire" (required)
}

export interface SECCompanySearchByName {
  symbol: string;
  name: string;
  cik: string;
  sicCode: string;
  industryTitle: string;
  businessAddress: string;
  phoneNumber: string;
}

export type SECFilingsByNameResponse = SECCompanySearchByName[];

// ========== SEC Filings Company Search By Symbol ==========

export interface SECCompanySearchBySymbolQueryParams {
  symbol: string; // e.g., "AAPL" (required)
}

export interface SECCompanySearchBySymbol {
  symbol: string;
  name: string;
  cik: string;
  sicCode: string;
  industryTitle: string;
  businessAddress: string;
  phoneNumber: string;
}

export type SECCompanySearchBySymbolResponse = SECCompanySearchBySymbol[];

// ========== SEC Filings Company Search By CIK ==========

export interface SECCompanySearchByCIKQueryParams {
  cik: string; // e.g., "0000320193" (required)
}

export interface SECCompanySearchByCIK {
  symbol: string;
  name: string;
  cik: string;
  sicCode: string;
  industryTitle: string;
  businessAddress: string;
  phoneNumber: string;
}

export type SECCompanySearchByCIKResponse = SECCompanySearchByCIK[];

// ========== SEC Company Full Profile ==========

export interface SECCompanyFullProfileQueryParams {
  symbol: string; // e.g., "AAPL" (required)
  cik?: string; // e.g., "320193" (optional)
}

export interface SECCompanyFullProfile {
  symbol: string;
  cik: string;
  registrantName: string;
  sicCode: string;
  sicDescription: string;
  sicGroup: string;
  isin: string;
  businessAddress: string;
  mailingAddress: string;
  phoneNumber: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  description: string;
  ceo: string;
  website: string;
  exchange: string;
  stateLocation: string;
  stateOfIncorporation: string;
  fiscalYearEnd: string;
  ipoDate: string;
  employees: string;
  secFilingsUrl: string;
  taxIdentificationNumber: string;
  fiftyTwoWeekRange: string;
  isActive: boolean;
  assetType: string;
  openFigiComposite: string;
  priceCurrency: string;
  marketSector: string;
  securityType: string | null;
  isEtf: boolean;
  isAdr: boolean;
  isFund: boolean;
}

export type SECCompanyFullProfileResponse = SECCompanyFullProfile[];

// ========== Industry Classification List ==========

export interface IndustryClassificationListQueryParams {
  industryTitle?: string; // e.g., "SERVICES"
  sicCode?: string; // e.g., "7371"
}

export interface IndustryClassification {
  office: string;
  sicCode: string;
  industryTitle: string;
}

export type IndustryClassificationListResponse = IndustryClassification[];

// ========== Industry Classification Search ==========

export interface IndustryClassificationSearchQueryParams {
  symbol?: string; // e.g., "AAPL"
  cik?: string; // e.g., "320193"
  sicCode?: string; // e.g., "7371"
}

export interface IndustryClassificationSearchResult {
  symbol: string;
  name: string;
  cik: string;
  sicCode: string;
  industryTitle: string;
  businessAddress: string;
  phoneNumber: string;
}

export type IndustryClassificationSearchResponse = IndustryClassificationSearchResult[];

// ========== All Industry Classification ==========

export interface AllIndustryClassificationQueryParams {
  page?: number; // default: 0
  limit?: number; // default: 100
}

export interface AllIndustryClassificationResult {
  symbol: string;
  name: string;
  cik: string;
  sicCode: string;
  industryTitle: string;
  businessAddress: string;
  phoneNumber: string;
}

export type AllIndustryClassificationResponse = AllIndustryClassificationResult[];

