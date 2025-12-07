/**
 * Service pour récupérer les derniers 13F filings
 * Combine FMP + Unusual Whales
 */

import { logger } from '../utils/logger';
import { handleError } from '../utils/errors';
import * as fmp from '../fmp';
import * as uw from '../unusual-whales';

export interface Filing13F {
  cik: string;
  institutionName: string;
  formType: string; // '13F-HR' ou '13F-HR/A'
  filingDate: string; // ISO date
  reportDate: string; // ISO date (date du rapport trimestriel)
  source: 'FMP' | 'UW' | 'BOTH';
  url?: string; // URL du filing sur EDGAR
  totalValue?: number; // Valeur totale des holdings (si disponible)
  holdingsCount?: number; // Nombre de positions (si disponible)
}

export interface Latest13FFilingsResponse {
  success: boolean;
  data: Filing13F[];
  cached: boolean;
  count: number;
  timestamp: string;
  sources: {
    fmp: { count: number; status: 'fulfilled' | 'rejected' };
    uw: { count: number; status: 'fulfilled' | 'rejected' };
  };
}

export class Filing13FService {
  /**
   * Récupère les derniers 13F filings publiés
   */
  async getLatest13FFilings(params: {
    from?: string; // YYYY-MM-DD (optionnel, défaut: 90 jours en arrière)
    to?: string; // YYYY-MM-DD (optionnel, défaut: aujourd'hui)
    limit?: number; // Nombre de résultats (défaut: 100)
  }): Promise<Latest13FFilingsResponse> {
    return handleError(async () => {
      const log = logger.child({ operation: 'getLatest13FFilings' });
      
      // Définir les dates par défaut (90 derniers jours)
      const to = params.to || new Date().toISOString().split('T')[0];
      const from = params.from || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const limit = params.limit || 100;

      log.info('Fetching latest 13F filings', { from, to, limit });

      // Récupération parallèle des deux sources
      const [fmpResult, uwResult] = await Promise.allSettled([
        // FMP : Filtrer par formType 13F-HR
        fmp.getFMPSECFilingsByFormType({
          formType: '13F-HR',
          from,
          to,
          page: 0,
          limit: Math.min(limit, 100), // FMP max 100
        }),
        // Unusual Whales : Latest filings institutionnels
        uw.getUWLatestFilings({
          limit: Math.min(limit, 500), // UW max 500
          order: 'filing_date',
          order_direction: 'desc',
        }),
      ]);

      const fmpStatus = fmpResult.status;
      const uwStatus = uwResult.status;

      log.info('13F filings fetched', {
        fmp: fmpStatus,
        uw: uwStatus,
      });

      // Extraire et filtrer les données FMP (uniquement 13F)
      const fmpFilings: Filing13F[] = [];
      if (fmpStatus === 'fulfilled' && fmpResult.value.success) {
        const fmpData = Array.isArray(fmpResult.value.data) ? fmpResult.value.data : [];
        for (const filing of fmpData) {
          // Filtrer uniquement les 13F (13F-HR et 13F-HR/A)
          if (filing.formType && (filing.formType.includes('13F') || filing.formType === '13F-HR' || filing.formType === '13F-HR/A')) {
            fmpFilings.push({
              cik: filing.cik || '',
              institutionName: filing.symbol || 'Unknown', // FMP ne retourne pas le nom de l'institution, seulement le symbol/CIK
              formType: filing.formType,
              filingDate: filing.filingDate || filing.acceptedDate || '',
              reportDate: filing.filingDate || filing.acceptedDate || '', // FMP n'a pas de reportDate séparé
              source: 'FMP',
              url: filing.link || filing.finalLink,
            });
          }
        }
      }

      // Extraire les données UW (déjà filtrées pour les filings institutionnels)
      const uwFilings: Filing13F[] = [];
      if (uwStatus === 'fulfilled' && uwResult.value.success) {
        const uwData = Array.isArray(uwResult.value.data) ? uwResult.value.data : [];
        for (const filing of uwData) {
          // UW LatestFilings retourne les derniers filings institutionnels (qui sont principalement des 13F)
          // Note: UW ne spécifie pas explicitement le formType, mais latest_filings retourne principalement des 13F
          uwFilings.push({
            cik: filing.cik || '',
            institutionName: filing.name || 'Unknown',
            formType: '13F-HR', // UW latest_filings retourne principalement des 13F
            filingDate: filing.filing_date || '',
            reportDate: filing.filing_date || '', // UW n'a pas de reportDate séparé dans LatestFiling
            source: 'UW',
            // LatestFiling n'a pas de totalValue ou holdingsCount
          });
        }
      }

      log.info('Filings extracted', {
        fmpCount: fmpFilings.length,
        uwCount: uwFilings.length,
      });

      // Fusionner les filings par CIK et date de filing
      const filingsMap = new Map<string, Filing13F>();

      // Ajouter les filings FMP
      for (const filing of fmpFilings) {
        const key = `${filing.cik}_${filing.filingDate}`;
        const existing = filingsMap.get(key);

        if (existing) {
          // Fusionner avec UW
          existing.source = 'BOTH';
          if (!existing.url && filing.url) {
            existing.url = filing.url;
          }
        } else {
          filingsMap.set(key, filing);
        }
      }

      // Ajouter les filings UW
      for (const filing of uwFilings) {
        const key = `${filing.cik}_${filing.filingDate}`;
        const existing = filingsMap.get(key);

        if (existing) {
          // Fusionner avec FMP
          existing.source = 'BOTH';
          if (!existing.totalValue && filing.totalValue) {
            existing.totalValue = filing.totalValue;
          }
          if (!existing.holdingsCount && filing.holdingsCount) {
            existing.holdingsCount = filing.holdingsCount;
          }
        } else {
          filingsMap.set(key, filing);
        }
      }

      // Filtrer par période si spécifiée
      let combinedFilings = Array.from(filingsMap.values());

      if (from || to) {
        combinedFilings = combinedFilings.filter((filing) => {
          const filingDate = new Date(filing.filingDate);
          if (from) {
            const fromDate = new Date(from);
            if (filingDate < fromDate) return false;
          }
          if (to) {
            const toDate = new Date(to);
            if (filingDate > toDate) return false;
          }
          return true;
        });
      }

      // Trier par date de filing décroissante (plus récents en premier)
      combinedFilings.sort((a, b) => {
        const dateA = new Date(a.filingDate);
        const dateB = new Date(b.filingDate);
        return dateB.getTime() - dateA.getTime();
      });

      // Limiter le nombre de résultats
      combinedFilings = combinedFilings.slice(0, limit);

      log.info('Combined 13F filings created', {
        totalFilings: combinedFilings.length,
        fmpOnly: combinedFilings.filter((f) => f.source === 'FMP').length,
        uwOnly: combinedFilings.filter((f) => f.source === 'UW').length,
        both: combinedFilings.filter((f) => f.source === 'BOTH').length,
      });

      return {
        success: true,
        data: combinedFilings,
        cached: false,
        count: combinedFilings.length,
        timestamp: new Date().toISOString(),
        sources: {
          fmp: {
            count: fmpFilings.length,
            status: fmpStatus === 'fulfilled' ? 'fulfilled' : 'rejected',
          },
          uw: {
            count: uwFilings.length,
            status: uwStatus === 'fulfilled' ? 'fulfilled' : 'rejected',
          },
        },
      };
    }, 'Get latest 13F filings');
  }
}

