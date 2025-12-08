# 🎯 Roadmap : Personamy → Arkham Intelligence (Actions + Options)

## 🎯 Vision

Transformer Personamy en **l'équivalent d'Arkham Intelligence** pour le marché des **actions et options**, en combinant :
- **Graph Intelligence** (Neo4j) : Relations entre entités
- **Attribution Engine** : Qui fait quoi et pourquoi
- **Real-time Surveillance** : Alertes 24/7
- **AI-Powered Insights** : Explications intelligentes
- **Visual Graph Explorer** : Interface Arkham-like

---

## 🧠 Les 5 Moteurs d'Arkham (Transposés à Personamy)

### 1. Moteur d'Attribution (Entity Attribution Engine)

**Arkham** : Clustering de wallets, matching comportemental, propagation d'attribution.

**Personamy** :
- Attribution d'institutions → positions
- Attribution insiders → patterns options
- Attribution hedge funds → comportements historiques
- Attribution flows → entités influentes
- Clustering des entités par corrélations

**Stack** : Neo4j + Embeddings + Supabase SQL

---

### 2. Graph Intelligence Layer (Entity Graph)

**Arkham** : Graphe d'entités avec relations et transactions.

**Personamy** :
- **Nœuds** : Institutions, Insiders, Tickers, Options Chain, Flows, Secteurs, Signaux
- **Edges** : Institution → Position, Ticker → Options Flow, Insider → Transaction → Ticker, Secteur → Ticker

**Stack** : Neo4j AURA (recommandé)

---

### 3. Surveillance & Alerting Temps Réel

**Arkham** : Moteur NoSQL temps réel, watchers en mémoire distribuée.

**Personamy** :
- DynamoDB + EventBridge
- Watchlists
- Scans programmés
- Triggers options flow
- Anomalie d'institution
- Divergence sentiment/fundamentals
- Gamma squeeze imminent
- Insider activity

**Stack** : DynamoDB + Lambda Scheduled + EventBridge

---

### 4. Intelligence Scoring (Arkham Labels & Rankings)

**Arkham** : Scores, labels, catégories, rangs d'influence.

**Personamy** :
- 💎 Score Options Influence
- 💎 Score Manipulation Institutionnelle
- 💎 Score Smart Money Activity
- 💎 Score Earnings Prediction
- 💎 Score Gamma/Delta Instability
- 💎 Score Risk Map Sectoriel
- 💎 Score Dark Pool Anomaly

**Stack** : Extension du Scoring Service existant + Propagation dans le graphe

---

### 5. UI/UX Graphique Ultra Claire

**Arkham** : Exploration visuelle, graph interactif, heatmaps, timeline.

**Personamy** :
- Neo4j Bloom-like visualization
- Graph Explorer
- Flows Heatmaps
- Option Activity Timeline
- Smart Money Map

**Stack** : Frontend React + Neo4j Graph Visualization

---

## 🏗️ Architecture Cible

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Graph Viewer │  │ Dashboard    │  │ Explorer    │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼─────────────┐
│              API Gateway (Lambda)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Graph API    │  │ Alert API    │  │ Signal API   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
    ┌─────┴─────┐      ┌─────┴─────┐      ┌─────┴─────┐
    │  Neo4j    │      │ DynamoDB   │      │ Supabase  │
    │  (Graph)  │      │ (Alerts)   │      │ (History) │
    └───────────┘      └───────────┘      └───────────┘
```

---

## 🟦 PHASE 1 — Foundation Graph + Watcher Engine (2-3 semaines)

### Objectif
Créer les fondations techniques pour ressembler à Arkham, sans changer l'architecture principale.

---

### 1.1 Graph Service Module

#### Fichiers à créer

**`services/api/src/services/graph.service.ts`**
```typescript
/**
 * Service de gestion du graphe d'entités (Neo4j)
 * Équivalent du moteur graph d'Arkham
 */
export class GraphService {
  // Créer/Mettre à jour des nœuds
  async createOrUpdateNode(type: EntityType, data: EntityData): Promise<void>
  
  // Créer/Mettre à jour des relations
  async createOrUpdateRelationship(
    from: EntityRef,
    to: EntityRef,
    type: RelationshipType,
    properties?: Record<string, any>
  ): Promise<void>
  
  // Requêtes graph
  async findEntityConnections(entityId: string, depth: number): Promise<GraphPath[]>
  async findInfluentialEntities(ticker: string): Promise<InfluentialEntity[]>
  async detectClusters(sector: string): Promise<EntityCluster[]>
  
  // Scoring par propagation
  async propagateScore(entityId: string, scoreType: ScoreType): Promise<number>
}
```

**`services/api/src/types/graph.ts`**
```typescript
export type EntityType = 
  | 'Institution'
  | 'Insider'
  | 'Ticker'
  | 'OptionContract'
  | 'Flow'
  | 'Sector'
  | 'Signal';

export type RelationshipType =
  | 'HOLDS'
  | 'TRADES'
  | 'INFLUENCES'
  | 'CORRELATES_WITH'
  | 'BELONGS_TO'
  | 'TRIGGERS'
  | 'PREDICTS';

export interface EntityNode {
  id: string;
  type: EntityType;
  properties: Record<string, any>;
}

export interface GraphPath {
  nodes: EntityNode[];
  relationships: Relationship[];
  length: number;
}
```

**`services/api/src/repositories/neo4j.repository.ts`**
```typescript
/**
 * Repository pour Neo4j
 * Gère les connexions et requêtes Cypher
 */
