/**
 * Types pour les endpoints Unusual Whales - Insiders
 * Basés sur la documentation officielle: https://api.unusualwhales.com/api
 */

import type { FinancialSector } from './earnings';

// Re-export FinancialSector for convenience
export type { FinancialSector };

// ========== Enums ==========

/**
 * Code de transaction (P=Purchase, S=Sale, etc.)
 */
export type TransactionCode = 'P' | 'S' | string; // Peut être d'autres codes selon la doc

/**
 * Buy ou Sell
 */
export type BuySell = 'buy' | 'sell';

/**
 * Taille de market cap
 */
export type MarketCapSize = 'small' | 'mid' | 'large';

// ========== Insider Transaction ==========

/**
 * Transaction d'insider (agrégée par défaut)
 * GET /insider/transactions
 */
export interface InsiderTransaction {
  /** Le montant de la transaction d'insider */
  amount: number; // Ex: 1000 (peut être négatif pour les ventes)
  /** La date exercisable de la transaction d'insider */
  date_excercisable: string | null; // ISO date: "2023-12-06" ou null
  /** Le director indirect de la transaction d'insider */
  director_indirect: string | null; // Ex: "John Doe" ou null
  /** La date d'expiration de la transaction d'insider */
  expiration_date: string | null; // ISO date: "2023-12-06" ou null
  /** La date de dépôt de la transaction d'insider */
  filing_date: string; // ISO date: "2023-12-06"
  /** Le type de formulaire de la transaction d'insider */
  formtype: string; // Ex: "4"
  /** ID unique de la transaction */
  id?: string; // Ex: "2662b73d-0ad6-4568-adb0-739b96c18090"
  /** Les IDs des transactions d'insider (si agrégées) */
  ids?: string[]; // Ex: ["26f2911d-8e40-4fd4-9b74-c450e203a0ad"]
  /** True si cette transaction d'insider faisait partie d'un plan 10b5-1 */
  is_10b5_1: boolean; // Ex: true
  /** Si l'insider est un directeur */
  is_director: boolean; // Ex: true
  /** Si l'insider est un officier */
  is_officer: boolean; // Ex: true
  /** Si l'insider est un propriétaire à 10% */
  is_ten_percent_owner: boolean; // Ex: true
  /** Si c'est dans le S&P 500 */
  is_s_p_500?: boolean; // Ex: true
  /** Market cap */
  marketcap?: string; // Ex: "1375122749418"
  /** La nature de propriété de la transaction d'insider */
  natureofownership: string | null; // Ex: "Direct" ou null
  /** Le titre d'officier de la transaction d'insider */
  officer_title: string | null; // Ex: "CEO" ou null
  /** Le nom du propriétaire de la transaction d'insider */
  owner_name: string; // Ex: "John Doe"
  /** Le prix de la transaction d'insider */
  price: string; // Ex: "123.45"
  /** Le prix exercisable de la transaction d'insider */
  price_excercisable: string | null; // Ex: "123.45" ou null
  /** Secteur financier */
  sector?: FinancialSector | string; // Ex: "Communication Services"
  /** Le code AD de sécurité de la transaction d'insider */
  security_ad_code: string | null; // Ex: "1234" ou null
  /** Le titre de sécurité de la transaction d'insider */
  security_title: string | null; // Ex: "Common Stock" ou null
  /** Le nombre d'actions détenues après la transaction d'insider */
  shares_owned_after: number | null; // Ex: 2000 ou null
  /** Le nombre d'actions détenues avant la transaction d'insider */
  shares_owned_before: number | null; // Ex: 1000 ou null
  /** Prix du stock au moment de la transaction */
  stock_price?: string | null; // Ex: "632" ou null
  /** Le ticker du stock */
  ticker: string; // Ex: "AAPL"
  /** Le code de transaction de la transaction d'insider */
  transaction_code: TransactionCode; // Ex: "S"
  /** La date de transaction de la transaction d'insider */
  transaction_date: string; // ISO date: "2023-12-06"
  /** Le nombre de transactions de la transaction d'insider */
  transactions: number; // Ex: 1
  /** Date des prochains earnings */
  next_earnings_date?: string | null; // ISO date: "2025-02-06" ou null
}

/**
 * Réponse de l'endpoint GET /insider/transactions
 */
export interface InsiderTransactionsResponse {
  data: InsiderTransaction[];
}

// ========== Insider Flow ==========

/**
 * Flow d'insider (agrégé par date et buy/sell)
 * GET /insider/{sector}/sector-flow
 * GET /insider/{ticker}/ticker-flow
 */
export interface InsiderFlow {
  /** Le prix moyen de la transaction d'insider */
  avg_price: string | number; // Ex: "123.45" ou 162.32
  /** Si l'insider a acheté ou vendu */
  buy_sell: BuySell; // "buy" ou "sell"
  /** Date de trading (format ISO) */
  date: string; // ISO date: "2023-09-08"
  /** Le premium de la transaction d'insider */
  premium: string; // Ex: "123.45" ou "664386"
  /** Le nombre de transactions de la transaction d'insider */
  transactions: number; // Ex: 1 ou 54
  /** Le nombre d'insiders uniques de la transaction d'insider */
  uniq_insiders: number; // Ex: 1 ou 10
  /** Le volume de la transaction d'insider */
  volume: number; // Ex: 1000 ou 244331
}

