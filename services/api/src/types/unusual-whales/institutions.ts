/**
 * Types pour les endpoints Unusual Whales - Institutions
 * Basés sur la documentation officielle: https://api.unusualwhales.com/api
 */

import type { FinancialSector } from './earnings';

// ========== Enums ==========

/**
 * Type de sécurité
 */
export type SecurityType = 'Share' | 'Fund' | 'Put' | 'Call' | 'Warrant' | 'Debt' | 'Pfd' | string;

/**
 * Put ou Call (null si ni l'un ni l'autre)
 */
export type PutCall = 'put' | 'call' | null;

/**
 * Direction de tri
 */
export type OrderDirection = 'desc' | 'asc';

// ========== Institutional Activity ==========

/**
 * Activité de trading d'une institution
 * GET /institution/{name}/activity
 */
export interface InstitutionalActivity {
  /** Prix moyen */
  avg_price: string; // Ex: "23.49"
  /** Prix d'achat */
  buy_price: string | null; // Ex: "23.49" ou null
  /** Prix de clôture du stock du ticker */
  close: string; // Ex: "182.91"
  /** Date de dépôt (date ISO) */
  filing_date: string; // ISO date: "2024-01-09"
  /** Prix de la sécurité à la date de dépôt */
  price_on_filing: string; // Ex: "23.49"
  /** Prix de la sécurité à la date de rapport */
  price_on_report: string; // Ex: "23.49"
  /** Si le holding est un put ou un call (null si ni l'un ni l'autre) */
  put_call: PutCall; // "put", "call" ou null
  /** Date de rapport (date ISO) */
  report_date: string; // ISO date: "2024-01-09"
  /** Type de sécurité */
  security_type: SecurityType; // Ex: "Share"
  /** Prix de vente */
  sell_price: string | null; // Ex: "23.49" ou null
  /** Total des actions en circulation pour le ticker */
  shares_outstanding: string; // Ex: "424295343.0"
  /** Ticker */
  ticker: string; // Ex: "MSFT"
  /** Unités */
  units: number; // Ex: 4103
  /** Changement d'unités */
  units_change: number; // Ex: -320
}

/**
 * Réponse de l'endpoint GET /institution/{name}/activity
 */
export interface InstitutionalActivityResponse {
  data: InstitutionalActivity[];
}

// ========== Institutional Holdings ==========

/**
 * Historical Units (maximum length = 8)
 */
export type HistoricalUnits = number[]; // Ex: [4103, 4423]

/**
 * Holding d'une institution
 * GET /institution/{name}/holdings
 */
export interface InstitutionalHolding {
  /** Prix moyen */
  avg_price: string; // Ex: "23.49"
  /** Prix de clôture du stock du ticker */
  close: string; // Ex: "182.91"
  /** Date (date ISO) */
  date: string; // ISO date: "2024-01-09"
  /** Date du premier achat (date ISO) */
  first_buy: string; // ISO date: "2024-01-09"
  /** Nom complet */
  full_name: string; // Ex: "MICROSOFT CORP"
  /** Comptes d'unités historiques. Longueur maximum = 8 */
  historical_units: HistoricalUnits; // Ex: [4103, 4423]
  /** Pourcentage de la valeur totale des actions de cette institution que ce holding représente */
  perc_of_share_value: number; // Ex: 0.04
  /** Pourcentage du total des actions en circulation détenues par cette institution */
  perc_of_total: number; // Ex: 0.002
  /** Prix de clôture du ticker à la date du premier achat */
  price_first_buy: string; // Ex: "42.39"
  /** Si le holding est un put ou un call (null si ni l'un ni l'autre) */
  put_call: PutCall; // "put", "call" ou null
  /** Secteur financier */
  sector: FinancialSector; // Ex: "Technology"
  /** Type de sécurité */
  security_type: SecurityType; // Ex: "Share"
  /** Total des actions en circulation pour le ticker */
  shares_outstanding: string; // Ex: "424295343.0"
  /** Ticker */
  ticker: string; // Ex: "MSFT"
  /** Unités */
  units: number; // Ex: 4103
  /** Changement d'unités */
  units_change: number; // Ex: -320
  /** Valeur totale arrondie à la date de rapport */
  value: number; // Ex: 2429329
}

/**
 * Réponse de l'endpoint GET /institution/{name}/holdings
 */
export interface InstitutionalHoldingsResponse {
  data: InstitutionalHolding[];
}

// ========== Sector Exposure ==========

/**
 * Exposition sectorielle d'une institution
 * GET /institution/{name}/sectors
 */
