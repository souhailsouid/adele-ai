/**
 * Types pour les endpoints Market Hours de FMP
 */

// ========== Exchange Market Hours ==========

export interface ExchangeMarketHoursQueryParams {
  exchange: string; // e.g., "NASDAQ"
}

export interface ExchangeMarketHours {
  exchange: string;
  tradingHours: string; // e.g., "09:30-16:00"
  timezone: string; // e.g., "America/New_York"
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  currentTime?: string;
}

export type ExchangeMarketHoursResponse = ExchangeMarketHours[];

// ========== Holidays By Exchange ==========

export interface HolidaysByExchangeQueryParams {
  exchange: string; // e.g., "NASDAQ"
}

export interface Holiday {
  date: string;
  name: string;
  exchange: string;
  isOpen: boolean;
}

export type HolidaysByExchangeResponse = Holiday[];

// ========== All Exchange Market Hours ==========

export interface AllExchangeMarketHours {
  exchange: string;
  tradingHours: string;
  timezone: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  currentTime?: string;
}

export type AllExchangeMarketHoursResponse = AllExchangeMarketHours[];
