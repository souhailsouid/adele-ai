/**
 * Types pour les endpoints Unusual Whales - Dark Pool
 * Basés sur la documentation officielle: https://api.unusualwhales.com/api
 */

// ========== Enums ==========

/**
 * Code décrivant pourquoi le trade s'est produit en dehors des heures normales de marché
 */
export type ExtendedHourSoldCode =
  | 'sold_out_of_sequence'
  | 'extended_hours_trade_late_or_out_of_sequence'
  | 'extended_hours_trade'
  | null;

/**
 * Code de condition de vente
 */
export type SaleConditionCode =
  | 'contingent_trade'
  | 'odd_lot_execution'
  | 'prior_reference_price'
  | 'average_price_trade'
  | null;

/**
 * Code de trade
 */
export type TradeCode =
  | 'derivative_priced'
  | 'qualified_contingent_trade'
  | 'intermarket_sweep'
  | null;

/**
 * Type de settlement du trade
 */
export type TradeSettlement =
  | 'cash'
  | 'next_day'
  | 'seller'
  | 'regular'
  | 'cash_settlement'
  | 'regular_settlement';

// ========== Dark Pool Trade ==========

/**
 * Trade Dark Pool (format commun pour tous les endpoints)
 */
export interface DarkPoolTrade {
  /** Si le trade a été annulé */
  canceled: boolean;
  /** Temps avec timezone quand le trade a été exécuté */
  executed_at: string; // ISO 8601 format: "2023-02-16T00:59:44Z"
  /** Code décrivant pourquoi le trade s'est produit en dehors des heures normales */
  ext_hour_sold_codes: ExtendedHourSoldCode;
  /** Code du centre de marché */
  market_center: string; // Ex: "L"
  /** NBBO Ask (peut être string ou number selon la doc) */
  nbbo_ask: string | number | null;
  /** Quantité NBBO Ask */
  nbbo_ask_quantity: number | null;
  /** NBBO Bid (peut être string ou number selon la doc) */
  nbbo_bid: string | number | null;
  /** Quantité NBBO Bid */
  nbbo_bid_quantity: number | null;
  /** Premium total de l'option */
  premium: string; // Ex: "27723806.00"
  /** Prix du trade */
  price: string; // Ex: "18.9904"
  /** Code de condition de vente */
  sale_cond_codes: SaleConditionCode;
  /** Taille de la transaction */
  size: number; // Ex: 6400
  /** Symbole du ticker */
  ticker: string; // Ex: "AAPL"
  /** ID de suivi du trade */
  tracking_id: number; // Ex: 71984388012245
  /** Code de trade */
  trade_code: TradeCode;
  /** Type de settlement du trade */
  trade_settlement: TradeSettlement;
  /** Volume du ticker pour le jour de trading */
  volume: number; // Ex: 23132119
}

// ========== Responses ==========

/**
 * Réponse de l'endpoint GET /darkpool/recent
 */
export interface DarkPoolRecentResponse {
  data: DarkPoolTrade[];
}

/**
 * Réponse de l'endpoint GET /darkpool/{ticker}
 */
export interface DarkPoolTickerResponse {
  data: DarkPoolTrade[];
}

// ========== Query Parameters ==========

/**
 * Paramètres de requête pour GET /darkpool/recent
 */
export interface DarkPoolRecentQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // Ex: "2024-01-18"
  /** Nombre d'éléments à retourner (1-200, défaut: 100) */
  limit?: number; // Min: 1, Max: 200, Default: 100
  /** Premium maximum que les trades doivent avoir */
  max_premium?: number; // Ex: 150000
  /** Taille maximum que les trades doivent avoir (entier positif) */
  max_size?: number; // Ex: 150000
  /** Volume consolidé maximum que les trades doivent avoir (entier positif) */
  max_volume?: number; // Ex: 150000
  /** Premium minimum que les trades doivent avoir (>= 0, défaut: 0) */
  min_premium?: number; // Min: 0, Default: 0, Ex: 50000
  /** Taille minimum que les trades doivent avoir (entier positif, >= 0, défaut: 0) */
  min_size?: number; // Min: 0, Default: 0, Ex: 50000
  /** Volume consolidé minimum que les trades doivent avoir (entier positif, >= 0, défaut: 0) */
  min_volume?: number; // Min: 0, Default: 0, Ex: 50000
}

/**
 * Paramètres de requête pour GET /darkpool/{ticker}
 */
export interface DarkPoolTickerQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // Ex: "2024-01-18"
  /** Nombre d'éléments à retourner (1-500, défaut: 500) */
  limit?: number; // Min: 1, Max: 500, Default: 500
  /** Premium maximum que les trades doivent avoir */
  max_premium?: number; // Ex: 150000
  /** Taille maximum que les trades doivent avoir (entier positif) */
  max_size?: number; // Ex: 150000
  /** Volume consolidé maximum que les trades doivent avoir (entier positif) */
  max_volume?: number; // Ex: 150000
  /** Premium minimum que les trades doivent avoir (>= 0, défaut: 0) */
  min_premium?: number; // Min: 0, Default: 0, Ex: 50000
  /** Taille minimum que les trades doivent avoir (entier positif, >= 0, défaut: 0) */
  min_size?: number; // Min: 0, Default: 0, Ex: 50000
  /** Volume consolidé minimum que les trades doivent avoir (entier positif, >= 0, défaut: 0) */
  min_volume?: number; // Min: 0, Default: 0, Ex: 50000
  /** Timestamp unix en millisecondes ou secondes à partir duquel aucun résultat plus ancien ne sera retourné. 
   * Peut être utilisé avec older_than pour paginer par temps. Accepte aussi une date ISO (ex: 2024-01-25) */
  newer_than?: string; // Unix timestamp ou ISO date
  /** Timestamp unix en millisecondes ou secondes à partir duquel aucun résultat plus récent ne sera retourné. 
   * Peut être utilisé avec newer_than pour paginer par temps. Accepte aussi une date ISO (ex: 2024-01-25) */
  older_than?: string; // Unix timestamp ou ISO date
}