export class Neo4jRepository {
  async executeQuery<T>(cypher: string, params?: Record<string, any>): Promise<T[]>
  async createNode(type: EntityType, properties: Record<string, any>): Promise<string>
  async createRelationship(
    fromId: string,
    toId: string,
    type: RelationshipType,
    properties?: Record<string, any>
  ): Promise<void>
}
```

#### Configuration Neo4j

**Option 1 : Neo4j AURA (Recommandé)**
- Gratuit jusqu'à 50K nœuds
- Managed service
- Pas de maintenance

**Option 2 : Neo4j Community (Self-hosted)**
- Gratuit mais maintenance requise
- Docker possible

**Variables d'environnement à ajouter** :
```bash
NEO4J_URI=neo4j+s://xxx.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=xxx
```

#### Routes Graph API

**`services/api/src/routes/graph.routes.ts`**
```typescript
export const graphRoutes: Route[] = [
  // Explorer le graphe
  {
    method: "GET",
    path: "/graph/entity/{id}",
    handler: async (event) => {
      const entityId = getPathParam(event, "id");
      const depth = getQueryParam(event, "depth") ? parseInt(...) : 2;
      return await graphService.getEntityGraph(entityId, depth);
    },
  },
  
  // Trouver les connexions
  {
    method: "GET",
    path: "/graph/connections",
    handler: async (event) => {
      const from = getQueryParam(event, "from");
      const to = getQueryParam(event, "to");
      return await graphService.findPath(from, to);
    },
  },
  
  // Détecter les clusters
  {
    method: "GET",
    path: "/graph/clusters",
    handler: async (event) => {
      const sector = getQueryParam(event, "sector");
      return await graphService.detectClusters(sector);
    },
  },
  
  // Entités influentes
  {
    method: "GET",
    path: "/graph/influential-entities",
    handler: async (event) => {
      const ticker = getQueryParam(event, "ticker");
      return await graphService.findInfluentialEntities(ticker);
    },
  },
];
```

#### Terraform

**`infra/terraform/neo4j.tf`** (si self-hosted) ou configuration AURA dans variables.

---

### 1.2 Migration Surveillance vers DynamoDB

#### Tables DynamoDB

**`infra/terraform/dynamodb.tf`**
```hcl
# Table des watchlists
resource "aws_dynamodb_table" "watchlists" {
  name           = "${var.project}-${var.stage}-watchlists"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"
  
  attribute {
    name = "id"
    type = "S"
  }
  
  attribute {
    name = "userId"
    type = "S"
  }
  
  attribute {
    name = "ticker"
    type = "S"
  }
  
  global_secondary_index {
    name     = "userId-index"
    hash_key = "userId"
  }
  
  global_secondary_index {
    name     = "ticker-index"
    hash_key = "ticker"
  }
}

# Table des alertes
resource "aws_dynamodb_table" "alerts" {
  name           = "${var.project}-${var.stage}-alerts"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"
  
  attribute {
    name = "id"
    type = "S"
  }
  
  attribute {
    name = "watchId"
    type = "S"
  }
  
  attribute {
    name = "userId"
    type = "S"
  }
  
  attribute {
    name = "triggeredAt"
    type = "N"
  }
  
  global_secondary_index {
    name     = "watchId-index"
    hash_key = "watchId"
    range_key = "triggeredAt"
  }
  
  global_secondary_index {
    name     = "userId-index"
    hash_key = "userId"
    range_key = "triggeredAt"
  }
}

# Table de l'historique des signaux
resource "aws_dynamodb_table" "signals_history" {
  name           = "${var.project}-${var.stage}-signals-history"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"
  
  attribute {
    name = "id"
    type = "S"
  }
  
  attribute {
    name = "ticker"
    type = "S"
  }
  
  attribute {
    name = "timestamp"
    type = "N"
  }
  
  global_secondary_index {
    name     = "ticker-timestamp-index"
    hash_key = "ticker"
    range_key = "timestamp"
  }
}
```

#### Migration du Service de Surveillance

**`services/api/src/services/surveillance-dynamodb.service.ts`**
```typescript
/**
 * Service de surveillance avec stockage DynamoDB
 * Remplace le stockage in-memory
 */
export class SurveillanceDynamoDBService {
  private dynamodb: DynamoDBClient;
  private watchlistsTable: string;
  private alertsTable: string;
  
  async createWatch(userId: string, config: SurveillanceConfig): Promise<SurveillanceWatch>
  async getWatches(userId: string): Promise<SurveillanceWatch[]>
  async deleteWatch(watchId: string, userId: string): Promise<void>
  async getAlerts(watchId: string, userId: string): Promise<SurveillanceAlert[]>
  async checkWatch(watchId: string): Promise<SurveillanceAlert[]>
}
```

#### Lambda Scheduled pour Surveillance

**`infra/terraform/surveillance-scheduler.tf`**
```hcl
# Lambda pour checker toutes les watchlists
resource "aws_lambda_function" "surveillance_checker" {
  function_name = "${var.project}-${var.stage}-surveillance-checker"
  # ... configuration
}

# EventBridge Rule : Toutes les 5 minutes
resource "aws_cloudwatch_event_rule" "surveillance_check" {
  name                = "${var.project}-${var.stage}-surveillance-check"
  description         = "Check all watchlists every 5 minutes"
  schedule_expression = "rate(5 minutes)"
}

resource "aws_cloudwatch_event_target" "surveillance_check" {
  rule      = aws_cloudwatch_event_rule.surveillance_check.name
  target_id = "SurveillanceChecker"
  arn       = aws_lambda_function.surveillance_checker.arn
}
```

**`workers/surveillance-checker/src/index.ts`**
```typescript
/**
 * Lambda scheduled pour checker toutes les watchlists
 * S'exécute toutes les 5 minutes
 */
