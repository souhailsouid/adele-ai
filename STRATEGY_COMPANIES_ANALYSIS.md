# 🏢 Stratégie d'Analyse des Entreprises - Adele AI

## 🎯 Vision : De la Data SEC à l'Intelligence Macro/Géopolitique

### Problème à Résoudre

**Actuellement** : Vous avez les **holdings** (qui détient quoi), mais pas l'analyse **intrinsèque** des entreprises elles-mêmes.

**Objectif** : Pour une entreprise comme **NVIDIA**, comprendre :
1. ✅ **Données SEC** (automatisables) : 8-K, 10-K, 10-Q, insider trading
2. ✅ **Contexte macro** : Position dans le secteur, tendances technologiques
3. ✅ **Contexte géopolitique** : Restrictions export, dépendances Chine, tensions US/Chine
4. ✅ **Signaux intelligents** : Combiner tout ça pour générer des insights actionnables

---

## 📊 Architecture Proposée : 3 Couches

### Couche 1 : Données SEC (Automatisable) ⚡

**Sources SEC à tracker** :
- **8-K** : Événements importants (acquisitions, changements management, résultats)
- **10-K** : Rapport annuel (annuel)
- **10-Q** : Rapport trimestriel (trimestriel)
- **Form 4** : Insider trading (achats/ventes des dirigeants)
- **DEF 14A** : Proxy statements (gouvernance, rémunérations)

**Tables à créer** :

```sql
-- Table companies (entreprises à suivre)
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  ticker TEXT UNIQUE NOT NULL, -- 'NVDA'
  cik TEXT UNIQUE NOT NULL, -- CIK de l'entreprise
  name TEXT NOT NULL, -- 'NVIDIA Corporation'
  sector TEXT, -- 'Technology'
  industry TEXT, -- 'Semiconductors'
  market_cap BIGINT, -- en USD
  headquarters_country TEXT, -- 'USA'
  headquarters_state TEXT, -- 'CA'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table company_filings (tous les filings SEC d'une entreprise)
CREATE TABLE company_filings (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id),
  cik TEXT NOT NULL, -- pour requêtes directes
  form_type TEXT NOT NULL, -- '8-K', '10-K', '10-Q', '4', 'DEF 14A'
  accession_number TEXT UNIQUE NOT NULL,
  filing_date DATE NOT NULL,
  period_of_report DATE, -- pour 10-K/10-Q
  document_url TEXT, -- URL du document sur EDGAR
  raw_content TEXT, -- contenu brut (pour parsing)
  status TEXT DEFAULT 'DISCOVERED' CHECK (status IN ('DISCOVERED', 'PARSED', 'FAILED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_company_filings_company_id ON company_filings(company_id);
CREATE INDEX idx_company_filings_form_type ON company_filings(form_type);
CREATE INDEX idx_company_filings_filing_date ON company_filings(filing_date DESC);
CREATE INDEX idx_company_filings_cik ON company_filings(cik);

-- Table company_events (événements extraits des 8-K)
CREATE TABLE company_events (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id),
  filing_id INTEGER REFERENCES company_filings(id),
  event_type TEXT NOT NULL, -- 'earnings', 'acquisition', 'management_change', 'guidance', etc.
  event_date DATE,
  title TEXT,
  summary TEXT, -- résumé IA
  importance_score INTEGER CHECK (importance_score BETWEEN 1 AND 10),
  raw_data JSONB, -- données structurées extraites
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table insider_trades (Form 4 - achats/ventes des dirigeants)
CREATE TABLE insider_trades (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id),
  filing_id INTEGER REFERENCES company_filings(id),
  insider_name TEXT,
  insider_title TEXT, -- 'CEO', 'CFO', etc.
  transaction_type TEXT, -- 'buy', 'sell', 'option_exercise', etc.
  shares BIGINT,
  price_per_share NUMERIC,
  total_value NUMERIC,
  transaction_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_insider_trades_company_id ON insider_trades(company_id);
CREATE INDEX idx_insider_trades_transaction_date ON insider_trades(transaction_date DESC);
```

**Collector SEC à créer** :
- `collector-sec-company-filings` : Lambda qui scanne EDGAR pour les nouvelles filings d'une entreprise
- Déclenché par EventBridge (quotidien ou à la demande)
- Parse les 8-K, 10-K, 10-Q, Form 4

---

### Couche 2 : Enrichissement Macro/Sectoriel 🌍

**Sources externes** (APIs/Scraping) :
- **Sector trends** : Gartner, IDC (reports sur semiconducteurs)
- **Geopolitical context** : News APIs (Reuters, Bloomberg) filtrées par keywords
- **Supply chain** : Données sur dépendances (ex: Taiwan pour TSMC)
- **Regulatory** : Changements réglementaires (ex: restrictions export US)

**Tables à créer** :

