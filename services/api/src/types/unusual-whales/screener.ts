/**
 * Types pour les endpoints Unusual Whales - Screener
 * Basés sur la documentation officielle: https://api.unusualwhales.com/api
 */

import type { FinancialSector } from './earnings';

// ========== Analyst Rating ==========

/**
 * Action de recommandation
 */
export type AnalystAction = 'initiated' | 'reiterated' | 'downgraded' | 'upgraded' | 'maintained' | 'target raised' | 'target lowered';

/**
 * Recommandation de l'analyste
 */
export type AnalystRecommendation = 'buy' | 'hold' | 'sell';

/**
 * Rating d'analyste
 * GET /screener/analysts
 */
export interface AnalystRating {
  /** Action de la recommandation */
  action: AnalystAction; // Ex: "maintained"
  /** Nom de l'analyste */
  analyst_name: string; // Ex: "David Vogt"
  /** La firme pour laquelle l'analyste travaille */
  firm: string; // Ex: "UBS"
  /** La recommandation que l'analyste a donnée */
  recommendation: AnalystRecommendation; // Ex: "hold"
  /** Secteur financier du ticker */
  sector: FinancialSector | ''; // Ex: "Technology"
  /** Prix cible du rating */
  target: string; // Ex: "190.0"
  /** Ticker */
  ticker: any; // Ex: "MSFT"
  /** Timestamp UTC lorsque le rating a été publié */
  timestamp: string; // ISO timestamp: "2023-09-08T12:21:10Z"
}

/**
 * Réponse de l'endpoint GET /screener/analysts
 */
export interface AnalystRatingResponse {
  data: AnalystRating[];
}

/**
 * Paramètres de requête pour GET /screener/analysts
 */
export interface AnalystRatingQueryParams {
  /** Action de la recommandation */
  action?: AnalystAction;
  /** Nombre d'éléments à retourner (1-500, défaut: 500) */
  limit?: number; // Min: 1, Max: 500, Default: 500
  /** La recommandation que l'analyste a donnée */
  recommendation?: AnalystRecommendation;
  /** Un seul ticker */
  ticker?: string; // Ex: "AAPL"
}

// ========== Hottest Chains (Option Contracts Screener) ==========

/**
 * Type d'option
 */
export type OptionType = 'call' | 'Call' | 'put' | 'Put';

/**
 * Type d'émission
 */
export type IssueType = 'Common Stock' | 'ETF' | 'Index' | 'ADR';

/**
 * Ordre pour Option Contracts Screener
 */
export type OptionContractsOrder =
  | 'bid_ask_vol'
  | 'bull_bear_vol'
  | 'contract_pricing'
  | 'daily_perc_change'
  | 'diff'
  | 'dte'
  | 'earnings'
  | 'expires'
  | 'expiry'
  | 'floor_volume'
  | 'floor_volume_ratio'
  | 'from_high'
  | 'from_low'
  | 'iv'
  | 'multileg_volume'
  | 'open_interest'
  | 'premium'
  | 'spread'
  | 'stock_price'
  | 'tape_time'
  | 'ticker'
  | 'total_multileg_volume_ratio'
  | 'trades'
  | 'volume'
  | 'volume_oi_ratio'
  | 'volume_ticker_vol_ratio';

/**
 * Contrat d'option (Hottest Chains)
 * GET /screener/option-contracts
 */