export async function handler() {
  const watchlists = await surveillanceService.getAllActiveWatches();
  
  for (const watch of watchlists) {
    await surveillanceService.checkWatch(watch.id);
  }
}
```

---

### 1.3 Unification des Signaux dans le Graphe

#### Service d'Intégration Graph

**`services/api/src/services/graph-signal-integration.service.ts`**
```typescript
/**
 * Intègre tous les signaux existants dans le graphe Neo4j
 */
export class GraphSignalIntegrationService {
  // Intégrer un signal gamma squeeze
  async integrateGammaSqueezeSignal(
    ticker: string,
    signal: GammaSqueezeAnalysis
  ): Promise<void> {
    // Créer nœud Signal
    // Créer relation Ticker -> TRIGGERS -> Signal
    // Créer relation Options Flow -> INFLUENCES -> Signal
  }
  
  // Intégrer un signal smart money
  async integrateSmartMoneySignal(
    institution: string,
    ticker: string,
    activity: InstitutionalActivity
  ): Promise<void> {
    // Créer nœud Institution (si n'existe pas)
    // Créer relation Institution -> TRADES -> Ticker
    // Créer relation Institution -> INFLUENCES -> Ticker
  }
  
  // Intégrer un signal earnings prediction
  async integrateEarningsSignal(
    ticker: string,
    prediction: EarningsPrediction
  ): Promise<void> {
    // Créer nœud Signal
    // Créer relations depuis toutes les sources (options, insiders, etc.)
  }
  
  // Intégrer un signal risk
  async integrateRiskSignal(
    ticker: string,
    risk: RiskAnalysis
  ): Promise<void> {
    // Créer nœud Signal
    // Créer relations depuis les sources de risque
  }
  
  // Intégrer un signal sector rotation
  async integrateSectorRotationSignal(
    sector: string,
    rotation: SectorRotationAnalysis
  ): Promise<void> {
    // Créer nœud Sector
    // Créer relations Sector -> ROTATES_TO -> Sector
  }
}
```

#### Hook dans les Services Existants

Modifier les services existants pour intégrer automatiquement dans le graphe :

**`services/api/src/services/scoring.service.ts`** (ajout)
```typescript
// Après le calcul du score
await graphIntegration.integrateScoreSignal(ticker, score);
```

**`services/api/src/services/gamma-squeeze.service.ts`** (ajout)
```typescript
// Après la détection
await graphIntegration.integrateGammaSqueezeSignal(ticker, analysis);
```

---

### 1.4 Collectors pour Alimenter le Graphe

**`workers/graph-collector/src/index.ts`**
```typescript
/**
 * Lambda qui collecte les données et les intègre dans le graphe
 * Déclenché par EventBridge toutes les heures
 */
export async function handler() {
  // 1. Collecter les nouvelles positions institutionnelles (13F)
  // 2. Collecter les nouveaux flows options
  // 3. Collecter les transactions insiders
  // 4. Intégrer dans Neo4j
  await graphIntegration.syncAllEntities();
}
```

---

### 📋 Checklist Phase 1

- [ ] **1.1 Graph Service**
  - [ ] Installer client Neo4j (`neo4j-driver`)
  - [ ] Créer `neo4j.repository.ts`
  - [ ] Créer `graph.service.ts`
  - [ ] Créer `graph.routes.ts`
  - [ ] Créer `types/graph.ts`
  - [ ] Configurer Neo4j AURA (ou self-hosted)
  - [ ] Ajouter routes Terraform
  - [ ] Tests unitaires

- [ ] **1.2 Migration DynamoDB**
  - [ ] Créer tables DynamoDB (watchlists, alerts, signals_history)
  - [ ] Créer `surveillance-dynamodb.service.ts`
  - [ ] Migrer logique depuis in-memory
  - [ ] Créer Lambda scheduled `surveillance-checker`
  - [ ] Configurer EventBridge (toutes les 5 min)
  - [ ] Tests d'intégration

- [ ] **1.3 Unification Signaux**
  - [ ] Créer `graph-signal-integration.service.ts`
  - [ ] Intégrer gamma squeeze dans graphe
  - [ ] Intégrer smart money dans graphe
  - [ ] Intégrer earnings prediction dans graphe
  - [ ] Intégrer risk analysis dans graphe
  - [ ] Intégrer sector rotation dans graphe
  - [ ] Hooks dans services existants

- [ ] **1.4 Collectors**
  - [ ] Créer `graph-collector` Lambda
  - [ ] Configurer EventBridge (toutes les heures)
  - [ ] Sync initial des entités existantes

**Estimation** : 2-3 semaines (1 dev full-time)

---

## 🟧 PHASE 2 — Attribution & Intelligence (3-5 semaines)

### Objectif
Construire le moteur d'attribution et d'intelligence qui fait la valeur d'Arkham.

---

### 2.1 Attribution Institutionnelle Avancée

#### Service d'Attribution

**`services/api/src/services/attribution.service.ts`**
```typescript
/**
 * Service d'attribution d'entités (équivalent Arkham)
 * Détermine qui influence quoi et comment
 */
export class AttributionService {
  // Attribuer un flow options à une institution
  async attributeFlowToInstitution(
    flow: OptionsFlow,
    ticker: string
  ): Promise<AttributionResult> {
    // 1. Chercher les institutions qui détiennent le ticker
    // 2. Analyser les patterns historiques
    // 3. Calculer la probabilité d'attribution
    // 4. Créer relation dans le graphe
  }
  
  // Attribuer une activité anormale à une entité
  async attributeAnomalyToEntity(
    anomaly: AnomalySignal,
    ticker: string
  ): Promise<AttributionResult[]> {
    // Analyser toutes les entités connectées
    // Calculer les scores d'attribution
    // Retourner les entités probables
  }
  
