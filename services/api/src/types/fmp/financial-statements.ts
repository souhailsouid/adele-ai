/**
 * Types pour les endpoints Financial Statements de FMP
 */

// ========== Income Statement ==========

export interface IncomeStatementQueryParams {
  symbol: string; // Required
  limit?: number; // default: 5, max: 1000
  period?: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY' | 'annual' | 'quarter';
}

export interface IncomeStatement {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string;
  filingDate: string;
  acceptedDate: string;
  fiscalYear: string;
  period: string;
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  researchAndDevelopmentExpenses: number;
  generalAndAdministrativeExpenses: number;
  sellingAndMarketingExpenses: number;
  sellingGeneralAndAdministrativeExpenses: number;
  otherExpenses: number;
  operatingExpenses: number;
  costAndExpenses: number;
  netInterestIncome: number;
  interestIncome: number;
  interestExpense: number;
  depreciationAndAmortization: number;
  ebitda: number;
  ebit: number;
  nonOperatingIncomeExcludingInterest: number;
  operatingIncome: number;
  totalOtherIncomeExpensesNet: number;
  incomeBeforeTax: number;
  incomeTaxExpense: number;
  netIncomeFromContinuingOperations: number;
  netIncomeFromDiscontinuedOperations: number;
  otherAdjustmentsToNetIncome: number;
  netIncome: number;
  netIncomeDeductions: number;
  bottomLineNetIncome: number;
  eps: number;
  epsDiluted: number;
  weightedAverageShsOut: number;
  weightedAverageShsOutDil: number;
}

export type IncomeStatementResponse = IncomeStatement[];

// ========== Income Statement TTM ==========

export interface IncomeStatementTTMQueryParams {
  symbol: string; // Required
  limit?: number; // default: 5, max: 1000
}

export type IncomeStatementTTMResponse = IncomeStatement[];

// ========== Balance Sheet Statement ==========

export interface BalanceSheetStatementQueryParams {
  symbol: string; // Required
  limit?: number; // default: 5, max: 1000
  period?: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY' | 'annual' | 'quarter';
}

export interface BalanceSheetStatement {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string;
  filingDate: string;
  acceptedDate: string;
  fiscalYear: string;
  period: string;
  cashAndCashEquivalents: number;
  shortTermInvestments: number;
  cashAndShortTermInvestments: number;
  netReceivables: number;
  accountsReceivables: number;
  otherReceivables: number;
  inventory: number;
  prepaids: number;
  otherCurrentAssets: number;
  totalCurrentAssets: number;
  propertyPlantEquipmentNet: number;
  goodwill: number;
  intangibleAssets: number;
  goodwillAndIntangibleAssets: number;
  longTermInvestments: number;
  taxAssets: number;
  otherNonCurrentAssets: number;
  totalNonCurrentAssets: number;
  otherAssets: number;
  totalAssets: number;
  totalPayables: number;
  accountPayables: number;
  otherPayables: number;
  accruedExpenses: number;
  shortTermDebt: number;
  capitalLeaseObligationsCurrent: number;
  taxPayables: number;
  deferredRevenue: number;
  otherCurrentLiabilities: number;
  totalCurrentLiabilities: number;
  longTermDebt: number;
  deferredRevenueNonCurrent: number;
  deferredTaxLiabilitiesNonCurrent: number;
  otherNonCurrentLiabilities: number;
  totalNonCurrentLiabilities: number;
  otherLiabilities: number;
  capitalLeaseObligations: number;
  totalLiabilities: number;
  treasuryStock: number;
  preferredStock: number;
  commonStock: number;
  retainedEarnings: number;
  additionalPaidInCapital: number;
  accumulatedOtherComprehensiveIncomeLoss: number;
  otherTotalStockholdersEquity: number;
  totalStockholdersEquity: number;
  totalEquity: number;
  minorityInterest: number;
  totalLiabilitiesAndTotalEquity: number;
  totalInvestments: number;
  totalDebt: number;
  netDebt: number;
}