export interface OptionContract {
  /** Volume côté ask */
  ask_side_volume: number; // Ex: 119403
  /** Prix de remplissage moyen pondéré par volume */
  avg_price: string; // Ex: "1.0465802437910297887119234370"
  /** Volume côté bid */
  bid_side_volume: number; // Ex: 122789
  /** Prix du contrat du jour de trading précédent */
  chain_prev_close: string; // Ex: "1.29"
  /** Dernier remplissage sur le contrat */
  close: string; // Ex: "0.03"
  /** Volume cross */
  cross_volume: number; // Ex: 0
  /** Heure de publication des résultats */
  er_time: 'unknown' | 'afterhours' | 'premarket'; // Ex: "premarket"
  /** Volume floor */
  floor_volume: number; // Ex: 142
  /** Remplissage le plus élevé sur ce contrat */
  high: string; // Ex: "2.95"
  /** Dernière fois qu'il y a eu une transaction pour le contrat donné en timestamp UTC */
  last_fill: string; // ISO timestamp: "2023-09-08T17:45:32Z"
  /** Remplissage le plus bas sur ce contrat */
  low: string; // Ex: "0.02"
  /** Volume au milieu de l'ask et du bid */
  mid_volume: number; // Ex: 22707
  /** Volume multi-leg */
  multileg_volume: number; // Ex: 7486
  /** Prochaine date de résultats du ticker. Null si inconnue ou si le ticker n'a pas de résultats comme un ETF */
  next_earnings_date: string | null; // ISO date: "2023-10-26"
  /** Volume sans côté identifiable */
  no_side_volume: number; // Ex: 0
  /** Prix d'ouverture sur ce contrat */
  open: string; // Ex: "0.92"
  /** Intérêt ouvert pour le contrat */
  open_interest: number; // Ex: 18680
  /** Symbole d'option du contrat */
  option_symbol: string; // Ex: "TSLA230908C00255000"
  /** Prime totale d'option */
  premium: string; // Ex: "27723806.00"
  /** Secteur financier du ticker */
  sector: FinancialSector | ''; // Ex: "Consumer Cyclical"
  /** Volume multi-leg avec stock */
  stock_multi_leg_volume: number; // Ex: 52
  /** Prix de clôture du stock du ticker */
  stock_price: string; // Ex: "247.94"
  /** Volume sweep */
  sweep_volume: number; // Ex: 18260
  /** Volume total d'options pour le ticker donné */
  ticker_vol: number; // Ex: 2546773
  /** Nombre total de changements du NBBO ask pendant la session de trading de ce jour */
  total_ask_changes: number; // Ex: 165
  /** Nombre total de changements du NBBO bid pendant la session de trading de ce jour */
  total_bid_changes: number; // Ex: 28
  /** Nombre de transactions pour ce contrat */
  trades: number; // Ex: 39690
  /** Volume du contrat */
  volume: number; // Ex: 264899
}

/**
 * Réponse de l'endpoint GET /screener/option-contracts
 */
export interface OptionContractsResponse {
  data: OptionContract[];
}

/**
 * Paramètres de requête pour GET /screener/option-contracts
 * NOTE: Ce endpoint a beaucoup de paramètres optionnels pour le filtrage
 */
