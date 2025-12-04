/**
 * Types pour les endpoints News de FMP
 */

// ========== Common Query Parameters ==========

export interface NewsQueryParams {
  page?: number; // default: 0
  limit?: number; // default: 20
}

// ========== FMP Articles ==========

export interface FMPArticle {
  title: string;
  snippet: string;
  url: string;
  publishedDate: string;
  source: string;
}

export type FMPArticlesResponse = FMPArticle[];

// ========== General News ==========

export interface GeneralNewsItem {
  title: string;
  snippet: string;
  url: string;
  publishedDate: string;
  source: string;
}

export type GeneralNewsResponse = GeneralNewsItem[];

// ========== Press Releases ==========

export interface PressRelease {
  title: string;
  snippet: string;
  url: string;
  publishedDate: string;
  source: string;
  symbol?: string;
}

export type PressReleasesResponse = PressRelease[];

// ========== Stock News ==========

export interface StockNewsItem {
  title: string;
  snippet: string;
  url: string;
  publishedDate: string;
  source: string;
  symbol: string;
}

export type StockNewsResponse = StockNewsItem[];

// ========== Crypto News ==========

export interface CryptoNewsItem {
  title: string;
  snippet: string;
  url: string;
  publishedDate: string;
  source: string;
}

export type CryptoNewsResponse = CryptoNewsItem[];

