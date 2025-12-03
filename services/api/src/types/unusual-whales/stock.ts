/**
 * Types pour les endpoints Unusual Whales - Stock
 * Basés sur la documentation officielle: https://api.unusualwhales.com/api
 */

import type { FinancialSector } from './earnings';

// ========== Enums ==========

/**
 * Type d'émission
 */
export type IssueType = 'Common Stock' | 'ETF' | 'Index' | 'ADR';

/**
 * Type d'option
 */
export type OptionType = 'call' | 'put';

/**
 * Temps d'annonce des résultats
 */
export type AnnounceTime = 'unknown' | 'afterhours' | 'premarket';

/**
 * Temps de marché
 */
export type MarketTime = 'regular' | 'premarket' | 'postmarket' | 'r' | 'pr' | 'po';

/**
 * Taille de bougie OHLC
 */
export type CandleSize = '1m' | '5m' | '10m' | '15m' | '30m' | '1h' | '4h' | '1d';

/**
 * Filtre pour flow-per-strike-intraday
 */
export type FlowFilter = 'NetPremium' | 'Volume' | 'Trades';

/**
 * Direction de tri
 */
export type OrderDirection = 'desc' | 'asc';

/**
 * Côté d'une transaction
 */
export type TradeSide = 'ALL' | 'ASK' | 'BID' | 'MID';

// ========== Companies in Sector ==========

/**
 * Réponse de l'endpoint GET /stock/{sector}/tickers
 */
export interface SectorTickersResponse {
  data: string[]; // Ex: ["AMD", "INTC", "NVDA"]
}

/**
 * Paramètres de requête pour GET /stock/{sector}/tickers
 */
export interface SectorTickersQueryParams {
  /** Secteur financier (requis) */
  sector: FinancialSector;
}

// ========== ATM Chains ==========

/**
 * Chaîne ATM pour une expiration donnée
 * GET /stock/{ticker}/atm-chains
 */