export interface OptionContractsQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
  /** Exclure les tickers qui négocient ex-dividende aujourd'hui */
  exclude_ex_div_ticker?: boolean;
  /** Tableau de 1 ou plusieurs dates d'expiration */
  expiry_dates?: string[]; // Ex: ["2024-02-02","2024-01-26"]
  /** Inclure uniquement les contrats qui sont actuellement out of the money */
  is_otm?: boolean;
  /** Tableau de 1 ou plusieurs types d'émission */
  issue_types?: IssueType[]; // Ex: ["Common Stock","Index"]
  /** Nombre d'éléments à retourner (1-250, défaut: 50) */
  limit?: number; // Min: 1, Max: 250, Default: 50
  /** Pourcentage maximum ask de volume */
  max_ask_perc?: string; // Ex: "0.45"
  /** Pourcentage maximum ask side sur 7 jours */
  max_ask_side_perc_7_day?: string; // Ex: "0.45"
  /** Prix moyen maximum */
  max_avg_price?: string; // Ex: "25.00"
  /** Pourcentage bear maximum */
  max_bear_perc?: string; // Ex: "0.45"
  /** Pourcentage maximum bid de volume */
  max_bid_perc?: string; // Ex: "0.45"
  /** Pourcentage maximum bid side sur 7 jours */
  max_bid_side_perc_7_day?: string; // Ex: "0.45"
  /** Pourcentage bull maximum */
  max_bull_perc?: string; // Ex: "0.45"
  /** Prix de clôture maximum (pas le prix sous-jacent) */
  max_close?: string; // Ex: "25.00"
  /** Volume moyen de contrat d'options sur 30 jours maximum pour le ticker sous-jacent */
  max_contract_30_d_avg_volume?: number; // Ex: 10000
  /** Changement de prix intraday maximum depuis l'ouverture du marché */
  max_daily_perc_change?: string; // Ex: "0.6"
  /** Jours maximum de hausse consécutive de l'OI */
  max_days_of_oi_increases?: number; // Ex: 10
  /** Jours maximum où le volume était supérieur à l'OI */
  max_days_of_vol_greater_than_oi?: number; // Ex: 7
  /** Delta maximum (-1.00 à +1.00) */
  max_delta?: string; // Ex: "0.80"
  /** Diff OTM maximum d'un contrat */
  max_diff?: string; // Ex: "1.34"
  /** Jours jusqu'à expiration maximum */
  max_dte?: number; // Ex: 3
  /** Jours jusqu'aux résultats maximum */
  max_earnings_dte?: number; // Ex: 30
  /** Volume floor maximum sur ce contrat */
  max_floor_volume?: number; // Ex: 55800
  /** Ratio volume floor/volume contrat maximum */
  max_floor_volume_ratio?: string; // Ex: "0.45"
  /** Pourcentage maximum depuis le haut d'aujourd'hui */
  max_from_high_perc?: string; // Ex: "0.45"
  /** Pourcentage maximum depuis le bas d'aujourd'hui */
  max_from_low_perc?: string; // Ex: "0.45"
  /** Gamma maximum (0.00 à +inf) */
  max_gamma?: string; // Ex: "0.15"
  /** Pourcentage de volatilité implicite maximum */
  max_iv_perc?: string; // Ex: "0.45"
  /** Marketcap maximum */
  max_marketcap?: string; // Ex: "250000000"
  /** Ratio volume multi-leg/volume contrat maximum */
  max_multileg_volume_ratio?: string; // Ex: "0.5"
  /** Changement d'OI maximum en valeur absolue */
  max_oi_change?: number; // Ex: 5000
  /** Pourcentage de changement d'OI maximum */
  max_oi_change_perc?: string; // Ex: "0.50"
  /** Intérêt ouvert maximum sur ce contrat */
  max_open_interest?: number; // Ex: 55600
  /** Changement de prix % maximum du contrat par rapport au jour précédent */
  max_perc_change?: string; // Ex: "0.68"
  /** Prime maximum sur ce contrat */
  max_premium?: string; // Ex: "53100.32"
  /** Pourcentage de retour sur capital maximum */
  max_return_on_capital_perc?: string; // Ex: "0.45"
  /** Pourcentage de skew maximum */
  max_skew_perc?: string; // Ex: "0.45"
  /** Strike maximum */
  max_strike?: string; // Ex: "1200"
  /** Ratio volume sweep maximum (0.00 à 1.00) */
  max_sweep_volume_ratio?: string; // Ex: "0.75"
  /** Theta maximum (-inf à 0.00) */
  max_theta?: string; // Ex: "-0.01"
  /** Volume moyen de stock sur 30 jours maximum pour le ticker sous-jacent */
  max_ticker_30_d_avg_volume?: number; // Ex: 50000000
  /** Nombre maximum de transactions */
  max_transactions?: number; // Ex: 500
  /** Prix du stock maximum */
  max_underlying_price?: string; // Ex: "10.53"
  /** Vega maximum (0.00 à +inf) */
  max_vega?: string; // Ex: "0.25"
  /** Volume maximum sur ce contrat */
  max_volume?: number; // Ex: 55600
  /** Ratio volume contrat/OI maximum */
  max_volume_oi_ratio?: string; // Ex: "1.58"
  /** Ratio volume contrat/volume total d'options du sous-jacent maximum (0.00 à 1.00) */
  max_volume_ticker_vol_ratio?: string; // Ex: "0.85"
  /** Pourcentage minimum ask de volume */
  min_ask_perc?: string; // Ex: "0.19"
  /** Pourcentage minimum ask side sur 7 jours */
  min_ask_side_perc_7_day?: string; // Ex: "0.19"
  /** Prix moyen minimum */
  min_avg_price?: string; // Ex: "1.50"
  /** Pourcentage bear minimum */
  min_bear_perc?: string; // Ex: "0.19"
  /** Pourcentage minimum bid de volume */
  min_bid_perc?: string; // Ex: "0.19"
  /** Pourcentage minimum bid side sur 7 jours */
  min_bid_side_perc_7_day?: string; // Ex: "0.19"
  /** Pourcentage bull minimum */
  min_bull_perc?: string; // Ex: "0.19"
  /** Prix de clôture minimum (pas le prix sous-jacent) */
  min_close?: string; // Ex: "1.50"
  /** Volume moyen de contrat d'options sur 30 jours minimum pour le ticker sous-jacent */
  min_contract_30_d_avg_volume?: number; // Ex: 500
  /** Changement de prix intraday minimum depuis l'ouverture du marché */
  min_daily_perc_change?: string; // Ex: "0.2"
  /** Jours minimum de hausse consécutive de l'OI */
  min_days_of_oi_increases?: number; // Ex: 3
  /** Jours minimum où le volume était supérieur à l'OI */
  min_days_of_vol_greater_than_oi?: number; // Ex: 2
  /** Delta minimum (-1.00 à +1.00) */
  min_delta?: string; // Ex: "-0.50"
  /** Diff OTM minimum d'un contrat */
  min_diff?: string; // Ex: "0.53"
  /** Jours jusqu'à expiration minimum */
  min_dte?: number; // Ex: 1
  /** Jours jusqu'aux résultats minimum */
  min_earnings_dte?: number; // Ex: 1
  /** Volume floor minimum sur ce contrat */
  min_floor_volume?: number; // Ex: 12300
  /** Ratio volume floor/volume contrat minimum */
  min_floor_volume_ratio?: string; // Ex: "0.2"
  /** Pourcentage minimum depuis le haut d'aujourd'hui */
  min_from_high_perc?: string; // Ex: "0.19"
  /** Pourcentage minimum depuis le bas d'aujourd'hui */
  min_from_low_perc?: string; // Ex: "0.19"
  /** Gamma minimum (0.00 à +inf) */
  min_gamma?: string; // Ex: "0.01"
  /** Pourcentage de volatilité implicite minimum */
  min_iv_perc?: string; // Ex: "0.19"
  /** Marketcap minimum */
  min_marketcap?: string; // Ex: "1000000"
  /** Ratio volume multi-leg/volume contrat minimum */
  min_multileg_volume_ratio?: string; // Ex: "0.3"
  /** Changement d'OI minimum en valeur absolue */
  min_oi_change?: number; // Ex: -1000
  /** Pourcentage de changement d'OI minimum */
  min_oi_change_perc?: string; // Ex: "-0.25"
  /** Intérêt ouvert minimum sur ce contrat */
  min_open_interest?: number; // Ex: 12300
  /** Changement de prix % minimum du contrat par rapport au jour précédent */
  min_perc_change?: string; // Ex: "0.5"
  /** Prime minimum sur ce contrat */
  min_premium?: string; // Ex: "12500.5"
  /** Pourcentage de retour sur capital minimum */
  min_return_on_capital_perc?: string; // Ex: "0.19"
  /** Pourcentage de skew minimum */
  min_skew_perc?: string; // Ex: "0.19"
  /** Strike minimum */
  min_strike?: string; // Ex: "120.5"
  /** Ratio volume sweep minimum (0.00 à 1.00) */
  min_sweep_volume_ratio?: string; // Ex: "0.15"
  /** Theta minimum (-inf à 0.00) */
  min_theta?: string; // Ex: "-0.10"
  /** Volume moyen de stock sur 30 jours minimum pour le ticker sous-jacent */
  min_ticker_30_d_avg_volume?: number; // Ex: 1500000
  /** Nombre minimum de transactions */
  min_transactions?: number; // Ex: 10
  /** Prix du stock minimum */
  min_underlying_price?: string; // Ex: "5.23"
  /** Vega minimum (0.00 à +inf) */
  min_vega?: string; // Ex: "0.05"
  /** Volume minimum sur ce contrat */
  min_volume?: number; // Ex: 12300
  /** Ratio volume contrat/OI minimum */
  min_volume_oi_ratio?: string; // Ex: "0.32"
  /** Ratio volume contrat/volume total d'options du sous-jacent minimum (0.00 à 1.00) */
  min_volume_ticker_vol_ratio?: string; // Ex: "0.25"
  /** Champ pour ordonner */
  order?: OptionContractsOrder;
  /** Trier par ordre décroissant ou croissant. Décroissant par défaut */
  order_direction?: 'desc' | 'asc'; // Default: 'desc'
  /** Numéro de page (utiliser avec limit). Commence à la page 0 */
  page?: number; // Ex: 1
  /** Tableau de 1 ou plusieurs secteurs */
  sectors?: FinancialSector[]; // Ex: ["Consumer Cyclical","Technology"]
  /** Liste de tickers séparés par des virgules. Pour exclure certains tickers, préfixer le premier ticker avec un - */
  ticker_symbol?: string; // Ex: "AAPL,INTC"
  /** Type d'option pour filtrer si spécifié */
  type?: OptionType;
  /** Inclure uniquement les contrats où le volume est supérieur à l'intérêt ouvert */
  vol_greater_oi?: boolean;
}

