/**
 * Service de calendrier économique combiné
 * Combine FMP Economic Calendar + Unusual Whales Economic Calendar
 */

import { logger } from '../utils/logger';
import { handleError } from '../utils/errors';
import * as fmp from '../fmp';
import * as uw from '../unusual-whales';
import type { EconomicCalendarEvent } from '../types/fmp/economics';
import type { EconomicEvent } from '../types/unusual-whales/market';

export interface CombinedEconomicEvent {
  date: string; // ISO date
  source: 'FMP' | 'UW' | 'BOTH'; // Source de l'événement
  // Données FMP
  fmp?: {
    country: string;
    event: string;
    currency: string;
    previous: number | null;
    estimate: number | null;
    actual: number | null;
    change: number | null;
    impact: string;
    changePercentage: number | null;
  };
  // Données UW
  uw?: {
    description: string;
    impact: string;
    country: string;
    time: string;
  };
  // Données fusionnées (priorité à FMP si disponible)
  event: string; // Nom de l'événement
  country: string;
  impact: string; // 'Low' | 'Medium' | 'High'
  time?: string; // Heure si disponible (UW)
  currency?: string; // Devise si disponible (FMP)
  previous?: number | null;
  estimate?: number | null;
  actual?: number | null;
  change?: number | null;
  changePercentage?: number | null;
}

export interface CombinedEconomicCalendarResponse {
  success: boolean;
  data: CombinedEconomicEvent[];
  cached: boolean;
  count: number;
  timestamp: string;
  sources: {
    fmp: { count: number; status: 'fulfilled' | 'rejected' };
    uw: { count: number; status: 'fulfilled' | 'rejected' };
  };
}

export class EconomicCalendarService {
  /**
   * Combine les calendriers économiques de FMP et Unusual Whales
   */
  async getCombinedEconomicCalendar(params: {
    from?: string;
    to?: string;
  }): Promise<CombinedEconomicCalendarResponse> {
    return handleError(async () => {
      const log = logger.child({ operation: 'getCombinedEconomicCalendar' });
      log.info('Fetching combined economic calendar', { from: params.from, to: params.to });

      // Récupération parallèle des deux calendriers
      const [fmpResult, uwResult] = await Promise.allSettled([
        fmp.getFMPEconomicCalendar({ from: params.from, to: params.to }),
        uw.getUWEconomicCalendar({
          // Convertir from/to en date pour UW si nécessaire
          // UW utilise 'date' (une seule date) ou 'limit' + 'page'
          // Pour une période, on récupère toutes les pages nécessaires
          limit: 500, // Max pour UW
        }),
      ]);

      const fmpStatus = fmpResult.status;
      const uwStatus = uwResult.status;

      log.info('Economic calendars fetched', {
        fmp: fmpStatus,
        uw: uwStatus,
      });

      // Extraire les données
      const fmpEvents: EconomicCalendarEvent[] =
        fmpStatus === 'fulfilled' && fmpResult.value.success
          ? (Array.isArray(fmpResult.value.data) ? fmpResult.value.data : [])
          : [];
      const uwEvents: EconomicEvent[] =
        uwStatus === 'fulfilled' && uwResult.value.success
          ? (Array.isArray(uwResult.value.data) ? uwResult.value.data : [])
          : [];

      log.info('Events extracted', {
        fmpCount: fmpEvents.length,
        uwCount: uwEvents.length,
      });

      // Créer un Map pour fusionner les événements par date
      const eventsMap = new Map<string, CombinedEconomicEvent>();

      // Ajouter les événements FMP
      for (const event of fmpEvents) {
        const dateKey = event.date.split(' ')[0]; // Extraire YYYY-MM-DD de "YYYY-MM-DD HH:MM:SS"
        const existing = eventsMap.get(dateKey);

        if (existing) {
          // Fusionner avec l'événement UW existant
          existing.source = 'BOTH';
          existing.fmp = {
            country: event.country,
            event: event.event,
            currency: event.currency,
            previous: event.previous,
            estimate: event.estimate,
            actual: event.actual,
            change: event.change,
            impact: event.impact,
            changePercentage: event.changePercentage,
          };
          // Mettre à jour les champs fusionnés (priorité à FMP)
          existing.event = event.event;
          existing.country = event.country;
          existing.impact = event.impact;
          existing.currency = event.currency;
          existing.previous = event.previous;
          existing.estimate = event.estimate;
          existing.actual = event.actual;
          existing.change = event.change;
          existing.changePercentage = event.changePercentage;
        } else {
          // Nouvel événement FMP
          eventsMap.set(dateKey, {
            date: dateKey,
            source: 'FMP',
            fmp: {
              country: event.country,
              event: event.event,
              currency: event.currency,
              previous: event.previous,
              estimate: event.estimate,
              actual: event.actual,
              change: event.change,
              impact: event.impact,
              changePercentage: event.changePercentage,
            },
            event: event.event,
            country: event.country,
            impact: event.impact,
            currency: event.currency,
            previous: event.previous,
            estimate: event.estimate,
            actual: event.actual,
            change: event.change,
            changePercentage: event.changePercentage,
          });
        }
      }

      // Ajouter les événements UW
      for (const event of uwEvents) {
        const dateKey = event.date; // UW retourne déjà YYYY-MM-DD
        const existing = eventsMap.get(dateKey);

        if (existing) {
          // Fusionner avec l'événement FMP existant
          existing.source = 'BOTH';
          existing.uw = {
            description: event.description,
            impact: event.impact,
            country: event.country,
            time: event.time,
          };
          // Ajouter l'heure si pas déjà présente
          if (!existing.time) {
            existing.time = event.time;
          }
        } else {
          // Nouvel événement UW
          eventsMap.set(dateKey, {
            date: dateKey,
            source: 'UW',
            uw: {
              description: event.description,
              impact: event.impact,
              country: event.country,
              time: event.time,
            },
            event: event.description,
            country: event.country,
            impact: event.impact,
            time: event.time,
          });
        }
      }

      // Filtrer par période si spécifiée
      let combinedEvents = Array.from(eventsMap.values());

      if (params.from || params.to) {
        combinedEvents = combinedEvents.filter((event) => {
          const eventDate = new Date(event.date);
          if (params.from) {
            const fromDate = new Date(params.from);
            if (eventDate < fromDate) return false;
          }
          if (params.to) {
            const toDate = new Date(params.to);
            if (eventDate > toDate) return false;
          }
          return true;
        });
      }

      // Trier par date
      combinedEvents.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

      log.info('Combined calendar created', {
        totalEvents: combinedEvents.length,
        fmpOnly: combinedEvents.filter((e) => e.source === 'FMP').length,
        uwOnly: combinedEvents.filter((e) => e.source === 'UW').length,
        both: combinedEvents.filter((e) => e.source === 'BOTH').length,
      });

      return {
        success: true,
        data: combinedEvents,
        cached: false,
        count: combinedEvents.length,
        timestamp: new Date().toISOString(),
        sources: {
          fmp: {
            count: fmpEvents.length,
            status: fmpStatus === 'fulfilled' ? 'fulfilled' : 'rejected',
          },
          uw: {
            count: uwEvents.length,
            status: uwStatus === 'fulfilled' ? 'fulfilled' : 'rejected',
          },
        },
      };
    }, 'Get combined economic calendar');
  }
}