  // Clustering institutionnel
  async clusterInstitutions(
    sector?: string
  ): Promise<InstitutionCluster[]> {
    // Utiliser Neo4j community detection
    // Grouper par comportements similaires
    // Identifier les hubs
  }
  
  // Détecter les entités dominantes
  async findDominantEntities(
    ticker: string
  ): Promise<DominantEntity[]> {
    // Calculer l'influence dans le graphe
    // Score basé sur :
    //   - Nombre de positions
    //   - Volume de trades
    //   - Corrélations avec flows
    //   - Centralité dans le graphe
  }
}
```

#### Types d'Attribution

**`services/api/src/types/attribution.ts`**
```typescript
export interface AttributionResult {
  entityId: string;
  entityType: 'Institution' | 'Insider' | 'Unknown';
  confidence: number; // 0-100
  reasoning: string;
  evidence: AttributionEvidence[];
}

export interface AttributionEvidence {
  type: 'HOLDING' | 'HISTORICAL_PATTERN' | 'CORRELATION' | 'FLOW_MATCH';
  score: number;
  description: string;
}

export interface InstitutionCluster {
  id: string;
  institutions: string[];
  commonBehaviors: string[];
  influenceScore: number;
  topTickers: string[];
}
```

#### Routes Attribution

**`services/api/src/routes/attribution.routes.ts`**
```typescript
export const attributionRoutes: Route[] = [
  // Attribuer un flow
  {
    method: "POST",
    path: "/attribution/flow",
    handler: async (event) => {
      const body = getBody(event);
      return await attributionService.attributeFlowToInstitution(
        body.flow,
        body.ticker
      );
    },
  },
  
  // Entités dominantes pour un ticker
  {
    method: "GET",
    path: "/attribution/dominant-entities/{ticker}",
    handler: async (event) => {
      const ticker = getPathParam(event, "ticker");
      return await attributionService.findDominantEntities(ticker);
    },
  },
  
  // Clusters institutionnels
  {
    method: "GET",
    path: "/attribution/clusters",
    handler: async (event) => {
      const sector = getQueryParam(event, "sector");
      return await attributionService.clusterInstitutions(sector);
    },
  },
];
```

---

### 2.2 Attribution Insider/Options

#### Service Insider Attribution

**`services/api/src/services/insider-attribution.service.ts`**
```typescript
/**
 * Service d'attribution des patterns insiders
 */
export class InsiderAttributionService {
  // Détecter les patterns insiders
  async detectInsiderPatterns(
    ticker: string,
    period: string
  ): Promise<InsiderPattern[]> {
    // Analyser les transactions insiders
    // Identifier les patterns récurrents
    // Corréler avec les options flows
  }
  
  // Comparer avec historique
  async compareWithHistorical(
    insider: string,
    ticker: string
  ): Promise<HistoricalComparison> {
    // Comparer les transactions passées
    // Calculer la cohérence
    // Prédire les prochaines actions
  }
  
  // Score d'anomalie insider
  async calculateInsiderAnomalyScore(
    ticker: string
  ): Promise<AnomalyScore> {
    // Détecter les transactions inhabituelles
    // Comparer avec la moyenne
    // Score de suspicion
  }
}
```

---

### 2.3 Option Influence Score

#### Service de Scoring d'Influence

**`services/api/src/services/influence-scoring.service.ts`**
```typescript
/**
 * Service de calcul d'influence (équivalent Arkham entity ranking)
 */
export class InfluenceScoringService {
  // Score d'influence d'une institution sur un ticker
  async calculateInstitutionInfluence(
    institutionId: string,
    ticker: string
  ): Promise<InfluenceScore> {
    // Basé sur :
    //   - Taille des positions
    //   - Fréquence des trades
    //   - Corrélations avec flows
    //   - Centralité dans le graphe
    //   - Historique de performance
  }
  
  // Score d'influence d'un ticker sur le marché
  async calculateTickerMarketInfluence(
    ticker: string
  ): Promise<MarketInfluenceScore> {
    // Basé sur :
    //   - Options flow volume
    //   - Institution holdings
    //   - Corrélations sectorielles
    //   - Media attention
  }
  
  // Ranking global des entités
  async getEntityRankings(
    type: 'Institution' | 'Ticker' | 'Sector',
    limit: number = 100
  ): Promise<EntityRanking[]> {
    // Calculer les scores pour toutes les entités
    // Trier par influence
    // Retourner le top N
  }
}
```

---

### 2.4 Détection d'Événements Majeurs

#### Service de Détection d'Événements

**`services/api/src/services/event-detection.service.ts`**
```typescript
/**
 * Service de détection d'événements majeurs
 * Équivalent des "major events" d'Arkham
 */
export class EventDetectionService {
  // Détecter les clusters options inhabituels
  async detectUnusualOptionsClusters(
    ticker?: string
  ): Promise<OptionsCluster[]> {
    // Analyser les flows options
    // Identifier les clusters par strike/expiry
    // Détecter les anomalies
  }
  
  // Propagation institutionnelle
  async detectInstitutionalPropagation(
    ticker: string
  ): Promise<PropagationEvent> {
    // Détecter quand plusieurs institutions agissent simultanément
    // Analyser les corrélations
    // Identifier les signaux de coordination
  }
  
  // Corrélations cross-ticker
  async detectCrossTickerCorrelations(
    ticker: string
  ): Promise<CorrelationEvent[]> {
    // Analyser les corrélations entre tickers
    // Détecter les mouvements synchronisés
    // Identifier les secteurs en rotation
  }
  