// ========== Stock Screener ==========

/**
 * Ordre pour Stock Screener
 */
export type StockScreenerOrder =
  | 'avg_30_day_call_oi'
  | 'avg_30_day_call_volume'
  | 'avg_30_day_put_oi'
  | 'avg_30_day_put_volume'
  | 'avg_3_day_call_volume'
  | 'avg_3_day_put_volume'
  | 'avg_7_day_call_volume'
  | 'avg_7_day_put_volume'
  | 'bearish_premium'
  | 'bullish_premium'
  | 'call_oi_change'
  | 'call_oi_change_perc'
  | 'call_open_interest'
  | 'call_premium'
  | 'call_premium_ask_side'
  | 'call_premium_bid_side'
  | 'call_volume'
  | 'call_volume_ask_side'
  | 'call_volume_bid_side'
  | 'cum_dir_delta'
  | 'cum_dir_gamma'
  | 'cum_dir_vega'
  | 'date'
  | 'flex_oi'
  | 'flex_option_chains'
  | 'implied_move'
  | 'implied_move_perc'
  | 'iv30d'
  | 'iv30d_1d'
  | 'iv30d_1m'
  | 'iv30d_1w'
  | 'iv_rank'
  | 'marketcap'
  | 'net_call_premium'
  | 'net_premium'
  | 'net_put_premium'
  | 'new_chains'
  | 'next_dividend_date'
  | 'next_earnings_date'
  | 'perc_call_vol_ask'
  | 'perc_call_vol_bid'
  | 'perc_change'
  | 'perc_put_vol_ask'
  | 'perc_put_vol_bid'
  | 'premium'
  | 'put_call_ratio'
  | 'put_oi_change'
  | 'put_oi_change_perc'
  | 'put_open_interest'
  | 'put_premium'
  | 'put_premium_ask_side'
  | 'put_premium_bid_side'
  | 'put_volume'
  | 'put_volume_ask_side'
  | 'put_volume_bid_side'
  | 'ticker'
  | 'total_oi_change'
  | 'total_oi_change_perc'
  | 'total_open_interest'
  | 'volatility'
  | 'volume';