export interface SectorExposure {
  /** Nombre de positions */
  positions: number; // Ex: 5
  /** Positions fermées */
  positions_closed: number; // Ex: 2
  /** Positions diminuées */
  positions_decreased: number; // Ex: 2
  /** Positions augmentées */
  positions_increased: number; // Ex: 2
  /** Date de rapport (date ISO) */
  report_date: string; // ISO date: "2024-01-09"
  /** Secteur financier */
  sector: FinancialSector; // Ex: "Technology"
  /** Valeur totale arrondie à la date de rapport */
  value: string | number; // Ex: "1948023952" ou 2429329
}

/**
 * Réponse de l'endpoint GET /institution/{name}/sectors
 */
export interface SectorExposureResponse {
  data: SectorExposure[];
}

// ========== Institutional Ownership ==========

/**
 * Tags d'institution
 */
export type InstitutionTags = string[]; // Ex: ["activist", "value_investor"]

/**
 * People of interest
 */
export type PeopleOfInterest = string[]; // Ex: ["Paul Singer"]

/**
 * Propriété institutionnelle d'un ticker
 * GET /institution/{ticker}/ownership
 */
export interface InstitutionalOwnership {
  /** Prix moyen */
  avg_price: string; // Ex: "23.49"
  /** Date de dépôt (date ISO) */
  filing_date: string; // ISO date: "2024-01-09"
  /** Date du premier achat (date ISO) */
  first_buy: string; // ISO date: "2024-01-09"
  /** Comptes d'unités historiques. Longueur maximum = 8 */
  historical_units: HistoricalUnits; // Ex: [4103, 4423]
  /** Valeur totale arrondie des actions dans le portefeuille de l'institution */
  inst_share_value: string; // Ex: "2394292.0"
  /** Valeur totale arrondie du portefeuille de l'institution */
  inst_value: string; // Ex: "2394292.0"
  /** Nom de l'institution */
  name: string; // Ex: "VANGUARD GROUP INC"
  /** Personnes d'intérêt dans l'institution */
  people: PeopleOfInterest; // Ex: ["Paul Singer"]
  /** Date de rapport (date ISO) */
  report_date: string; // ISO date: "2024-01-09"
  /** Total des actions en circulation pour le ticker */
  shares_outstanding: string; // Ex: "424295343.0"
  /** Nom court de l'institution */
  short_name: string; // Ex: "Vanguard"
  /** Tags liés à l'institution */
  tags: InstitutionTags; // Ex: ["activist", "value_investor"]
  /** Unités */
  units: number; // Ex: 4103
  /** Changement d'unités */
  units_change: number; // Ex: -320
  /** Valeur totale arrondie à la date de rapport */
  value: string | number; // Ex: "2934823.0" ou 2429329
}

/**
 * Réponse de l'endpoint GET /institution/{ticker}/ownership
 */
export interface InstitutionalOwnershipResponse {
  data: InstitutionalOwnership[];
}

// ========== Institution Summary ==========

/**
 * Résumé d'une institution
 * GET /institutions
 */
