/**
 * Module FMP - Interface publique
 * Expose toutes les fonctions FMP pour le router
 * Utilise les services et repositories pour éviter la duplication
 */

import { FMPService } from './services/fmp.service';
import { logger } from './utils/logger';

// Instance singleton du service
const fmpService = new FMPService();

// ========== Quote & Market Data ==========

export async function getFMPQuote(symbol: string, forceRefresh: boolean = false) {
  const log = logger.child({ symbol, function: 'getFMPQuote' });
  log.info('Getting FMP quote');
  try {
    return await fmpService.getQuote(symbol, forceRefresh);
  } catch (error) {
    log.error('Failed to get FMP quote', error);
    throw error;
  }
}

export async function getFMPHistoricalPrice(symbol: string, period: string = '1day', forceRefresh: boolean = false) {
  return await fmpService.getHistoricalPrice(symbol, period, forceRefresh);
}

export async function getFMPMarketCap(symbol: string) {
  const quote = await fmpService.getQuote(symbol);
  return {
    success: true,
    data: { symbol, marketCap: quote.data.marketCap || 0 },
    cached: quote.cached,
    timestamp: quote.timestamp,
  };
}

// ========== Financial Statements ==========

export async function getFMPIncomeStatement(symbol: string, period: string = 'annual', limit: number = 5) {
  return await fmpService.getIncomeStatement(symbol, period, limit);
}

export async function getFMPBalanceSheet(symbol: string, period: string = 'annual', limit: number = 5) {
  return await fmpService.getBalanceSheet(symbol, period, limit);
}

export async function getFMPCashFlow(symbol: string, period: string = 'annual', limit: number = 5) {
  return await fmpService.getCashFlow(symbol, period, limit);
}

// ========== Financial Metrics ==========

export async function getFMPKeyMetrics(symbol: string, period: string = 'annual', limit: number = 5) {
  return await fmpService.getKeyMetrics(symbol, period, limit);
}

export async function getFMPRatios(symbol: string, period: string = 'annual', limit: number = 5) {
  return await fmpService.getRatios(symbol, period, limit);
}

export async function getFMPDCF(symbol: string) {
  return await fmpService.getDCF(symbol);
}

export async function getFMPEnterpriseValue(symbol: string, period: string = 'annual', limit: number = 5) {
  return await fmpService.getEnterpriseValue(symbol, period, limit);
}

// ========== Earnings & Estimates ==========

export async function getFMPEarnings(symbol: string, limit: number = 10) {
  return await fmpService.getEarnings(symbol, limit);
}

export async function getFMPEarningsTranscript(symbol: string, limit: number = 10) {
  return await fmpService.getEarningsTranscript(symbol, limit);
}

export async function getFMPEarningsEstimates(symbol: string, period: string = 'annual', limit: number = 10) {
  return await fmpService.getEarningsEstimates(symbol, period, limit);
}

export async function getFMPEarningsSurprises(symbol: string, limit: number = 10) {
  return await fmpService.getEarningsSurprises(symbol, limit);
}

export async function getFMPAnalystEstimates(symbol: string, period: string = 'annual', limit: number = 10) {
  return await fmpService.getAnalystEstimates(symbol, period, limit);
}

// ========== Insider & Institutional ==========

export async function getFMPInsiderTrades(symbol: string, limit: number = 100) {
  return await fmpService.getInsiderTrades(symbol, limit);
}

export async function getFMPHedgeFundHoldings(symbol: string, limit: number = 100) {
  return await fmpService.getHedgeFundHoldings(symbol, limit);
}

// ========== Market Data ==========

export async function getFMPMarketNews(symbol?: string, limit: number = 50) {
  return await fmpService.getMarketNews(symbol, limit);
}

export async function getFMPEconomicCalendar(from: string, to: string) {
  return await fmpService.getEconomicCalendar(from, to);
}

export async function getFMPEarningsCalendar(from: string, to: string) {
  return await fmpService.getEarningsCalendar(from, to);
}

export async function getFMPScreener(criteria: Record<string, any>) {
  return await fmpService.getScreener(criteria);
}

// ========== SEC Filings ==========

export async function getFMPSECFilings(symbol: string, type?: string, limit: number = 10) {
  return await fmpService.getSECFilings(symbol, type, limit);
}