export type BalanceSheetStatementResponse = BalanceSheetStatement[];

// ========== Balance Sheet Statement TTM ==========

export interface BalanceSheetStatementTTMQueryParams {
  symbol: string; // Required
  limit?: number; // default: 5, max: 1000
}

export type BalanceSheetStatementTTMResponse = BalanceSheetStatement[];

// ========== Cash Flow Statement ==========

export interface CashFlowStatementQueryParams {
  symbol: string; // Required
  limit?: number; // default: 5, max: 1000
  period?: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY' | 'annual' | 'quarter';
}

export interface CashFlowStatement {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string;
  filingDate: string;
  acceptedDate: string;
  fiscalYear: string;
  period: string;
  netIncome: number;
  depreciationAndAmortization: number;
  deferredIncomeTax: number;
  stockBasedCompensation: number;
  changeInWorkingCapital: number;
  accountsReceivables: number;
  inventory: number;
  accountsPayables: number;
  otherWorkingCapital: number;
  otherNonCashItems: number;
  netCashProvidedByOperatingActivities: number;
  investmentsInPropertyPlantAndEquipment: number;
  acquisitionsNet: number;
  purchasesOfInvestments: number;
  salesMaturitiesOfInvestments: number;
  otherInvestingActivities: number;
  netCashProvidedByInvestingActivities: number;
  netDebtIssuance: number;
  longTermNetDebtIssuance: number;
  shortTermNetDebtIssuance: number;
  netStockIssuance: number;
  netCommonStockIssuance: number;
  commonStockIssuance: number;
  commonStockRepurchased: number;
  netPreferredStockIssuance: number;
  netDividendsPaid: number;
  commonDividendsPaid: number;
  preferredDividendsPaid: number;
  otherFinancingActivities: number;
  netCashProvidedByFinancingActivities: number;
  effectOfForexChangesOnCash: number;
  netChangeInCash: number;
  cashAtEndOfPeriod: number;
  cashAtBeginningOfPeriod: number;
  operatingCashFlow: number;
  capitalExpenditure: number;
  freeCashFlow: number;
  incomeTaxesPaid: number;
  interestPaid: number;
}

export type CashFlowStatementResponse = CashFlowStatement[];

// ========== Cash Flow Statement TTM ==========

export interface CashFlowStatementTTMQueryParams {
  symbol: string; // Required
  limit?: number; // default: 5, max: 1000
}

export type CashFlowStatementTTMResponse = CashFlowStatement[];

// ========== Latest Financial Statements ==========

export interface LatestFinancialStatementsQueryParams {
  page?: number; // default: 0, max: 100
  limit?: number; // default: 250, max: 250
}

export interface LatestFinancialStatement {
  symbol: string;
  calendarYear: number;
  period: string;
  date: string;
  dateAdded: string;
}

export type LatestFinancialStatementsResponse = LatestFinancialStatement[];

// ========== Key Metrics ==========

export interface KeyMetricsQueryParams {
  symbol: string; // Required
  limit?: number; // default: 5, max: 1000
  period?: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY' | 'annual' | 'quarter';
}

