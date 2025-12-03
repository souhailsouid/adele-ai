/**
 * Types et interfaces pour les données ticker
 * Centralisation de tous les types liés aux tickers
 */

export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  timestamp: string;
}

export interface Ownership {
  name: string;
  shares: number;
  units: number;
  value: number;
  is_hedge_fund: boolean;
  report_date: string;
  filing_date: string;
  percentage?: number;
}

export interface Activity {
  institution_name: string;
  units_change: number;
  change: number;
  avg_price: number;
  buy_price?: number | null;
  sell_price?: number | null;
  filing_date: string;
  report_date: string;
  price_on_filing: number;
  price_on_report: number;
  close: number;
  transaction_type: "BUY" | "SELL";
}

export interface InsiderTrade {
  owner_name: string;
  officer_title: string;
  transaction_code: string;
  acquisitionOrDisposition: string;
  amount: number;
  transaction_date: string;
  shares?: number;
  price?: number;
}

export interface CongressTrade {
  name: string;
  member_type: string;
  txn_type: string;
  amounts: string;
  transaction_date: string;
}

export interface OptionsFlow {
  type: string;
  strike: number;
  total_premium: number;
  premium: number;
  volume: number;
  expiry: string;
  created_at: string;
  open_interest?: number;
}

export interface DarkPoolTrade {
  date: string;
  volume: number;
  size: number;
  price: number;
  value: number;
}

/**
 * Types de réponse standardisés pour toutes les fonctions
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  cached: boolean;
  count?: number;
  timestamp: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  limit: number;
  offset: number;
  total?: number;
}