export interface ATMChain {
  /** Volume côté ask */
  ask_side_volume: number; // Ex: 119403
  /** Prix moyen pondéré par volume */
  avg_price: string; // Ex: "1.0465802437910297887119234370"
  /** Volume côté bid */
  bid_side_volume: number; // Ex: 122789
  /** Prix de clôture du contrat le jour de trading précédent */
  chain_prev_close: string; // Ex: "1.29"
  /** Dernier fill sur le contrat */
  close: string; // Ex: "0.03"
  /** Volume cross (transactions avec code cross) */
  cross_volume: number; // Ex: 0
  /** Temps de publication des résultats */
  er_time: AnnounceTime; // Ex: "premarket"
  /** Volume floor (transactions avec code floor) */
  floor_volume: number; // Ex: 142
  /** Plus haut fill sur ce contrat */
  high: string; // Ex: "2.95"
  /** Dernière fois qu'il y a eu une transaction pour le contrat donné (timestamp UTC) */
  last_fill: string; // ISO timestamp: "2023-09-08T17:45:32Z"
  /** Plus bas fill sur ce contrat */
  low: string; // Ex: "0.02"
  /** Volume au milieu de l'ask et du bid */
  mid_volume: number; // Ex: 22707
  /** Volume multileg (spreads/rolls/condors/butterflies) */
  multileg_volume: number; // Ex: 7486
  /** Prochaine date de résultats du ticker. Null si inconnue ou si le ticker n'a pas de résultats (ETF) */
  next_earnings_date: string | null; // ISO date: "2023-10-26"
  /** Volume sans côté identifiable (late, out of sequence, cross) */
  no_side_volume: number; // Ex: 0
  /** Premier fill sur ce contrat */
  open: string; // Ex: "0.92"
  /** Open interest pour le contrat */
  open_interest: number; // Ex: 18680
  /** Symbole d'option du contrat */
  option_symbol: string; // Ex: "TSLA230908C00255000"
  /** Prime totale d'option */
  premium: string; // Ex: "27723806.00"
  /** Secteur financier du ticker */
  sector: FinancialSector | string; // Ex: "Technology"
  /** Volume de transaction stock et possiblement d'autres contrats d'option */
  stock_multi_leg_volume: number; // Ex: 52
  /** Prix de clôture du stock du ticker */
  stock_price: string; // Ex: "182.91"
  /** Volume sweep (transactions avec code sweep) */
  sweep_volume: number; // Ex: 18260
  /** Volume total d'options pour le ticker donné */
  ticker_vol: number; // Ex: 2546773
  /** Nombre total de changements du NBBO ask pendant la session de trading */
  total_ask_changes: number; // Ex: 165
  /** Nombre total de changements du NBBO bid pendant la session de trading */
  total_bid_changes: number; // Ex: 28
  /** Nombre de transactions pour ce contrat */
  trades: number; // Ex: 39690
  /** Volume du contrat */
  volume: number; // Ex: 264899
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/atm-chains
 */
export interface ATMChainsResponse {
  data: ATMChain[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/atm-chains
 */
export interface ATMChainsQueryParams {
  /** Tableau de 1 ou plusieurs dates d'expiration (requis) */
  expirations: string[]; // Ex: ["2024-02-02", "2024-01-26"]
}

// ========== Flow Alerts (Deprecated) ==========

/**
 * Flow Alert (déprécié)
 * GET /stock/{ticker}/flow-alerts
 */
export interface FlowAlert {
  /** Nom de la règle d'alerte */
  alert_rule: string; // Ex: "RepeatedHits"
  /** Tous les trades d'ouverture */
  all_opening_trades: boolean; // Ex: false
  /** Timestamp UTC */
  created_at: string; // ISO timestamp: "2023-12-12T16:35:52.168490Z"
  /** Date d'expiration du contrat (format ISO) */
  expiry: string; // ISO date: "2023-12-22"
  /** Nombre d'expirations appartenant au trade (multileg si > 1) */
  expiry_count: number; // Ex: 2
  /** A un floor */
  has_floor: boolean; // Ex: false
  /** Si le trade est multileg */
  has_multileg: boolean; // Ex: false
  /** Si le trade est singleleg */
  has_singleleg: boolean; // Ex: true
  /** Si le trade est un sweep */
  has_sweep: boolean; // Ex: true
  /** Type d'émission du ticker */
  issue_type: IssueType; // Ex: "Common Stock"
  /** Open interest */
  open_interest: any;
  /** Symbole d'option du contrat */
  option_chain: string; // Ex: "MSFT231222C00375000"
  /** Prix */
  price: any;
  /** Strike du contrat */
  strike: string; // Ex: "375"
  /** Ticker */
  ticker: any;
  /** Prime totale côté ask */
  total_ask_side_prem: any;
  /** Prime totale côté bid */
  total_bid_side_prem: any;
  /** Prime totale */
  total_premium: any;
  /** Taille totale */
  total_size: any;
  /** Nombre de trades */
  trade_count: any;
  /** Type de contrat */
  type: OptionType; // Ex: "call"
  /** Prix sous-jacent */
  underlying_price: any;
  /** Volume */
  volume: any;
  /** Ratio volume/OI */
  volume_oi_ratio: any;
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/flow-alerts
 */
export interface FlowAlertsResponse {
  data: FlowAlert[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/flow-alerts
 */
export interface FlowAlertsQueryParams {
  /** Flag booléen si une transaction est côté ask (défaut: true) */
  is_ask_side?: boolean; // Default: true
  /** Flag booléen si une transaction est côté bid (défaut: true) */
  is_bid_side?: boolean; // Default: true
  /** Nombre d'éléments à retourner (1-200, défaut: 100) */
  limit?: number; // Min: 1, Max: 200, Default: 100
}

// ========== Flow per Expiry ==========

/**
 * Flow par expiration
 * GET /stock/{ticker}/flow-per-expiry
 */
export interface FlowPerExpiry {
  /** Prime totale des transactions call OTM */
  call_otm_premium: string; // Ex: "9908777.0"
  /** Nombre de transactions call OTM */
  call_otm_trades: number; // Ex: 6338
  /** Volume total des transactions call OTM */
  call_otm_volume: number; // Ex: 40385
  /** Prime totale des transactions call */
  call_premium: string; // Ex: "9908777.0"
  /** Prime totale des transactions call côté ask */
  call_premium_ask_side: string; // Ex: "5037703.0"
  /** Prime totale des transactions call côté bid */
  call_premium_bid_side: string; // Ex: "4055973.0"
  /** Nombre de transactions call */
  call_trades: number; // Ex: 6338
  /** Volume total des transactions call */
  call_volume: number; // Ex: 990943
  /** Volume total des transactions call côté ask */
  call_volume_ask_side: number; // Ex: 417251
  /** Volume total des transactions call côté bid */
  call_volume_bid_side: number; // Ex: 498271
  /** Date de trading (format ISO) */
  date: string; // ISO date: "2023-09-08"
  /** Date d'expiration du contrat (format ISO) */
  expiry: string; // ISO date: "2023-12-22"
  /** Prime totale des transactions put OTM */
  put_otm_premium: string; // Ex: "1204570.0"
  /** Nombre de transactions put OTM */
  put_otm_trades: number; // Ex: 4270
  /** Volume total des transactions put OTM */
  put_otm_volume: number; // Ex: 12638
  /** Prime totale des transactions put */
  put_premium: string; // Ex: "163537151"
  /** Prime totale des transactions put côté ask */
  put_premium_ask_side: string; // Ex: "799873.0"
  /** Prime totale des transactions put côté bid */
  put_premium_bid_side: string; // Ex: "4055973.0"
  /** Nombre de transactions put */
  put_trades: number; // Ex: 841
  /** Volume total des transactions put */
  put_volume: number; // Ex: 808326
  /** Volume total des transactions put côté ask */
  put_volume_ask_side: number; // Ex: 431791
  /** Volume total des transactions put côté bid */
  put_volume_bid_side: number; // Ex: 314160
  /** Ticker du stock */
  ticker: string; // Ex: "AAPL"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/flow-per-expiry
 */
export interface FlowPerExpiryResponse {
  data: FlowPerExpiry[];
  date: string; // ISO date: "2024-01-22"
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/flow-per-expiry
 */
export interface FlowPerExpiryQueryParams {
  /** Aucun paramètre selon la documentation */
}

// ========== Flow per Strike ==========

/**
 * Flow par strike
 * GET /stock/{ticker}/flow-per-strike
 */
export interface FlowPerStrike {
  /** Prime totale des transactions call */
  call_premium: string; // Ex: "9908777.0"
  /** Prime totale des transactions call côté ask */
  call_premium_ask_side: string; // Ex: "5037703.0"
  /** Prime totale des transactions call côté bid */
  call_premium_bid_side: string; // Ex: "4055973.0"
  /** Nombre de transactions call */
  call_trades: number; // Ex: 6338
  /** Volume total des transactions call */
  call_volume: number; // Ex: 990943
  /** Volume total des transactions call côté ask */
  call_volume_ask_side: number; // Ex: 417251
  /** Volume total des transactions call côté bid */
  call_volume_bid_side: number; // Ex: 498271
  /** Date de trading (format ISO) */
  date: string; // ISO date: "2023-09-08"
  /** Prime totale des transactions put */
  put_premium: string; // Ex: "163537151"
  /** Prime totale des transactions put côté ask */
  put_premium_ask_side: string; // Ex: "799873.0"
  /** Prime totale des transactions put côté bid */
  put_premium_bid_side: string; // Ex: "4055973.0"
  /** Nombre de transactions put */
  put_trades: number; // Ex: 841
  /** Volume total des transactions put */
  put_volume: number; // Ex: 808326
  /** Volume total des transactions put côté ask */
  put_volume_ask_side: number; // Ex: 431791
  /** Volume total des transactions put côté bid */
  put_volume_bid_side: number; // Ex: 314160
  /** Strike du contrat */
  strike: string; // Ex: "375"
  /** Ticker du stock */
  ticker: string; // Ex: "AAPL"
  /** Timestamp UTC */
  timestamp: string; // ISO timestamp: "2023-12-12T16:35:52.168490Z"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/flow-per-strike
 */
export type FlowPerStrikeResponse = FlowPerStrike[];

/**
 * Paramètres de requête pour GET /stock/{ticker}/flow-per-strike
 */
export interface FlowPerStrikeQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== Flow per Strike Intraday ==========

/**
 * Flow par strike intraday (même structure que FlowPerStrike)
 * GET /stock/{ticker}/flow-per-strike-intraday
 */
export type FlowPerStrikeIntraday = FlowPerStrike;

/**
 * Réponse de l'endpoint GET /stock/{ticker}/flow-per-strike-intraday
 */
export type FlowPerStrikeIntradayResponse = FlowPerStrikeIntraday[];

/**
 * Paramètres de requête pour GET /stock/{ticker}/flow-per-strike-intraday
 */
export interface FlowPerStrikeIntradayQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
  /** Récupérer les strikes avec le paramètre de filtre le plus élevé */
  filter?: FlowFilter; // Default: "NetPremium"
}

// ========== Recent Flows ==========

/**
 * Flow récent (même structure que FlowPerExpiry)
 * GET /stock/{ticker}/flow-recent
 */
export type RecentFlow = FlowPerExpiry;

/**
 * Réponse de l'endpoint GET /stock/{ticker}/flow-recent
 */
export interface RecentFlowsResponse {
  data: RecentFlow[];
  date: string; // ISO date: "2024-01-22"
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/flow-recent
 */
export interface RecentFlowsQueryParams {
  /** Prime minimum (>= 0, défaut: 0) */
  min_premium?: number; // Default: 0
  /** Côté d'une transaction stock (ALL, ASK, BID, MID, défaut: ALL) */
  side?: TradeSide; // Default: "ALL"
}

// ========== Greek Exposure ==========

/**
 * Exposition grecque
 * GET /stock/{ticker}/greek-exposure
 */
export interface GreekExposure {
  /** Charm call (somme des valeurs charm * OI * 100) */
  call_charm: string; // Ex: "102382359.5786"
  /** Delta call (somme des valeurs delta * OI * 100) */
  call_delta: string; // Ex: "227549667.4651"
  /** Gamma call (somme des valeurs gamma * OI * 100) */
  call_gamma: string; // Ex: "9356683.4241"
  /** Vanna call (somme des valeurs vanna * OI * 100) */
  call_vanna: string; // Ex: "152099632406.9564"
  /** Date (format ISO) */
  date: string; // ISO date: "2023-09-08"
  /** Charm put (somme des valeurs charm * OI * 100) */
  put_charm: string; // Ex: "-943028472.4815"
  /** Delta put (somme des valeurs delta * OI * 100) */
  put_delta: string; // Ex: "-191893077.7193"
  /** Gamma put (somme des valeurs gamma * OI * 100) */
  put_gamma: string; // Ex: "-12337386.0524"
  /** Vanna put (somme des valeurs vanna * OI * 100) */
  put_vanna: string; // Ex: "488921784213.1121"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/greek-exposure
 */
export interface GreekExposureResponse {
  data: GreekExposure[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/greek-exposure
 */
export interface GreekExposureQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
  /** Timeframe des données (YTD, 1D, 2D, 1W, 2W, 1M, 2M, 1Y, 2Y, etc., défaut: 1Y) */
  timeframe?: string; // Default: "1Y"
}

// ========== Greek Exposure By Expiry ==========

/**
 * Exposition grecque par expiration
 * GET /stock/{ticker}/greek-exposure/expiry
 */
export interface GreekExposureByExpiry extends GreekExposure {
  /** Date d'expiration du contrat d'option (format ISO) */
  expiry: string; // ISO date: "2022-05-30"
  /** Nombre de jours jusqu'à l'expiration */
  dte?: number; // Ex: 5
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/greek-exposure/expiry
 */
export interface GreekExposureByExpiryResponse {
  data: GreekExposureByExpiry[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/greek-exposure/expiry
 */
export interface GreekExposureByExpiryQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== Greek Exposure By Strike ==========

/**
 * Exposition grecque par strike
 * GET /stock/{ticker}/greek-exposure/strike
 */
export interface GreekExposureByStrike extends GreekExposure {
  /** Prix de strike du contrat d'option */
  strike: string; // Ex: "150.0"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/greek-exposure/strike
 */
export interface GreekExposureByStrikeResponse {
  data: GreekExposureByStrike[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/greek-exposure/strike
 */
export interface GreekExposureByStrikeQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== Greek Exposure By Strike And Expiry ==========

/**
 * Exposition grecque par strike et expiration
 * GET /stock/{ticker}/greek-exposure/strike-expiry
 */
export interface GreekExposureByStrikeAndExpiry extends GreekExposure {
  /** Date d'expiration du contrat d'option (format ISO) */
  expiry: string; // ISO date: "2022-05-30"
  /** Prix de strike du contrat d'option */
  strike: string; // Ex: "150.0"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/greek-exposure/strike-expiry
 */
export interface GreekExposureByStrikeAndExpiryResponse {
  data: GreekExposureByStrikeAndExpiry[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/greek-exposure/strike-expiry
 */
export interface GreekExposureByStrikeAndExpiryQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
  /** Date d'expiration unique (format ISO, requis) */
  expiry: string; // ISO date: "2024-02-02"
}

// ========== Greek Flow ==========

/**
 * Greek flow
 * GET /stock/{ticker}/greek-flow
 */
export interface GreekFlow {
  /** Flow delta directionnel */
  dir_delta_flow: string; // Ex: "-43593.96"
  /** Flow vega directionnel */
  dir_vega_flow: string; // Ex: "31243.04"
  /** Flow delta directionnel OTM */
  otm_dir_delta_flow: string; // Ex: "14947.51"
  /** Flow vega directionnel OTM */
  otm_dir_vega_flow: string; // Ex: "11421.03"
  /** Flow delta total OTM */
  otm_total_delta_flow: string; // Ex: "-28564.02"
  /** Flow vega total OTM */
  otm_total_vega_flow: string; // Ex: "101745.64"
  /** Ticker du stock */
  ticker: string; // Ex: "AAPL"
  /** Timestamp (début de minute) des données */
  timestamp: string; // ISO timestamp: "2024-10-28T18:46:00Z"
  /** Flow delta total */
  total_delta_flow: string; // Ex: "-21257.36"
  /** Flow vega total */
  total_vega_flow: string; // Ex: "350944.58"
  /** Nombre de transactions */
  transactions: number; // Ex: 1188
  /** Volume total d'options */
  volume: number; // Ex: 12348
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/greek-flow
 */
export interface GreekFlowResponse {
  data: GreekFlow[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/greek-flow
 */
export interface GreekFlowQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== Greek Flow By Expiry ==========

/**
 * Greek flow par expiration
 * GET /stock/{ticker}/greek-flow/{expiry}
 */
export interface GreekFlowByExpiry extends GreekFlow {
  /** Date d'expiration du contrat (format ISO) */
  expiry: string; // ISO date: "2023-12-22"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/greek-flow/{expiry}
 */
export interface GreekFlowByExpiryResponse {
  data: GreekFlowByExpiry[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/greek-flow/{expiry}
 */
export interface GreekFlowByExpiryQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== Greeks ==========

/**
 * Greeks pour chaque strike pour une date d'expiration unique
 * GET /stock/{ticker}/greeks
 */
export interface Greeks {
  /** Charm call */
  call_charm: string; // Ex: "9.2"
  /** Delta de l'option call */
  call_delta: string; // Ex: "0.610546281537814"
  /** Gamma de l'option call */
  call_gamma: string; // Ex: "0.00775013889662635"
  /** Rho de l'option call */
  call_rho: string; // Ex: "0.2316546330093438"
  /** Theta de l'option call */
  call_theta: string; // Ex: "-0.0640155364004474"
  /** Vanna call */
  call_vanna: string; // Ex: "-0.9"
  /** Vega de l'option call */
  call_vega: string; // Ex: "0.3140468475903719"
  /** Volatilité implicite de l'option call */
  call_volatility: string; // Ex: "0.604347250962543"
  /** Date (format ISO) */
  date: string; // ISO date: "2024-01-09"
  /** Expiration (format ISO) */
  expiry: string; // ISO date: "2024-01-09"
  /** Charm put */
  put_charm: string; // Ex: "9.2"
  /** Delta de l'option put */
  put_delta: string; // Ex: "0.610546281537814"
  /** Gamma de l'option put */
  put_gamma: string; // Ex: "0.00775013889662635"
  /** Rho de l'option put */
  put_rho: string; // Ex: "0.2316546330093438"
  /** Theta de l'option put */
  put_theta: string; // Ex: "-0.0640155364004474"
  /** Vanna put */
  put_vanna: string; // Ex: "-0.9"
  /** Vega de l'option put */
  put_vega: string; // Ex: "0.3140468475903719"
  /** Volatilité implicite de l'option put */
  put_volatility: string; // Ex: "0.604347250962543"
  /** Prix de strike du contrat d'option */
  strike: string; // Ex: "150.0"
  /** Symbole d'option call (optionnel) */
  call_option_symbol?: string; // Ex: "SPY240105C00480000"
  /** Symbole d'option put (optionnel) */
  put_option_symbol?: string; // Ex: "SPY240105P00480000"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/greeks
 */
export interface GreeksResponse {
  data: Greeks[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/greeks
 */
export interface GreeksQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
  /** Date d'expiration unique (format ISO, requis) */
  expiry: string; // ISO date: "2024-02-02"
}

// ========== Historical Risk Reversal Skew ==========

/**
 * Historical Risk Reversal Skew
 * GET /stock/{ticker}/historical-risk-reversal-skew
 */
export interface HistoricalRiskReversalSkew {
  /** Date (format ISO) */
  date: string; // ISO date: "2024-01-09"
  /** Delta */
  delta: number; // Ex: 10
  /** Différence entre l'IV d'un put et d'un call avec des deltas absolus similaires */
  risk_reversal: string; // Ex: "-0.021"
  /** Ticker du stock */
  ticker: string; // Ex: "AAPL"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/historical-risk-reversal-skew
 */
export interface HistoricalRiskReversalSkewResponse {
  data: HistoricalRiskReversalSkew[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/historical-risk-reversal-skew
 */
export interface HistoricalRiskReversalSkewQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
  /** Timeframe des données (YTD, 1D, 2D, 1W, 2W, 1M, 2M, 1Y, 2Y, etc., défaut: 1Y) */
  timeframe?: string; // Default: "1Y"
  /** Delta de l'option (requis) */
  delta: string; // Ex: "0.610546281537814"
  /** Date d'expiration unique (format ISO, requis) */
  expiry: string; // ISO date: "2024-02-02"
}

// ========== Information ==========

/**
 * Informations sur un ticker
 * GET /stock/{ticker}/info
 */
export interface StockInfo {
  /** Temps d'annonce des résultats */
  announce_time: AnnounceTime; // Ex: "premarket"
  /** Volume moyen du stock sur les 30 derniers jours */
  avg30_volume: string; // Ex: "55973002"
  /** Nom complet du ticker */
  full_name: string; // Ex: "APPLE"
  /** Flag booléen si la société paie des dividendes */
  has_dividend: boolean; // Ex: true
  /** Flag booléen si des données de résultats historiques sont présentes */
  has_earnings_history: boolean; // Ex: true
  /** Flag booléen si le stock donné détient des stocks d'autres sociétés */
  has_investment_arm: boolean; // Ex: true
  /** Flag booléen si la société a des options */
  has_options: boolean; // Ex: true
  /** Type d'émission du ticker */
  issue_type: IssueType; // Ex: "Common Stock"
  /** Lien vers un logo */
  logo?: string; // Ex: "https://..."
  /** Marketcap du ticker sous-jacent. Si le type d'émission est ETF, alors le marketcap représente l'AUM */
  marketcap: string; // Ex: "2965813810400"
  /** Taille du marketcap (optionnel) */
  marketcap_size?: string; // Ex: "big"
  /** Prochaine date de résultats du ticker. Null si inconnue ou si le ticker n'a pas de résultats (ETF) */
  next_earnings_date: string | null; // ISO date: "2023-10-26"
  /** Secteur financier du ticker */
  sector: FinancialSector | string; // Ex: "Technology"
  /** Description courte de ce que fait le stock */
  short_description: string; // Ex: "Apple Inc. is an American multinational technology company..."
  /** Symbole du ticker */
  symbol: string; // Ex: "AAPL"
  /** Tags UW (optionnel) */
  uw_tags?: string[]; // Ex: []
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/info
 */
export interface StockInfoResponse {
  data: StockInfo;
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/info
 */
export interface StockInfoQueryParams {
  /** Aucun paramètre selon la documentation */
}

// ========== Insider Buy & Sells ==========

/**
 * Insider buy & sells
 * GET /stock/{ticker}/insider-buy-sells
 */
export interface InsiderBuySell {
  /** Date de dépôt (format ISO) */
  filing_date: string; // ISO date: "2023-12-13"
  /** Nombre de transactions d'achat */
  purchases: number; // Ex: 12
  /** Valeur notionnelle totale des transactions d'achat */
  purchases_notional: string; // Ex: "14317122.490"
  /** Nombre de transactions de vente */
  sells: number; // Ex: 10
  /** Valeur notionnelle totale des transactions de vente */
  sells_notional: string; // Ex: "-1291692.4942"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/insider-buy-sells
 */
export interface InsiderBuySellsResponse {
  data: InsiderBuySell[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/insider-buy-sells
 */
export interface InsiderBuySellsQueryParams {
  /** Aucun paramètre selon la documentation */
}

// ========== Interpolated IV ==========

/**
 * IV interpolée
 * GET /stock/{ticker}/interpolated-iv
 */
export interface InterpolatedIV {
  /** Date (format ISO) */
  date: string; // ISO date: "2023-09-08"
  /** Nombre de jours jusqu'à l'expiration */
  days: number; // Ex: 30
  /** Mouvement attendu en pourcentage du prix actuel */
  implied_move_perc: string; // Ex: "0.058"
  /** Percentile de cette valeur de volatilité sur une période de 1 an */
  percentile: string; // Ex: "77.193"
  /** Valeur de volatilité implicite interpolée */
  volatility: string; // Ex: "0.299"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/interpolated-iv
 */
export interface InterpolatedIVResponse {
  data: InterpolatedIV[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/interpolated-iv
 */
export interface InterpolatedIVQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== IV Rank ==========

/**
 * IV Rank
 * GET /stock/{ticker}/iv-rank
 */
export interface IVRank {
  /** Prix de clôture du stock du ticker */
  close: string; // Ex: "182.91"
  /** Date (format ISO) */
  date: string; // ISO date: "2023-09-08"
  /** Valeur IV rank, qui représente où se situe la volatilité implicite actuelle par rapport à sa plage historique */
  iv_rank_1y: string; // Ex: "0.65"
  /** Timestamp UTC */
  updated_at: string; // ISO timestamp: "2023-12-12T16:35:52.168490Z"
  /** Valeur de volatilité implicite */
  volatility: string; // Ex: "0.25"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/iv-rank
 */
export interface IVRankResponse {
  data: IVRank[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/iv-rank
 */
export interface IVRankQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
  /** Timespan optionnel (1y, 6m, 3m, 1m, 1w ou date ISO) */
  timespan?: string; // Ex: "1y"
}

// ========== Max Pain ==========

/**
 * Max Pain
 * GET /stock/{ticker}/max-pain
 */
export interface MaxPain {
  /** Date d'expiration du contrat (format ISO) */
  expiry: string; // ISO date: "2023-12-22"
  /** Max pain pour l'expiration donnée */
  max_pain: string; // Ex: "472"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/max-pain
 */
export interface MaxPainResponse {
  data: MaxPain[];
  date: string; // ISO date: "2024-03-04"
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/max-pain
 */
export interface MaxPainQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== Net Premium Ticks ==========

/**
 * Net Premium Ticks
 * GET /stock/{ticker}/net-prem-ticks
 */
export interface NetPremiumTick {
  /** Volume total des transactions call */
  call_volume: number; // Ex: 990943
  /** Volume total des transactions call côté ask */
  call_volume_ask_side: number; // Ex: 417251
  /** Volume total des transactions call côté bid */
  call_volume_bid_side: number; // Ex: 498271
  /** Date (format ISO) */
  date: string; // ISO date: "2023-09-08"
  /** Défini comme (prime call côté ask) - (prime call côté bid) */
  net_call_premium: string; // Ex: "-29138464"
  /** Défini comme (volume call côté ask) - (volume call côté bid) */
  net_call_volume: number; // Ex: 1049
  /** Net delta */
  net_delta: string; // Ex: "26294.85"
  /** Défini comme (prime put côté ask) - (prime put côté bid) */
  net_put_premium: string; // Ex: "23924325"
  /** Défini comme (volume put côté ask) - (volume put côté bid) */
  net_put_volume: number; // Ex: 1313
  /** Volume total des transactions put */
  put_volume: number; // Ex: 808326
  /** Volume total des transactions put côté ask */
  put_volume_ask_side: number; // Ex: 431791
  /** Volume total des transactions put côté bid */
  put_volume_bid_side: number; // Ex: 314160
  /** Temps de début du tick (timestamp avec timezone) */
  tape_time: string; // ISO timestamp: "2023-09-07T09:30:00-04:00"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/net-prem-ticks
 */
export interface NetPremiumTicksResponse {
  data: NetPremiumTick[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/net-prem-ticks
 */
export interface NetPremiumTicksQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== NOPE ==========

/**
 * NOPE (Net Options Pricing Effect)
 * GET /stock/{ticker}/nope
 */
export interface NOPE {
  /** Delta call total (volume * delta) */
  call_delta: number; // Ex: -21257.36
  /** Delta call fill total (taille * delta au moment de la transaction) */
  call_fill_delta: number; // Ex: -21257.36
  /** Volume call cumulatif total */
  call_vol: number; // Ex: 12348
  /** Valeur NOPE basée sur call_delta & put_delta */
  nope: number; // Ex: -0.000648
  /** Valeur NOPE basée sur call_fill_delta & put_fill_delta */
  nope_fill: number; // Ex: -0.000434
  /** Delta put total (volume * delta) */
  put_delta: number; // Ex: -43593.96
  /** Delta put fill total (taille * delta au moment de la transaction) */
  put_fill_delta: number; // Ex: -43593.96
  /** Volume put cumulatif total */
  put_vol: number; // Ex: 12348
  /** Volume stock cumulatif total */
  stock_vol: number; // Ex: 12348
  /** Timestamp (début de minute) des données */
  timestamp: string; // ISO timestamp: "2024-10-28T18:46:00Z"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/nope
 */
export interface NOPEResponse {
  data: NOPE[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/nope
 */
export interface NOPEQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== OHLC ==========

/**
 * Données de bougie OHLC
 * GET /stock/{ticker}/ohlc/{candle_size}
 */
export interface OHLC {
  /** Prix de clôture de la bougie */
  close: string; // Ex: "56.79"
  /** Temps de fin de la bougie (timestamp UTC) */
  end_time?: string; // ISO timestamp: "2023-09-07T20:07:00Z"
  /** Prix le plus haut de la bougie */
  high: string; // Ex: "58.12"
  /** Prix le plus bas de la bougie */
  low: string; // Ex: "51.90"
  /** Temps de marché */
  market_time: MarketTime; // Ex: "pr"
  /** Prix d'ouverture de la bougie */
  open: string; // Ex: "54.29"
  /** Temps de début de la bougie (timestamp UTC) */
  start_time?: string; // ISO timestamp: "2023-09-07T20:06:00Z"
  /** Volume total du ticker pour le jour de trading complet jusqu'à présent */
  total_volume: number; // Ex: 13744676
  /** Volume de la bougie */
  volume: number; // Ex: 10699
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/ohlc/{candle_size}
 */
export interface OHLCResponse {
  data: OHLC[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/ohlc/{candle_size}
 */
export interface OHLCQueryParams {
  /** Date de trading au format YYYY-MM-DD */
  date?: string; // ISO date: "2024-01-18"
  /** Date de fin au format YYYY-MM-DD */
  end_date?: string; // ISO date: "2024-01-18"
  /** Nombre d'éléments à retourner (1-2500) */
  limit?: number; // Min: 1, Max: 2500
  /** Timeframe des données (YTD, 1D, 2D, 1W, 2W, 1M, 2M, 1Y, 2Y, etc., défaut: 1Y) */
  timeframe?: string; // Default: "1Y"
}

// ========== OI Change ==========

/**
 * Changement d'OI
 * GET /stock/{ticker}/oi-change
 */
export interface OIChange {
  /** Prix moyen */
  avg_price: any;
  /** Date actuelle */
  curr_date: string; // ISO date: "2024-01-09"
  /** OI actuel */
  curr_oi: any;
  /** Dernier ask */
  last_ask: any;
  /** Dernier bid */
  last_bid: any;
  /** Dernière date */
  last_date: string; // ISO date: "2024-01-09"
  /** Dernier fill */
  last_fill: any;
  /** Dernier OI */
  last_oi: any;
  /** Changement d'OI */
  oi_change: any;
  /** Différence d'OI plain */
  oi_diff_plain: any;
  /** Symbole d'option du contrat */
  option_symbol: string; // Ex: "MSFT240315C00350000"
  /** Pourcentage du total */
  percentage_of_total: any;
  /** Volume ask précédent */
  prev_ask_volume: any;
  /** Volume bid précédent */
  prev_bid_volume: any;
  /** Volume mid précédent */
  prev_mid_volume: any;
  /** Volume multileg précédent */
  prev_multi_leg_volume: any;
  /** Volume neutre précédent */
  prev_neutral_volume: any;
  /** Volume stock multileg précédent */
  prev_stock_multi_leg_volume: any;
  /** Prime totale précédente */
  prev_total_premium: any;
  /** Rang */
  rnk: any;
  /** Trades */
  trades: any;
  /** Symbole sous-jacent */
  underlying_symbol: any;
  /** Volume */
  volume: any;
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/oi-change
 */
export interface OIChangeResponse {
  data: OIChange[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/oi-change
 */
export interface OIChangeQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
  /** Nombre d'éléments à retourner (>= 1) */
  limit?: number; // Min: 1
  /** Trier décroissant ou croissant (défaut: desc) */
  order?: OrderDirection; // Default: "desc"
  /** Numéro de page (utiliser avec limit). Commence à la page 0 */
  page?: number; // Ex: 1
}

// ========== OI per Expiry ==========

/**
 * OI par expiration
 * GET /stock/{ticker}/oi-per-expiry
 */
export interface OIPerExpiry {
  /** OI call total */
  call_oi: number; // Ex: 3994750
  /** Date (format ISO) */
  date: string; // ISO date: "2023-09-08"
  /** Date d'expiration du contrat (format ISO) */
  expiry: string; // ISO date: "2023-12-22"
  /** OI put total */
  put_oi: number; // Ex: 3679410
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/oi-per-expiry
 */
export interface OIPerExpiryResponse {
  data: OIPerExpiry[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/oi-per-expiry
 */
export interface OIPerExpiryQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== OI per Strike ==========

/**
 * OI par strike
 * GET /stock/{ticker}/oi-per-strike
 */
export interface OIPerStrike {
  /** OI call total */
  call_oi: number; // Ex: 3994750
  /** Date (format ISO) */
  date: string; // ISO date: "2023-09-08"
  /** OI put total */
  put_oi: number; // Ex: 3679410
  /** Strike du contrat */
  strike: string; // Ex: "375"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/oi-per-strike
 */
export interface OIPerStrikeResponse {
  data: OIPerStrike[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/oi-per-strike
 */
export interface OIPerStrikeQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== Option Chains ==========

/**
 * Réponse de l'endpoint GET /stock/{ticker}/option-chains
 */
export interface OptionChainsResponse {
  data: string[]; // Ex: ["AAPL230908C00175000", "AAPL231020C00185000"]
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/option-chains
 */
export interface OptionChainsQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== Option Stock Price Levels ==========

/**
 * Volume call et put par niveau de prix
 * GET /stock/{ticker}/option/stock-price-levels
 */
export interface OptionStockPriceLevel {
  /** Volume total des transactions call */
  call_volume: number; // Ex: 990943
  /** Niveau de prix */
  price: string; // Ex: "120.12"
  /** Volume total des transactions put */
  put_volume: number; // Ex: 808326
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/option/stock-price-levels
 */
export interface OptionStockPriceLevelsResponse {
  data: OptionStockPriceLevel[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/option/stock-price-levels
 */
export interface OptionStockPriceLevelsQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== Volume & OI per Expiry ==========

/**
 * Volume et OI par expiration
 * GET /stock/{ticker}/option/volume-oi-expiry
 */
export interface VolumeOIPerExpiry {
  /** Expiration d'un cycle d'options (format ISO) */
  expires: string; // ISO date: "2023-09-08"
  /** Somme de l'open interest pour tous les contrats */
  oi: number; // Ex: 451630
  /** Somme du volume pour tous les contrats */
  volume: number; // Ex: 962332
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/option/volume-oi-expiry
 */
export interface VolumeOIPerExpiryResponse {
  data: VolumeOIPerExpiry[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/option/volume-oi-expiry
 */
export interface VolumeOIPerExpiryQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== Options Volume ==========

/**
 * Volume et prime d'options
 * GET /stock/{ticker}/options-volume
 */
export interface OptionsVolume {
  /** Volume call moyen sur 30 jours */
  avg_30_day_call_volume: string; // Ex: "679430.000000000000"
  /** Volume put moyen sur 30 jours */
  avg_30_day_put_volume: string; // Ex: "401961.285714285714"
  /** Volume call moyen sur 3 jours */
  avg_3_day_call_volume: string; // Ex: "606258.533333333333"
  /** Volume put moyen sur 3 jours */
  avg_3_day_put_volume: string; // Ex: "436126.833333333333"
  /** Volume call moyen sur 7 jours */
  avg_7_day_call_volume: string; // Ex: "679145.333333333333"
  /** Volume put moyen sur 7 jours */
  avg_7_day_put_volume: string; // Ex: "388676.000000000000"
  /** Prime bearish (prime call côté bid + prime put côté ask) */
  bearish_premium: string; // Ex: "143198625"
  /** Prime bullish (prime call côté ask + prime put côté bid) */
  bullish_premium: string; // Ex: "196261414"
  /** Somme de l'open interest de toutes les options call */
  call_open_interest: number; // Ex: 3975333
  /** Prime totale des transactions call */
  call_premium: string; // Ex: "9908777.0"
  /** Volume total des transactions call */
  call_volume: number; // Ex: 990943
  /** Volume total des transactions call côté ask */
  call_volume_ask_side: number; // Ex: 417251
  /** Volume total des transactions call côté bid */
  call_volume_bid_side: number; // Ex: 498271
  /** Date (format ISO) */
  date: string; // ISO date: "2023-09-08"
  /** Défini comme (prime call côté ask) - (prime call côté bid) */
  net_call_premium: string; // Ex: "-29138464"
  /** Défini comme (prime put côté ask) - (prime put côté bid) */
  net_put_premium: string; // Ex: "23924325"
  /** Somme de l'open interest de toutes les options put */
  put_open_interest: number; // Ex: 3564153
  /** Prime totale des transactions put */
  put_premium: string; // Ex: "163537151"
  /** Volume total des transactions put */
  put_volume: number; // Ex: 808326
  /** Volume total des transactions put côté ask */
  put_volume_ask_side: number; // Ex: 431791
  /** Volume total des transactions put côté bid */
  put_volume_bid_side: number; // Ex: 314160
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/options-volume
 */
export interface OptionsVolumeResponse {
  data: OptionsVolume[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/options-volume
 */
export interface OptionsVolumeQueryParams {
  /** Nombre d'éléments à retourner (1-500, défaut: 1) */
  limit?: number; // Min: 1, Max: 500, Default: 1
}

// ========== Spot Exposures ==========

/**
 * Spot GEX exposures par minute
 * GET /stock/{ticker}/spot-exposures
 */
export interface SpotExposure {
  /** Charm 1% move basé sur volume directionnalisé */
  charm_per_one_percent_move_dir: string; // Ex: "-5559678859.12"
  /** Charm 1% move basé sur OI (charm * OI * 365) */
  charm_per_one_percent_move_oi: string; // Ex: "5124108502049.17"
  /** Charm 1% move basé sur volume (charm * volume * 365) */
  charm_per_one_percent_move_vol: string; // Ex: "320909908341.10"
  /** Gamma 1% move basé sur volume directionnalisé */
  gamma_per_one_percent_move_dir: string; // Ex: "-5559678859.12"
  /** Gamma 1% move basé sur OI (gamma * OI * price * price) */
  gamma_per_one_percent_move_oi: string; // Ex: "65476967081.41"
  /** Gamma 1% move basé sur volume (gamma * volume * price * price) */
  gamma_per_one_percent_move_vol: string; // Ex: "12921519098.30"
  /** Prix sous-jacent utilisé dans les calculs */
  price: string; // Ex: "4650"
  /** Timestamp UTC du calcul */
  time: string; // ISO timestamp: "2023-12-13T05:00:41.481000Z"
  /** Vanna 1% move basé sur volume directionnalisé */
  vanna_per_one_percent_move_dir: string; // Ex: "-5559678859.12"
  /** Vanna 1% move basé sur OI (vanna * OI) */
  vanna_per_one_percent_move_oi: string; // Ex: "-54622844772.90"
  /** Vanna 1% move basé sur volume (vanna * volume) */
  vanna_per_one_percent_move_vol: string; // Ex: "-5559678859.12"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/spot-exposures
 */
export interface SpotExposuresResponse {
  data: SpotExposure[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/spot-exposures
 */
export interface SpotExposuresQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== Spot Exposures By Strike & Expiry ==========

/**
 * Spot GEX exposures par strike et expiration
 * GET /stock/{ticker}/spot-exposures/expiry-strike
 */
export interface SpotExposureByStrikeAndExpiry {
  /** Charm call ask */
  call_charm_ask: string; // Ex: "2582359253.61"
  /** Charm call bid */
  call_charm_bid: string; // Ex: "5820636.43"
  /** Charm call OI */
  call_charm_oi: string; // Ex: "70827151575067.12"
  /** Charm call vol */
  call_charm_vol: string; // Ex: "70827151575067.12"
  /** Delta call ask */
  call_delta_ask: string; // Ex: "23452351.20"
  /** Delta call bid */
  call_delta_bid: string; // Ex: "30499234235.52"
  /** Delta call OI */
  call_delta_oi: string; // Ex: "227549667.4651"
  /** Delta call vol */
  call_delta_vol: string; // Ex: "227549667.4651"
  /** Gamma call ask */
  call_gamma_ask: string; // Ex: "23452351.20"
  /** Gamma call bid */
  call_gamma_bid: string; // Ex: "30499234235.52"
  /** Gamma call OI */
  call_gamma_oi: string; // Ex: "5124108502049.17"
  /** Gamma call vol */
  call_gamma_vol: string; // Ex: "5124108502049.17"
  /** Vanna call ask */
  call_vanna_ask: string; // Ex: "22692351.20"
  /** Vanna call bid */
  call_vanna_bid: string; // Ex: "234235.52"
  /** Vanna call OI */
  call_vanna_oi: string; // Ex: "65476967081.41"
  /** Vanna call vol */
  call_vanna_vol: string; // Ex: "65476967081.41"
  /** Prix sous-jacent utilisé dans les calculs */
  price: string; // Ex: "4650"
  /** Charm put ask */
  put_charm_ask: string; // Ex: "96836366.22"
  /** Charm put bid */
  put_charm_bid: string; // Ex: "6100352354.34"
  /** Charm put OI */
  put_charm_oi: string; // Ex: "2282895170748.09"
  /** Charm put vol */
  put_charm_vol: string; // Ex: "2282895170748.09"
  /** Delta put ask */
  put_delta_ask: string; // Ex: "9528523023.39"
  /** Delta put bid */
  put_delta_bid: string; // Ex: "9342852354.34"
  /** Delta put OI */
  put_delta_oi: string; // Ex: "-191893077.7193"
  /** Delta put vol */
  put_delta_vol: string; // Ex: "-191893077.7193"
  /** Gamma put ask */
  put_gamma_ask: string; // Ex: "9528523023.39"
  /** Gamma put bid */
  put_gamma_bid: string; // Ex: "9342852354.34"
  /** Gamma put OI */
  put_gamma_oi: string; // Ex: "320909908341.10"
  /** Gamma put vol */
  put_gamma_vol: string; // Ex: "320909908341.10"
  /** Vanna put ask */
  put_vanna_ask: string; // Ex: "495803.39"
  /** Vanna put bid */
  put_vanna_bid: string; // Ex: "26934630.34"
  /** Vanna put OI */
  put_vanna_oi: string; // Ex: "12921519098.30"
  /** Vanna put vol */
  put_vanna_vol: string; // Ex: "12921519098.30"
  /** Strike du contrat d'option */
  strike: string; // Ex: "150.0"
  /** Timestamp UTC du calcul */
  time: string; // ISO timestamp: "2023-12-13T05:00:41.481000Z"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/spot-exposures/expiry-strike
 */
export interface SpotExposureByStrikeAndExpiryResponse {
  data: SpotExposureByStrikeAndExpiry[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/spot-exposures/expiry-strike
 */
export interface SpotExposureByStrikeAndExpiryQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
  /** Nombre d'éléments à retourner (1-500, défaut: 500) */
  limit?: number; // Min: 1, Max: 500, Default: 500
  /** Maximum days to expiry (>= 0) */
  max_dte?: number; // Min: 0
  /** Maximum strike (>= 0) */
  max_strike?: number; // Min: 0
  /** Minimum days to expiry (>= 0) */
  min_dte?: number; // Min: 0
  /** Minimum strike (>= 0) */
  min_strike?: number; // Min: 0
  /** Numéro de page (utiliser avec limit). Commence à la page 0 */
  page?: number; // Ex: 1
  /** Tableau de 1 ou plusieurs dates d'expiration (requis) */
  expirations: string[]; // Ex: ["2024-02-02", "2024-01-26"]
}

// ========== Spot Exposures By Strike ==========

/**
 * Spot GEX exposures par strike
 * GET /stock/{ticker}/spot-exposures/strike
 */
export type SpotExposureByStrike = SpotExposureByStrikeAndExpiry;

/**
 * Réponse de l'endpoint GET /stock/{ticker}/spot-exposures/strike
 */
export interface SpotExposureByStrikeResponse {
  data: SpotExposureByStrike[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/spot-exposures/strike
 */
export interface SpotExposureByStrikeQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
  /** Nombre d'éléments à retourner (1-500, défaut: 500) */
  limit?: number; // Min: 1, Max: 500, Default: 500
  /** Maximum strike (>= 0) */
  max_strike?: number; // Min: 0
  /** Minimum strike (>= 0) */
  min_strike?: number; // Min: 0
  /** Numéro de page (utiliser avec limit). Commence à la page 0 */
  page?: number; // Ex: 1
}

// ========== Stock State ==========

/**
 * État du stock
 * GET /stock/{ticker}/stock-state
 */
export interface StockState {
  /** Prix de clôture du stock du ticker */
  close: string; // Ex: "182.91"
  /** Prix le plus haut du stock du ticker */
  high: string; // Ex: "182.91"
  /** Prix le plus bas du stock du ticker */
  low: string; // Ex: "182.91"
  /** Temps de marché des données */
  market_time: MarketTime; // Ex: "regular"
  /** Prix d'ouverture du stock du ticker */
  open: string; // Ex: "182.91"
  /** Prix du stock du ticker du jour de trading précédent */
  prev_close: string; // Ex: "189.70"
  /** Dernier temps de tape des données */
  tape_time: string; // ISO timestamp: "2023-09-07T20:06:00Z"
  /** Volume cumulatif du stock à travers le jour de trading */
  total_volume: number; // Ex: 23132119
  /** Volume cumulatif total du stock sous-jacent tradé */
  volume: number; // Ex: 12348
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/stock-state
 */
export interface StockStateResponse {
  data: StockState;
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/stock-state
 */
export interface StockStateQueryParams {
  /** Aucun paramètre selon la documentation */
}

// ========== Stock Volume Price Levels ==========

/**
 * Volume lit & off lit par niveau de prix
 * GET /stock/{ticker}/stock-volume-price-levels
 */
export interface StockVolumePriceLevel {
  /** Volume lit (exchanges Nasdaq) */
  lit_vol: number; // Ex: 19941285
  /** Volume off lit (exchanges FINRA) */
  off_vol: number; // Ex: 22074116
  /** Niveau de prix */
  price: string; // Ex: "120.12"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/stock-volume-price-levels
 */
export interface StockVolumePriceLevelsResponse {
  data: StockVolumePriceLevel[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/stock-volume-price-levels
 */
export interface StockVolumePriceLevelsQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== Realized Volatility ==========

/**
 * Volatilité réalisée
 * GET /stock/{ticker}/volatility/realized
 */
export interface RealizedVolatility {
  /** Date (format ISO) */
  date: string; // ISO date: "2023-09-08"
  /** Volatilité implicite (30 jours forward) */
  implied_volatility: string; // Ex: "0.2038053572177887"
  /** Prix de clôture du stock du ticker */
  price: string; // Ex: "182.91"
  /** Volatilité réalisée/historique (30 derniers jours, 21 jours de trading) */
  realized_volatility: string; // Ex: "0.18338055163621902"
  /** Dernière date utilisée pour calculer la volatilité réalisée */
  unshifted_rv_date: string; // ISO date: "2024-12-01"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/volatility/realized
 */
export interface RealizedVolatilityResponse {
  data: RealizedVolatility[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/volatility/realized
 */
export interface RealizedVolatilityQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
  /** Timeframe des données (YTD, 1D, 2D, 1W, 2W, 1M, 2M, 1Y, 2Y, etc., défaut: 1Y) */
  timeframe?: string; // Default: "1Y"
}

// ========== Volatility Statistics ==========

/**
 * Statistiques de volatilité
 * GET /stock/{ticker}/volatility/stats
 */
export interface VolatilityStats {
  /** Date (format ISO) */
  date: string; // ISO date: "2023-09-08"
  /** Valeur de volatilité implicite */
  iv: string; // Ex: "0.25"
  /** Valeur de volatilité implicite haute */
  iv_high: string; // Ex: "0.25"
  /** Valeur de volatilité implicite basse */
  iv_low: string; // Ex: "0.25"
  /** Valeur IV rank */
  iv_rank: string; // Ex: "0.65"
  /** Valeur de volatilité réalisée */
  rv: string; // Ex: "0.25"
  /** Valeur de volatilité réalisée haute */
  rv_high: string; // Ex: "0.25"
  /** Valeur de volatilité réalisée basse */
  rv_low: string; // Ex: "0.25"
  /** Ticker du stock */
  ticker: string; // Ex: "AAPL"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/volatility/stats
 */
export interface VolatilityStatsResponse {
  data: VolatilityStats;
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/volatility/stats
 */
export interface VolatilityStatsQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== Implied Volatility Term Structure ==========

/**
 * Structure de terme de volatilité implicite
 * GET /stock/{ticker}/volatility/term-structure
 */
export interface VolatilityTermStructure {
  /** Date (format ISO) */
  date: string; // ISO date: "2023-09-08"
  /** Nombre de jours jusqu'à l'expiration */
  dte: number; // Ex: 5
  /** Expiration d'un cycle d'options (format ISO) */
  expiry: string; // ISO date: "2023-09-08"
  /** Mouvement implicite du stock sous-jacent à une date donnée basé sur les contrats d'option à la monnaie */
  implied_move: string; // Ex: "2.2398043036460877"
  /** Mouvement implicite en pourcentage du prix du stock sous-jacent */
  implied_move_perc: string; // Ex: "0.012247398860706955"
  /** Volatilité implicite moyenne des contrats d'option call et put à la monnaie */
  volatility: string; // Ex: "0.18338055163621902"
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/volatility/term-structure
 */
export interface VolatilityTermStructureResponse {
  data: VolatilityTermStructure[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/volatility/term-structure
 */
export interface VolatilityTermStructureQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

