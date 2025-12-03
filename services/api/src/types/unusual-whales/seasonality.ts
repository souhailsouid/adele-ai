/**
 * Types pour les endpoints Unusual Whales - Seasonality
 * Basés sur la documentation officielle: https://api.unusualwhales.com/api
 */

import type { FinancialSector } from './earnings';

// ========== Price change per month per year ==========

/**
 * Changement de prix par mois par année
 * GET /seasonality/{ticker}/year-month
 */
export interface YearMonthPriceChange {
  /** Changement relatif de prix pour le mois */
  change: number; // Ex: 0.09494354167379757
  /** Prix de clôture du stock du ticker pour le mois */
  close: string; // Ex: "182.91"
  /** Numéro du mois (1 -> janvier, 2 -> février, ...) */
  month: number; // Ex: 5
  /** Prix d'ouverture du stock du ticker pour le mois */
  open: string; // Ex: "182.91"
  /** Année */
  year: number; // Ex: 2024
}

/**
 * Réponse de l'endpoint GET /seasonality/{ticker}/year-month
 */
export interface YearMonthPriceChangeResponse {
  data: YearMonthPriceChange[];
}

/**
 * Paramètres de requête pour GET /seasonality/{ticker}/year-month
 */
export interface YearMonthPriceChangeQueryParams {
  /** Aucun paramètre selon la documentation */
}

// ========== Average return per month ==========

/**
 * Retour moyen par mois
 * GET /seasonality/{ticker}/monthly
 */
export interface MonthlyAverageReturn {
  /** Changement relatif de prix moyen par jour pour le mois */
  avg_change: number; // Ex: 0.09494354167379757
  /** Changement relatif de prix maximum par jour pour le mois */
  max_change: number; // Ex: 0.14970489711277724
  /** Changement relatif de prix médian par jour pour le mois */
  median_change: number; // Ex: 0.09494354167379757
  /** Changement relatif de prix minimum par jour pour le mois */
  min_change: number; // Ex: 0.0401821862348179
  /** Numéro du mois (1 -> janvier, 2 -> février, ...) */
  month: number; // Ex: 5
  /** Nombre d'années où le mois a eu une clôture positive */
  positive_closes: number; // Ex: 2
  /** Montant relatif de fois où le mois a eu une clôture positive. Multiplier par 100 pour obtenir le pourcentage */
  positive_months_perc: number; // Ex: 0.6667
  /** Nombre d'années utilisées pour calculer les données */
  years: number; // Ex: 3
}

/**
 * Réponse de l'endpoint GET /seasonality/{ticker}/monthly
 */
export interface MonthlyAverageReturnResponse {
  data: MonthlyAverageReturn[];
}

/**
 * Paramètres de requête pour GET /seasonality/{ticker}/monthly
 */
export interface MonthlyAverageReturnQueryParams {
  /** Aucun paramètre selon la documentation */
}

// ========== Month Performers ==========

/**
 * Type pour S&P 500/Nasdaq Only
 */
export type SP500NasdaqOnly = 's_p_500' | 'nasdaq';

/**
 * Ordre pour Month Performers
 */
export type MonthPerformersOrder =
  | 'month'
  | 'positive_closes'
  | 'years'
  | 'positive_months_perc'
  | 'median_change'
  | 'avg_change'
  | 'max_change'
  | 'min_change'
  | 'ticker';

/**
 * Performeurs du mois
 * GET /seasonality/{month}/performers
 */
export interface MonthPerformer {
  /** Changement relatif de prix moyen par jour pour le mois */
  avg_change: number; // Ex: 0.0592
  /** Marketcap du ticker sous-jacent. Si le type d'émission est ETF, alors le marketcap représente l'AUM */
  marketcap: string; // Ex: "19427901578"
  /** Changement relatif de prix maximum par jour pour le mois */
  max_change: number; // Ex: 0.1104
  /** Changement relatif de prix médian par jour pour le mois */
  median_change: number; // Ex: 0.0639
  /** Changement relatif de prix minimum par jour pour le mois */
  min_change: number; // Ex: 0.0091
  /** Numéro du mois (1 -> janvier, 2 -> février, ...) */
  month: number; // Ex: 5
  /** Nombre d'années où le mois a eu une clôture positive */
  positive_closes: number; // Ex: 11
  /** Montant relatif de fois où le mois a eu une clôture positive. Multiplier par 100 pour obtenir le pourcentage */
  positive_months_perc: string; // Ex: "1.1"
  /** Secteur financier du ticker */
  sector: FinancialSector | ''; // Ex: "Healthcare"
  /** Symbole du ticker */
  ticker: string; // Ex: "ICLR"
  /** Nombre d'années utilisées pour calculer les données */
  years: number; // Ex: 10
}

/**
 * Réponse de l'endpoint GET /seasonality/{month}/performers
 */
export interface MonthPerformersResponse {
  data: MonthPerformer[];
}

/**
 * Paramètres de requête pour GET /seasonality/{month}/performers
 */
export interface MonthPerformersQueryParams {
  /** Nombre d'éléments à retourner (1+, défaut: 50) */
  limit?: number; // Min: 1, Default: 50
  /** Intérêt ouvert minimum (0+) */
  min_oi?: number; // Min: 0
  /** Nombre minimum d'années de données pour le mois nécessaires pour le ticker (1+, défaut: 10) */
  min_years?: number; // Min: 1, Default: 10
  /** Colonnes optionnelles pour ordonner le résultat */
  order?: MonthPerformersOrder;
  /** Trier par ordre décroissant ou croissant. Décroissant par défaut */
  order_direction?: 'desc' | 'asc'; // Default: 'desc'
  /** S&P 500/Nasdaq Only */
  s_p_500_nasdaq_only?: SP500NasdaqOnly;
  /** Un seul ticker. Le résultat ne contiendra que les tickers du même secteur que le ticker donné */
  ticker_for_sector?: string; // Ex: "MSFT"
}

// ========== Market Seasonality ==========

/**
 * Saisonnalité du marché
 * GET /seasonality/market
 */
export interface MarketSeasonality {
  /** Changement relatif de prix moyen par jour pour le mois */
  avg_change: number; // Ex: 0.09494354167379757
  /** Changement relatif de prix maximum par jour pour le mois */
  max_change: number; // Ex: 0.14970489711277724
  /** Changement relatif de prix médian par jour pour le mois */
  median_change: number; // Ex: 0.09494354167379757
  /** Changement relatif de prix minimum par jour pour le mois */
  min_change: number; // Ex: 0.0401821862348179
  /** Numéro du mois (1 -> janvier, 2 -> février, ...) */
  month: number; // Ex: 5
  /** Nombre d'années où le mois a eu une clôture positive */
  positive_closes: number; // Ex: 2
  /** Montant relatif de fois où le mois a eu une clôture positive. Multiplier par 100 pour obtenir le pourcentage */
  positive_months_perc: number; // Ex: 0.6667
  /** Symbole du ticker */
  ticker: string; // Ex: "SPY"
  /** Nombre d'années utilisées pour calculer les données */
  years: number; // Ex: 3
}

/**
 * Réponse de l'endpoint GET /seasonality/market
 */
export interface MarketSeasonalityResponse {
  data: MarketSeasonality[];
}

/**
 * Paramètres de requête pour GET /seasonality/market
 */
export interface MarketSeasonalityQueryParams {
  /** Aucun paramètre selon la documentation */
}