export interface KeyMetrics {
  symbol: string;
  date: string;
  fiscalYear: string;
  period: string;
  reportedCurrency: string;
  marketCap: number;
  enterpriseValue: number;
  evToSales: number;
  evToOperatingCashFlow: number;
  evToFreeCashFlow: number;
  evToEBITDA: number;
  netDebtToEBITDA: number;
  currentRatio: number;
  incomeQuality: number;
  grahamNumber: number;
  grahamNetNet: number;
  taxBurden: number;
  interestBurden: number;
  workingCapital: number;
  investedCapital: number;
  returnOnAssets: number;
  operatingReturnOnAssets: number;
  returnOnTangibleAssets: number;
  returnOnEquity: number;
  returnOnInvestedCapital: number;
  returnOnCapitalEmployed: number;
  earningsYield: number;
  freeCashFlowYield: number;
  capexToOperatingCashFlow: number;
  capexToDepreciation: number;
  capexToRevenue: number;
  salesGeneralAndAdministrativeToRevenue: number;
  researchAndDevelopementToRevenue: number;
  stockBasedCompensationToRevenue: number;
  intangiblesToTotalAssets: number;
  averageReceivables: number;
  averagePayables: number;
  averageInventory: number;
  daysOfSalesOutstanding: number;
  daysOfPayablesOutstanding: number;
  daysOfInventoryOutstanding: number;
  operatingCycle: number;
  cashConversionCycle: number;
  freeCashFlowToEquity: number;
  freeCashFlowToFirm: number;
  tangibleAssetValue: number;
  netCurrentAssetValue: number;
}

export type KeyMetricsResponse = KeyMetrics[];

// ========== Key Metrics TTM ==========

export interface KeyMetricsTTMQueryParams {
  symbol: string; // Required
}

export interface KeyMetricsTTM {
  symbol: string;
  marketCap: number;
  enterpriseValueTTM: number;
  evToSalesTTM: number;
  evToOperatingCashFlowTTM: number;
  evToFreeCashFlowTTM: number;
  evToEBITDATTM: number;
  netDebtToEBITDATTM: number;
  currentRatioTTM: number;
  incomeQualityTTM: number;
  grahamNumberTTM: number;
  grahamNetNetTTM: number;
  taxBurdenTTM: number;
  interestBurdenTTM: number;
  workingCapitalTTM: number;
  investedCapitalTTM: number;
  returnOnAssetsTTM: number;
  operatingReturnOnAssetsTTM: number;
  returnOnTangibleAssetsTTM: number;
  returnOnEquityTTM: number;
  returnOnInvestedCapitalTTM: number;
  returnOnCapitalEmployedTTM: number;
  earningsYieldTTM: number;
  freeCashFlowYieldTTM: number;
  capexToOperatingCashFlowTTM: number;
  capexToDepreciationTTM: number;
  capexToRevenueTTM: number;
  salesGeneralAndAdministrativeToRevenueTTM: number;
  researchAndDevelopementToRevenueTTM: number;
  stockBasedCompensationToRevenueTTM: number;
  intangiblesToTotalAssetsTTM: number;
  averageReceivablesTTM: number;
  averagePayablesTTM: number;
  averageInventoryTTM: number;
  daysOfSalesOutstandingTTM: number;
  daysOfPayablesOutstandingTTM: number;
  daysOfInventoryOutstandingTTM: number;
  operatingCycleTTM: number;
  cashConversionCycleTTM: number;
  freeCashFlowToEquityTTM: number;
  freeCashFlowToFirmTTM: number;
  tangibleAssetValueTTM: number;
  netCurrentAssetValueTTM: number;
}

export type KeyMetricsTTMResponse = KeyMetricsTTM[];

// ========== Financial Ratios ==========

export interface FinancialRatiosQueryParams {
  symbol: string; // Required
  limit?: number; // default: 5, max: 1000
  period?: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY' | 'annual' | 'quarter';
}

