/**
 * Module Unusual Whales - Interface publique
 * Expose toutes les fonctions Unusual Whales pour le router
 * Utilise les services et repositories pour éviter la duplication
 */

import { UnusualWhalesService } from './services/unusual-whales.service';
import { logger } from './utils/logger';
import type { AlertsQueryParams, AlertConfigurationQueryParams } from './types/unusual-whales/alerts';
import type {
  CongressTraderQueryParams,
  CongressLateReportsQueryParams,
  CongressRecentTradesQueryParams,
} from './types/unusual-whales/congress';
import type {
  DarkPoolRecentQueryParams,
  DarkPoolTickerQueryParams,
} from './types/unusual-whales/darkpool';
import type {
  EarningsAfterhoursQueryParams,
  EarningsPremarketQueryParams,
  EarningsHistoricalQueryParams,
} from './types/unusual-whales/earnings';
import type {
  ETFExposureQueryParams,
  ETFHoldingsQueryParams,
  ETFInOutflowQueryParams,
  ETFInfoQueryParams,
  ETFWeightsQueryParams,
} from './types/unusual-whales/etf';
import type {
  GroupGreekFlowQueryParams,
  GroupGreekFlowByExpiryQueryParams,
  FlowGroup,
} from './types/unusual-whales/group-flow';
import type {
  InsiderTransactionsQueryParams,
  InsiderSectorFlowQueryParams,
  InsidersQueryParams,
  InsiderTickerFlowQueryParams,
  FinancialSector,
} from './types/unusual-whales/insiders';
import type {
  InstitutionalActivityQueryParams,
  InstitutionalHoldingsQueryParams,
  SectorExposureQueryParams,
  InstitutionalOwnershipQueryParams,
  InstitutionsQueryParams,
  LatestFilingsQueryParams,
} from './types/unusual-whales/institutions';
import type {
  CorrelationsQueryParams,
  EconomicCalendarQueryParams,
  FDACalendarQueryParams,
  InsiderBuySellsQueryParams,
  MarketTideQueryParams,
  OIChangeQueryParams,
  SectorETFsQueryParams,
  SpikeQueryParams,
  TopNetImpactQueryParams,
  TotalOptionsVolumeQueryParams,
  SectorTideQueryParams,
  ETFTideQueryParams,
  NetFlowExpiryQueryParams,
} from './types/unusual-whales/market';
import type {
  SectorTickersQueryParams,
  ATMChainsQueryParams,
  FlowAlertsQueryParams,
  FlowPerExpiryQueryParams,
  FlowPerStrikeQueryParams,
  FlowPerStrikeIntradayQueryParams,
  RecentFlowsQueryParams,
  GreekExposureQueryParams,
  GreekExposureByExpiryQueryParams,
  GreekExposureByStrikeQueryParams,
  GreekExposureByStrikeAndExpiryQueryParams,
  GreekFlowQueryParams,
  GreekFlowByExpiryQueryParams,
  GreeksQueryParams,
  HistoricalRiskReversalSkewQueryParams,
  StockInfoQueryParams,
  InsiderBuySellsQueryParams as StockInsiderBuySellsQueryParams,
  InterpolatedIVQueryParams,
  IVRankQueryParams,
  MaxPainQueryParams,
  NetPremiumTicksQueryParams,
  NOPEQueryParams,
  OHLCQueryParams,
  OIChangeQueryParams as StockOIChangeQueryParams,
  OIPerExpiryQueryParams,
  OIPerStrikeQueryParams,
  OptionChainsQueryParams,
  OptionStockPriceLevelsQueryParams,
  VolumeOIPerExpiryQueryParams,
  OptionsVolumeQueryParams,
  SpotExposuresQueryParams,
  SpotExposureByStrikeAndExpiryQueryParams,
  SpotExposureByStrikeQueryParams,
  StockStateQueryParams,
  StockVolumePriceLevelsQueryParams,
  RealizedVolatilityQueryParams,
  VolatilityStatsQueryParams,
  VolatilityTermStructureQueryParams,
} from './types/unusual-whales/stock';
import type {
  ShortDataQueryParams,
  FailuresToDeliverQueryParams,
  ShortInterestAndFloatQueryParams,
  ShortVolumeAndRatioQueryParams,
  ShortVolumeByExchangeQueryParams,
} from './types/unusual-whales/shorts';
import type {
  YearMonthPriceChangeQueryParams,
  MonthlyAverageReturnQueryParams,
  MonthPerformersQueryParams,
  MarketSeasonalityQueryParams,
} from './types/unusual-whales/seasonality';
import type {
  AnalystRatingQueryParams,
  OptionContractsQueryParams,
  StockScreenerQueryParams,
} from './types/unusual-whales/screener';
import type {
  OptionTradeFlowAlertsQueryParams,
  FullTapeQueryParams,
} from './types/unusual-whales/option-trade';
import type {
  OptionContractFlowQueryParams,
  OptionContractHistoricQueryParams,
  OptionContractIntradayQueryParams,
  OptionContractVolumeProfileQueryParams,
  ExpiryBreakdownQueryParams,
  StockOptionContractsQueryParams,
} from './types/unusual-whales/option-contract';
import type {
  NewsHeadlinesQueryParams,
} from './types/unusual-whales/news';

