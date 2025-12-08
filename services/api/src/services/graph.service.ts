/**
 * Service de gestion du graphe d'entités (Neo4j)
 * Gère les nœuds, relations et requêtes graph
 */

import { logger } from '../utils/logger';
import { handleError } from '../utils/errors';
import { Neo4jRepository } from '../repositories/neo4j.repository';

export class GraphService {
  private repository: Neo4jRepository;

  constructor() {
    this.repository = new Neo4jRepository();
  }

  /**
   * Récupérer les positions institutionnelles depuis le graphe
   */
  async getInstitutionalPositions(ticker: string): Promise<any[]> {
    return handleError(async () => {
      const log = logger.child({ operation: 'getInstitutionalPositions', ticker });
      log.info('Getting institutional positions from graph');

      const cypher = `
        MATCH (t:Ticker {symbol: $ticker})<-[r:HOLDS]-(i:Institution)
        RETURN i.id as institutionId,
               i.name as institutionName,
               r.shares as shares,
               r.value as value,
               r.change as change,
               r.changePercent as changePercent,
               r.filingDate as filingDate
        ORDER BY r.value DESC
        LIMIT 50
      `;

      const results = await this.repository.executeQuery(cypher, { ticker: ticker.toUpperCase() });
      log.info('Institutional positions retrieved from graph', { count: results.length });
      return results;
    }, 'Get institutional positions from graph');
  }

  /**
   * Récupérer les transactions insiders depuis le graphe
   */
  async getInsiderTransactions(ticker: string): Promise<any[]> {
    return handleError(async () => {
      const log = logger.child({ operation: 'getInsiderTransactions', ticker });
      log.info('Getting insider transactions from graph');

      const cypher = `
        MATCH (t:Ticker {symbol: $ticker})<-[r:TRADES]-(ins:Insider)
        RETURN ins.id as insiderId,
               ins.name as insiderName,
               t.symbol as ticker,
               r.transactionType as transactionType,
               r.amount as amount,
               r.price as price,
               r.date as date
        ORDER BY r.date DESC
        LIMIT 50
      `;

      const results = await this.repository.executeQuery(cypher, { ticker: ticker.toUpperCase() });
      log.info('Insider transactions retrieved from graph', { count: results.length });
      return results;
    }, 'Get insider transactions from graph');
  }

  /**
   * Récupérer les flows historiques depuis le graphe
   */
  async getHistoricalFlows(ticker: string, flowType: 'CALL' | 'PUT'): Promise<any[]> {
    return handleError(async () => {
      const log = logger.child({ operation: 'getHistoricalFlows', ticker, flowType });
      log.info('Getting historical flows from graph');

      const cypher = `
        MATCH (t:Ticker {symbol: $ticker})<-[r:ON]-(f:Flow)
        WHERE f.flowType = $flowType
        RETURN f.id as flowId,
               f.premium as premium,
               f.strike as strike,
               f.expiry as expiry,
               f.timestamp as timestamp
        ORDER BY f.timestamp DESC
        LIMIT 100
      `;

      const results = await this.repository.executeQuery(cypher, {
        ticker: ticker.toUpperCase(),
        flowType,
      });
      log.info('Historical flows retrieved from graph', { count: results.length });
      return results;
    }, 'Get historical flows from graph');
  }

  /**
   * Obtenir la centralité d'une entité dans le graphe (simple)
   */
  async getEntityCentrality(entityId: string, entityType: string): Promise<number> {
    return handleError(async () => {
      const log = logger.child({ operation: 'getEntityCentrality', entityId, entityType });
      log.info('Getting entity centrality from graph');

      const centrality = await this.repository.getEntityCentrality(entityId, entityType);
      log.info('Entity centrality calculated', { centrality });
      return centrality;
    }, 'Get entity centrality from graph');
  }

  /**
   * Obtenir les métriques de centralité avancées
   */
  async getAdvancedCentralityMetrics(
    entityId: string,
    entityType: string
  ): Promise<import('../types/attribution').GraphCentralityMetrics> {
    return handleError(async () => {
      const log = logger.child({
        operation: 'getAdvancedCentralityMetrics',
        entityId,
        entityType,
      });
      log.info('Getting advanced centrality metrics from graph');

      const metrics = await this.repository.getAdvancedCentralityMetrics(entityId, entityType);
      log.info('Advanced centrality metrics calculated', { overall: metrics.overall });
      return metrics;
    }, 'Get advanced centrality metrics from graph');
  }

  /**
   * Détecter les clusters sectoriels
   */
  async detectSectorClusters(sector?: string): Promise<import('../types/attribution').SectorCluster[]> {
    return handleError(async () => {
      const log = logger.child({ operation: 'detectSectorClusters', sector });
      log.info('Detecting sector clusters from graph');

      const clusters = await this.repository.detectSectorClusters(sector);
      log.info('Sector clusters detected', { count: clusters.length });
      return clusters;
    }, 'Detect sector clusters from graph');
  }

  /**
   * Créer ou mettre à jour un nœud dans le graphe
   */
  async createOrUpdateNode(type: string, data: Record<string, any>): Promise<void> {
    return handleError(async () => {
      const log = logger.child({ operation: 'createOrUpdateNode', type });
      log.info('Creating/updating node in graph', { data });

      await this.repository.createOrUpdateNode(type, data);
      log.info('Node created/updated in graph');
    }, 'Create or update node in graph');
  }

  /**
   * Créer ou mettre à jour une relation dans le graphe
   */
  async createOrUpdateRelationship(
    from: { type: string; id: string },
    to: { type: string; id: string },
    relationshipType: string,
    properties?: Record<string, any>
  ): Promise<void> {
    return handleError(async () => {
      const log = logger.child({ operation: 'createOrUpdateRelationship' });
      log.info('Creating/updating relationship in graph', {
        from,
        to,
        relationshipType,
        properties,
      });

      await this.repository.createOrUpdateRelationship(
        from.id,
        from.type,
        to.id,
        to.type,
        relationshipType,
        properties
      );
      log.info('Relationship created/updated in graph');
    }, 'Create or update relationship in graph');
  }

  /**
   * Trouver les connexions d'une entité
   */
  async findEntityConnections(
    entityId: string,
    entityType: string,
    depth: number = 2
  ): Promise<any[]> {
    return handleError(async () => {
      const log = logger.child({ operation: 'findEntityConnections', entityId, entityType, depth });
      log.info('Finding entity connections in graph');

      const connections = await this.repository.findEntityConnections(entityId, entityType, depth);
      log.info('Entity connections found', { count: connections.length });
      return connections;
    }, 'Find entity connections in graph');
  }

  /**
   * Tester la connexion Neo4j
   */
  async testConnection(): Promise<boolean> {
    return handleError(async () => {
      const log = logger.child({ operation: 'testConnection' });
      log.info('Testing Neo4j connection');

      const isConnected = await this.repository.testConnection();
      log.info('Neo4j connection test result', { isConnected });
      return isConnected;
    }, 'Test Neo4j connection');
  }
}