export interface FinancialRatios {
  symbol: string;
  date: string;
  fiscalYear: string;
  period: string;
  reportedCurrency: string;
  grossProfitMargin: number;
  ebitMargin: number;
  ebitdaMargin: number;
  operatingProfitMargin: number;
  pretaxProfitMargin: number;
  continuousOperationsProfitMargin: number;
  netProfitMargin: number;
  bottomLineProfitMargin: number;
  receivablesTurnover: number;
  payablesTurnover: number;
  inventoryTurnover: number;
  fixedAssetTurnover: number;
  assetTurnover: number;
  currentRatio: number;
  quickRatio: number;
  solvencyRatio: number;
  cashRatio: number;
  priceToEarningsRatio: number;
  priceToEarningsGrowthRatio: number;
  forwardPriceToEarningsGrowthRatio: number;
  priceToBookRatio: number;
  priceToSalesRatio: number;
  priceToFreeCashFlowRatio: number;
  priceToOperatingCashFlowRatio: number;
  debtToAssetsRatio: number;
  debtToEquityRatio: number;
  debtToCapitalRatio: number;
  longTermDebtToCapitalRatio: number;
  financialLeverageRatio: number;
  workingCapitalTurnoverRatio: number;
  operatingCashFlowRatio: number;
  operatingCashFlowSalesRatio: number;
  freeCashFlowOperatingCashFlowRatio: number;
  debtServiceCoverageRatio: number;
  interestCoverageRatio: number;
  shortTermOperatingCashFlowCoverageRatio: number;
  operatingCashFlowCoverageRatio: number;
  capitalExpenditureCoverageRatio: number;
  dividendPaidAndCapexCoverageRatio: number;
  dividendPayoutRatio: number;
  dividendYield: number;
  dividendYieldPercentage: number;
  revenuePerShare: number;
  netIncomePerShare: number;
  interestDebtPerShare: number;
  cashPerShare: number;
  bookValuePerShare: number;
  tangibleBookValuePerShare: number;
  shareholdersEquityPerShare: number;
  operatingCashFlowPerShare: number;
  capexPerShare: number;
  freeCashFlowPerShare: number;
  netIncomePerEBT: number;
  ebtPerEbit: number;
  priceToFairValue: number;
  debtToMarketCap: number;
  effectiveTaxRate: number;
  enterpriseValueMultiple: number;
}

export type FinancialRatiosResponse = FinancialRatios[];

// ========== Financial Scores ==========

export interface FinancialScoresQueryParams {
  symbol: string; // Required
}

export interface FinancialScores {
  symbol: string;
  reportedCurrency: string;
  altmanZScore: number;
  piotroskiScore: number;
  workingCapital: number;
  totalAssets: number;
  retainedEarnings: number;
  ebit: number;
  marketCap: number;
  totalLiabilities: number;
  revenue: number;
}

export type FinancialScoresResponse = FinancialScores[];

// ========== Owner Earnings ==========

export interface OwnerEarningsQueryParams {
  symbol: string; // Required
  limit?: number; // default: 5, max: 1000
}

export interface OwnerEarnings {
  symbol: string;
  reportedCurrency: string;
  fiscalYear: string;
  period: string;
  date: string;
  averagePPE: number;
  maintenanceCapex: number;
  ownersEarnings: number;
  growthCapex: number;
  ownersEarningsPerShare: number;
}

export type OwnerEarningsResponse = OwnerEarnings[];

// ========== Enterprise Values ==========

export interface EnterpriseValuesQueryParams {
  symbol: string; // Required
  limit?: number; // default: 5, max: 1000
  period?: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY' | 'annual' | 'quarter';
}

export interface EnterpriseValues {
  symbol: string;
  date: string;
  stockPrice: number;
  numberOfShares: number;
  marketCapitalization: number;
  minusCashAndCashEquivalents: number;
  addTotalDebt: number;
  enterpriseValue: number;
}

export type EnterpriseValuesResponse = EnterpriseValues[];

// ========== Income Statement Growth ==========

export interface IncomeStatementGrowthQueryParams {
  symbol: string; // Required
  limit?: number; // default: 5, max: 1000
  period?: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY' | 'annual' | 'quarter';
}