/**
 * Stock Screener
 * GET /screener/stocks
 */
export interface StockScreenerResult {
  /** Volume moyen d'appels sur 30 jours */
  avg_30_day_call_volume: string; // Ex: "679430.000000000000"
  /** Volume moyen de puts sur 30 jours */
  avg_30_day_put_volume: string; // Ex: "401961.285714285714"
  /** Volume moyen d'appels sur 3 jours */
  avg_3_day_call_volume: string; // Ex: "606258.533333333333"
  /** Volume moyen de puts sur 3 jours */
  avg_3_day_put_volume: string; // Ex: "436126.833333333333"
  /** Volume moyen d'appels sur 7 jours */
  avg_7_day_call_volume: string; // Ex: "679145.333333333333"
  /** Volume moyen de puts sur 7 jours */
  avg_7_day_put_volume: string; // Ex: "388676.000000000000"
  /** Prime bearish définie comme (prime d'appel côté bid) + (prime de put côté ask) */
  bearish_premium: string; // Ex: "143198625"
  /** Prime bullish définie comme (prime d'appel côté ask) + (prime de put côté bid) */
  bullish_premium: string; // Ex: "196261414"
  /** Somme de l'intérêt ouvert de toutes les options d'appel */
  call_open_interest: number; // Ex: 3975333
  /** Somme de la prime de toutes les transactions d'appel qui ont été exécutées */
  call_premium: string; // Ex: "9908777.0"
  /** Somme de la taille de toutes les transactions d'appel qui ont été exécutées */
  call_volume: number; // Ex: 990943
  /** Somme de la taille de toutes les transactions d'appel qui ont été exécutées côté ask */
  call_volume_ask_side: number; // Ex: 417251
  /** Somme de la taille de toutes les transactions d'appel qui ont été exécutées côté bid */
  call_volume_bid_side: number; // Ex: 498271
  /** Prix de clôture du stock du ticker */
  close: string; // Ex: "182.91"
  /** Heure de publication des résultats */
  er_time: 'unknown' | 'afterhours' | 'premarket'; // Ex: "premarket"
  /** Mouvement implicite du stock sous-jacent à une date donnée basé sur les contrats d'options monétaires */
  implied_move: string; // Ex: "2.2398043036460877"
  /** Mouvement implicite en pourcentage du prix du stock sous-jacent */
  implied_move_perc: string; // Ex: "0.012247398860706955"
  /** Indicateur si le ticker est un index */
  is_index: boolean; // Ex: true
  /** Type d'émission du ticker */
  issue_type: IssueType; // Ex: "Common Stock"
  /** Volatilité implicite sur 30 jours */
  iv30d: string; // Ex: "0.2038053572177887"
  /** Volatilité implicite sur 30 jours du jour de trading précédent */
  iv30d_1d: string; // Ex: "0.18791808187961578"
  /** Volatilité implicite relative à la volatilité implicite tout au long de l'année précédente */
  iv30d_1m: string; // Ex: "13.52369891956068210400"
  /** Volatilité implicite sur 30 jours d'il y a 1 semaine */
  iv30d_1w: string; // Ex: "0.18398597836494446"
  /** Rang de volatilité implicite */
  iv_rank: string; // Ex: "13.52369891956068210400"
  /** Marketcap du ticker sous-jacent. Si le type d'émission est ETF, alors le marketcap représente l'AUM */
  marketcap: string; // Ex: "2965813810400"
  /** Défini comme (prime d'appel côté ask) - (prime d'appel côté bid) */
  net_call_premium: string; // Ex: "-29138464"
  /** Défini comme (prime de put côté ask) - (prime de put côté bid) */
  net_put_premium: string; // Ex: "23924325"
  /** Prochaine date de dividende du ticker. Null si inconnue ou si le stock ne paie pas de dividendes */
  next_dividend_date: string | null; // ISO date: "2023-10-26"
  /** Prochaine date de résultats du ticker. Null si inconnue ou si le ticker n'a pas de résultats comme un ETF */
  next_earnings_date: string | null; // ISO date: "2023-10-26"
  /** Intérêt ouvert d'appel du jour de trading précédent */
  prev_call_oi: number; // Ex: 3994750
  /** Prix du stock du ticker du jour de trading précédent */
  prev_close: string; // Ex: "189.70"
  /** Intérêt ouvert de put du jour de trading précédent */
  prev_put_oi: number; // Ex: 3679410
  /** Ratio put/call défini comme volume de put / volume d'appel */
  put_call_ratio: string; // Ex: "0.815713920982337"
  /** Somme de l'intérêt ouvert de toutes les options de put */
  put_open_interest: number; // Ex: 3564153
  /** Somme de la prime de toutes les transactions de put qui ont été exécutées */
  put_premium: string; // Ex: "163537151"
  /** Somme de la taille de toutes les transactions de put qui ont été exécutées */
  put_volume: number; // Ex: 808326
  /** Somme de la taille de toutes les transactions de put qui ont été exécutées côté ask */
  put_volume_ask_side: number; // Ex: 431791
  /** Somme de la taille de toutes les transactions de put qui ont été exécutées côté bid */
  put_volume_bid_side: number; // Ex: 314160
  /** Volume relatif du stock. Le volume négocié aujourd'hui divisé par le volume moyen sur les 30 derniers jours */
  relative_volume?: string;
  /** Secteur financier du ticker */
  sector: FinancialSector | ''; // Ex: "Technology"
  /** Symbole du ticker */
  ticker: string; // Ex: "AAPL"
  /** Somme de l'intérêt ouvert de toutes les chaînes pour le ticker donné */
  total_open_interest: number;
  /** Volatilité implicite moyenne des contrats d'options put et call à la monnaie */
  volatility: string; // Ex: "0.18338055163621902"
  /** Prix du stock le plus élevé sur 52 semaines */
  week_52_high: string; // Ex: "198.23"
  /** Prix du stock le plus bas sur 52 semaines */
  week_52_low: string; // Ex: "124.17"
}

