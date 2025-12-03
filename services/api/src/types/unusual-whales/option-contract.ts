/**
 * Types pour les endpoints Unusual Whales - Option Contract
 * Basés sur la documentation officielle: https://api.unusualwhales.com/api
 */

import type { FinancialSector } from './earnings';

// ========== Flow Data ==========

/**
 * Côté d'un trade de stock
 */
export type TradeSide = 'ALL' | 'ASK' | 'BID' | 'MID';

/**
 * Flow Data
 * GET /option-contract/{id}/flow
 */
export interface OptionContractFlow {
  /** Volume côté ask */
  ask_vol: number; // Ex: 119403
  /** Volume côté bid */
  bid_vol: number; // Ex: 122789
  /** Si le trade d'option a été annulé */
  canceled: boolean; // Ex: false
  /** Delta du trade d'option */
  delta: string; // Ex: "0.610546281537814"
  /** Heure de publication des résultats */
  er_time: 'unknown' | 'afterhours' | 'premarket'; // Ex: "premarket"
  /** Moyenne mobile pondérée exponentiellement du NBBO ask */
  ewma_nbbo_ask: string; // Ex: "21.60"
  /** Moyenne mobile pondérée exponentiellement du NBBO bid */
  ewma_nbbo_bid: string; // Ex: "21.45"
  /** Exchange où le trade d'option a été exécuté */
  exchange: string; // Ex: "MXOP"
  /** Heure à laquelle le trade d'option a été exécuté */
  executed_at: string; // ISO timestamp: "2024-08-21T13:50:52.278302Z"
  /** Date d'expiration du contrat au format ISO */
  expiry: string; // ISO date: "2023-12-22"
  /** ID de l'alerte de flow du trade d'option */
  flow_alert_id: string | null;
  /** Nom complet du ticker */
  full_name: string; // Ex: "APPLE"
  /** Gamma du trade d'option */
  gamma: string; // Ex: "0.00775013889662635"
  /** ID du trade d'option */
  id: string; // Ex: "8ef90a2d-d881-41de-98c9-c1de4318dcb5"
  /** Volatilité implicite du trade d'option */
  implied_volatility: string; // Ex: "0.604347250962543"
  /** Type d'industrie du ticker */
  industry_type: string; // Ex: "Semiconductors"
  /** Marketcap du ticker sous-jacent. Si le type d'émission est ETF, alors le marketcap représente l'AUM */
  marketcap: string; // Ex: "2965813810400"
  /** Volume au milieu de l'ask et du bid */
  mid_vol: number; // Ex: 22707
  /** Volume multi-leg */
  multi_vol: number; // Ex: 7486
  /** Prix NBBO ask */
  nbbo_ask: string; // Ex: "0.03"
  /** Prix NBBO bid */
  nbbo_bid: string; // Ex: "0.03"
  /** Prochaine date de résultats du ticker. Null si inconnue ou si le ticker n'a pas de résultats comme un ETF */
  next_earnings_date: string | null; // ISO date: "2023-10-26"
  /** Volume sans côté identifiable */
  no_side_vol: number; // Ex: 0
  /** Intérêt ouvert pour le contrat */
  open_interest: number; // Ex: 18680
  /** Symbole d'option du contrat */
  option_chain_id: string; // Ex: "NVDA250117C00124000"
  /** Type d'option du contrat */
  option_type: 'call' | 'put'; // Ex: "call"
  /** Prime du trade d'option */
  premium: string; // Ex: "2150.00"
  /** Prix de remplissage du trade d'option */
  price: string; // Ex: "21.50"
  /** Flags de rapport du trade d'option */
  report_flags: string[]; // Ex: ["cross_trade"]
  /** Rho du trade d'option */
  rho: string; // Ex: "0.2316546330093438"
  /** ID de règle du trade d'option qui représente la règle qui a constitué l'alerte de flow */
  rule_id: string | null;
  /** Secteur financier du ticker */
  sector: FinancialSector | ''; // Ex: "Technology"
  /** Taille du trade d'option */
  size: number; // Ex: 1
  /** Volume multi-leg avec stock */
  stock_multi_vol: number; // Ex: 52
  /** Strike du contrat */
  strike: string; // Ex: "375"
  /** Tags liés à l'institution */
  tags: string[]; // Ex: ["activist","value_investor"]
  /** Prix théorique du trade d'option */
  theo: string; // Ex: "21.49999999999999"
  /** Theta du trade d'option */
  theta: string; // Ex: "-0.0640155364004474"
  /** Prix de l'actif sous-jacent */
  underlying_price: string; // Ex: "128.16"
  /** Symbole sous-jacent du contrat */
  underlying_symbol: string; // Ex: "AAPL"
  /** Détail de condition en amont/code de trade du trade d'option */
  upstream_condition_detail: string; // Ex: "auto"
  /** Vega du trade d'option */
  vega: string; // Ex: "0.3140468475903719"
  /** Nombre de contrats négociés jusqu'à ce point */
  volume: number; // Ex: 33
}