export interface IncomeStatementGrowth {
  symbol: string;
  date: string;
  fiscalYear: string;
  period: string;
  reportedCurrency: string;
  growthRevenue: number;
  growthCostOfRevenue: number;
  growthGrossProfit: number;
  growthGrossProfitRatio: number;
  growthResearchAndDevelopmentExpenses: number;
  growthGeneralAndAdministrativeExpenses: number;
  growthSellingAndMarketingExpenses: number;
  growthOtherExpenses: number;
  growthOperatingExpenses: number;
  growthCostAndExpenses: number;
  growthInterestIncome: number;
  growthInterestExpense: number;
  growthDepreciationAndAmortization: number;
  growthEBITDA: number;
  growthOperatingIncome: number;
  growthIncomeBeforeTax: number;
  growthIncomeTaxExpense: number;
  growthNetIncome: number;
  growthEPS: number;
  growthEPSDiluted: number;
  growthWeightedAverageShsOut: number;
  growthWeightedAverageShsOutDil: number;
  growthEBIT: number;
  growthNonOperatingIncomeExcludingInterest: number;
  growthNetInterestIncome: number;
  growthTotalOtherIncomeExpensesNet: number;
  growthNetIncomeFromContinuingOperations: number;
  growthOtherAdjustmentsToNetIncome: number;
  growthNetIncomeDeductions: number;
}

export type IncomeStatementGrowthResponse = IncomeStatementGrowth[];

// ========== Balance Sheet Statement Growth ==========

export interface BalanceSheetStatementGrowthQueryParams {
  symbol: string; // Required
  limit?: number; // default: 5, max: 1000
  period?: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY' | 'annual' | 'quarter';
}

export interface BalanceSheetStatementGrowth {
  symbol: string;
  date: string;
  fiscalYear: string;
  period: string;
  reportedCurrency: string;
  growthCashAndCashEquivalents: number;
  growthShortTermInvestments: number;
  growthCashAndShortTermInvestments: number;
  growthNetReceivables: number;
  growthInventory: number;
  growthOtherCurrentAssets: number;
  growthTotalCurrentAssets: number;
  growthPropertyPlantEquipmentNet: number;
  growthGoodwill: number;
  growthIntangibleAssets: number;
  growthGoodwillAndIntangibleAssets: number;
  growthLongTermInvestments: number;
  growthTaxAssets: number;
  growthOtherNonCurrentAssets: number;
  growthTotalNonCurrentAssets: number;
  growthOtherAssets: number;
  growthTotalAssets: number;
  growthAccountPayables: number;
  growthShortTermDebt: number;
  growthTaxPayables: number;
  growthDeferredRevenue: number;
  growthOtherCurrentLiabilities: number;
  growthTotalCurrentLiabilities: number;
  growthLongTermDebt: number;
  growthDeferredRevenueNonCurrent: number;
  growthDeferredTaxLiabilitiesNonCurrent: number;
  growthOtherNonCurrentLiabilities: number;
  growthTotalNonCurrentLiabilities: number;
  growthOtherLiabilities: number;
  growthTotalLiabilities: number;
  growthPreferredStock: number;
  growthCommonStock: number;
  growthRetainedEarnings: number;
  growthAccumulatedOtherComprehensiveIncomeLoss: number;
  growthOthertotalStockholdersEquity: number;
  growthTotalStockholdersEquity: number;
  growthMinorityInterest: number;
  growthTotalEquity: number;
  growthTotalLiabilitiesAndStockholdersEquity: number;
  growthTotalInvestments: number;
  growthTotalDebt: number;
  growthNetDebt: number;
  growthAccountsReceivables: number;
  growthOtherReceivables: number;
  growthPrepaids: number;
  growthTotalPayables: number;
  growthOtherPayables: number;
  growthAccruedExpenses: number;
  growthCapitalLeaseObligationsCurrent: number;
  growthAdditionalPaidInCapital: number;
  growthTreasuryStock: number;
}

export type BalanceSheetStatementGrowthResponse = BalanceSheetStatementGrowth[];

// ========== Cashflow Statement Growth ==========

export interface CashflowStatementGrowthQueryParams {
  symbol: string; // Required
  limit?: number; // default: 5, max: 1000
  period?: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY' | 'annual' | 'quarter';
}