  // Chaîne earnings → flows → sentiment
  async detectEarningsFlowChain(
    ticker: string,
    earningsDate: string
  ): Promise<EarningsFlowChain> {
    // Analyser la séquence :
    //   1. Options flow pré-earnings
    //   2. Insider activity
    //   3. Dark pool activity
    //   4. Earnings release
    //   5. Post-earnings movement
  }
}
```

---

### 📋 Checklist Phase 2

- [ ] **2.1 Attribution Institutionnelle**
  - [ ] Créer `attribution.service.ts`
  - [ ] Implémenter `attributeFlowToInstitution`
  - [ ] Implémenter `attributeAnomalyToEntity`
  - [ ] Implémenter `clusterInstitutions` (Neo4j community detection)
  - [ ] Implémenter `findDominantEntities`
  - [ ] Créer routes attribution
  - [ ] Tests unitaires

- [ ] **2.2 Attribution Insider**
  - [ ] Créer `insider-attribution.service.ts`
  - [ ] Implémenter détection de patterns
  - [ ] Implémenter comparaison historique
  - [ ] Implémenter score d'anomalie
  - [ ] Intégrer dans le graphe

- [ ] **2.3 Option Influence Score**
  - [ ] Créer `influence-scoring.service.ts`
  - [ ] Implémenter scoring d'influence institution
  - [ ] Implémenter scoring d'influence ticker
  - [ ] Implémenter rankings globaux
  - [ ] Routes API

- [ ] **2.4 Détection d'Événements**
  - [ ] Créer `event-detection.service.ts`
  - [ ] Implémenter détection clusters options
  - [ ] Implémenter propagation institutionnelle
  - [ ] Implémenter corrélations cross-ticker
  - [ ] Implémenter chaîne earnings → flows
  - [ ] Routes API

**Estimation** : 3-5 semaines (1 dev full-time)

---

## 🟥 PHASE 3 — UI Arkham-like + Graph Explorer (4-6 semaines)

### Objectif
Créer l'interface visuelle qui fait le succès d'Arkham.

---

### 3.1 Graph Explorer Backend API

#### Routes Graph Explorer

**`services/api/src/routes/graph-explorer.routes.ts`**
```typescript
export const graphExplorerRoutes: Route[] = [
  // Explorer une entité
  {
    method: "GET",
    path: "/graph/explore/{entityId}",
    handler: async (event) => {
      const entityId = getPathParam(event, "entityId");
      const depth = getQueryParam(event, "depth") ? parseInt(...) : 2;
      const direction = getQueryParam(event, "direction") || 'both'; // 'in', 'out', 'both'
      return await graphService.exploreEntity(entityId, depth, direction);
    },
  },
  
  // Recherche d'entités
  {
    method: "GET",
    path: "/graph/search",
    handler: async (event) => {
      const query = getQueryParam(event, "q");
      const type = getQueryParam(event, "type");
      return await graphService.searchEntities(query, type);
    },
  },
  
  // Path entre deux entités
  {
    method: "GET",
    path: "/graph/path",
    handler: async (event) => {
      const from = getQueryParam(event, "from");
      const to = getQueryParam(event, "to");
      const maxDepth = getQueryParam(event, "maxDepth") ? parseInt(...) : 5;
      return await graphService.findShortestPath(from, to, maxDepth);
    },
  },
  
  // Subgraph autour d'un ticker
  {
    method: "GET",
    path: "/graph/ticker/{ticker}/subgraph",
    handler: async (event) => {
      const ticker = getPathParam(event, "ticker");
      const includeDepth = getQueryParam(event, "depth") ? parseInt(...) : 2;
      return await graphService.getTickerSubgraph(ticker, includeDepth);
    },
  },
  
  // Statistiques du graphe
  {
    method: "GET",
    path: "/graph/stats",
    handler: async (event) => {
      return await graphService.getGraphStatistics();
    },
  },
];
```

#### Service Graph Explorer

**`services/api/src/services/graph-explorer.service.ts`**
```typescript
/**
 * Service pour l'exploration du graphe
 * Fournit les données pour le Graph Explorer frontend
 */
export class GraphExplorerService {
  // Explorer une entité avec son voisinage
  async exploreEntity(
    entityId: string,
    depth: number,
    direction: 'in' | 'out' | 'both'
  ): Promise<GraphExplorationResult> {
    // Requête Cypher pour récupérer le subgraph
    // Format pour visualisation (nodes + edges)
  }
  
  // Recherche d'entités
  async searchEntities(
    query: string,
    type?: EntityType
  ): Promise<EntitySearchResult[]> {
    // Recherche full-text dans Neo4j
    // Retourner les entités correspondantes
  }
  
  // Trouver le chemin le plus court
  async findShortestPath(
    fromId: string,
    toId: string,
    maxDepth: number
  ): Promise<GraphPath> {
    // Algorithme shortest path de Neo4j
  }
  
  // Subgraph d'un ticker
  async getTickerSubgraph(
    ticker: string,
    depth: number
  ): Promise<TickerSubgraph> {
    // Récupérer :
    //   - Institutions qui détiennent
    //   - Options flows
    //   - Insiders
    //   - Corrélations
    //   - Signaux
  }
  
