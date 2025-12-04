/**
 * Types pour les endpoints Earnings Transcript de FMP
 */

// ========== Latest Earning Transcripts ==========

export interface LatestEarningTranscriptsResponse {
  symbol: string;
  companyName: string;
  noOfTranscripts: string;
}

// ========== Earnings Transcript ==========

export interface EarningsTranscriptQueryParams {
  symbol: string; // Required
  year: number; // Required
  quarter: number; // Required (1, 2, 3, or 4)
}

export interface EarningsTranscript {
  symbol: string;
  quarter: number;
  year: number;
  date: string;
  content: string;
}

export type EarningsTranscriptResponse = EarningsTranscript[];

// ========== Transcripts Dates By Symbol ==========

export interface TranscriptsDatesBySymbolQueryParams {
  symbol: string; // Required
}

export interface TranscriptDate {
  quarter: number;
  fiscalYear: number;
  date: string;
}

export type TranscriptsDatesBySymbolResponse = TranscriptDate[];

// ========== Available Transcript Symbols ==========

export interface AvailableTranscriptSymbol {
  symbol: string;
  companyName: string;
  noOfTranscripts: string;
}

export type AvailableTranscriptSymbolsResponse = AvailableTranscriptSymbol[];