// Instance singleton du service
const uwService = new UnusualWhalesService();

// ========== Institutional Data (Legacy - kept for backward compatibility) ==========

// ========== Options Flow ==========

export async function getUWOptionsFlow(ticker: string, options?: Record<string, any>) {
  return await uwService.getOptionsFlow(ticker, options);
}

export async function getUWFlowAlerts(ticker: string, options?: Record<string, any>) {
  return await uwService.getFlowAlerts(ticker, options);
}

export async function getUWGreekFlow(ticker: string, options?: Record<string, any>) {
  return await uwService.getGreekFlow(ticker, options);
}

// ========== Dark Pool ==========

/**
 * Récupère les derniers dark pool trades
 * GET /darkpool/recent
 * 
 * @param params Paramètres de requête (date, limit, filtres premium/size/volume)
 * @returns Réponse avec les dark pool trades récents
 */
export async function getUWDarkPoolRecent(params?: DarkPoolRecentQueryParams) {
  return await uwService.getDarkPoolRecent(params);
}

/**
 * Récupère les dark pool trades pour un ticker donné
 * GET /darkpool/{ticker}
 * 
 * @param ticker Symbole du ticker (requis)
 * @param params Paramètres de requête (date, limit, filtres, pagination)
 * @returns Réponse avec les dark pool trades du ticker
 */
export async function getUWDarkPoolTrades(ticker: string, params?: DarkPoolTickerQueryParams) {
  return await uwService.getDarkPoolTrades(ticker, params);
}

// ========== Earnings ==========

/**
 * Récupère les earnings afterhours pour une date donnée
 * GET /earnings/afterhours
 * 
 * @param params Paramètres de requête (date, limit, page)
 * @returns Réponse avec les earnings afterhours
 */
export async function getUWEarningsAfterhours(params?: EarningsAfterhoursQueryParams) {
  return await uwService.getEarningsAfterhours(params);
}

/**
 * Récupère les earnings premarket pour une date donnée
 * GET /earnings/premarket
 * 
 * @param params Paramètres de requête (date, limit, page)
 * @returns Réponse avec les earnings premarket
 */
export async function getUWEarningsPremarket(params?: EarningsPremarketQueryParams) {
  return await uwService.getEarningsPremarket(params);
}

/**
 * Récupère les earnings historiques pour un ticker donné
 * GET /earnings/{ticker}
 * 
 * @param ticker Symbole du ticker (requis)
 * @param params Paramètres de requête (aucun selon la doc)
 * @returns Réponse avec les earnings historiques
 */
export async function getUWEarningsHistorical(ticker: string, params?: EarningsHistoricalQueryParams) {
  return await uwService.getEarningsHistorical(ticker, params);
}

// ========== ETF ==========

/**
 * Récupère tous les ETFs dans lesquels le ticker donné est un holding
 * GET /etfs/{ticker}/exposure
 * 
 * @param ticker Symbole du ticker (requis)
 * @param params Paramètres de requête (aucun selon la doc)
 * @returns Réponse avec les ETFs contenant le ticker
 */
export async function getUWETFExposure(ticker: string, params?: ETFExposureQueryParams) {
  return await uwService.getETFExposure(ticker, params);
}

/**
 * Récupère les holdings de l'ETF
 * GET /etfs/{ticker}/holdings
 * 
 * @param ticker Symbole du ticker ETF (requis)
 * @param params Paramètres de requête (aucun selon la doc)
 * @returns Réponse avec les holdings de l'ETF
 */
export async function getUWETFHoldings(ticker: string, params?: ETFHoldingsQueryParams) {
  return await uwService.getETFHoldings(ticker, params);
}

/**
 * Récupère l'inflow et outflow d'un ETF
 * GET /etfs/{ticker}/in-outflow
 * 
 * @param ticker Symbole du ticker ETF (requis)
 * @param params Paramètres de requête (aucun selon la doc)
 * @returns Réponse avec l'inflow/outflow de l'ETF
 */
