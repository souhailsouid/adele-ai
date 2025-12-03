/**
 * Types pour les endpoints Unusual Whales - Alerts
 * Basés sur la documentation officielle: https://api.unusualwhales.com/api
 */

// ========== Alert Configuration ==========

/**
 * Statut d'une configuration d'alerte
 */
export type AlertStatus = 'active' | 'rate_limit' | 'paused';

/**
 * Type de notification d'alerte
 */
export type NotificationType =
  | 'stock'
  | 'news'
  | 'earnings'
  | 'dividends'
  | 'splits'
  | 'option_contract'
  | 'price_target'
  | 'analyst_rating'
  | 'option_contract_interval'
  | 'insider_trades'
  | 'trading_state'
  | 'fda'
  | 'economic_release'
  | 'politician_trades'
  | 'market_tide'
  | 'sec_filings'
  | 'flow_alerts'
  | 'chain_oi_change'
  | 'gex';

/**
 * Configuration d'une alerte (schéma variable selon le type)
 * Exemples de configs selon la doc:
 * - chain_oi_change: { option_symbols: string[], symbols: string }
 * - sec_filings: { name_contains: string[], symbols: string }
 */
export type AlertConfig = Record<string, any>;

/**
 * Configuration d'alerte retournée par l'API
 * GET /alerts/configuration
 */
export interface AlertConfiguration {
  /** Configuration de l'alerte (schéma variable) */
  config: AlertConfig;
  /** Date de création */
  created_at: string; // ISO 8601 format: "2024-11-19T18:19:14Z"
  /** ID unique de la configuration */
  id: string; // UUID format: "ebe24953-a0bf-4b4d-98be-14f721a1199a"
  /** Nom de l'alerte */
  name: string; // Ex: "Chain OI Chg: TGT241122C00177500"
  /** Type de notification */
  noti_type: NotificationType;
  /** Statut de l'alerte */
  status: AlertStatus;
  /** Mobile only flag (optionnel selon la doc) */
  mobile_only?: boolean;
}

/**
 * Réponse de l'endpoint GET /alerts/configuration
 */
export interface AlertConfigurationResponse {
  data: AlertConfiguration[];
}

// ========== Alerts (Triggered) ==========

/**
 * Type de symbole dans une alerte déclenchée
 */
export type SymbolType = 'stock' | 'option';

/**
 * Métadonnées d'une alerte déclenchée (schéma variable selon le type)
 * Exemples selon la doc:
 * - dividends: { alert_type, date, div_yield, dividend, frequency, payment_date, prev_dividend }
 * - trading_state: { avg_vol_30, curr, curr_vol, prev, reason, sector, state }
 */
export type AlertMeta = Record<string, any>;

/**
 * Alerte déclenchée retournée par l'API
 * GET /alerts
 */
export interface Alert {
  /** Date de création de l'alerte */
  created_at: string; // ISO 8601 format: "2024-12-11T14:00:00Z"
  /** ID unique de l'alerte */
  id: string; // UUID format: "fdc2cf91-d387-480f-a79e-28026447a6f5"
  /** Données brutes de l'alerte (schéma variable selon le type) */
  meta: AlertMeta;
  /** Nom de l'alerte */
  name: string; // Ex: "S&P 500 Dividends"
  /** Type de notification */
  noti_type: NotificationType;
  /** Symbole (ticker stock ou option contract) */
  symbol: string; // Ex: "AMCR" ou "TGT241122C00177500"
  /** Type de symbole */
  symbol_type?: SymbolType; // "stock" ou "option"
  /** Temps de l'alerte sur le tape */
  tape_time: string; // ISO 8601 format: "2024-12-11T14:00:00Z"
  /** ID de la configuration d'alerte utilisateur */
  user_noti_config_id: string; // UUID format: "cb70c287-f10a-4e63-98ad-571b7dafc8e4"
}

/**
 * Réponse de l'endpoint GET /alerts
 */
export interface AlertsResponse {
  data: Alert[];
}

// ========== Query Parameters ==========

/**
 * Paramètres de requête pour GET /alerts
 */
export interface AlertsQueryParams {
  /** Liste d'IDs de configuration pour filtrer */
  config_ids?: string[]; // Ex: ["ded2bee3-68fe-4aff-8316-f6ddbcf7ea67"]
  /** Retourner uniquement les alertes intraday */
  intraday_only?: boolean; // Défaut: true
  /** Nombre d'éléments à retourner (1-500, défaut: 50) */
  limit?: number; // Min: 1, Max: 500, Default: 50
  /** Filtrer les alertes créées après ce timestamp (ISO ou unix) */
  newer_than?: string; // ISO format ou unix timestamp
  /** Liste de types de notifications */
  noti_types?: NotificationType[];
  /** Filtrer les alertes créées avant ce timestamp (ISO ou unix) */
  older_than?: string; // ISO format ou unix timestamp
  /** Liste de tickers séparés par virgule (préfixer avec - pour exclure) */
  ticker_symbols?: string; // Ex: "AAPL,INTC" ou "-AAPL,INTC"
}

/**
 * Paramètres de requête pour GET /alerts/configuration
 * (Aucun paramètre selon la doc)
 */
export interface AlertConfigurationQueryParams {
  // Pas de paramètres selon la documentation
}