/**
 * Réponse de l'endpoint GET /option-contract/{id}/flow
 */
export interface OptionContractFlowResponse {
  data: OptionContractFlow[];
}

/**
 * Paramètres de requête pour GET /option-contract/{id}/flow
 */
export interface OptionContractFlowQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
  /** Nombre d'éléments à retourner. Si aucune limite n'est donnée, retourne toutes les données correspondantes (1+) */
  limit?: number; // Min: 1
  /** Prime minimum que les trades demandés doivent avoir (0+, défaut: 0) */
  min_premium?: number; // Min: 0, Default: 0
  /** Côté d'un trade de stock. Doit être l'un de ASK, BID, MID. Si non défini, retournera tous les côtés (défaut: ALL) */
  side?: TradeSide; // Default: 'ALL'
}

// ========== Historic Data ==========

/**
 * Historic Data
 * GET /option-contract/{id}/historic
 */
export interface OptionContractHistoric {
  /** Volume côté ask */
  ask_volume: number; // Ex: 119403
  /** Prix de remplissage moyen pondéré par volume */
  avg_price: string; // Ex: "1.0465802437910297887119234370"
  /** Volume côté bid */
  bid_volume: number; // Ex: 122789
  /** Volume cross */
  cross_volume: number; // Ex: 0
  /** Date de trading au format ISO */
  date: string; // ISO date: "2023-09-08"
  /** Volume floor */
  floor_volume: number; // Ex: 142
  /** Remplissage le plus élevé sur ce contrat */
  high_price: string; // Ex: "2.95"
  /** Volatilité implicite pour la dernière transaction */
  implied_volatility: string; // Ex: "0.675815680048166"
  /** Volatilité implicite la plus élevée à laquelle une transaction s'est produite */
  iv_high: string; // Ex: "0.675815680048166"
  /** Volatilité implicite la plus basse à laquelle une transaction s'est produite */
  iv_low: string; // Ex: "0.310502942482285"
  /** Dernier remplissage sur le contrat */
  last_price: string; // Ex: "0.03"
  /** Dernière fois qu'il y a eu une transaction pour le contrat donné en timestamp UTC */
  last_tape_time: string; // ISO timestamp: "2023-09-08T17:45:32Z"
  /** Remplissage le plus bas sur ce contrat */
  low_price: string; // Ex: "0.02"
  /** Volume au milieu de l'ask et du bid */
  mid_volume: number; // Ex: 22707
  /** Volume multi-leg */
  multi_leg_volume: number; // Ex: 7486
  /** Prix NBBO Ask pour le dernier tick de la session de trading de ce jour */
  nbbo_ask: string; // Ex: "0.45"
  /** Prix NBBO Bid pour le dernier tick de la session de trading de ce jour */
  nbbo_bid: string; // Ex: "0.30"
  /** Volume sans côté identifiable */
  no_side_volume: number; // Ex: 0
  /** Intérêt ouvert pour le contrat */
  open_interest: number; // Ex: 18680
  /** Premier remplissage sur ce contrat */
  open_price: string; // Ex: "0.92"
  /** Volume multi-leg avec stock */
  stock_multi_leg_volume: number; // Ex: 52
  /** Volume sweep */
  sweep_volume: number; // Ex: 18260
  /** Nombre total de changements du NBBO ask pendant la session de trading de ce jour */
  total_ask_changes: number; // Ex: 165
  /** Nombre total de changements du NBBO bid pendant la session de trading de ce jour */
  total_bid_changes: number; // Ex: 28
  /** Prime totale d'option */
  total_premium: string; // Ex: "27723806.00"
  /** Nombre de transactions pour ce contrat */
  trades: number; // Ex: 39690
  /** Volume du contrat */
  volume: number; // Ex: 264899
}