export async function getUWETFInOutflow(ticker: string, params?: ETFInOutflowQueryParams) {
  return await uwService.getETFInOutflow(ticker, params);
}

/**
 * Récupère les informations sur l'ETF
 * GET /etfs/{ticker}/info
 * 
 * @param ticker Symbole du ticker ETF (requis)
 * @param params Paramètres de requête (aucun selon la doc)
 * @returns Réponse avec les informations de l'ETF
 */
export async function getUWETFInfo(ticker: string, params?: ETFInfoQueryParams) {
  return await uwService.getETFInfo(ticker, params);
}

/**
 * Récupère les poids sectoriels et par pays pour l'ETF
 * GET /etfs/{ticker}/weights
 * 
 * @param ticker Symbole du ticker ETF (requis)
 * @param params Paramètres de requête (aucun selon la doc)
 * @returns Réponse avec les poids sectoriels et par pays
 */
export async function getUWETFWeights(ticker: string, params?: ETFWeightsQueryParams) {
  return await uwService.getETFWeights(ticker, params);
}

// ========== Group Flow ==========

/**
 * Récupère le greek flow (delta & vega flow) d'un flow group pour un jour de marché donné, décomposé par minute
 * GET /group-flow/{flow_group}/greek-flow
 * 
 * @param flowGroup Flow group (requis)
 * @param params Paramètres de requête (date)
 * @returns Réponse avec le greek flow par minute
 */
export async function getUWGroupGreekFlow(flowGroup: FlowGroup, params?: GroupGreekFlowQueryParams) {
  return await uwService.getGroupGreekFlow(flowGroup, params);
}

/**
 * Récupère le greek flow (delta & vega flow) d'un flow group pour un jour de marché donné, décomposé par minute et expiry
 * GET /group-flow/{flow_group}/greek-flow/{expiry}
 * 
 * @param flowGroup Flow group (requis)
 * @param expiry Date d'expiration (format ISO, requis)
 * @param params Paramètres de requête (date)
 * @returns Réponse avec le greek flow par minute et expiry
 */
export async function getUWGroupGreekFlowByExpiry(
  flowGroup: FlowGroup,
  expiry: string,
  params?: GroupGreekFlowByExpiryQueryParams
) {
  return await uwService.getGroupGreekFlowByExpiry(flowGroup, expiry, params);
}

// ========== Insider Transactions ==========

/**
 * Récupère les dernières transactions d'insiders
 * GET /insider/transactions
 * 
 * @param params Paramètres de requête (filtres nombreux)
 * @returns Réponse avec les transactions d'insiders
 */
export async function getUWInsiderTransactions(params?: InsiderTransactionsQueryParams) {
  return await uwService.getInsiderTransactions(params);
}

/**
 * Récupère une vue agrégée du flow d'insiders pour un secteur donné
 * GET /insider/{sector}/sector-flow
 * 
 * @param sector Secteur financier (requis)
 * @param params Paramètres de requête (aucun selon la doc)
 * @returns Réponse avec le flow d'insiders par secteur
 */
export async function getUWInsiderSectorFlow(sector: FinancialSector, params?: InsiderSectorFlowQueryParams) {
  return await uwService.getInsiderSectorFlow(sector, params);
}

/**
 * Récupère tous les insiders pour un ticker donné
 * GET /insider/{ticker}
 * 
 * @param ticker Symbole du ticker (requis)
 * @param params Paramètres de requête (aucun selon la doc)
 * @returns Réponse avec les insiders
 */
export async function getUWInsiders(ticker: string, params?: InsidersQueryParams) {
  return await uwService.getInsiders(ticker, params);
}

/**
 * Récupère une vue agrégée du flow d'insiders pour un ticker donné
 * GET /insider/{ticker}/ticker-flow
 * 
 * @param ticker Symbole du ticker (requis)
 * @param params Paramètres de requête (aucun selon la doc)
 * @returns Réponse avec le flow d'insiders par ticker
 */
export async function getUWInsiderTickerFlow(ticker: string, params?: InsiderTickerFlowQueryParams) {
  return await uwService.getInsiderTickerFlow(ticker, params);
}

// ========== Institutions ==========

/**
 * Récupère les activités de trading pour une institution donnée
 * GET /institution/{name}/activity
 * 
 * @param name Nom de l'institution ou CIK (requis)
 * @param params Paramètres de requête (date, limit, page)
 * @returns Réponse avec les activités de trading
 */
export async function getUWInstitutionActivity(name: string, params?: InstitutionalActivityQueryParams) {
  return await uwService.getInstitutionActivity(name, params);
}

/**
 * Récupère les holdings pour une institution donnée
 * GET /institution/{name}/holdings
 * 
 * @param name Nom de l'institution ou CIK (requis)
 * @param params Paramètres de requête (date, limit, order, etc.)
 * @returns Réponse avec les holdings
 */