  // Statistiques globales
  async getGraphStatistics(): Promise<GraphStatistics> {
    // Nombre de nœuds par type
    // Nombre de relations par type
    // Entités les plus connectées
    // Clusters détectés
  }
}
```

---

### 3.2 Ticker Intelligence Dashboard API

#### Routes Dashboard

**`services/api/src/routes/ticker-intelligence.routes.ts`**
```typescript
export const tickerIntelligenceRoutes: Route[] = [
  // Dashboard complet d'un ticker
  {
    method: "GET",
    path: "/ticker-intelligence/{ticker}",
    handler: async (event) => {
      const ticker = getPathParam(event, "ticker");
      return await tickerIntelligenceService.getCompleteDashboard(ticker);
    },
  },
  
  // Flows timeline
  {
    method: "GET",
    path: "/ticker-intelligence/{ticker}/flows-timeline",
    handler: async (event) => {
      const ticker = getPathParam(event, "ticker");
      const from = getQueryParam(event, "from");
      const to = getQueryParam(event, "to");
      return await tickerIntelligenceService.getFlowsTimeline(ticker, from, to);
    },
  },
  
  // Anomalies détectées
  {
    method: "GET",
    path: "/ticker-intelligence/{ticker}/anomalies",
    handler: async (event) => {
      const ticker = getPathParam(event, "ticker");
      return await tickerIntelligenceService.getAnomalies(ticker);
    },
  },
  
  // Gamma/Greeks map
  {
    method: "GET",
    path: "/ticker-intelligence/{ticker}/greeks-map",
    handler: async (event) => {
      const ticker = getPathParam(event, "ticker");
      return await tickerIntelligenceService.getGreeksMap(ticker);
    },
  },
];
```

#### Service Ticker Intelligence

**`services/api/src/services/ticker-intelligence.service.ts`**
```typescript
/**
 * Service d'intelligence complète pour un ticker
 * Combine toutes les sources de données
 */
export class TickerIntelligenceService {
  // Dashboard complet
  async getCompleteDashboard(
    ticker: string
  ): Promise<TickerIntelligenceDashboard> {
    // Récupérer en parallèle :
    //   - Flows options (timeline)
    //   - Sentiment (score, évolution)
    //   - Anomalies détectées
    //   - Insiders (dernières transactions)
    //   - Gamma/Greeks map
    //   - Institutions (top holders)
    //   - Corrélations
    //   - Signaux (gamma squeeze, risk, etc.)
  }
  
  // Timeline des flows
  async getFlowsTimeline(
    ticker: string,
    from?: string,
    to?: string
  ): Promise<FlowTimelineEvent[]> {
    // Récupérer tous les flows sur la période
    // Grouper par date
    // Calculer les agrégations
  }
  
  // Anomalies
  async getAnomalies(
    ticker: string
  ): Promise<Anomaly[]> {
    // Détecter :
    //   - Flows inhabituels
    //   - Changements institutionnels
    //   - Activité insider anormale
    //   - Dark pool spikes
    //   - Short interest changes
  }
  
  // Greeks map (heatmap)
  async getGreeksMap(
    ticker: string
  ): Promise<GreeksMap> {
    // Récupérer les greeks pour toutes les strikes/expiries
    // Formater pour heatmap
    // Calculer les zones critiques
  }
}
```

---

### 3.3 Institution Intelligence API

#### Routes Institution

**`services/api/src/routes/institution-intelligence.routes.ts`**
```typescript
export const institutionIntelligenceRoutes: Route[] = [
  // Dashboard d'une institution
  {
    method: "GET",
    path: "/institution-intelligence/{id}",
    handler: async (event) => {
      const id = getPathParam(event, "id");
      return await institutionIntelligenceService.getDashboard(id);
    },
  },
  
  // Réseau d'influence
  {
    method: "GET",
    path: "/institution-intelligence/{id}/influence-network",
    handler: async (event) => {
      const id = getPathParam(event, "id");
      return await institutionIntelligenceService.getInfluenceNetwork(id);
    },
  },
  
  // Mouvements récents
  {
    method: "GET",
    path: "/institution-intelligence/{id}/recent-movements",
    handler: async (event) => {
      const id = getPathParam(event, "id");
      const limit = getQueryParam(event, "limit") ? parseInt(...) : 20;
      return await institutionIntelligenceService.getRecentMovements(id, limit);
    },
  },
];
```

#### Service Institution Intelligence

**`services/api/src/services/institution-intelligence.service.ts`**
```typescript
/**
 * Service d'intelligence pour les institutions
 */
export class InstitutionIntelligenceService {
  // Dashboard complet
  async getDashboard(
    institutionId: string
  ): Promise<InstitutionDashboard> {
    // Holdings actuels
    // Mouvements récents
    // Réseau d'influence
    // Performance historique
    // Top positions
    // Sector exposure
  }
  
  // Réseau d'influence
  async getInfluenceNetwork(
    institutionId: string
  ): Promise<InfluenceNetwork> {
    // Récupérer le graphe autour de l'institution
    // Calculer les scores d'influence
    // Identifier les connexions importantes
  }
  