/**
 * Réponse de l'endpoint GET /screener/stocks
 */
export interface StockScreenerResponse {
  data: StockScreenerResult[];
}

/**
 * Paramètres de requête pour GET /screener/stocks
 * NOTE: Ce endpoint a beaucoup de paramètres optionnels pour le filtrage
 */
export interface StockScreenerQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
  /** Booléen pour n'inclure que les stocks qui paient des dividendes. Mettre à false n'a aucun effet */
  has_dividends?: boolean;
  /** Booléen pour n'inclure que les stocks qui font partie du S&P 500. Mettre à false n'a aucun effet */
  is_s_p_500?: boolean;
  /** Tableau de 1 ou plusieurs types d'émission */
  issue_types?: IssueType[]; // Ex: ["Common Stock","Index"]
  /** Volume de stock maximum vs volume moyen sur 30 jours */
  max_avg30_volume?: string; // Ex: "10.0"
  /** Changement d'OI d'appel maximum en pourcentage par rapport au jour précédent */
  max_call_oi_change_perc?: string; // Ex: "0.2"
  /** Prime d'options d'appel minimum */
  max_call_premium?: string; // Ex: "35000"
  /** Volume d'options d'appel maximum */
  max_call_volume?: number; // Ex: 35000
  /** Changement % maximum par rapport au jour de trading précédent */
  max_change?: string; // Ex: "0.2"
  /** Mouvement implicite maximum */
  max_implied_move?: string; // Ex: "1.4"
  /** Mouvement implicite en pourcentage maximum */
  max_implied_move_perc?: string; // Ex: "0.6"
  /** Rang IV maximum */
  max_iv_rank?: string; // Ex: "22.6"
  /** Marketcap maximum */
  max_marketcap?: string; // Ex: "250000000"
  /** Prime nette d'appel maximum */
  max_net_call_premium?: string; // Ex: "35000"
  /** Prime nette d'options maximum */
  max_net_premium?: string; // Ex: "35000"
  /** Prime nette de put maximum */
  max_net_put_premium?: string; // Ex: "35000"
  /** Intérêt ouvert maximum */
  max_oi?: number; // Ex: 35000
  /** Ratio OI vs volume d'options maximum */
  max_oi_vs_vol?: string; // Ex: "1.5"
  /** Ratio volume d'appels vs volume moyen d'appels sur 30 jours maximum */
  max_perc_30_day_call?: string; // Ex: "1.72"
  /** Ratio volume de puts vs volume moyen de puts sur 30 jours maximum */
  max_perc_30_day_put?: string; // Ex: "1.72"
  /** Ratio volume d'options vs volume moyen d'options sur 30 jours maximum */
  max_perc_30_day_total?: string; // Ex: "1.72"
  /** Ratio volume d'appels vs volume moyen d'appels sur 3 jours maximum */
  max_perc_3_day_call?: string; // Ex: "1.72"
  /** Ratio volume de puts vs volume moyen de puts sur 3 jours maximum */
  max_perc_3_day_put?: string; // Ex: "1.72"
  /** Ratio volume d'options vs volume moyen d'options sur 3 jours maximum */
  max_perc_3_day_total?: string; // Ex: "1.72"
  /** Prime d'options minimum */
  max_premium?: string; // Ex: "35000"
  /** Ratio put/call maximum */
  max_put_call_ratio?: string; // Ex: "1.5"
  /** Changement d'OI de put maximum en pourcentage par rapport au jour précédent */
  max_put_oi_change_perc?: string; // Ex: "0.2"
  /** Prime d'options de put minimum */
  max_put_premium?: string; // Ex: "35000"
  /** Volume d'options de put maximum */
  max_put_volume?: number; // Ex: 35000
  /** Changement d'OI total maximum en pourcentage par rapport au jour précédent */
  max_total_oi_change_perc?: string; // Ex: "0.2"
  /** Prix du stock maximum */
  max_underlying_price?: string; // Ex: "10.53"
  /** Volatilité maximum */
  max_volatility?: string; // Ex: "0.6"
  /** Volume d'options maximum */
  max_volume?: number; // Ex: 35000
  /** Changement d'OI d'appel minimum en pourcentage par rapport au jour précédent */
  min_call_oi_change_perc?: string; // Ex: "-0.45"
  /** Prime d'options d'appel minimum */
  min_call_premium?: string; // Ex: "10000"
  /** Volume d'options d'appel minimum */
  min_call_volume?: number; // Ex: 10000
  /** Changement % minimum par rapport au jour de trading précédent */
  min_change?: string; // Ex: "-0.45"
  /** Mouvement implicite minimum */
  min_implied_move?: string; // Ex: "0.45"
  /** Mouvement implicite en pourcentage minimum */
  min_implied_move_perc?: string; // Ex: "0.15"
  /** Rang IV minimum */
  min_iv_rank?: string; // Ex: "0.15"
  /** Marketcap minimum */
  min_marketcap?: string; // Ex: "1000000"
  /** Prime nette d'appel minimum */
  min_net_call_premium?: string; // Ex: "10000"
  /** Prime nette d'options minimum */
  min_net_premium?: string; // Ex: "10000"
  /** Prime nette de put minimum */
  min_net_put_premium?: string; // Ex: "10000"
  /** Intérêt ouvert minimum */
  min_oi?: number; // Ex: 10000
  /** Ratio OI vs volume d'options minimum */
  min_oi_vs_vol?: string; // Ex: "0.5"
  /** Ratio volume d'appels vs volume moyen d'appels sur 30 jours minimum */
  min_perc_30_day_call?: string; // Ex: "0.25"
  /** Ratio volume de puts vs volume moyen de puts sur 30 jours minimum */
  min_perc_30_day_put?: string; // Ex: "0.25"
  /** Ratio volume d'options vs volume moyen d'options sur 30 jours minimum */
  min_perc_30_day_total?: string; // Ex: "0.25"
  /** Ratio volume d'appels vs volume moyen d'appels sur 3 jours minimum */
  min_perc_3_day_call?: string; // Ex: "0.25"
  /** Ratio volume de puts vs volume moyen de puts sur 3 jours minimum */
  min_perc_3_day_put?: string; // Ex: "0.25"
  /** Ratio volume d'options vs volume moyen d'options sur 3 jours minimum */
  min_perc_3_day_total?: string; // Ex: "0.25"
  /** Prime d'options minimum */
  min_premium?: string; // Ex: "10000"
  /** Ratio put/call minimum */
  min_put_call_ratio?: string; // Ex: "0.5"
  /** Changement d'OI de put minimum en pourcentage par rapport au jour précédent */
  min_put_oi_change_perc?: string; // Ex: "-0.45"
  /** Prime d'options de put minimum */
  min_put_premium?: string; // Ex: "10000"
  /** Volume d'options de put minimum */
  min_put_volume?: number; // Ex: 10000
  /** Volume de stock minimum vs volume moyen sur 30 jours */
  min_stock_volume_vs_avg30_volume?: string; // Ex: "1.2"
  /** Changement d'OI total minimum en pourcentage par rapport au jour précédent */
  min_total_oi_change_perc?: string; // Ex: "-0.45"
  /** Prix du stock minimum */
  min_underlying_price?: string; // Ex: "5.23"
  /** Volatilité minimum */
  min_volatility?: string; // Ex: "0.15"
  /** Volume d'options minimum */
  min_volume?: number; // Ex: 10000
  /** Champ pour ordonner */
  order?: StockScreenerOrder;
  /** Trier par ordre décroissant ou croissant. Décroissant par défaut */
  order_direction?: 'desc' | 'asc'; // Default: 'desc'
  /** Tableau de 1 ou plusieurs secteurs */
  sectors?: FinancialSector[]; // Ex: ["Consumer Cyclical","Technology"]
  /** Liste de tickers séparés par des virgules. Pour exclure certains tickers, préfixer le premier ticker avec un - */
  ticker?: string; // Ex: "AAPL,INTC"
}