export async function getUWInstitutionHoldings(name: string, params?: InstitutionalHoldingsQueryParams) {
  return await uwService.getInstitutionHoldings(name, params);
}

/**
 * Récupère l'exposition sectorielle pour une institution donnée
 * GET /institution/{name}/sectors
 * 
 * @param name Nom de l'institution ou CIK (requis)
 * @param params Paramètres de requête (date, limit, page)
 * @returns Réponse avec l'exposition sectorielle
 */
export async function getUWInstitutionSectorExposure(name: string, params?: SectorExposureQueryParams) {
  return await uwService.getInstitutionSectorExposure(name, params);
}

/**
 * Récupère la propriété institutionnelle d'un ticker donné
 * GET /institution/{ticker}/ownership
 * 
 * @param ticker Liste de tickers séparés par des virgules (requis)
 * @param params Paramètres de requête (date, limit, order, etc.)
 * @returns Réponse avec la propriété institutionnelle
 */
export async function getUWInstitutionOwnership(ticker: string, params?: InstitutionalOwnershipQueryParams) {
  return await uwService.getInstitutionOwnership(ticker, params);
}

/**
 * Récupère une liste d'institutions
 * GET /institutions
 * 
 * @param params Paramètres de requête (limit, name, order, tags, etc.)
 * @returns Réponse avec la liste des institutions
 */
export async function getUWInstitutions(params?: InstitutionsQueryParams) {
  return await uwService.getInstitutions(params);
}

/**
 * Récupère les derniers dépôts institutionnels
 * GET /institutions/latest_filings
 * 
 * @param params Paramètres de requête (date, limit, name, order, etc.)
 * @returns Réponse avec les derniers dépôts
 */
export async function getUWLatestFilings(params?: LatestFilingsQueryParams) {
  return await uwService.getLatestFilings(params);
}

// ========== Congress ==========

/**
 * Récupère les rapports récents par un membre du Congrès
 * GET /congress/congress-trader
 * 
 * @param params Paramètres de requête (date, limit, name, ticker)
 * @returns Réponse avec les trades du membre du Congrès
 */
export async function getUWCongressTrader(params?: CongressTraderQueryParams) {
  return await uwService.getCongressTrader(params);
}

/**
 * Récupère les rapports tardifs récents par les membres du Congrès
 * GET /congress/late-reports
 * 
 * @param params Paramètres de requête (date, limit, ticker)
 * @returns Réponse avec les rapports tardifs
 */
export async function getUWCongressLateReports(params?: CongressLateReportsQueryParams) {
  return await uwService.getCongressLateReports(params);
}

/**
 * Récupère les trades récents du Congrès
 * GET /congress/recent-trades
 * 
 * @param params Paramètres de requête (date, limit, ticker)
 * @returns Réponse avec les trades récents
 */
export async function getUWCongressRecentTrades(params?: CongressRecentTradesQueryParams) {
  return await uwService.getCongressRecentTrades(params);
}

// Alias pour compatibilité (ancienne méthode)
export async function getUWCongressTrades(ticker: string, options?: Record<string, any>) {
  return await uwService.getCongressTrades(ticker, options);
}


// ========== Alerts ==========

/**
 * Récupère toutes les alertes déclenchées pour l'utilisateur
 * GET /alerts
 * 
 * @param params Paramètres de requête (filtres, pagination, etc.)
 * @returns Réponse avec les alertes déclenchées
 */
export async function getUWAlerts(params?: AlertsQueryParams) {
  return await uwService.getAlerts(params);
}

/**
 * Récupère toutes les configurations d'alertes de l'utilisateur
 * GET /alerts/configuration
 * 
 * @param params Paramètres de requête (aucun selon la doc)
 * @returns Réponse avec les configurations d'alertes
 */
export async function getUWAlertConfigurations(params?: AlertConfigurationQueryParams) {
  return await uwService.getAlertConfigurations(params);
}

// ========== Market ==========

/**
 * Récupère les corrélations entre deux tickers
 * GET /market/correlations
 *
 * @param params Paramètres de requête (ticker1, ticker2, date)
 * @returns Réponse avec les corrélations
 */
export async function getUWCorrelations(params: CorrelationsQueryParams) {
  return await uwService.getCorrelations(params);
}

/**
 * Récupère le calendrier économique
 * GET /market/economic-calendar
 *
 * @param params Paramètres de requête (date, limit, page)
 * @returns Réponse avec le calendrier économique
 */
export async function getUWEconomicCalendar(params?: EconomicCalendarQueryParams) {
  return await uwService.getEconomicCalendar(params);
}