  // Mouvements récents
  async getRecentMovements(
    institutionId: string,
    limit: number
  ): Promise<InstitutionalMovement[]> {
    // Récupérer les changements de positions récents
    // Analyser les patterns
    // Calculer l'impact
  }
}
```

---

### 3.4 Watchlists Avancées API

#### Routes Watchlists

**`services/api/src/routes/watchlist-advanced.routes.ts`**
```typescript
export const watchlistAdvancedRoutes: Route[] = [
  // Créer une watchlist avancée
  {
    method: "POST",
    path: "/watchlists/advanced",
    handler: async (event) => {
      const body = getBody(event);
      return await watchlistService.createAdvancedWatchlist(body);
    },
  },
  
  // Alertes par entités
  {
    method: "GET",
    path: "/watchlists/{id}/entity-alerts",
    handler: async (event) => {
      const id = getPathParam(event, "id");
      return await watchlistService.getEntityAlerts(id);
    },
  },
  
  // Surveillance flows
  {
    method: "GET",
    path: "/watchlists/{id}/flow-surveillance",
    handler: async (event) => {
      const id = getPathParam(event, "id");
      return await watchlistService.getFlowSurveillance(id);
    },
  },
];
```

---

### 📋 Checklist Phase 3 (Backend)

- [ ] **3.1 Graph Explorer API**
  - [ ] Créer `graph-explorer.service.ts`
  - [ ] Implémenter `exploreEntity`
  - [ ] Implémenter `searchEntities`
  - [ ] Implémenter `findShortestPath`
  - [ ] Implémenter `getTickerSubgraph`
  - [ ] Implémenter `getGraphStatistics`
  - [ ] Créer routes
  - [ ] Tests

- [ ] **3.2 Ticker Intelligence API**
  - [ ] Créer `ticker-intelligence.service.ts`
  - [ ] Implémenter dashboard complet
  - [ ] Implémenter flows timeline
  - [ ] Implémenter détection anomalies
  - [ ] Implémenter greeks map
  - [ ] Créer routes
  - [ ] Tests

- [ ] **3.3 Institution Intelligence API**
  - [ ] Créer `institution-intelligence.service.ts`
  - [ ] Implémenter dashboard
  - [ ] Implémenter réseau d'influence
  - [ ] Implémenter mouvements récents
  - [ ] Créer routes
  - [ ] Tests

- [ ] **3.4 Watchlists Avancées**
  - [ ] Étendre `surveillance.service.ts`
  - [ ] Ajouter alertes par entités
  - [ ] Ajouter surveillance flows
  - [ ] Créer routes
  - [ ] Tests

**Estimation Backend** : 2-3 semaines  
**Estimation Frontend** : 2-3 semaines (en parallèle)  
**Total Phase 3** : 4-6 semaines

---

## 🟩 PHASE 4 — Automations & IA (2-4 semaines)

### Objectif
Ajouter l'IA comme valeur ajoutée unique (Arkham ne l'a pas).

---

### 4.1 GPT-Insight Engine

#### Service GPT Insights

**`services/api/src/services/gpt-insight.service.ts`**
```typescript
/**
 * Service d'insights générés par GPT
 * Explique les signaux et relations de manière intelligible
 */
export class GPTInsightService {
  // Expliquer un flow options
  async explainFlow(
    flow: OptionsFlow,
    ticker: string
  ): Promise<FlowInsight> {
    // Contexte :
    //   - Flow details
    //   - Ticker fundamentals
    //   - Institution holdings
    //   - Historical patterns
    // GPT génère :
    //   - Explication du flow
    //   - Pourquoi c'est important
    //   - Implications possibles
  }
  
  // Expliquer une relation institution → ticker
  async explainInstitutionInfluence(
    institutionId: string,
    ticker: string
  ): Promise<InfluenceInsight> {
    // Contexte :
    //   - Institution profile
    //   - Holdings history
    //   - Trading patterns
    //   - Performance
    // GPT génère :
    //   - Pourquoi cette institution influence ce ticker
    //   - Patterns détectés
    //   - Prédictions
  }
  
  // Analyser un graphe de relations
  async analyzeGraphRelations(
    entityId: string,
    depth: number
  ): Promise<GraphAnalysis> {
    // Récupérer le subgraph
    // GPT analyse :
    //   - Structure du réseau
    //   - Entités clés
    //   - Patterns de connexion
    //   - Insights sur les relations
  }
  
  // Résumer un cluster d'entités
  async summarizeEntityCluster(
    clusterId: string
  ): Promise<ClusterSummary> {
    // Récupérer les entités du cluster
    // GPT génère :
    //   - Description du cluster
    //   - Caractéristiques communes
    //   - Comportements typiques
  }
}
```

#### Routes GPT Insights

**`services/api/src/routes/gpt-insights.routes.ts`**
```typescript
export const gptInsightsRoutes: Route[] = [
  // Expliquer un flow
  {
    method: "POST",
    path: "/insights/explain-flow",
    handler: async (event) => {
      const body = getBody(event);
      return await gptInsightService.explainFlow(body.flow, body.ticker);
    },
  },
  
  // Expliquer une influence
  {
    method: "GET",
    path: "/insights/influence/{institutionId}/{ticker}",
    handler: async (event) => {
      const institutionId = getPathParam(event, "institutionId");
      const ticker = getPathParam(event, "ticker");
      return await gptInsightService.explainInstitutionInfluence(institutionId, ticker);
    },
  },
  
  // Analyser un graphe
  {
    method: "GET",
    path: "/insights/analyze-graph/{entityId}",
    handler: async (event) => {
      const entityId = getPathParam(event, "entityId");
      const depth = getQueryParam(event, "depth") ? parseInt(...) : 2;
      return await gptInsightService.analyzeGraphRelations(entityId, depth);
    },
  },
];
```

---

### 4.2 GPT Alerting

#### Service GPT Alerting

**`services/api/src/services/gpt-alerting.service.ts`**
```typescript
/**
 * Service d'alertes générées par GPT
 * L'IA crée automatiquement des alertes pertinentes
 */
export class GPTAlertingService {
  // Générer des alertes automatiques
  async generateAutomaticAlerts(
    userId: string,
    preferences: AlertPreferences
  ): Promise<Alert[]> {
    // Analyser les données du graphe
    // GPT identifie les patterns intéressants
    // Crée des alertes personnalisées
  }
  
  // Suggérer des watchlists
  async suggestWatchlists(
    userId: string,
    interests: string[]
  ): Promise<WatchlistSuggestion[]> {
    // Analyser les intérêts de l'utilisateur
    // GPT suggère des tickers/institutions à surveiller
  }
}
```

---

### 4.3 GPT Portfolio Autopsy

#### Service Portfolio Analysis

**`services/api/src/services/gpt-portfolio-analysis.service.ts`**
```typescript
/**
 * Service d'analyse de portefeuille par GPT
 */