export interface CashflowStatementGrowth {
  symbol: string;
  date: string;
  fiscalYear: string;
  period: string;
  reportedCurrency: string;
  growthNetIncome: number;
  growthDepreciationAndAmortization: number;
  growthDeferredIncomeTax: number;
  growthStockBasedCompensation: number;
  growthChangeInWorkingCapital: number;
  growthAccountsReceivables: number;
  growthInventory: number;
  growthAccountsPayables: number;
  growthOtherWorkingCapital: number;
  growthOtherNonCashItems: number;
  growthNetCashProvidedByOperatingActivites: number;
  growthInvestmentsInPropertyPlantAndEquipment: number;
  growthAcquisitionsNet: number;
  growthPurchasesOfInvestments: number;
  growthSalesMaturitiesOfInvestments: number;
  growthOtherInvestingActivites: number;
  growthNetCashUsedForInvestingActivites: number;
  growthDebtRepayment: number;
  growthCommonStockIssued: number;
  growthCommonStockRepurchased: number;
  growthDividendsPaid: number;
  growthOtherFinancingActivites: number;
  growthNetCashUsedProvidedByFinancingActivities: number;
  growthEffectOfForexChangesOnCash: number;
  growthNetChangeInCash: number;
  growthCashAtEndOfPeriod: number;
  growthCashAtBeginningOfPeriod: number;
  growthOperatingCashFlow: number;
  growthCapitalExpenditure: number;
  growthFreeCashFlow: number;
  growthNetDebtIssuance: number;
  growthLongTermNetDebtIssuance: number;
  growthShortTermNetDebtIssuance: number;
  growthNetStockIssuance: number;
  growthPreferredDividendsPaid: number;
  growthIncomeTaxesPaid: number;
  growthInterestPaid: number;
}

export type CashflowStatementGrowthResponse = CashflowStatementGrowth[];

// ========== Financial Statement Growth ==========

export interface FinancialStatementGrowthQueryParams {
  symbol: string; // Required
  limit?: number; // default: 5, max: 1000
  period?: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY' | 'annual' | 'quarter';
}

export interface FinancialStatementGrowth {
  symbol: string;
  date: string;
  fiscalYear: string;
  period: string;
  reportedCurrency: string;
  revenueGrowth: number;
  grossProfitGrowth: number;
  ebitgrowth: number;
  operatingIncomeGrowth: number;
  netIncomeGrowth: number;
  epsgrowth: number;
  epsdilutedGrowth: number;
  weightedAverageSharesGrowth: number;
  weightedAverageSharesDilutedGrowth: number;
  dividendsPerShareGrowth: number;
  operatingCashFlowGrowth: number;
  receivablesGrowth: number;
  inventoryGrowth: number;
  assetGrowth: number;
  bookValueperShareGrowth: number;
  debtGrowth: number;
  rdexpenseGrowth: number;
  sgaexpensesGrowth: number;
  freeCashFlowGrowth: number;
  tenYRevenueGrowthPerShare: number;
  fiveYRevenueGrowthPerShare: number;
  threeYRevenueGrowthPerShare: number;
  tenYOperatingCFGrowthPerShare: number;
  fiveYOperatingCFGrowthPerShare: number;
  threeYOperatingCFGrowthPerShare: number;
  tenYNetIncomeGrowthPerShare: number;
  fiveYNetIncomeGrowthPerShare: number;
  threeYNetIncomeGrowthPerShare: number;
  tenYShareholdersEquityGrowthPerShare: number;
  fiveYShareholdersEquityGrowthPerShare: number;
  threeYShareholdersEquityGrowthPerShare: number;
  tenYDividendperShareGrowthPerShare: number;
  fiveYDividendperShareGrowthPerShare: number;
  threeYDividendperShareGrowthPerShare: number;
  ebitdaGrowth: number | null;
  growthCapitalExpenditure: number | null;
  tenYBottomLineNetIncomeGrowthPerShare: number | null;
  fiveYBottomLineNetIncomeGrowthPerShare: number | null;
  threeYBottomLineNetIncomeGrowthPerShare: number | null;
}