/**
 * Récupère le calendrier FDA
 * GET /market/fda-calendar
 *
 * @param params Paramètres de requête (date, limit, page)
 * @returns Réponse avec le calendrier FDA
 */
export async function getUWFDACalendar(params?: FDACalendarQueryParams) {
  return await uwService.getFDACalendar(params);
}

/**
 * Récupère les totaux d'achats et ventes d'insiders
 * GET /market/insider-buy-sells
 *
 * @param params Paramètres de requête (start_date, end_date, limit, page)
 * @returns Réponse avec les totaux d'achats et ventes
 */
export async function getUWInsiderBuySells(params?: InsiderBuySellsQueryParams) {
  return await uwService.getInsiderBuySells(params);
}

/**
 * Récupère le Market Tide
 * GET /market/market-tide
 *
 * @param params Paramètres de requête (date, limit, page)
 * @returns Réponse avec le Market Tide
 */
export async function getUWMarketTide(params?: MarketTideQueryParams) {
  return await uwService.getMarketTide(params);
}

/**
 * Récupère les changements d'Open Interest
 * GET /market/oi-change
 *
 * @param params Paramètres de requête (date, limit, page)
 * @returns Réponse avec les changements d'OI
 */
export async function getUWOIChange(params?: OIChangeQueryParams) {
  return await uwService.getOIChange(params);
}

/**
 * Récupère les ETFs sectoriels
 * GET /market/sector-etfs
 *
 * @param params Paramètres de requête (aucun selon la documentation)
 * @returns Réponse avec les ETFs sectoriels
 */
export async function getUWSectorETFs(params?: SectorETFsQueryParams) {
  return await uwService.getSectorETFs(params);
}

/**
 * Récupère les SPIKE
 * GET /market/spike
 *
 * @param params Paramètres de requête (date, limit, page)
 * @returns Réponse avec les SPIKE
 */
export async function getUWSpike(params?: SpikeQueryParams) {
  return await uwService.getSpike(params);
}

/**
 * Récupère le Top Net Impact
 * GET /market/top-net-impact
 *
 * @param params Paramètres de requête (date, limit, page)
 * @returns Réponse avec le Top Net Impact
 */
export async function getUWTopNetImpact(params?: TopNetImpactQueryParams) {
  return await uwService.getTopNetImpact(params);
}

/**
 * Récupère le volume total d'options
 * GET /market/total-options-volume
 *
 * @param params Paramètres de requête (date, limit, page)
 * @returns Réponse avec le volume total d'options
 */
export async function getUWTotalOptionsVolume(params?: TotalOptionsVolumeQueryParams) {
  return await uwService.getTotalOptionsVolume(params);
}

/**
 * Récupère le Sector Tide
 * GET /market/{sector}/sector-tide
 *
 * @param sector Secteur financier (requis)
 * @param params Paramètres de requête (date, limit, page)
 * @returns Réponse avec le Sector Tide
 */
export async function getUWSectorTide(sector: string, params?: SectorTideQueryParams) {
  return await uwService.getSectorTide(sector, params);
}

/**
 * Récupère l'ETF Tide
 * GET /market/{ticker}/etf-tide
 *
 * @param ticker Ticker de l'ETF (requis)
 * @param params Paramètres de requête (date, limit, page)
 * @returns Réponse avec l'ETF Tide
 */
export async function getUWETFTide(ticker: string, params?: ETFTideQueryParams) {
  return await uwService.getETFTide(ticker, params);
}

/**
 * Récupère le Net Flow par expiry
 * GET /net-flow/expiry
 *
 * @param params Paramètres de requête (ticker, date, limit, page)
 * @returns Réponse avec le Net Flow par expiry
 */
export async function getUWNetFlowExpiry(params: NetFlowExpiryQueryParams) {
  return await uwService.getNetFlowExpiry(params);
}

// ========== Stock ==========

/**
 * Récupère la liste des tickers dans un secteur donné
 * GET /stock/{sector}/tickers
 */
export async function getUWSectorTickers(sector: string) {
  return await uwService.getSectorTickers(sector);
}

/**
 * Récupère les chaînes ATM pour les expirations données
 * GET /stock/{ticker}/atm-chains
 */
export async function getUWATMChains(ticker: string, params: ATMChainsQueryParams) {
  return await uwService.getATMChains(ticker, params);
}

/**
 * Récupère les flow alerts (déprécié)
 * GET /stock/{ticker}/flow-alerts
 */
export async function getUWStockFlowAlerts(ticker: string, params?: FlowAlertsQueryParams) {
  return await uwService.getStockFlowAlerts(ticker, params);
}