export class GPTPortfolioAnalysisService {
  // Autopsie complète d'un portefeuille
  async analyzePortfolio(
    portfolio: Portfolio
  ): Promise<PortfolioAutopsy> {
    // Pour chaque position :
    //   - Analyser les risques
    //   - Identifier les corrélations
    //   - Détecter les opportunités
    //   - Suggérer des améliorations
    // GPT génère un rapport complet
  }
}
```

---

### 📋 Checklist Phase 4

- [ ] **4.1 GPT-Insight Engine**
  - [ ] Créer `gpt-insight.service.ts`
  - [ ] Implémenter `explainFlow`
  - [ ] Implémenter `explainInstitutionInfluence`
  - [ ] Implémenter `analyzeGraphRelations`
  - [ ] Implémenter `summarizeEntityCluster`
  - [ ] Créer routes
  - [ ] Tests

- [ ] **4.2 GPT Alerting**
  - [ ] Créer `gpt-alerting.service.ts`
  - [ ] Implémenter génération automatique d'alertes
  - [ ] Implémenter suggestions de watchlists
  - [ ] Intégrer avec DynamoDB
  - [ ] Tests

- [ ] **4.3 GPT Portfolio Analysis**
  - [ ] Créer `gpt-portfolio-analysis.service.ts`
  - [ ] Implémenter analyse de portefeuille
  - [ ] Créer routes
  - [ ] Tests

**Estimation** : 2-4 semaines (1 dev full-time)

---

## 📊 Estimation Globale

| Phase | Durée | Priorité | Dépendances |
|-------|-------|----------|-------------|
| **Phase 1** | 2-3 semaines | 🔴 Haute | Aucune |
| **Phase 2** | 3-5 semaines | 🔴 Haute | Phase 1 |
| **Phase 3** | 4-6 semaines | 🟡 Moyenne | Phase 1, 2 |
| **Phase 4** | 2-4 semaines | 🟢 Basse | Phase 1, 2, 3 |

**Total** : 11-18 semaines (3-4.5 mois) avec 1 dev full-time

---

## 🛠️ Stack Technique Complète

### Backend
- **TypeScript** (Node.js 20.x) sur **AWS Lambda**
- **Neo4j AURA** (Graph Database)
- **DynamoDB** (Surveillance & Alerts)
- **Supabase** (PostgreSQL - Historique)
- **Terraform** (Infrastructure)

### Frontend (à développer)
- **React** + **TypeScript**
- **Neo4j Bloom** ou **Cytoscape.js** (Graph Visualization)
- **Recharts** ou **D3.js** (Charts & Heatmaps)
- **Tailwind CSS** (Styling)

### APIs Externes
- **FMP** (Financial Modeling Prep)
- **Unusual Whales**
- **OpenAI GPT-4** (Insights)

---

## 🎯 Définition de Succès

### Phase 1 ✅
- Graphe Neo4j opérationnel avec entités de base
- Surveillance migrée vers DynamoDB
- Signaux intégrés dans le graphe

### Phase 2 ✅
- Attribution fonctionnelle (institutions, insiders)
- Scores d'influence calculés
- Détection d'événements majeurs opérationnelle

### Phase 3 ✅
- Graph Explorer backend prêt
- APIs d'intelligence complètes
- Frontend peut consommer les APIs

### Phase 4 ✅
- GPT génère des insights pertinents
- Alertes automatiques fonctionnelles
- Portfolio analysis opérationnelle

---

## 🚀 Quick Start - Phase 1

### Étape 1 : Setup Neo4j

```bash
# Option 1 : Neo4j AURA (Recommandé)
# 1. Créer compte sur https://neo4j.com/cloud/aura/
# 2. Créer une base AURA Free
# 3. Récupérer URI, USER, PASSWORD

# Option 2 : Neo4j Community (Docker)
docker run -d \
  --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password \
  neo4j:latest
```

### Étape 2 : Installer Client Neo4j

```bash
cd services/api
npm install neo4j-driver
```

### Étape 3 : Créer le Repository

Créer `services/api/src/repositories/neo4j.repository.ts` (voir structure ci-dessus)

### Étape 4 : Créer le Service Graph

Créer `services/api/src/services/graph.service.ts` (voir structure ci-dessus)

### Étape 5 : Tester

```typescript
// Test simple
const graphService = new GraphService();
await graphService.createOrUpdateNode('Ticker', { symbol: 'AAPL', name: 'Apple Inc.' });
await graphService.createOrUpdateNode('Institution', { name: 'Vanguard', cik: '0000102909' });
await graphService.createOrUpdateRelationship(
  { type: 'Institution', id: 'vanguard-id' },
  { type: 'Ticker', id: 'aapl-id' },
  'HOLDS',
  { shares: 1000000, value: 175000000 }
);
```

---

## 📚 Documentation à Créer

- **`GRAPH_ARCHITECTURE.md`** : Architecture du graphe (entités, relations, patterns)
- **`ATTRIBUTION_ENGINE.md`** : Comment fonctionne l'attribution
- **`NEO4J_GUIDE.md`** : Guide d'utilisation de Neo4j dans le projet
- **`DYNAMODB_MIGRATION.md`** : Guide de migration depuis in-memory vers DynamoDB
- **`GPT_INSIGHTS_GUIDE.md`** : Comment utiliser les insights GPT

---

## 🎯 Prochaines Actions Immédiates

1. **Créer compte Neo4j AURA** (5 minutes)
2. **Installer `neo4j-driver`** (1 minute)
3. **Créer `neo4j.repository.ts`** (2 heures)
4. **Créer `graph.service.ts`** (4 heures)
5. **Tester avec un ticker simple** (1 heure)

**Total pour démarrer** : ~1 jour de travail

---

**Dernière mise à jour** : 2025-12-07  
**Version** : 1.0  
**Auteur** : Équipe Backend Personamy

