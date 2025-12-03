/**
 * Types pour les endpoints Unusual Whales - ETF
 * Basés sur la documentation officielle: https://api.unusualwhales.com/api
 */

import type { FinancialSector } from './earnings';

// ========== ETF Exposure ==========

/**
 * Exposition d'un ticker dans un ETF
 * GET /etfs/{ticker}/exposure
 */
export interface ETFExposure {
  /** Ticker de l'ETF */
  etf: string; // Ex: "VTI"
  /** Nom complet de l'ETF */
  full_name: string; // Ex: "SPDR S&P 500 ETF Trust"
  /** Prix de clôture de la bougie */
  last_price: string; // Ex: "56.79"
  /** Prix du stock du ticker du jour de trading précédent */
  prev_price: string; // Ex: "189.70"
  /** Nombre d'actions que l'ETF détient */
  shares: number; // Ex: 48427939
  /** Poids en pourcentage que la position représente dans l'ETF */
  weight: string; // Ex: "0.35"
}

/**
 * Réponse de l'endpoint GET /etfs/{ticker}/exposure
 */
export interface ETFExposureResponse {
  data: ETFExposure[];
}

// ========== ETF Holdings ==========

/**
 * Holding d'un ETF
 * GET /etfs/{ticker}/holdings
 */
export interface ETFHolding {
  /** Volume moyen du stock sur les 30 derniers jours */
  avg30_volume: string; // Ex: "55973002"
  /** Premium bearish défini comme (call premium bid side) + (put premium ask side) */
  bearish_premium: string; // Ex: "143198625"
  /** Premium bullish défini comme (call premium ask side) + (put premium bid side) */
  bullish_premium: string; // Ex: "196261414"
  /** Somme du premium de toutes les transactions call exécutées */
  call_premium: string; // Ex: "9908777.0"
  /** Somme de la taille de toutes les transactions call exécutées */
  call_volume: number; // Ex: 990943
  /** Prix de clôture de la bougie */
  close: string; // Ex: "56.79"
  /** Flag booléen si l'entreprise a des options */
  has_options: boolean; // Ex: true
  /** Prix le plus élevé de la bougie */
  high: string; // Ex: "58.12"
  /** Prix le plus bas de la bougie */
  low: string; // Ex: "51.90"
  /** Nom de l'entreprise */
  name: string; // Ex: "APPLE INC"
  /** Prix d'ouverture de la bougie */
  open?: string; // Ex: "54.29" (optionnel selon la doc)
  /** Prix du stock du ticker du jour de trading précédent */
  prev_price: string; // Ex: "189.70"
  /** Somme du premium de toutes les transactions put exécutées */
  put_premium: string; // Ex: "163537151"
  /** Somme de la taille de toutes les transactions put exécutées */
  put_volume: number; // Ex: 808326
  /** Nombre d'actions détenues */
  shares?: number; // Ex: 169938760 (optionnel selon la doc)
  /** Nom court */
  short_name?: string; // Ex: "APPLE" (optionnel selon la doc)
  /** Secteur financier du ticker. Vide si inconnu ou non applicable (ETF/Index) */
  sector: FinancialSector | string; // Ex: "Technology" ou "" si non applicable
  /** Ticker du stock */
  ticker: string; // Ex: "AAPL"
  /** Type (stock, etc.) */
  type?: string; // Ex: "stock" (optionnel selon la doc)
  /** Volume du ticker pour le jour de trading */
  volume: number; // Ex: 23132119
  /** Prix haut sur 52 semaines du ticker */
  week_52_high: string; // Ex: "198.23" (peut être "week52_high" dans la réponse)
  /** Prix bas sur 52 semaines du ticker */
  week_52_low: string; // Ex: "124.17" (peut être "week52_low" dans la réponse)
  /** Poids en pourcentage */
  weight?: string; // Ex: "7.335" (optionnel selon la doc)
}

/**
 * Réponse de l'endpoint GET /etfs/{ticker}/holdings
 */
export interface ETFHoldingsResponse {
  data: ETFHolding[];
}

// ========== ETF Inflow & Outflow ==========

/**
 * Inflow/Outflow d'un ETF
 * GET /etfs/{ticker}/in-outflow
 */