/**
 * Récupère le flow par expiration
 * GET /stock/{ticker}/flow-per-expiry
 */
export async function getUWFlowPerExpiry(ticker: string, params?: FlowPerExpiryQueryParams) {
  return await uwService.getFlowPerExpiry(ticker, params);
}

/**
 * Récupère le flow par strike
 * GET /stock/{ticker}/flow-per-strike
 */
export async function getUWFlowPerStrike(ticker: string, params?: FlowPerStrikeQueryParams) {
  return await uwService.getFlowPerStrike(ticker, params);
}

/**
 * Récupère le flow par strike intraday
 * GET /stock/{ticker}/flow-per-strike-intraday
 */
export async function getUWFlowPerStrikeIntraday(ticker: string, params?: FlowPerStrikeIntradayQueryParams) {
  return await uwService.getFlowPerStrikeIntraday(ticker, params);
}

/**
 * Récupère les flows récents
 * GET /stock/{ticker}/flow-recent
 */
export async function getUWRecentFlows(ticker: string, params?: RecentFlowsQueryParams) {
  return await uwService.getRecentFlows(ticker, params);
}

/**
 * Récupère l'exposition grecque
 * GET /stock/{ticker}/greek-exposure
 */
export async function getUWGreekExposure(ticker: string, params?: GreekExposureQueryParams) {
  return await uwService.getGreekExposure(ticker, params);
}

/**
 * Récupère l'exposition grecque par expiration
 * GET /stock/{ticker}/greek-exposure/expiry
 */
export async function getUWGreekExposureByExpiry(ticker: string, params?: GreekExposureByExpiryQueryParams) {
  return await uwService.getGreekExposureByExpiry(ticker, params);
}

/**
 * Récupère l'exposition grecque par strike
 * GET /stock/{ticker}/greek-exposure/strike
 */
export async function getUWGreekExposureByStrike(ticker: string, params?: GreekExposureByStrikeQueryParams) {
  return await uwService.getGreekExposureByStrike(ticker, params);
}

/**
 * Récupère l'exposition grecque par strike et expiration
 * GET /stock/{ticker}/greek-exposure/strike-expiry
 */
export async function getUWGreekExposureByStrikeAndExpiry(ticker: string, params: GreekExposureByStrikeAndExpiryQueryParams) {
  return await uwService.getGreekExposureByStrikeAndExpiry(ticker, params);
}

/**
 * Récupère le greek flow
 * GET /stock/{ticker}/greek-flow
 */
export async function getUWStockGreekFlow(ticker: string, params?: GreekFlowQueryParams) {
  return await uwService.getStockGreekFlow(ticker, params);
}

/**
 * Récupère le greek flow par expiration
 * GET /stock/{ticker}/greek-flow/{expiry}
 */
export async function getUWStockGreekFlowByExpiry(ticker: string, expiry: string, params?: GreekFlowByExpiryQueryParams) {
  return await uwService.getStockGreekFlowByExpiry(ticker, expiry, params);
}

/**
 * Récupère les greeks pour chaque strike pour une date d'expiration unique
 * GET /stock/{ticker}/greeks
 */
export async function getUWGreeks(ticker: string, params: GreeksQueryParams) {
  return await uwService.getGreeks(ticker, params);
}

/**
 * Récupère le historical risk reversal skew
 * GET /stock/{ticker}/historical-risk-reversal-skew
 */
export async function getUWHistoricalRiskReversalSkew(ticker: string, params: HistoricalRiskReversalSkewQueryParams) {
  return await uwService.getHistoricalRiskReversalSkew(ticker, params);
}

/**
 * Récupère les informations sur un ticker
 * GET /stock/{ticker}/info
 */
export async function getUWStockInfo(ticker: string, params?: StockInfoQueryParams) {
  return await uwService.getStockInfo(ticker, params);
}

/**
 * Récupère les insider buy & sells
 * GET /stock/{ticker}/insider-buy-sells
 */
export async function getUWStockInsiderBuySells(ticker: string, params?: StockInsiderBuySellsQueryParams) {
  return await uwService.getStockInsiderBuySells(ticker, params);
}

/**
 * Récupère l'IV interpolée
 * GET /stock/{ticker}/interpolated-iv
 */
export async function getUWInterpolatedIV(ticker: string, params?: InterpolatedIVQueryParams) {
  return await uwService.getInterpolatedIV(ticker, params);
}

/**
 * Récupère l'IV rank
 * GET /stock/{ticker}/iv-rank
 */
export async function getUWIVRank(ticker: string, params?: IVRankQueryParams) {
  return await uwService.getIVRank(ticker, params);
}