/**
 * Réponse de l'endpoint GET /option-contract/{id}/historic
 */
export interface OptionContractHistoricResponse {
  chains: OptionContractHistoric[];
}

/**
 * Paramètres de requête pour GET /option-contract/{id}/historic
 */
export interface OptionContractHistoricQueryParams {
  /** Nombre d'éléments à retourner. Si aucune limite n'est donnée, retourne toutes les données correspondantes (1+) */
  limit?: number; // Min: 1
}

// ========== Intraday Data ==========

/**
 * Intraday Data
 * GET /option-contract/{id}/intraday
 */
export interface OptionContractIntraday {
  /** Prix de remplissage moyen pondéré par volume */
  avg_price: string; // Ex: "1.0465802437910297887119234370"
  /** Dernier remplissage sur le contrat */
  close: string; // Ex: "0.03"
  /** Date d'expiration du contrat au format ISO */
  expiry: string; // ISO date: "2023-12-22"
  /** Remplissage le plus élevé sur ce contrat */
  high: string; // Ex: "2.95"
  /** Volatilité implicite la plus élevée à laquelle une transaction s'est produite */
  iv_high: string; // Ex: "0.675815680048166"
  /** Volatilité implicite la plus basse à laquelle une transaction s'est produite */
  iv_low: string; // Ex: "0.310502942482285"
  /** Remplissage le plus bas sur ce contrat */
  low: string; // Ex: "0.02"
  /** Premier remplissage sur ce contrat */
  open: string; // Ex: "0.92"
  /** Symbole d'option du contrat */
  option_symbol: string; // Ex: "AAPL240621C00190000"
  /** Valeur de prime totale pour les transactions exécutées côté ask */
  premium_ask_side: string; // Ex: "3138.00"
  /** Valeur de prime totale pour les transactions exécutées côté bid */
  premium_bid_side: string; // Ex: "1403.92"
  /** Valeur de prime totale pour les transactions exécutées au prix mid */
  premium_mid_side: string; // Ex: "60.50"
  /** Valeur de prime totale pour les transactions sans côté identifiable */
  premium_no_side: string; // Ex: "0.00"
  /** Timestamp UTC */
  start_time: string; // ISO timestamp: "2023-12-12T16:35:52.168490Z"
  /** Volume côté ask */
  volume_ask_side: number; // Ex: 119403
  /** Volume côté bid */
  volume_bid_side: number; // Ex: 122789
  /** Volume au milieu de l'ask et du bid */
  volume_mid_side: number; // Ex: 22707
  /** Volume multi-leg */
  volume_multi: number; // Ex: 7486
  /** Volume sans côté identifiable */
  volume_no_side: number; // Ex: 0
  /** Volume multi-leg avec stock */
  volume_stock_multi: number; // Ex: 52
}

/**
 * Réponse de l'endpoint GET /option-contract/{id}/intraday
 */
export interface OptionContractIntradayResponse {
  data: OptionContractIntraday[];
}

/**
 * Paramètres de requête pour GET /option-contract/{id}/intraday
 */
export interface OptionContractIntradayQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== Volume Profile ==========

/**
 * Volume Profile
 * GET /option-contract/{id}/volume-profile
 */
export interface OptionContractVolumeProfile {
  /** Volume côté ask */
  ask_vol: number; // Ex: 119403
  /** Volume côté bid */
  bid_vol: number; // Ex: 122789
  /** Volume cross */
  cross_vol: number; // Ex: 0
  /** Date de trading au format ISO */
  date: string; // ISO date: "2023-09-08"
  /** Volume floor */
  floor_vol: number; // Ex: 142
  /** Volume au milieu de l'ask et du bid */
  mid_vol: number; // Ex: 22707
  /** Volume multi-leg */
  multi_vol: number; // Ex: 7486
  /** Prix de remplissage du trade d'option */
  price: string; // Ex: "21.50"
  /** Volume sweep */
  sweep_vol: number; // Ex: 18260
  /** Nombre de transactions pour ce contrat */
  transactions: number; // Ex: 39690
  /** Volume du contrat */
  volume: number; // Ex: 264899
}

/**
 * Réponse de l'endpoint GET /option-contract/{id}/volume-profile
 */
export interface OptionContractVolumeProfileResponse {
  data: OptionContractVolumeProfile[];
}