export interface ETFInOutflow {
  /** Le net in/outflow mesuré en volume */
  change: number; // Ex: -50
  /** Le net in/outflow mesuré en premium */
  change_prem: string; // Ex: "-5023.50"
  /** Prix de clôture du stock du ticker */
  close: string; // Ex: "182.91"
  /** Date (format ISO) */
  date: string; // ISO date: "2024-01-09"
  /** Si la date a une annonce FOMC */
  is_fomc: boolean; // Ex: false
  /** Volume du ticker pour le jour de trading */
  volume: number; // Ex: 23132119
}

/**
 * Réponse de l'endpoint GET /etfs/{ticker}/in-outflow
 */
export interface ETFInOutflowResponse {
  data: ETFInOutflow[];
}

// ========== ETF Information ==========

/**
 * Informations sur un ETF
 * GET /etfs/{ticker}/info
 */
export interface ETFInfo {
  /** Total des actifs sous gestion (AUM) de l'ETF */
  aum: string; // Ex: "428887833900"
  /** Volume moyen du stock sur les 30 derniers jours */
  avg30_volume: string; // Ex: "55973002"
  /** Somme de la taille de toutes les transactions call exécutées */
  call_vol: number; // Ex: 990943
  /** Informations sur l'ETF */
  description: string; // Ex: "The Trust seeks to achieve..."
  /** Domicile de l'ETF */
  domicile: string; // Ex: "US"
  /** L'entreprise qui supervise l'ETF */
  etf_company: string; // Ex: "SPDR"
  /** Ratio de dépenses de l'ETF */
  expense_ratio: string; // Ex: "0.0945"
  /** Flag booléen si l'entreprise a des options */
  has_options: boolean; // Ex: true
  /** Nombre de holdings que l'ETF a */
  holdings_count: number; // Ex: 503
  /** Date de création de l'ETF (date ISO) */
  inception_date: string; // ISO date: "1993-01-22"
  /** Nom complet de l'ETF */
  name: string; // Ex: "SPDR S&P 500 ETF Trust"
  /** Volume total d'options tradées pour le dernier jour de trading */
  opt_vol: number; // Ex: 533227
  /** Somme de la taille de toutes les transactions put exécutées */
  put_vol: number; // Ex: 808326
  /** Volume du ticker pour le jour de trading */
  stock_vol: number; // Ex: 23132119
  /** Lien vers le site web de l'ETF */
  website: string; // Ex: "https://www.ssga.com/..."
}

/**
 * Réponse de l'endpoint GET /etfs/{ticker}/info
 */
export interface ETFInfoResponse {
  data: ETFInfo;
}

// ========== ETF Weights ==========

/**
 * Poids par pays
 */
export interface CountryWeight {
  /** Le pays */
  country: string; // Ex: "Ireland"
  /** Exposition du pays en pourcentage */
  weight: string; // Ex: "0.0164"
}

/**
 * Poids par secteur
 */
export interface SectorWeight {
  /** Le secteur */
  sector: FinancialSector | string; // Ex: "Healthcare" ou "Other"
  /** Exposition du secteur en pourcentage */
  weight: string; // Ex: "0.1272"
}

/**
 * Réponse de l'endpoint GET /etfs/{ticker}/weights
 */
export interface ETFWeightsResponse {
  /** Liste des pays avec leur exposition en pourcentage */
  country: CountryWeight[];
  /** Liste des secteurs avec leur exposition en pourcentage */
  sector: SectorWeight[];
}

// ========== Query Parameters ==========

/**
 * Paramètres de requête pour GET /etfs/{ticker}/exposure
 * (Aucun paramètre selon la documentation)
 */
export interface ETFExposureQueryParams {
  // Pas de paramètres selon la documentation
}

/**
 * Paramètres de requête pour GET /etfs/{ticker}/holdings
 * (Aucun paramètre selon la documentation)
 */
export interface ETFHoldingsQueryParams {
  // Pas de paramètres selon la documentation
}

/**
 * Paramètres de requête pour GET /etfs/{ticker}/in-outflow
 * (Aucun paramètre selon la documentation)
 */
export interface ETFInOutflowQueryParams {
  // Pas de paramètres selon la documentation
}

/**
 * Paramètres de requête pour GET /etfs/{ticker}/info
 * (Aucun paramètre selon la documentation)
 */
export interface ETFInfoQueryParams {
  // Pas de paramètres selon la documentation
}

/**
 * Paramètres de requête pour GET /etfs/{ticker}/weights
 * (Aucun paramètre selon la documentation)
 */
export interface ETFWeightsQueryParams {
  // Pas de paramètres selon la documentation
}