/**
 * Récupère le max pain
 * GET /stock/{ticker}/max-pain
 */
export async function getUWMaxPain(ticker: string, params?: MaxPainQueryParams) {
  return await uwService.getMaxPain(ticker, params);
}

/**
 * Récupère les net premium ticks
 * GET /stock/{ticker}/net-prem-ticks
 */
export async function getUWNetPremiumTicks(ticker: string, params?: NetPremiumTicksQueryParams) {
  return await uwService.getNetPremiumTicks(ticker, params);
}

/**
 * Récupère le NOPE
 * GET /stock/{ticker}/nope
 */
export async function getUWNOPE(ticker: string, params?: NOPEQueryParams) {
  return await uwService.getNOPE(ticker, params);
}

/**
 * Récupère les données OHLC
 * GET /stock/{ticker}/ohlc/{candle_size}
 */
export async function getUWOHLC(ticker: string, candleSize: string, params?: OHLCQueryParams) {
  return await uwService.getOHLC(ticker, candleSize, params);
}

/**
 * Récupère les changements d'OI
 * GET /stock/{ticker}/oi-change
 */
export async function getUWStockOIChange(ticker: string, params?: StockOIChangeQueryParams) {
  return await uwService.getStockOIChange(ticker, params);
}

/**
 * Récupère l'OI par expiration
 * GET /stock/{ticker}/oi-per-expiry
 */
export async function getUWOIPerExpiry(ticker: string, params?: OIPerExpiryQueryParams) {
  return await uwService.getOIPerExpiry(ticker, params);
}

/**
 * Récupère l'OI par strike
 * GET /stock/{ticker}/oi-per-strike
 */
export async function getUWOIPerStrike(ticker: string, params?: OIPerStrikeQueryParams) {
  return await uwService.getOIPerStrike(ticker, params);
}

/**
 * Récupère les option chains
 * GET /stock/{ticker}/option-chains
 */
export async function getUWOptionChains(ticker: string, params?: OptionChainsQueryParams) {
  return await uwService.getOptionChains(ticker, params);
}

/**
 * Récupère les niveaux de prix stock pour les options
 * GET /stock/{ticker}/option/stock-price-levels
 */
export async function getUWOptionStockPriceLevels(ticker: string, params?: OptionStockPriceLevelsQueryParams) {
  return await uwService.getOptionStockPriceLevels(ticker, params);
}

/**
 * Récupère le volume et OI par expiration
 * GET /stock/{ticker}/option/volume-oi-expiry
 */
export async function getUWVolumeOIPerExpiry(ticker: string, params?: VolumeOIPerExpiryQueryParams) {
  return await uwService.getVolumeOIPerExpiry(ticker, params);
}

/**
 * Récupère le volume d'options
 * GET /stock/{ticker}/options-volume
 */
export async function getUWOptionsVolume(ticker: string, params?: OptionsVolumeQueryParams) {
  return await uwService.getOptionsVolume(ticker, params);
}

/**
 * Récupère les spot exposures
 * GET /stock/{ticker}/spot-exposures
 */
export async function getUWSpotExposures(ticker: string, params?: SpotExposuresQueryParams) {
  return await uwService.getSpotExposures(ticker, params);
}

/**
 * Récupère les spot exposures par strike et expiration
 * GET /stock/{ticker}/spot-exposures/expiry-strike
 */
export async function getUWSpotExposureByStrikeAndExpiry(ticker: string, params: SpotExposureByStrikeAndExpiryQueryParams) {
  return await uwService.getSpotExposureByStrikeAndExpiry(ticker, params);
}

/**
 * Récupère les spot exposures par strike
 * GET /stock/{ticker}/spot-exposures/strike
 */
export async function getUWSpotExposureByStrike(ticker: string, params?: SpotExposureByStrikeQueryParams) {
  return await uwService.getSpotExposureByStrike(ticker, params);
}

/**
 * Récupère l'état du stock
 * GET /stock/{ticker}/stock-state
 */
export async function getUWStockState(ticker: string, params?: StockStateQueryParams) {
  return await uwService.getStockState(ticker, params);
}

/**
 * Récupère les niveaux de prix volume stock
 * GET /stock/{ticker}/stock-volume-price-levels
 */
export async function getUWStockVolumePriceLevels(ticker: string, params?: StockVolumePriceLevelsQueryParams) {
  return await uwService.getStockVolumePriceLevels(ticker, params);
}

/**
 * Récupère la volatilité réalisée
 * GET /stock/{ticker}/volatility/realized
 */
export async function getUWRealizedVolatility(ticker: string, params?: RealizedVolatilityQueryParams) {
  return await uwService.getRealizedVolatility(ticker, params);
}