export interface InstitutionSummary {
  /** Valeur totale arrondie d'achat dans le portefeuille de l'institution */
  buy_value: string; // Ex: "2394292.0"
  /** Nombre d'unités call dans le portefeuille de l'institution */
  call_holdings: string; // Ex: "2394292.0"
  /** Valeur totale arrondie call dans le portefeuille de l'institution */
  call_value: string; // Ex: "2394292.0"
  /** CIK de l'institution */
  cik: string; // Ex: "0000102909"
  /** Date de fin de la période de rapport (format ISO) */
  date: string; // ISO date: "2024-10-02"
  /** Nombre d'unités debt dans le portefeuille de l'institution */
  debt_holdings: string; // Ex: "2394292.0"
  /** Valeur totale arrondie debt dans le portefeuille de l'institution */
  debt_value: string; // Ex: "2394292.0"
  /** Description de l'institution */
  description: string; // Ex: "Florida-based hedge fund..."
  /** Date de dépôt la plus récente (format ISO) */
  filing_date: string; // ISO date: "2024-10-02"
  /** URL de l'image du fondateur de l'institution */
  founder_img_url: string | null; // Ex: "https://..." ou null
  /** Nombre d'unités fund dans le portefeuille de l'institution */
  fund_holdings: string; // Ex: "2394292.0"
  /** Valeur totale arrondie fund dans le portefeuille de l'institution */
  fund_value: string; // Ex: "2394292.0"
  /** Si c'est un hedge fund */
  is_hedge_fund: boolean; // Ex: true
  /** URL du logo de l'institution */
  logo_url: string | null; // Ex: "https://..." ou null
  /** Nom de l'institution */
  name: string; // Ex: "VANGUARD GROUP INC"
  /** Personnes d'intérêt dans l'institution */
  people: PeopleOfInterest; // Ex: ["Paul Singer"]
  /** Nombre d'unités preferred share dans le portefeuille de l'institution */
  pfd_holdings: string; // Ex: "2394292.0"
  /** Valeur totale arrondie preferred share dans le portefeuille de l'institution */
  pfd_value: string; // Ex: "2394292.0"
  /** Nombre d'unités put dans le portefeuille de l'institution */
  put_holdings: string; // Ex: "2394292.0"
  /** Valeur totale arrondie put dans le portefeuille de l'institution */
  put_value: string; // Ex: "2394292.0"
  /** Valeur totale arrondie de vente dans le portefeuille de l'institution */
  sell_value: string; // Ex: "2394292.0"
  /** Nombre d'unités share dans le portefeuille de l'institution */
  share_holdings: string; // Ex: "2394292.0"
  /** Valeur totale arrondie share dans le portefeuille de l'institution */
  share_value: string; // Ex: "2394292.0"
  /** Nom court de l'institution */
  short_name: string; // Ex: "Vanguard"
  /** Tags liés à l'institution */
  tags: InstitutionTags; // Ex: ["activist", "value_investor"]
  /** Valeur totale arrondie du portefeuille de l'institution */
  total_value: string; // Ex: "2394292.0"
  /** Nombre d'unités warrant dans le portefeuille de l'institution */
  warrant_holdings: string; // Ex: "2394292.0"
  /** Valeur totale arrondie warrant dans le portefeuille de l'institution */
  warrant_value: string; // Ex: "2394292.0"
  /** Site web de l'institution */
  website: string | null; // Ex: "https://www.elliottmgmt.com/" ou null
}

/**
 * Réponse de l'endpoint GET /institutions
 */
export interface InstitutionsResponse {
  data: InstitutionSummary[];
}

// ========== Latest Filing ==========

/**
 * Dernier dépôt institutionnel
 * GET /institutions/latest_filings
 */
export interface LatestFiling {
  /** CIK de l'institution */
  cik: string; // Ex: "0000102909"
  /** Date de dépôt (date ISO) */
  filing_date: string; // ISO date: "2024-01-09"
  /** Si c'est un hedge fund */
  is_hedge_fund: boolean; // Ex: true
  /** Nom de l'institution */
  name: string; // Ex: "VANGUARD GROUP INC"
  /** Personnes d'intérêt dans l'institution */
  people: PeopleOfInterest; // Ex: ["Paul Singer"]
  /** Nom court de l'institution */
  short_name: string; // Ex: "Vanguard"
  /** Tags liés à l'institution */
  tags: InstitutionTags; // Ex: ["activist", "value_investor"]
}

/**
 * Réponse de l'endpoint GET /institutions/latest_filings
 */
export interface LatestFilingsResponse {
  data: LatestFiling[];
}

// ========== Query Parameters ==========

/**
 * Paramètres de requête pour GET /institution/{name}/activity
 */
export interface InstitutionalActivityQueryParams {
  /** Date de fin pour filtrer les données de rapport institutionnel (format YYYY-MM-DD) */
  date?: string; // ISO date: "2023-03-31"
  /** Nombre d'éléments à retourner (1-500, défaut: 500) */
  limit?: number; // Min: 1, Max: 500, Default: 500
  /** Numéro de page (utiliser avec limit). Commence à la page 0 */
  page?: number; // Ex: 1
}

/**
 * Paramètres de requête pour GET /institution/{name}/holdings
 */
export interface InstitutionalHoldingsQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // ISO date: "2024-01-18"
  /** Date de fin (format YYYY-MM-DD) */
  end_date?: string; // ISO date: "2023-03-31"
  /** Nombre d'éléments à retourner (1-500, défaut: 500) */
  limit?: number; // Min: 1, Max: 500, Default: 500
  /** Colonnes optionnelles pour ordonner le résultat */
  order?: 'date' | 'ticker' | 'security_type' | 'put_call' | 'first_buy' | 'price_first_buy' | 'units' | 'units_change' | 'historical_units' | 'value' | 'avg_price' | 'close' | 'shares_outstanding';
  /** Si trier en ordre décroissant ou croissant. Décroissant par défaut */
  order_direction?: OrderDirection; // "desc" ou "asc", Default: "desc"
  /** Numéro de page (utiliser avec limit). Commence à la page 0 */
  page?: number; // Ex: 1
  /** Tableau de types de sécurité */
  security_types?: SecurityType[]; // Ex: ["Share"]
  /** Date de début (format YYYY-MM-DD) */
  start_date?: string; // ISO date: "2023-01-01"
}

