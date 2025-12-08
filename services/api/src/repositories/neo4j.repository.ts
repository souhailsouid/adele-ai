/**
 * Repository pour Neo4j
 * Gère les connexions et requêtes Cypher
 */

import neo4j, { Driver, Session } from 'neo4j-driver';
import { logger } from '../utils/logger';
import { handleError } from '../utils/errors';

export class Neo4jRepository {
  private driver: Driver | null = null;
  private uri: string;
  private username: string;
  private password: string;
  private database: string;

  constructor() {
    this.uri = process.env.NEO4J_URI || '';
    this.username = process.env.NEO4J_USERNAME || process.env.NEO4J_USER || 'neo4j';
    this.password = process.env.NEO4J_PASSWORD || '';
    this.database = process.env.NEO4J_DATABASE || 'neo4j';

    if (!this.uri || !this.password) {
      logger.warn('Neo4j credentials not configured. Graph features will be limited.');
    }
  }

  /**
   * Obtenir ou créer le driver Neo4j
   */
  private getDriver(): Driver | null {
    if (!this.uri || !this.password) {
      return null;
    }

    if (!this.driver) {
      try {
        this.driver = neo4j.driver(
          this.uri,
          neo4j.auth.basic(this.username, this.password),
          {
            maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 hours
            maxConnectionPoolSize: 50,
            connectionAcquisitionTimeout: 2 * 60 * 1000, // 2 minutes
          }
        );
        logger.info('Neo4j driver created');
      } catch (error) {
        logger.error('Failed to create Neo4j driver', error);
        return null;
      }
    }

    return this.driver;
  }

  /**
   * Obtenir une session Neo4j
   */
  private async getSession(): Promise<Session | null> {
    const driver = this.getDriver();
    if (!driver) {
      return null;
    }

    try {
      return driver.session({ database: this.database });
    } catch (error) {
      logger.error('Failed to create Neo4j session', error);
      return null;
    }
  }

  /**
   * Exécuter une requête Cypher
   */
  async executeQuery<T = any>(
    cypher: string,
    params?: Record<string, any>
  ): Promise<T[]> {
    return handleError(async () => {
      const session = await this.getSession();
      if (!session) {
        logger.warn('Neo4j not available, returning empty result');
        return [];
      }

      try {
        const result = await session.run(cypher, params);
        return result.records.map((record) => {
          const obj: any = {};
          record.keys.forEach((key) => {
            obj[key] = this.convertNeo4jValue(record.get(key));
          });
          return obj as T;
        });
      } finally {
        await session.close();
      }
    }, 'Execute Neo4j query');
  }