/**
 * Réponse de l'endpoint GET /insider/{sector}/sector-flow
 */
export interface InsiderSectorFlowResponse {
  data: InsiderFlow[];
}

/**
 * Réponse de l'endpoint GET /insider/{ticker}/ticker-flow
 */
export interface InsiderTickerFlowResponse {
  data: InsiderFlow[];
}

// ========== Insider ==========

/**
 * Insider
 * GET /insider/{ticker}
 */
export interface Insider {
  /** Nom d'affichage de l'insider */
  display_name?: string; // Ex: "KARP ALEXANDER"
  /** L'ID de l'insider */
  id: number; // Ex: 1 ou 10343
  /** Si l'insider est une personne. False si l'insider est un fonds, LLC, etc. */
  is_person: boolean; // Ex: true
  /** L'URL du logo de l'insider */
  logo_url: string; // Ex: "https://example.com/logo.png"
  /** Le nom de l'insider */
  name: string; // Ex: "John Doe"
  /** Le nom slugifié de l'insider */
  name_slug: string; // Ex: "john-doe"
  /** Les liens sociaux de l'insider */
  social_links: string[]; // Ex: ["https://twitter.com/johndoe"]
  /** Le ticker du stock */
  ticker: string; // Ex: "AAPL"
}

/**
 * Réponse de l'endpoint GET /insider/{ticker}
 */
export interface InsidersResponse {
  data: Insider[];
}

// ========== Query Parameters ==========

/**
 * Paramètres de requête pour GET /insider/transactions
 */
export interface InsiderTransactionsQueryParams {
  /** Inclure uniquement les transactions de common stock */
  common_stock_only?: boolean; // Ex: true
  /** Filtrer par industrie ou industries de l'entreprise */
  industries?: string; // Ex: "Airlines"
  /** Filtrer les transactions par directeurs d'entreprise */
  is_director?: boolean; // Ex: true
  /** Filtrer les transactions par officiers d'entreprise */
  is_officer?: boolean; // Ex: true
  /** Inclure uniquement les entreprises S&P 500 */
  is_s_p_500?: boolean; // Ex: true
  /** Filtrer les transactions par propriétaires à 10% */
  is_ten_percent_owner?: boolean; // Ex: false
  /** Nombre d'éléments à retourner (1-500, défaut: 500) */
  limit?: number; // Min: 1, Max: 500, Default: 500
  /** Catégorie de taille de market cap de l'entreprise (small, mid, large) */
  market_cap_size?: MarketCapSize; // Ex: "large"
  /** Nombre maximum d'actions dans la transaction */
  max_amount?: string; // Ex: "10000"
  /** Nombre maximum de jours jusqu'aux earnings */
  max_earnings_dte?: string; // Ex: "30"
  /** Market cap maximum. Min: 0 */
  max_marketcap?: number; // Min: 0, Ex: 250000000
  /** Prix maximum du stock au moment de la transaction */
  max_price?: string; // Ex: "50.75"
  /** Valeur maximum de transaction en dollars */
  max_value?: string; // Ex: "1000000"
  /** Nombre minimum d'actions dans la transaction */
  min_amount?: string; // Ex: "1000"
  /** Nombre minimum de jours jusqu'aux earnings (filtrer pour les entreprises qui rapportent bientôt) */
  min_earnings_dte?: string; // Ex: "5"
  /** Market cap minimum. Min: 0 */
  min_marketcap?: number; // Min: 0, Ex: 1000000
  /** Prix minimum du stock au moment de la transaction */
  min_price?: string; // Ex: "10.5"
  /** Valeur minimum de transaction en dollars */
  min_value?: string; // Ex: "100000"
  /** Nom de l'insider qui a fait la transaction */
  owner_name?: string; // Ex: "John Doe"
  /** Numéro de page (utiliser avec limit). Commence à la page 0 */
  page?: number; // Ex: 1
  /** Filtrer par secteur(s) de l'entreprise */
  sectors?: string; // Ex: "Healthcare"
  /** Filtrer par codes d'acquisition/disposition de sécurité */
  security_ad_codes?: string; // Ex: '["COM","PRF"]'
  /** Liste de tickers séparés par des virgules. Pour exclure certains tickers, préfixer le premier ticker avec un - */
  ticker_symbol?: string; // Ex: "AAPL,INTC"
  /** Filtrer par codes de transaction (P=Purchase, S=Sale, etc.) */
  transaction_codes?: string[]; // Ex: ["P","S"]
  /** Désactiver le groupement (retourner les transactions individuelles) */
  group?: boolean; // Default: true
}

/**
 * Paramètres de requête pour GET /insider/{sector}/sector-flow
 * (Aucun paramètre selon la documentation)
 */
export interface InsiderSectorFlowQueryParams {
  // Pas de paramètres selon la documentation
}

/**
 * Paramètres de requête pour GET /insider/{ticker}
 * (Aucun paramètre selon la documentation)
 */
export interface InsidersQueryParams {
  // Pas de paramètres selon la documentation
}

/**
 * Paramètres de requête pour GET /insider/{ticker}/ticker-flow
 * (Aucun paramètre selon la documentation)
 */
export interface InsiderTickerFlowQueryParams {
  // Pas de paramètres selon la documentation
}