/**
 * Paramètres de requête pour GET /institution/{name}/sectors
 */
export interface SectorExposureQueryParams {
  /** Date (format YYYY-MM-DD) */
  date?: string; // ISO date: "2023-03-31"
  /** Nombre d'éléments à retourner (1-500, défaut: 500) */
  limit?: number; // Min: 1, Max: 500, Default: 500
  /** Numéro de page (utiliser avec limit). Commence à la page 0 */
  page?: number; // Ex: 1
}

/**
 * Paramètres de requête pour GET /institution/{ticker}/ownership
 */
export interface InstitutionalOwnershipQueryParams {
  /** Date de rapport au format YYYY-MM-DD */
  date?: string; // ISO date: "2024-01-18"
  /** Date de fin (format YYYY-MM-DD) */
  end_date?: string; // ISO date: "2023-03-31"
  /** Nombre d'éléments à retourner (1-500, défaut: 500) */
  limit?: number; // Min: 1, Max: 500, Default: 500
  /** Colonnes optionnelles pour ordonner le résultat */
  order?: 'name' | 'short_name' | 'first_buy' | 'units' | 'units_change' | 'units_changed' | 'value' | 'avg_price' | 'perc_outstanding' | 'perc_units_changed' | 'activity' | 'perc_inst_value' | 'perc_share_value';
  /** Si trier en ordre décroissant ou croissant. Décroissant par défaut */
  order_direction?: OrderDirection; // "desc" ou "asc", Default: "desc"
  /** Numéro de page (utiliser avec limit). Commence à la page 0 */
  page?: number; // Ex: 1
  /** Date de début (format YYYY-MM-DD) */
  start_date?: string; // ISO date: "2023-01-01"
  /** Tableau de tags d'institution */
  tags?: string[]; // Ex: ["activist"]
}

/**
 * Paramètres de requête pour GET /institutions
 */
export interface InstitutionsQueryParams {
  /** Nombre d'éléments à retourner (1-500, défaut: 500) */
  limit?: number; // Min: 1, Max: 500, Default: 500
  /** Valeur maximale du champ donné */
  max_share_value?: string; // Ex: "10.0"
  /** Valeur maximale du champ donné */
  max_total_value?: string; // Ex: "10.0"
  /** Valeur minimale du champ donné */
  min_share_value?: string; // Ex: "0.5"
  /** Valeur minimale du champ donné */
  min_total_value?: string; // Ex: "0.5"
  /** Grande entité qui gère des fonds et des investissements pour d'autres. Interrogeable par nom ou cik */
  name?: string; // Ex: "VANGUARD GROUP INC"
  /** Colonnes optionnelles pour ordonner le résultat */
  order?: 'name' | 'call_value' | 'put_value' | 'share_value' | 'call_holdings' | 'put_holdings' | 'share_holdings' | 'total_value' | 'warrant_value' | 'fund_value' | 'pfd_value' | 'debt_value' | 'total_holdings' | 'warrant_holdings' | 'fund_holdings' | 'pfd_holdings' | 'debt_holdings' | 'percent_of_total' | 'date' | 'buy_value' | 'sell_value';
  /** Si trier en ordre décroissant ou croissant. Décroissant par défaut */
  order_direction?: OrderDirection; // "desc" ou "asc", Default: "desc"
  /** Numéro de page (utiliser avec limit). Commence à la page 0 */
  page?: number; // Ex: 1
  /** Tableau de tags d'institution */
  tags?: string[]; // Ex: ["activist"]
}

/**
 * Paramètres de requête pour GET /institutions/latest_filings
 */
export interface LatestFilingsQueryParams {
  /** Date au format YYYY-MM-DD */
  date?: string; // ISO date: "2024-01-18"
  /** Nombre d'éléments à retourner (1-500, défaut: 500) */
  limit?: number; // Min: 1, Max: 500, Default: 500
  /** Grande entité qui gère des fonds et des investissements pour d'autres. Interrogeable par nom ou cik */
  name?: string; // Ex: "VANGUARD GROUP INC"
  /** Colonnes optionnelles pour ordonner le résultat. La date de dépôt est toujours triée en ordre décroissant */
  order?: 'name' | 'short_name' | 'cik';
  /** Si trier en ordre décroissant ou croissant. Décroissant par défaut */
  order_direction?: OrderDirection; // "desc" ou "asc", Default: "desc"
  /** Numéro de page (utiliser avec limit). Commence à la page 0 */
  page?: number; // Ex: 1
}

