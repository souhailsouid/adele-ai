/**
 * Types pour les endpoints Unusual Whales - Group Flow
 * Basés sur la documentation officielle: https://api.unusualwhales.com/api
 */

// ========== Enums ==========

/**
 * Flow group - Groupe de flow où les données de flow pour tous les tickers de ce groupe sont agrégées
 */
export type FlowGroup =
  | 'airline'
  | 'bank'
  | 'basic materials'
  | 'china'
  | 'communication services'
  | 'consumer cyclical'
  | 'consumer defensive'
  | 'crypto'
  | 'cyber'
  | 'energy'
  | 'financial services'
  | 'gas'
  | 'gold'
  | 'healthcare'
  | 'industrials'
  | 'mag7'
  | 'oil'
  | 'real estate'
  | 'refiners'
  | 'reit'
  | 'semi'
  | 'silver'
  | 'technology'
  | 'uranium'
  | 'utilities';

// ========== Greek Flow ==========

/**
 * Greek flow par flow group et minute
 * GET /group-flow/{flow_group}/greek-flow
 */
export interface GroupGreekFlow {
  /** Le directional delta flow */
  dir_delta_flow: string; // Ex: "-43593.96"
  /** Le directional vega flow */
  dir_vega_flow: string; // Ex: "31243.04"
  /** Flow group où les données de flow pour tous les tickers de ce groupe sont agrégées */
  flow_group: FlowGroup; // Ex: "airline"
  /** Défini comme (call premium ask side) - (call premium bid side) */
  net_call_premium: string; // Ex: "-29138464"
  /** Défini comme (call volume ask side) - (call volume bid side) */
  net_call_volume: number; // Ex: 1049
  /** Défini comme (put premium ask side) - (put premium bid side) */
  net_put_premium: string; // Ex: "23924325"
  /** Défini comme (put volume ask side) - (put volume bid side) */
  net_put_volume: number; // Ex: 1313
  /** Le directional delta flow des options out-of-the-money */
  otm_dir_delta_flow: string; // Ex: "14947.51"
  /** Le directional vega flow des options out-of-the-money */
  otm_dir_vega_flow: string; // Ex: "11421.03"
  /** Le total delta flow des options out-of-the-money */
  otm_total_delta_flow: string; // Ex: "-28564.02"
  /** Le total vega flow des options out-of-the-money */
  otm_total_vega_flow: string; // Ex: "101745.64"
  /** Timestamp (début de minute) des données */
  timestamp: string; // ISO date-time: "2024-10-28T18:46:00Z"
  /** Le total delta flow */
  total_delta_flow: string; // Ex: "-21257.36"
  /** Le total vega flow */
  total_vega_flow: string; // Ex: "350944.58"
  /** Le nombre de transactions */
  transactions: number; // Ex: 1188
  /** Le volume total d'options */
  volume: number; // Ex: 12348
}

/**
 * Greek flow par flow group, minute et expiry
 * GET /group-flow/{flow_group}/greek-flow/{expiry}
 */
export interface GroupGreekFlowByExpiry extends GroupGreekFlow {
  /** Date d'expiration du contrat (format ISO) */
  expiry: string; // ISO date: "2023-12-22"
}

// ========== Responses ==========

/**
 * Réponse de l'endpoint GET /group-flow/{flow_group}/greek-flow
 */
export interface GroupGreekFlowResponse {
  data: GroupGreekFlow[];
}

/**
 * Réponse de l'endpoint GET /group-flow/{flow_group}/greek-flow/{expiry}
 */
export interface GroupGreekFlowByExpiryResponse {
  data: GroupGreekFlowByExpiry[];
}

// ========== Query Parameters ==========

/**
 * Paramètres de requête pour GET /group-flow/{flow_group}/greek-flow
 */
export interface GroupGreekFlowQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // Ex: "2024-01-18"
}

/**
 * Paramètres de requête pour GET /group-flow/{flow_group}/greek-flow/{expiry}
 */
export interface GroupGreekFlowByExpiryQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // Ex: "2024-01-18"
}

