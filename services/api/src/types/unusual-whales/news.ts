/**
 * Types pour les endpoints Unusual Whales - News
 * Basés sur la documentation officielle: https://api.unusualwhales.com/api
 */

// ========== News Headlines ==========

/**
 * News Headline
 * GET /news/headlines
 */
export interface NewsHeadline {
  /** Timestamp lorsque le titre de l'actualité a été créé ou publié */
  created_at: string; // ISO timestamp: "2023-04-15T16:30:00Z"
  /** Le texte du titre de l'actualité */
  headline: string; // Ex: "Company XYZ Reports Better Than Expected Earnings"
  /** Indique si l'actualité est considérée comme majeure ou significative */
  is_major: boolean; // Ex: true
  /** Métadonnées supplémentaires liées au titre */
  meta: Record<string, any>; // Ex: {}
  /** Analyse de sentiment du titre (ex: positive, negative, neutral) */
  sentiment: string; // Ex: "positive"
  /** Source du titre de l'actualité (ex: Reuters, Bloomberg, etc.) */
  source: string; // Ex: "BusinessWire"
  /** Tags ou catégories liés au titre */
  tags: string[]; // Ex: ["earnings", "tech"]
  /** Liste de symboles de tickers liés à cette actualité */
  tickers: string[]; // Ex: ["XYZ", "EXMP"]
}

/**
 * Réponse de l'endpoint GET /news/headlines
 */
export interface NewsHeadlinesResponse {
  data: NewsHeadline[];
}

/**
 * Paramètres de requête pour GET /news/headlines
 */
export interface NewsHeadlinesQueryParams {
  /** Nombre d'éléments à retourner (1-100, défaut: 50) */
  limit?: number; // Min: 1, Max: 100, Default: 50
  /** Lorsqu'il est défini à true, retourne uniquement les actualités majeures/significatives (défaut: false) */
  major_only?: boolean; // Default: false
  /** Numéro de page (utiliser avec limit). Commence à la page 0 */
  page?: number; // Ex: 1
  /** Terme de recherche pour filtrer les titres d'actualité par contenu */
  search_term?: string; // Ex: "earnings"
  /** Liste de sources d'actualité séparées par des virgules pour filtrer (ex: 'Reuters,Bloomberg') */
  sources?: string; // Ex: "BusinessWire,MarketNews"
}