/**
 * Paramètres de requête pour GET /option-contract/{id}/volume-profile
 */
export interface OptionContractVolumeProfileQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== Expiry Breakdown ==========

/**
 * Expiry Breakdown
 * GET /stock/{ticker}/expiry-breakdown
 */
export interface ExpiryBreakdown {
  /** Nombre total de chaînes pour cette expiration */
  chains: number; // Ex: 12223
  /** Date d'expiration du contrat au format ISO */
  expiry: string; // ISO date: "2023-12-22"
  /** Intérêt ouvert total pour cette expiration */
  open_interest: number; // Ex: 12223
  /** Volume total pour cette expiration */
  volume: number; // Ex: 12223
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/expiry-breakdown
 */
export interface ExpiryBreakdownResponse {
  data: ExpiryBreakdown[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/expiry-breakdown
 */
export interface ExpiryBreakdownQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== Option Contracts ==========

/**
 * Option Contracts
 * GET /stock/{ticker}/option-contracts
 */
export interface StockOptionContract {
  /** Volume côté ask */
  ask_volume: number; // Ex: 119403
  /** Prix de remplissage moyen pondéré par volume */
  avg_price: string; // Ex: "1.0465802437910297887119234370"
  /** Volume côté bid */
  bid_volume: number; // Ex: 122789
  /** Volume cross */
  cross_volume: number; // Ex: 0
  /** Volume floor */
  floor_volume: number; // Ex: 142
  /** Remplissage le plus élevé sur ce contrat */
  high_price: string; // Ex: "2.95"
  /** Volatilité implicite pour la dernière transaction */
  implied_volatility: string; // Ex: "0.675815680048166"
  /** Dernier remplissage sur le contrat */
  last_price: string; // Ex: "0.03"
  /** Remplissage le plus bas sur ce contrat */
  low_price: string; // Ex: "0.02"
  /** Volume au milieu de l'ask et du bid */
  mid_volume: number; // Ex: 22707
  /** Volume multi-leg */
  multi_leg_volume: number; // Ex: 7486
  /** Prix NBBO ask */
  nbbo_ask: string; // Ex: "0.03"
  /** Prix NBBO bid */
  nbbo_bid: string; // Ex: "0.03"
  /** Volume sans côté identifiable */
  no_side_volume: number; // Ex: 0
  /** Intérêt ouvert pour le contrat */
  open_interest: number; // Ex: 18680
  /** Symbole d'option du contrat */
  option_symbol: string; // Ex: "AAPL240202P00185000"
  /** Intérêt ouvert du jour de trading précédent */
  prev_oi: number; // Ex: 18680
  /** Volume multi-leg avec stock */
  stock_multi_leg_volume: number; // Ex: 52
  /** Volume sweep */
  sweep_volume: number; // Ex: 18260
  /** Prime totale d'option */
  total_premium: string; // Ex: "27723806.00"
  /** Volume du contrat */
  volume: number; // Ex: 264899
}

/**
 * Réponse de l'endpoint GET /stock/{ticker}/option-contracts
 */
export interface StockOptionContractsResponse {
  data: StockOptionContract[];
}

/**
 * Paramètres de requête pour GET /stock/{ticker}/option-contracts
 */
export interface StockOptionContractsQueryParams {
  /** Exclure les chaînes qui expirent le même jour */
  exclude_zero_dte?: boolean;
  /** Exclure les chaînes où l'intérêt ouvert > 0 */
  exclude_zero_oi_chains?: boolean;
  /** Exclure les chaînes où le volume > 0 */
  exclude_zero_vol_chains?: boolean;
  /** Une seule date d'expiration au format ISO */
  expiry?: string; // ISO date: "2024-02-02"
  /** Nombre d'éléments à retourner (1-500, défaut: 500) */
  limit?: number; // Min: 1, Max: 500, Default: 500
  /** Inclure uniquement les chaînes qui sont out of the money */
  maybe_otm_only?: boolean;
  /** Symboles d'options pour filtrer */
  option_symbol?: string[];
  /** Type d'option pour filtrer si spécifié */
  option_type?: 'call' | 'Call' | 'put' | 'Put';
  /** Numéro de page (utiliser avec limit). Commence à la page 0 */
  page?: number; // Ex: 1
  /** Inclure uniquement les chaînes où le volume > intérêt ouvert */
  vol_greater_oi?: boolean;
}

