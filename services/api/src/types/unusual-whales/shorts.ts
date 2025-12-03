/**
 * Types pour les endpoints Unusual Whales - Shorts
 * Basés sur la documentation officielle: https://api.unusualwhales.com/api
 */

// ========== Short Data ==========

/**
 * Données de short
 * GET /shorts/{ticker}/data
 */
export interface ShortData {
  /** Devise utilisée pour les taux de frais et de rebate */
  currency: string; // Ex: "USD"
  /** Taux de frais pour short le stock, exprimé en pourcentage */
  fee_rate: string; // Ex: "0.42"
  /** Nom de l'entreprise */
  name: string; // Ex: "EXAMPLE COMPANY INC"
  /** Taux de rebate pour short le stock, exprimé en pourcentage */
  rebate_rate: string; // Ex: "2.75"
  /** Nombre d'actions disponibles pour short */
  short_shares_available: number; // Ex: 5000000
  /** Symbole du ticker */
  symbol: string; // Ex: "EXMP"
  /** Timestamp lorsque les données de short ont été enregistrées */
  timestamp: string; // ISO timestamp: "2025-03-15T14:30:00Z"
}

/**
 * Réponse de l'endpoint GET /shorts/{ticker}/data
 */
export interface ShortDataResponse {
  data: ShortData[];
}

/**
 * Paramètres de requête pour GET /shorts/{ticker}/data
 */
export interface ShortDataQueryParams {
  /** Aucun paramètre selon la documentation */
}

// ========== Failures to Deliver ==========

/**
 * Failures to Deliver
 * GET /shorts/{ticker}/ftds
 */
export interface FailureToDeliver {
  /** Date des failures to deliver */
  date: any; // Ex: "2023-04-10"
  /** Prix de clôture du stock du ticker */
  price: string; // Ex: "182.91"
  /** Quantité de failures to deliver pour le jour */
  quantity: string; // Ex: "1250"
}

/**
 * Réponse de l'endpoint GET /shorts/{ticker}/ftds
 */
export interface FailuresToDeliverResponse {
  data: FailureToDeliver[];
}

/**
 * Paramètres de requête pour GET /shorts/{ticker}/ftds
 */
export interface FailuresToDeliverQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
}

// ========== Short Interest and Float ==========

/**
 * Short Interest and Float
 * GET /shorts/{ticker}/interest-float
 */
export interface ShortInterestAndFloat {
  /** Datetime lorsque l'enregistrement a été créé */
  created_at: string; // ISO timestamp: "2023-04-15T16:30:00Z"
  /** Nombre estimé de jours pour couvrir toutes les positions short basé sur le volume de trading quotidien moyen */
  days_to_cover_returned: string; // Ex: "2.1"
  /** Date des données de short interest */
  market_date: any; // Ex: "2023-04-15"
  /** Pourcentage du float qui est short */
  percent_returned: string; // Ex: "5.67"
  /** Nombre d'actions shortées */
  si_float_returned: number; // Ex: 4250000
  /** Symbole du ticker */
  symbol: string; // Ex: "EXMP"
  /** Float (actions disponibles pour le trading) */
  total_float_returned: number; // Ex: 75000000
}

/**
 * Réponse de l'endpoint GET /shorts/{ticker}/interest-float
 */
export interface ShortInterestAndFloatResponse {
  data: ShortInterestAndFloat;
}

/**
 * Paramètres de requête pour GET /shorts/{ticker}/interest-float
 */
export interface ShortInterestAndFloatQueryParams {
  /** Aucun paramètre selon la documentation */
}

// ========== Short Volume and Ratio ==========

/**
 * Short Volume and Ratio
 * GET /shorts/{ticker}/volume-and-ratio
 */
export interface ShortVolumeAndRatio {
  /** Prix de clôture du stock du ticker */
  close_price: string; // Ex: "182.91"
  /** Date pour le short interest */
  market_date: any; // Ex: "2023-04-10"
  /** Volume de short */
  short_volume: string; // Ex: "925000"
  /** Ratio relatif du volume de short au volume total */
  short_volume_ratio: string; // Ex: "0.14"
  /** Volume total */
  total_volume: string; // Ex: "6607143"
}

/**
 * Réponse de l'endpoint GET /shorts/{ticker}/volume-and-ratio
 */
export interface ShortVolumeAndRatioResponse {
  data: ShortVolumeAndRatio[];
}

/**
 * Paramètres de requête pour GET /shorts/{ticker}/volume-and-ratio
 */
export interface ShortVolumeAndRatioQueryParams {
  /** Aucun paramètre selon la documentation */
}

// ========== Short Volume By Exchange ==========

/**
 * Short Volume By Exchange
 * GET /shorts/{ticker}/volumes-by-exchange
 */
export interface ShortVolumeByExchange {
  /** Date des données de volume de short */
  date: any; // Ex: "2023-04-15"
  /** Identifiant de l'échange */
  exchange_name: string; // Ex: "NYSE"
  /** Identifiant du centre de marché */
  market_center: string; // Ex: "NYSE"
  /** Volume de short pour cet échange */
  short_volume: number; // Ex: 325000
  /** Volume total pour cet échange */
  total_volume: number; // Ex: 2150000
}

/**
 * Réponse de l'endpoint GET /shorts/{ticker}/volumes-by-exchange
 */
export interface ShortVolumeByExchangeResponse {
  data: ShortVolumeByExchange[];
}

/**
 * Paramètres de requête pour GET /shorts/{ticker}/volumes-by-exchange
 */
export interface ShortVolumeByExchangeQueryParams {
  /** Aucun paramètre selon la documentation */
}

