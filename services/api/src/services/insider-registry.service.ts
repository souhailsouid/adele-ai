/**
 * Service de Registry des Insiders
 * Mapping insiderId → person name, role, CIK, etc.
 */

import { logger } from '../utils/logger';
import { handleError } from '../utils/errors';
import * as uw from '../unusual-whales';
import * as fmp from '../fmp';
import type { InsiderInfo } from '../types/attribution';

export class InsiderRegistryService {
  private registry: Map<string, InsiderInfo> = new Map();

  constructor() {
    // Le registry sera rempli progressivement lors des appels
  }

  /**
   * Obtenir ou créer les infos d'un insider
   */
  async getInsiderInfo(insiderId: string, ticker?: string): Promise<InsiderInfo | null> {
    return handleError(async () => {
      const log = logger.child({
        operation: 'getInsiderInfo',
        insiderId,
        ticker,
      });

      // Vérifier le cache
      if (this.registry.has(insiderId)) {
        return this.registry.get(insiderId)!;
      }

      log.info('Fetching insider info from APIs');

      // Récupérer depuis UW (FMP n'a pas d'endpoint insider direct)
      const [uwResult] = await Promise.allSettled([
        ticker ? uw.getUWStockInsiderBuySells(ticker, {}) : Promise.resolve({ success: false, data: [] }),
      ]);

      let insiderInfo: InsiderInfo | null = null;

      // Chercher dans UW
      if (uwResult.status === 'fulfilled' && uwResult.value.success) {
        const data = uwResult.value.data;
        let allTransactions: any[] = [];
        
        if (Array.isArray(data)) {
          allTransactions = data;
        } else if (data && typeof data === 'object') {
          if ('buy_sells' in data || 'sell_sells' in data) {
            allTransactions = [...((data as any).buy_sells || []), ...((data as any).sell_sells || [])];
          } else if ('data' in data && Array.isArray((data as any).data)) {
            allTransactions = (data as any).data;
          }
        }

        const transaction = allTransactions.find((t: any) => {
          const ownerName = (t.owner_name || t.insider_name || t.name || '').toLowerCase().replace(/\s+/g, '-');
          return ownerName === insiderId.toLowerCase();
        });

        if (transaction) {
          const ownerName = transaction.owner_name || transaction.insider_name || transaction.name || '';
          const officerTitle = transaction.officer_title || transaction.title || '';

          insiderInfo = {
            insiderId: insiderId,
            name: ownerName,
            role: officerTitle || undefined,
            company: ticker,
            lastSeen: transaction.transaction_date || transaction.date,
          };
        }
      }

      // FMP n'a pas d'endpoint insider direct, on utilise uniquement UW

      // Détecter le type (LLC, Trust, etc.)
      if (insiderInfo) {
        const nameLower = insiderInfo.name.toLowerCase();
        insiderInfo.isLLC = nameLower.includes('llc') || nameLower.includes('l.l.c.');
        insiderInfo.isTrust = nameLower.includes('trust');
        insiderInfo.isBeneficialOwner = nameLower.includes('beneficial') || nameLower.includes('owner');
      }

      // Mettre en cache
      if (insiderInfo) {
        this.registry.set(insiderId, insiderInfo);
        log.info('Insider info cached', { name: insiderInfo.name, role: insiderInfo.role });
      } else {
        // Créer une entrée minimale pour éviter les recherches répétées
        this.registry.set(insiderId, {
          insiderId,
          name: insiderId,
        });
      }

      return insiderInfo;
    }, 'Get insider info');
  }

  /**
   * Enrichir un insider avec les infos du registry
   */
  async enrichInsider(
    insiderId: string,
    insiderName: string,
    ticker?: string
  ): Promise<InsiderInfo> {
    const info = await this.getInsiderInfo(insiderId, ticker);
    
    if (info) {
      return info;
    }

    // Retourner les infos de base si pas trouvé
    return {
      insiderId,
      name: insiderName || insiderId,
    };
  }

  /**
   * Rechercher des insiders par nom (fuzzy match)
   */
  async searchInsiders(query: string, ticker?: string): Promise<InsiderInfo[]> {
    return handleError(async () => {
      const results: InsiderInfo[] = [];

      // Chercher dans le registry
      for (const [id, info] of this.registry.entries()) {
        if (
          info.name.toLowerCase().includes(query.toLowerCase()) ||
          id.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push(info);
        }
      }

      // Si pas de résultats et ticker fourni, chercher dans les APIs
      if (results.length === 0 && ticker) {
        const uwResult = await Promise.allSettled([
          uw.getUWStockInsiderBuySells(ticker, {}),
        ]);

        if (uwResult[0].status === 'fulfilled' && uwResult[0].value.success) {
          const data = uwResult[0].value.data;
          let allTransactions: any[] = [];
          
          if (Array.isArray(data)) {
            allTransactions = data;
          } else if (data && typeof data === 'object') {
            if ('buy_sells' in data || 'sell_sells' in data) {
              allTransactions = [...((data as any).buy_sells || []), ...((data as any).sell_sells || [])];
            }
          }

          const matching = allTransactions.filter((t: any) => {
            const name = (t.owner_name || t.insider_name || '').toLowerCase();
            return name.includes(query.toLowerCase());
          });

          for (const t of matching) {
            const ownerName = t.owner_name || t.insider_name || '';
            const id = ownerName.toLowerCase().replace(/\s+/g, '-');
            
            const info = await this.getInsiderInfo(id, ticker);
            if (info && !results.find(r => r.insiderId === id)) {
              results.push(info);
            }
          }
        }
      }

      return results;
    }, 'Search insiders');
  }
}