/**
 * Récupère les statistiques de volatilité
 * GET /stock/{ticker}/volatility/stats
 */
export async function getUWVolatilityStats(ticker: string, params?: VolatilityStatsQueryParams) {
  return await uwService.getVolatilityStats(ticker, params);
}

/**
 * Récupère la structure de terme de volatilité implicite
 * GET /stock/{ticker}/volatility/term-structure
 */
export async function getUWVolatilityTermStructure(ticker: string, params?: VolatilityTermStructureQueryParams) {
  return await uwService.getVolatilityTermStructure(ticker, params);
}

// ========== Shorts ==========

/**
 * Récupère les données de short
 * GET /shorts/{ticker}/data
 */
export async function getUWShortData(ticker: string, params?: ShortDataQueryParams) {
  return await uwService.getShortData(ticker, params);
}

/**
 * Récupère les failures to deliver
 * GET /shorts/{ticker}/ftds
 */
export async function getUWFailuresToDeliver(ticker: string, params?: FailuresToDeliverQueryParams) {
  return await uwService.getFailuresToDeliver(ticker, params);
}

/**
 * Récupère le short interest et float
 * GET /shorts/{ticker}/interest-float
 */
export async function getUWShortInterestAndFloat(ticker: string, params?: ShortInterestAndFloatQueryParams) {
  return await uwService.getShortInterestAndFloat(ticker, params);
}

/**
 * Récupère le volume de short et ratio
 * GET /shorts/{ticker}/volume-and-ratio
 */
export async function getUWShortVolumeAndRatio(ticker: string, params?: ShortVolumeAndRatioQueryParams) {
  return await uwService.getShortVolumeAndRatio(ticker, params);
}

/**
 * Récupère le volume de short par échange
 * GET /shorts/{ticker}/volumes-by-exchange
 */
export async function getUWShortVolumeByExchange(ticker: string, params?: ShortVolumeByExchangeQueryParams) {
  return await uwService.getShortVolumeByExchange(ticker, params);
}

// ========== Seasonality ==========

export async function getUWYearMonthPriceChange(ticker: string, params?: YearMonthPriceChangeQueryParams) {
  return await uwService.getYearMonthPriceChange(ticker, params);
}

export async function getUWMonthlyAverageReturn(ticker: string, params?: MonthlyAverageReturnQueryParams) {
  return await uwService.getMonthlyAverageReturn(ticker, params);
}

export async function getUWMonthPerformers(month: number, params?: MonthPerformersQueryParams) {
  return await uwService.getMonthPerformers(month, params);
}

export async function getUWMarketSeasonality(params?: MarketSeasonalityQueryParams) {
  return await uwService.getMarketSeasonality(params);
}

// ========== Screener ==========

export async function getUWAnalystRatings(params?: AnalystRatingQueryParams) {
  return await uwService.getAnalystRatings(params);
}

export async function getUWOptionContracts(params?: OptionContractsQueryParams) {
  return await uwService.getOptionContracts(params);
}

export async function getUWStockScreener(params?: StockScreenerQueryParams) {
  return await uwService.getStockScreener(params);
}

// ========== Option Trade ==========

export async function getUWOptionTradeFlowAlerts(params?: OptionTradeFlowAlertsQueryParams) {
  return await uwService.getOptionTradeFlowAlerts(params);
}

export async function getUWFullTape(date: string, params?: FullTapeQueryParams) {
  return await uwService.getFullTape(date, params);
}

// ========== Option Contract ==========

export async function getUWOptionContractFlow(id: string, params?: OptionContractFlowQueryParams) {
  return await uwService.getOptionContractFlow(id, params);
}

export async function getUWOptionContractHistoric(id: string, params?: OptionContractHistoricQueryParams) {
  return await uwService.getOptionContractHistoric(id, params);
}

export async function getUWOptionContractIntraday(id: string, params?: OptionContractIntradayQueryParams) {
  return await uwService.getOptionContractIntraday(id, params);
}

export async function getUWOptionContractVolumeProfile(id: string, params?: OptionContractVolumeProfileQueryParams) {
  return await uwService.getOptionContractVolumeProfile(id, params);
}

export async function getUWExpiryBreakdown(ticker: string, params?: ExpiryBreakdownQueryParams) {
  return await uwService.getExpiryBreakdown(ticker, params);
}

export async function getUWStockOptionContracts(ticker: string, params?: StockOptionContractsQueryParams) {
  return await uwService.getStockOptionContracts(ticker, params);
}

// ========== News ==========

export async function getUWNewsHeadlines(params?: NewsHeadlinesQueryParams) {
  return await uwService.getNewsHeadlines(params);
}