  /**
   * Créer ou mettre à jour un nœud
   */
  async createOrUpdateNode(
    type: string,
    properties: Record<string, any>
  ): Promise<string> {
    return handleError(async () => {
      const session = await this.getSession();
      if (!session) {
        logger.warn('Neo4j not available, skipping node creation');
        return '';
      }

      try {
        // Générer un ID unique si non fourni
        const nodeId = properties.id || `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Construire la requête MERGE
        const propsString = Object.keys(properties)
          .map((key) => `n.${key} = $${key}`)
          .join(', ');

        const cypher = `
          MERGE (n:${type} {id: $id})
          SET ${propsString}
          RETURN n.id as id
        `;

        const result = await session.run(cypher, { id: nodeId, ...properties });
        
        if (result.records.length > 0) {
          return result.records[0].get('id');
        }
        
        return nodeId;
      } finally {
        await session.close();
      }
    }, 'Create or update Neo4j node');
  }

  /**
   * Créer ou mettre à jour une relation
   */
  async createOrUpdateRelationship(
    fromId: string,
    fromType: string,
    toId: string,
    toType: string,
    relationshipType: string,
    properties?: Record<string, any>
  ): Promise<void> {
    return handleError(async () => {
      const session = await this.getSession();
      if (!session) {
        logger.warn('Neo4j not available, skipping relationship creation');
        return;
      }

      try {
        const propsString = properties
          ? Object.keys(properties)
              .map((key) => `r.${key} = $${key}`)
              .join(', ')
          : '';

        const setClause = propsString ? `SET ${propsString}` : '';

        const cypher = `
          MATCH (from:${fromType} {id: $fromId})
          MATCH (to:${toType} {id: $toId})
          MERGE (from)-[r:${relationshipType}]->(to)
          ${setClause}
        `;

        await session.run(cypher, {
          fromId,
          toId,
          ...(properties || {}),
        });
      } finally {
        await session.close();
      }
    }, 'Create or update Neo4j relationship');
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
      const session = await this.getSession();
      if (!session) {
        return [];
      }

      try {
        const cypher = `
          MATCH (start:${entityType} {id: $entityId})
          MATCH path = (start)-[*1..${depth}]-(connected)
          RETURN path, length(path) as depth
          ORDER BY depth
          LIMIT 50
        `;

        const result = await session.run(cypher, { entityId });
        return result.records.map((record) => ({
          path: record.get('path'),
          depth: record.get('depth'),
        }));
      } finally {
        await session.close();
      }
    }, 'Find entity connections');
  }

  /**
   * Calculer la centralité d'une entité (degré simple)
   */
  async getEntityCentrality(
    entityId: string,
    entityType: string
  ): Promise<number> {
    return handleError(async () => {
      const session = await this.getSession();
      if (!session) {
        return 0;
      }

      try {
        // Centralité de degré (nombre de connexions)
        const cypher = `
          MATCH (n:${entityType} {id: $entityId})
          OPTIONAL MATCH (n)-[r]-()
          RETURN count(r) as degree
        `;

        const result = await session.run(cypher, { entityId });
        
        if (result.records.length > 0) {
          const degree = result.records[0].get('degree').toNumber();
          // Normaliser entre 0 et 1 (supposons max 100 connexions)
          return Math.min(1, degree / 100);
        }
        
        return 0;
      } finally {
        await session.close();
      }
    }, 'Get entity centrality');
  }

  /**
   * Calculer les métriques de centralité avancées (Betweenness, PageRank, etc.)
   */
  async getAdvancedCentralityMetrics(
    entityId: string,
    entityType: string
  ): Promise<import('../types/attribution').GraphCentralityMetrics> {
    return handleError(async () => {
      const session = await this.getSession();
      if (!session) {
        // Retourner des valeurs par défaut si Neo4j indisponible
        return {
          degree: 0,
          betweenness: 0,
          pagerank: 0,
          closeness: 0,
          eigenvector: 0,
          overall: 0,
        };
      }

      try {
        // 1. Degree Centrality
        const degreeCypher = `
          MATCH (n:${entityType} {id: $entityId})
          OPTIONAL MATCH (n)-[r]-()
          RETURN count(r) as degree
        `;
        const degreeResult = await session.run(degreeCypher, { entityId });
        const degree = degreeResult.records.length > 0 
          ? degreeResult.records[0].get('degree').toNumber() 
          : 0;

        // 2. Betweenness Centrality (approximation)
        // Calcule le nombre de plus courts chemins qui passent par ce nœud
        const betweennessCypher = `
          MATCH (n:${entityType} {id: $entityId})
          MATCH (a)-[*..3]-(b)
          WHERE a <> n AND b <> n AND a <> b
          WITH a, b, n, 
               [path IN allShortestPaths((a)-[*..3]-(b)) WHERE n IN nodes(path)] as pathsThroughN
          RETURN count(pathsThroughN) as betweenness
        `;
        const betweennessResult = await session.run(betweennessCypher, { entityId });
        const betweennessRaw = betweennessResult.records.length > 0
          ? betweennessResult.records[0].get('betweenness').toNumber()
          : 0;
        // Normaliser (approximation, max basé sur le nombre de nœuds)
        const betweenness = Math.min(1, betweennessRaw / 1000);

        // 3. PageRank (simplifié - utilise l'algorithme GDS si disponible, sinon approximation)
        // Pour l'instant, approximation basée sur le degré et les connexions entrantes
        const pagerankCypher = `
          MATCH (n:${entityType} {id: $entityId})
          OPTIONAL MATCH (other)-[r]->(n)
          WITH n, count(r) as incoming, 
               [(n)-[r2]->() | count(r2)] as outgoing
          RETURN incoming, outgoing[0] as outgoing
        `;
        const pagerankResult = await session.run(pagerankCypher, { entityId });
        let pagerank = 0;
        if (pagerankResult.records.length > 0) {
          const incoming = pagerankResult.records[0].get('incoming').toNumber() || 0;
          const outgoing = pagerankResult.records[0].get('outgoing') || 0;
          // Approximation simple : (incoming / (incoming + outgoing + 1))
          pagerank = Math.min(1, incoming / (incoming + outgoing + 1));
        }

        // 4. Closeness Centrality (distance moyenne aux autres nœuds)
        const closenessCypher = `
          MATCH (n:${entityType} {id: $entityId})
          MATCH (other:${entityType})
          WHERE other <> n
          WITH n, other,
               shortestPath((n)-[*..5]-(other)) as path
          WHERE path IS NOT NULL
          WITH n, avg(length(path)) as avgDistance
          RETURN 1.0 / (avgDistance + 1) as closeness
        `;
        const closenessResult = await session.run(closenessCypher, { entityId });
        const closeness = closenessResult.records.length > 0
          ? closenessResult.records[0].get('closeness')
          : 0;

        // 5. Eigenvector Centrality (simplifié)
        // Approximation basée sur les connexions aux nœuds importants
        const eigenvectorCypher = `
          MATCH (n:${entityType} {id: $entityId})-[r]-(connected)
          WITH n, connected, count(r) as connectionStrength
          MATCH (connected)-[r2]-()
          WITH n, avg(count(r2)) as avgNeighborDegree
          RETURN avgNeighborDegree / 100.0 as eigenvector
        `;
        const eigenvectorResult = await session.run(eigenvectorCypher, { entityId });
        const eigenvector = eigenvectorResult.records.length > 0
          ? eigenvectorResult.records[0].get('eigenvector')
          : 0;

        // Normaliser degree
        const normalizedDegree = Math.min(1, degree / 100);

        // Calculer overall (moyenne pondérée)
        const overall = (
          normalizedDegree * 0.2 +
          betweenness * 0.3 +
          pagerank * 0.25 +
          closeness * 0.15 +
          eigenvector * 0.1
        );

        return {
          degree: normalizedDegree,
          betweenness,
          pagerank,
          closeness: closeness || 0,
          eigenvector: eigenvector || 0,
          overall: Math.min(1, overall),
        };
      } finally {
        await session.close();
      }
    }, 'Get advanced centrality metrics');
  }

  /**
   * Détecter les clusters sectoriels
   */
  async detectSectorClusters(sector?: string): Promise<import('../types/attribution').SectorCluster[]> {
    return handleError(async () => {
      const session = await this.getSession();
      if (!session) {
        return [];
      }

      try {
        // Community detection simplifié (basé sur les connexions communes)
        const cypher = `
          MATCH (i1:Institution)-[:HOLDS]->(t1:Ticker)
          MATCH (i2:Institution)-[:HOLDS]->(t2:Ticker)
          WHERE i1 <> i2 AND t1 = t2
          WITH i1, i2, count(DISTINCT t1) as commonTickers
          WHERE commonTickers >= 3
          WITH i1, collect(DISTINCT i2.id) as cluster
          WHERE size(cluster) >= 2
          RETURN i1.id as leader, cluster, size(cluster) as clusterSize
          ORDER BY clusterSize DESC
          LIMIT 10
        `;

        const result = await session.run(cypher, {});
        const clusters: import('../types/attribution').SectorCluster[] = [];

        for (const record of result.records) {
          const leader = record.get('leader');
          const clusterMembers = record.get('cluster') as string[];
          
          // Récupérer les tickers communs
          const tickersCypher = `
            MATCH (i:Institution)-[:HOLDS]->(t:Ticker)
            WHERE i.id IN $institutionIds
            WITH t, count(DISTINCT i) as holderCount
            WHERE holderCount >= 2
            RETURN t.symbol as ticker
            ORDER BY holderCount DESC
            LIMIT 10
          `;
          const tickersResult = await session.run(tickersCypher, {
            institutionIds: [leader, ...clusterMembers],
          });
          const topTickers = tickersResult.records.map((r) => r.get('ticker'));

          clusters.push({
            sector: sector || 'Unknown',
            institutions: [leader, ...clusterMembers],
            influenceScore: Math.min(100, clusterMembers.length * 10),
            topTickers,
            clusterId: `cluster_${leader}_${Date.now()}`,
          });
        }

        return clusters;
      } finally {
        await session.close();
      }
    }, 'Detect sector clusters');
  }

  /**
   * Fermer le driver
   */
  async close(): Promise<void> {
    if (this.driver) {
      await this.driver.close();
      this.driver = null;
      logger.info('Neo4j driver closed');
    }
  }

  /**
   * Convertir les valeurs Neo4j en types JavaScript
   */
  private convertNeo4jValue(value: any): any {
    if (neo4j.isInt(value)) {
      return value.toNumber();
    }
    if (neo4j.isDate(value)) {
      return value.toString();
    }
    if (neo4j.isDateTime(value)) {
      return value.toString();
    }
    if (neo4j.isTime(value)) {
      return value.toString();
    }
    if (neo4j.isLocalDateTime(value)) {
      return value.toString();
    }
    if (neo4j.isLocalTime(value)) {
      return value.toString();
    }
    if (neo4j.isDuration(value)) {
      return value.toString();
    }
    if (neo4j.isPoint(value)) {
      return value.toString();
    }
    return value;
  }

  /**
   * Tester la connexion
   */
  async testConnection(): Promise<boolean> {
    return handleError(async () => {
      const session = await this.getSession();
      if (!session) {
        return false;
      }

      try {
        const result = await session.run('RETURN 1 as test');
        return result.records.length > 0;
      } finally {
        await session.close();
      }
    }, 'Test Neo4j connection');
  }
}

