/**
 * Types pour les endpoints DCF (Discounted Cash Flow) de FMP
 */

// ========== DCF Valuation ==========

export interface DCFValuationQueryParams {
  symbol: string; // Required
}

export interface DCFValuation {
  symbol: string;
  date: string;
  dcf: number;
  "Stock Price": number;
}

export type DCFValuationResponse = DCFValuation[];

// ========== Levered DCF ==========

export interface LeveredDCFQueryParams {
  symbol: string; // Required
}

export interface LeveredDCF {
  symbol: string;
  date: string;
  dcf: number;
  "Stock Price": number;
}

export type LeveredDCFResponse = LeveredDCF[];

// ========== Custom DCF Advanced ==========

export interface CustomDCFAdvancedQueryParams {
  symbol: string; // Required
  revenueGrowthPct?: number;
  ebitdaPct?: number;
  depreciationAndAmortizationPct?: number;
  cashAndShortTermInvestmentsPct?: number;
  receivablesPct?: number;
  inventoriesPct?: number;
  payablePct?: number;
  ebitPct?: number;
  capitalExpenditurePct?: number;
  operatingCashFlowPct?: number;
  sellingGeneralAndAdministrativeExpensesPct?: number;
  taxRate?: number;
  longTermGrowthRate?: number;
  costOfDebt?: number;
  costOfEquity?: number;
  marketRiskPremium?: number;
  beta?: number;
  riskFreeRate?: number;
}

export interface CustomDCFAdvanced {
  year: string;
  symbol: string;
  revenue: number;
  revenuePercentage: number;
  ebitda: number;
  ebitdaPercentage: number;
  ebit: number;
  ebitPercentage: number;
  depreciation: number;
  depreciationPercentage: number;
  totalCash: number;
  totalCashPercentage: number;
  receivables: number;
  receivablesPercentage: number;
  inventories: number;
  inventoriesPercentage: number;
  payable: number;
  payablePercentage: number;
  capitalExpenditure: number;
  capitalExpenditurePercentage: number;
  price: number;
  beta: number;
  dilutedSharesOutstanding: number;
  costofDebt: number;
  taxRate: number;
  afterTaxCostOfDebt: number;
  riskFreeRate: number;
  marketRiskPremium: number;
  costOfEquity: number;
  totalDebt: number;
  totalEquity: number;
  totalCapital: number;
  debtWeighting: number;
  equityWeighting: number;
  wacc: number;
  taxRateCash: number;
  ebiat: number;
  ufcf: number;
  sumPvUfcf: number;
  longTermGrowthRate: number;
  terminalValue: number;
  presentTerminalValue: number;
  enterpriseValue: number;
  netDebt: number;
  equityValue: number;
  equityValuePerShare: number;
  freeCashFlowT1: number;
}

export type CustomDCFAdvancedResponse = CustomDCFAdvanced[];

// ========== Custom DCF Levered ==========

export interface CustomDCFLeveredQueryParams {
  symbol: string; // Required
  revenueGrowthPct?: number;
  ebitdaPct?: number;
  depreciationAndAmortizationPct?: number;
  cashAndShortTermInvestmentsPct?: number;
  receivablesPct?: number;
  inventoriesPct?: number;
  payablePct?: number;
  ebitPct?: number;
  capitalExpenditurePct?: number;
  operatingCashFlowPct?: number;
  sellingGeneralAndAdministrativeExpensesPct?: number;
  taxRate?: number;
  longTermGrowthRate?: number;
  costOfDebt?: number;
  costOfEquity?: number;
  marketRiskPremium?: number;
  beta?: number;
  riskFreeRate?: number;
}

export interface CustomDCFLevered {
  year: string;
  symbol: string;
  revenue: number;
  revenuePercentage: number;
  capitalExpenditure: number;
  capitalExpenditurePercentage: number;
  price: number;
  beta: number;
  dilutedSharesOutstanding: number;
  costofDebt: number;
  taxRate: number;
  afterTaxCostOfDebt: number;
  riskFreeRate: number;
  marketRiskPremium: number;
  costOfEquity: number;
  totalDebt: number;
  totalEquity: number;
  totalCapital: number;
  debtWeighting: number;
  equityWeighting: number;
  wacc: number;
  operatingCashFlow: number;
  pvLfcf: number;
  sumPvLfcf: number;
  longTermGrowthRate: number;
  freeCashFlow: number;
  terminalValue: number;
  presentTerminalValue: number;
  enterpriseValue: number;
  netDebt: number;
  equityValue: number;
  equityValuePerShare: number;
  freeCashFlowT1: number;
  operatingCashFlowPercentage: number;
}

export type CustomDCFLeveredResponse = CustomDCFLevered[];