```sql
-- Table company_context (contexte macro/géopolitique)
CREATE TABLE company_context (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id),
  context_type TEXT NOT NULL, -- 'sector_trend', 'geopolitical', 'regulatory', 'supply_chain'
  source TEXT, -- 'gartner', 'reuters', 'sec', etc.
  title TEXT,
  summary TEXT,
  impact_score INTEGER CHECK (impact_score BETWEEN -10 AND 10), -- négatif = risque, positif = opportunité
  relevance_score INTEGER CHECK (relevance_score BETWEEN 1 AND 10),
  event_date DATE,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_company_context_company_id ON company_context(company_id);
CREATE INDEX idx_company_context_type ON company_context(context_type);
CREATE INDEX idx_company_context_impact ON company_context(impact_score DESC);

-- Table sector_analysis (analyse sectorielle)
CREATE TABLE sector_analysis (
  id SERIAL PRIMARY KEY,
  sector TEXT NOT NULL, -- 'Semiconductors', 'AI', etc.
  analysis_date DATE NOT NULL,
  trend_direction TEXT, -- 'bullish', 'bearish', 'neutral'
  key_drivers TEXT[], -- ['AI demand', 'China restrictions', etc.]
  summary TEXT,
  source TEXT,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Workers à créer** :
- `collector-sector-news` : Scrape/API pour news sectorielles
- `analyzer-geopolitical` : Analyse les news pour extraire le contexte géopolitique
- `enricher-company-context` : Combine SEC + news + sector pour enrichir le contexte

---

### Couche 3 : Signaux Intelligents (IA) 🧠

**Objectif** : Combiner toutes les données pour générer des signaux actionnables.

**Table à créer** :

```sql
-- Table company_signals (signaux générés pour une entreprise)
CREATE TABLE company_signals (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id),
  signal_type TEXT NOT NULL, -- 'earnings_beat', 'insider_buying', 'geopolitical_risk', 'sector_tailwind', etc.
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  importance_score INTEGER CHECK (importance_score BETWEEN 1 AND 10),
  
  -- Données sources (pour traçabilité)
  source_filing_id INTEGER REFERENCES company_filings(id),
  source_context_id INTEGER REFERENCES company_context(id),
  source_holdings_data JSONB, -- données des funds qui détiennent
  
  -- Signal généré
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  reasoning TEXT, -- explication du signal
  confidence_score NUMERIC CHECK (confidence_score BETWEEN 0 AND 1),
  
  -- Métadonnées
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- certains signaux expirent
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'expired'))
);

CREATE INDEX idx_company_signals_company_id ON company_signals(company_id);
CREATE INDEX idx_company_signals_priority ON company_signals(priority, importance_score DESC);
CREATE INDEX idx_company_signals_status ON company_signals(status) WHERE status = 'active';
```

**Worker IA à créer** :
- `processor-company-signals` : Lambda qui :
  1. Analyse les nouvelles données (filings, context, holdings changes)
  2. Utilise un LLM pour générer des signaux intelligents
  3. Combine multiples sources pour un signal cohérent

---

## 🔄 Flux de Données : Exemple NVIDIA

### 1. Découverte Automatique (SEC)

```
EventBridge (quotidien)
  → collector-sec-company-filings
    → Scan EDGAR pour CIK de NVIDIA (0001045810)
    → Découvre nouveau 8-K (earnings release)
    → Insère dans company_filings
    → Publie événement "Company Filing Discovered"
```

### 2. Parsing & Extraction

```
EventBridge "Company Filing Discovered"
  → parser-company-filing
    → Parse le 8-K
    → Extrait : earnings beat, guidance raise
    → Insère dans company_events
    → Publie événement "Company Event Extracted"
```

### 3. Enrichissement Contextuel

```
EventBridge "Company Event Extracted"
  → enricher-company-context
    → Récupère news récentes sur NVIDIA (Reuters API)
    → Récupère contexte géopolitique (restrictions export)
    → Récupère tendances secteur (AI demand)
    → Insère dans company_context
```

### 4. Génération de Signal Intelligent

```
EventBridge "Company Context Enriched"
  → processor-company-signals
    → Combine :
      - 8-K : earnings beat
      - Context : AI demand strong
      - Holdings : ARK a augmenté position
      - Geopolitical : restrictions mais impact limité
    → LLM génère signal :
      "NVIDIA: Strong earnings beat + AI tailwind + institutional buying = BULLISH"
    → Insère dans company_signals