export type FinancialStatementGrowthResponse = FinancialStatementGrowth[];

// ========== Financial Reports Dates ==========

export interface FinancialReportsDatesQueryParams {
  symbol: string; // Required
}

export interface FinancialReportsDates {
  symbol: string;
  fiscalYear: number;
  period: string;
  linkXlsx: string;
  linkJson: string;
}

export type FinancialReportsDatesResponse = FinancialReportsDates[];

// ========== Financial Reports Form 10-K JSON ==========

export interface FinancialReportsJSONQueryParams {
  symbol: string; // Required
  year: number; // Required
  period: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY'; // Required
}

export type FinancialReportsJSONResponse = Record<string, any>[];

// ========== Financial Reports Form 10-K XLSX ==========

export interface FinancialReportsXLSXQueryParams {
  symbol: string; // Required
  year: number; // Required
  period: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY'; // Required
}

export type FinancialReportsXLSXResponse = Record<string, any>[];

// ========== Revenue Product Segmentation ==========

export interface RevenueProductSegmentationQueryParams {
  symbol: string; // Required
  period?: 'annual' | 'quarter';
  structure?: string; // default: 'flat'
}

export interface RevenueProductSegmentation {
  symbol: string;
  fiscalYear: number;
  period: string;
  reportedCurrency: string | null;
  date: string;
  data: Record<string, number>;
}

export type RevenueProductSegmentationResponse = RevenueProductSegmentation[];

// ========== Revenue Geographic Segments ==========

export interface RevenueGeographicSegmentsQueryParams {
  symbol: string; // Required
  period?: 'annual' | 'quarter';
  structure?: string; // default: 'flat'
}

export interface RevenueGeographicSegments {
  symbol: string;
  fiscalYear: number;
  period: string;
  reportedCurrency: string | null;
  date: string;
  data: Record<string, number>;
}

export type RevenueGeographicSegmentsResponse = RevenueGeographicSegments[];

// ========== As Reported Income Statements ==========

export interface AsReportedIncomeStatementsQueryParams {
  symbol: string; // Required
  limit?: number; // default: 5, max: 1000
  period?: 'annual' | 'quarter';
}

export interface AsReportedIncomeStatements {
  symbol: string;
  fiscalYear: number;
  period: string;
  reportedCurrency: string | null;
  date: string;
  data: Record<string, any>;
}

export type AsReportedIncomeStatementsResponse = AsReportedIncomeStatements[];

// ========== As Reported Balance Statements ==========

export interface AsReportedBalanceStatementsQueryParams {
  symbol: string; // Required
  limit?: number; // default: 5, max: 1000
  period?: 'annual' | 'quarter';
}

export interface AsReportedBalanceStatements {
  symbol: string;
  fiscalYear: number;
  period: string;
  reportedCurrency: string | null;
  date: string;
  data: Record<string, any>;
}

export type AsReportedBalanceStatementsResponse = AsReportedBalanceStatements[];

// ========== As Reported Cashflow Statements ==========

export interface AsReportedCashflowStatementsQueryParams {
  symbol: string; // Required
  limit?: number; // default: 5, max: 1000
  period?: 'annual' | 'quarter';
}

export interface AsReportedCashflowStatements {
  symbol: string;
  fiscalYear: number;
  period: string;
  reportedCurrency: string | null;
  date: string;
  data: Record<string, any>;
}

export type AsReportedCashflowStatementsResponse = AsReportedCashflowStatements[];

// ========== As Reported Financial Statements ==========

export interface AsReportedFinancialStatementsQueryParams {
  symbol: string; // Required
  limit?: number; // default: 5, max: 1000
  period?: 'annual' | 'quarter';
}

export interface AsReportedFinancialStatements {
  symbol: string;
  fiscalYear: number;
  period: string;
  reportedCurrency: string | null;
  date: string;
  data: Record<string, any>;
}

export type AsReportedFinancialStatementsResponse = AsReportedFinancialStatements[];

