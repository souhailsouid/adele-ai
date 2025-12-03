/**
 * Types pour les endpoints Unusual Whales - Earnings
 * Basés sur la documentation officielle: https://api.unusualwhales.com/api
 */

// ========== Enums ==========

/**
 * Secteur financier
 */
export type FinancialSector =
  | 'Basic Materials'
  | 'Communication Services'
  | 'Consumer Cyclical'
  | 'Consumer Defensive'
  | 'Energy'
  | 'Financial Services'
  | 'Healthcare'
  | 'Industrials'
  | 'Real Estate'
  | 'Technology'
  | 'Utilities';

/**
 * Temps de rapport des earnings
 */
export type ReportTime = 'premarket' | 'postmarket' | 'unknown';

/**
 * Source du rapport (company ou estimation)
 */
export type EarningsSource = 'company' | 'estimation';

// ========== Earnings Data ==========

/**
 * Données d'earnings pour afterhours/premarket (format commun)
 */
export interface EarningsData {
  /** EPS réel */
  actual_eps: string; // Ex: "1.44"
  /** Continent */
  continent: string; // Ex: "North America"
  /** Code pays */
  country_code: string; // Ex: "US"
  /** Nom du pays */
  country_name: string; // Ex: "UNITED STATES"
  /** Fin du trimestre fiscal (date ISO) */
  ending_fiscal_quarter: string; // ISO date: "2024-01-09"
  /** Mouvement attendu en $ */
  expected_move: string; // Ex: "1.23"
  /** Mouvement attendu en % */
  expected_move_perc: string; // Ex: "0.08"
  /** Nom complet de l'entreprise */
  full_name: string; // Ex: "MICROSOFT CORP"
  /** Si l'entreprise a des options disponibles pour le trading */
  has_options: boolean | null; // Ex: true
  /** Si c'est dans le S&P 500 */
  is_s_p_500: boolean;
  /** Market cap */
  marketcap: string; // Ex: "152983052"
  /** Prix de clôture après earnings */
  post_earnings_close: string; // Ex: "182.91"
  /** Date après earnings (date ISO) */
  post_earnings_date: string; // ISO date: "2024-01-09"
  /** Prix de clôture avant earnings */
  pre_earnings_close: string; // Ex: "182.91"
  /** Date avant earnings (date ISO) */
  pre_earnings_date: string; // ISO date: "2024-01-09"
  /** Mouvement % du stock 1 jour après le rapport d'earnings */
  reaction: string; // Ex: "0.15"
  /** Date du rapport (date ISO) */
  report_date: string; // ISO date: "2024-01-09"
  /** Temps du rapport d'earnings */
  report_time: ReportTime; // "premarket", "postmarket" ou "unknown"
  /** Secteur financier */
  sector: FinancialSector;
  /** Source du rapport */
  source: EarningsSource; // "company" ou "estimation"
  /** Estimations EPS moyennes de la Street */
  street_mean_est: string; // Ex: "1.34"
  /** Symbole du ticker */
  symbol: string; // Ex: "MSFT"
}

/**
 * Données d'earnings historiques pour un ticker (format avec plus de détails)
 */
export interface HistoricalEarningsData {
  /** EPS réel */
  actual_eps: string; // Ex: "2.45"
  /** Fin du trimestre fiscal (date ISO) */
  ending_fiscal_quarter: string; // ISO date: "2024-09-30"
  /** Mouvement attendu en $ */
  expected_move: string; // Ex: "9.91"
  /** Mouvement attendu en % */
  expected_move_perc: string; // Ex: "0.0359"
  /** Retour % 1 jour pour le long ATM straddle le plus proche */
  long_straddle_1d: string; // Ex: "0.2349"
  /** Retour % 1 semaine pour le long ATM straddle le plus proche */
  long_straddle_1w: string; // Ex: "0.0129"
  /** Mouvement % 1 jour après le rapport d'earnings */
  post_earnings_move_1d: string; // Ex: "0.0724"
  /** Mouvement % 1 semaine après le rapport d'earnings */
  post_earnings_move_1w: string; // Ex: "0.132"
  /** Mouvement % 2 semaines après le rapport d'earnings */
  post_earnings_move_2w: string; // Ex: "0.1582"
  /** Mouvement % 3 jours après le rapport d'earnings */
  post_earnings_move_3d: string; // Ex: "0.0231"
  /** Mouvement % 1 jour jusqu'au rapport d'earnings */
  pre_earnings_move_1d: string; // Ex: "0.0724"
  /** Mouvement % 1 semaine jusqu'au rapport d'earnings */
  pre_earnings_move_1w: string; // Ex: "0.132"
  /** Mouvement % 2 semaines jusqu'au rapport d'earnings */
  pre_earnings_move_2w: string; // Ex: "0.1582"
  /** Mouvement % 3 jours jusqu'au rapport d'earnings */
  pre_earnings_move_3d: string; // Ex: "0.0231"
  /** Date du rapport (date ISO) */
  report_date: string; // ISO date: "2024-11-10"
  /** Temps du rapport d'earnings */
  report_time: ReportTime; // "premarket", "postmarket" ou "unknown"
  /** Retour % 1 jour pour le short ATM straddle le plus proche */
  short_straddle_1d: string; // Ex: "-0.5830"
  /** Retour % 1 semaine pour le short ATM straddle le plus proche */
  short_straddle_1w: string; // Ex: "-0.005"
  /** Source du rapport */
  source: EarningsSource; // "company" ou "estimation"
  /** Estimations EPS moyennes de la Street */
  street_mean_est: string; // Ex: "2.25"
}

// ========== Responses ==========

/**
 * Réponse de l'endpoint GET /earnings/afterhours
 */
export interface EarningsAfterhoursResponse {
  data: EarningsData[];
}

/**
 * Réponse de l'endpoint GET /earnings/premarket
 */
export interface EarningsPremarketResponse {
  data: EarningsData[];
}

/**
 * Réponse de l'endpoint GET /earnings/{ticker}
 */
export interface EarningsHistoricalResponse {
  data: HistoricalEarningsData[];
}

// ========== Query Parameters ==========

/**
 * Paramètres de requête pour GET /earnings/afterhours
 */
export interface EarningsAfterhoursQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // Ex: "2024-01-18"
  /** Nombre d'éléments à retourner (1-100, défaut: 50) */
  limit?: number; // Min: 1, Max: 100, Default: 50
  /** Numéro de page (utiliser avec limit). Commence à la page 0 */
  page?: number; // Ex: 1
}

/**
 * Paramètres de requête pour GET /earnings/premarket
 */
export interface EarningsPremarketQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // Ex: "2024-01-18"
  /** Nombre d'éléments à retourner (1-100, défaut: 50) */
  limit?: number; // Min: 1, Max: 100, Default: 50
  /** Numéro de page (utiliser avec limit). Commence à la page 0 */
  page?: number; // Ex: 1
}

/**
 * Paramètres de requête pour GET /earnings/{ticker}
 * (Aucun paramètre selon la documentation)
 */
export interface EarningsHistoricalQueryParams {
  // Pas de paramètres selon la documentation
}