```

### 5. Signal Disponible dans l'API

```
GET /companies/NVDA/signals
→ Retourne les signaux actifs avec contexte complet
```

---

## 🎯 Exemple Concret : NVIDIA

### Données SEC (Automatique)

**8-K du 2025-11-20** :
- Earnings beat : $5.20 vs $5.00 estimé
- Guidance raise : Q4 revenue $28B vs $26B estimé
- Event type : `earnings`

**Form 4 du 2025-11-15** :
- CEO Jensen Huang : Achat de 10,000 actions à $450
- Event type : `insider_buying`

### Contexte Macro (Enrichi)

**Sector Trend** :
- AI demand : +40% YoY
- Data center spending : +25% YoY
- Source : Gartner Q4 2025

**Géopolitique** :
- Restrictions export Chine : Impact limité (revenus Chine < 20%)
- Taiwan tensions : Risque supply chain modéré
- Source : Reuters analysis

### Signal Généré (IA)

```json
{
  "company_id": 1,
  "signal_type": "earnings_beat_with_tailwind",
  "priority": "high",
  "importance_score": 8,
  "title": "NVIDIA: Strong Earnings + AI Tailwind + Insider Buying",
  "summary": "NVIDIA reported strong Q3 earnings beat ($5.20 vs $5.00) and raised guidance. CEO Jensen Huang purchased 10,000 shares. AI demand remains strong (+40% YoY). Geopolitical risks (China restrictions) are manageable given low China revenue exposure.",
  "reasoning": "Combination of fundamental strength (earnings), insider confidence (CEO buying), and sector tailwinds (AI demand) suggests continued bullish momentum. Geopolitical risks are present but manageable.",
  "confidence_score": 0.85,
  "sources": {
    "filing": "8-K 2025-11-20",
    "insider_trade": "Form 4 2025-11-15",
    "sector_trend": "Gartner Q4 2025",
    "geopolitical": "Reuters analysis"
  }
}
```

---

## 🚀 Roadmap d'Implémentation

### Phase 1 : Foundation (Semaine 1-2)
- [ ] Créer tables `companies`, `company_filings`
- [ ] Créer `collector-sec-company-filings` Lambda
- [ ] Tester avec NVIDIA (CIK: 0001045810)
- [ ] API endpoint : `POST /companies` (ajouter une entreprise)

### Phase 2 : Parsing (Semaine 3-4)
- [ ] Créer `parser-company-filing` Lambda
- [ ] Parser 8-K (extraction événements)
- [ ] Parser Form 4 (insider trading)
- [ ] Table `company_events`, `insider_trades`

### Phase 3 : Enrichissement (Semaine 5-6)
- [ ] Créer `collector-sector-news` Lambda
- [ ] Intégrer API news (Reuters/Bloomberg)
- [ ] Table `company_context`
- [ ] Enrichissement automatique après parsing

### Phase 4 : Signaux IA (Semaine 7-8)
- [ ] Créer `processor-company-signals` Lambda
- [ ] Intégrer LLM pour génération signaux
- [ ] Table `company_signals`
- [ ] API endpoint : `GET /companies/{ticker}/signals`

### Phase 5 : Frontend (Semaine 9-10)
- [ ] Page entreprise (ex: `/companies/NVDA`)
- [ ] Affichage signaux avec contexte
- [ ] Timeline des événements
- [ ] Graphiques holdings (qui détient)

---

## 💡 Points Clés pour Adele AI

### 1. Automatisation Maximale
- ✅ SEC = source fiable et automatisable
- ✅ EventBridge orchestre tout
- ✅ Pas d'intervention manuelle nécessaire

### 2. Enrichissement Intelligent
- ✅ Combine données structurées (SEC) + non-structurées (news)
- ✅ Contextualise avec macro/géopolitique
- ✅ Traçabilité complète (sources)

### 3. Signaux Actionnables
- ✅ Pas juste des données brutes
- ✅ Insights générés par IA
- ✅ Priorisation automatique
- ✅ Confiance score pour chaque signal

### 4. Scalabilité
- ✅ Même architecture pour toutes les entreprises
- ✅ Ajouter une entreprise = `POST /companies`
- ✅ Tout se fait automatiquement

---

## 🔗 Intégration avec l'Existant

### Connexion Funds ↔ Companies

**Requête** : "Quels funds détiennent NVIDIA et ont augmenté leur position ?"

```sql
SELECT 
  f.name as fund_name,
  h.ticker,
  h.shares,
  h.market_value,
  ff.filing_date,
  c.name as company_name
FROM fund_holdings h
JOIN funds f ON h.fund_id = f.id
JOIN fund_filings ff ON h.filing_id = ff.id
JOIN companies c ON h.ticker = c.ticker
WHERE c.ticker = 'NVDA'
ORDER BY ff.filing_date DESC;
```

**Signal combiné** :
- Company signal : "NVIDIA earnings beat"
- Holdings signal : "ARK increased position by 20%"
- → Signal composite : "Strong fundamentals + institutional buying = BULLISH"

---

## 📝 Prochaines Étapes

1. **Valider cette architecture** avec vous
2. **Créer la migration SQL** pour les nouvelles tables
3. **Implémenter Phase 1** (collector SEC)
4. **Tester avec NVIDIA** comme proof of concept

**Questions pour vous** :
- Cette approche vous convient-elle ?
- Quelles sources de données macro/géopolitiques avez-vous déjà ?
- Préférez-vous commencer par une entreprise (NVIDIA) ou plusieurs ?
- Quel LLM voulez-vous utiliser pour la génération de signaux ?



