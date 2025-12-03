/**
 * Types pour les endpoints Unusual Whales - Congress
 * Basés sur la documentation officielle: https://api.unusualwhales.com/api
 */

// ========== Transaction Types ==========

/**
 * Type de transaction Congress
 */
export type CongressTransactionType =
  | 'Buy'
  | 'Sell (partial)'
  | 'Purchase'
  | 'Sale (Partial)'
  | 'Receive'
  | 'Sale (Full)'
  | 'Sell (PARTIAL)'
  | 'Sell'
  | 'Exchange';

/**
 * Type de membre du Congrès
 */
export type CongressMemberType = 'house' | 'senate';

/**
 * Type d'issuer (personne qui a exécuté la transaction)
 */
export type CongressIssuer =
  | 'spouse'
  | 'joint'
  | 'not-disclosed'
  | string; // Peut être d'autres valeurs

/**
 * Statut actif du politicien
 */
export type CongressIsActive = boolean | string; // Peut être boolean ou string comme "G000585"

// ========== Congress Trade ==========

/**
 * Trade du Congrès (format commun pour tous les endpoints)
 */
export interface CongressTrade {
  /** Plage de montant rapporté de la transaction */
  amounts: string; // Ex: "$1,000 - $15,000"
  /** Date de dépôt au format ISO */
  filed_at_date: string; // ISO date: "2023-12-13"
  /** Le politicien est-il un membre actif */
  is_active: CongressIsActive; // boolean ou string comme "G000585"
  /** Personne qui a exécuté la transaction */
  issuer: CongressIssuer; // Ex: "spouse", "joint", "not-disclosed"
  /** Type de membre (house ou senate) */
  member_type: CongressMemberType; // "house" ou "senate"
  /** Nom standardisé du rapporteur (si trouvé) */
  name: string; // Ex: "Stephen Cohen"
  /** Notes du dépôt */
  notes: string; // Ex: "Subholding Of: Stephens Advantage Account..."
  /** ID du politicien */
  politician_id: string; // UUID: "18f9fc95-4661-444e-99f5-99d3778e0c31"
  /** Personne qui a rapporté la transaction (tel qu'écrit dans le dépôt) */
  reporter: string; // Ex: "Stephen C."
  /** Symbole du ticker */
  ticker: string; // Ex: "AAPL"
  /** Date de transaction au format ISO */
  transaction_date: string; // ISO date: "2023-12-06"
  /** Type de transaction */
  txn_type: CongressTransactionType; // Ex: "Buy", "Sell"
}

// ========== Responses ==========

/**
 * Réponse de l'endpoint GET /congress/congress-trader
 */
export interface CongressTraderResponse {
  data: CongressTrade[];
}

/**
 * Réponse de l'endpoint GET /congress/late-reports
 */
export interface CongressLateReportsResponse {
  data: CongressTrade[];
}

/**
 * Réponse de l'endpoint GET /congress/recent-trades
 */
export interface CongressRecentTradesResponse {
  data: CongressTrade[];
}

// ========== Query Parameters ==========

/**
 * Paramètres de requête pour GET /congress/congress-trader
 */
export interface CongressTraderQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // Ex: "2024-01-18"
  /** Nombre d'éléments à retourner (1-200, défaut: 100) */
  limit?: number; // Min: 1, Max: 200, Default: 100
  /** Nom complet d'un membre du Congrès (ne peut pas contenir de chiffres). 
   * Les espaces et caractères peuvent nécessiter un encodage URI, 
   * ex: Adam Kinzinger -> Adam%20Kinzinger */
  name?: string; // Défaut: "Nancy Pelosi", Ex: "Adam Kinzinger"
  /** Symbole de ticker optionnel pour filtrer les résultats */
  ticker?: string | null; // Ex: "IOVA"
}

/**
 * Paramètres de requête pour GET /congress/late-reports
 */
export interface CongressLateReportsQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // Ex: "2024-01-18"
  /** Nombre d'éléments à retourner (1-200, défaut: 100) */
  limit?: number; // Min: 1, Max: 200, Default: 100
  /** Symbole de ticker optionnel pour filtrer les résultats */
  ticker?: string | null; // Ex: "IOVA"
}

/**
 * Paramètres de requête pour GET /congress/recent-trades
 */
export interface CongressRecentTradesQueryParams {
  /** Date de trading au format YYYY-MM-DD (optionnel, défaut: dernière date de trading) */
  date?: string; // Ex: "2024-01-18"
  /** Nombre d'éléments à retourner (1-200, défaut: 100) */
  limit?: number; // Min: 1, Max: 200, Default: 100
  /** Symbole de ticker optionnel pour filtrer les résultats */
  ticker?: string | null; // Ex: "IOVA"
}

