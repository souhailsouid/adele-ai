# 🔒 Migration des APIs FMP et Unusual Whales vers le Backend

## ⚠️ Problème de Sécurité Actuel

Les clés API de **FMP (Financial Modeling Prep)** et **Unusual Whales** sont actuellement exposées côté client via les variables d'environnement `NEXT_PUBLIC_*`, ce qui les rend visibles dans le navigateur (inspect Chrome → Sources → Environment variables).

### Clés API Exposées
- `NEXT_PUBLIC_FMP_API_KEY` - Clé API FMP
- `NEXT_PUBLIC_UNUSUAL_WHALES` - Clé API Unusual Whales

**Impact**: Ces clés peuvent être extraites et utilisées par des tiers, entraînant :
- Consommation non autorisée de votre quota API
- Coûts supplémentaires
- Risque de compromission de sécurité

---

## ✅ Solution Implémentée

### Architecture Backend (Design Patterns)

L'architecture suit les principes SOLID et utilise des design patterns éprouvés :

#### 1. **Repository Pattern** (`repositories/`)
- **`fmp.repository.ts`** : Accès aux données FMP uniquement
- **`unusual-whales.repository.ts`** : Accès aux données Unusual Whales uniquement
- **Responsabilité** : Gérer uniquement l'accès aux APIs externes, pas de logique métier

#### 2. **Service Layer Pattern** (`services/`)
- **`fmp.service.ts`** : Logique métier FMP (cache, transformation, validation)
- **`unusual-whales.service.ts`** : Logique métier Unusual Whales
- **`api-client.service.ts`** : Client API centralisé avec retry, rate limiting, gestion d'erreurs
- **`cache.service.ts`** : Service de cache générique réutilisable
- **Responsabilité** : Logique métier, orchestration, cache

#### 3. **Module Public Interface** (`fmp.ts`, `unusual-whales.ts`)
- Interface publique pour le router
- Instance singleton des services
- **Responsabilité** : Point d'entrée unique pour le router

#### 4. **Centralized Error Handling** (`utils/errors.ts`)
- Classes d'erreurs personnalisées (`ExternalApiError`, `RateLimitError`)
- Fonction `handleError` pour gestion uniforme
- **Responsabilité** : Gestion cohérente des erreurs

#### 5. **Structured Logging** (`utils/logger.ts`)
- Logger structuré avec contexte
- Niveaux de log appropriés
- **Responsabilité** : Observabilité et debugging

### Avantages de cette Architecture

✅ **Séparation des responsabilités** : Repository (données) vs Service (métier) vs Router (HTTP)
✅ **Réutilisabilité** : Services et repositories peuvent être utilisés par plusieurs routes
✅ **Testabilité** : Chaque couche peut être testée indépendamment
✅ **Maintenabilité** : Code organisé, facile à comprendre et modifier
✅ **Pas de duplication** : Logique centralisée dans les services
✅ **Gestion d'erreurs cohérente** : Toutes les erreurs passent par le même système
✅ **Cache centralisé** : Service de cache réutilisable pour toutes les APIs

---

## 📁 Structure des Fichiers

```
services/api/src/
├── repositories/
│   ├── fmp.repository.ts              # Repository FMP (accès données)
│   ├── unusual-whales.repository.ts   # Repository UW (accès données)
│   └── ticker.repository.ts           # Repository Ticker (existant)
├── services/
│   ├── fmp.service.ts                 # Service métier FMP
│   ├── unusual-whales.service.ts       # Service métier UW
│   ├── api-client.service.ts          # Client API centralisé
│   ├── cache.service.ts               # Service de cache générique
│   └── ticker.service.ts              # Service Ticker (existant)
├── utils/
│   ├── errors.ts                      # Gestion d'erreurs centralisée
│   └── logger.ts                      # Logger structuré
├── fmp.ts                             # Interface publique FMP
├── unusual-whales.ts                  # Interface publique UW
├── ticker-activity.ts                 # Module Ticker Activity (existant)
└── router.ts                          # Router avec toutes les routes
```

---

## 🔧 Endpoints FMP Disponibles

### Quote & Market Data
- `GET /fmp/quote/{symbol}` - Prix actuel
  - Query params: `force_refresh` (boolean)
- `GET /fmp/historical-price/{symbol}` - Historique des prix
  - Query params: `period` (1day, 5day, 1month, etc.), `force_refresh` (boolean)

### Financial Statements
- `GET /fmp/income-statement/{symbol}` - État des résultats
  - Query params: `period` (annual/quarter), `limit` (number)
- `GET /fmp/balance-sheet/{symbol}` - Bilan
  - Query params: `period` (annual/quarter), `limit` (number)
- `GET /fmp/cash-flow/{symbol}` - Flux de trésorerie
  - Query params: `period` (annual/quarter), `limit` (number)

### Financial Metrics
- `GET /fmp/key-metrics/{symbol}` - Métriques clés
  - Query params: `period` (annual/quarter), `limit` (number)
- `GET /fmp/ratios/{symbol}` - Ratios financiers
  - Query params: `period` (annual/quarter), `limit` (number)
- `GET /fmp/dcf/{symbol}` - Valuation DCF

### Earnings & Estimates
- `GET /fmp/earnings/{symbol}` - Résultats
  - Query params: `limit` (number)
- `GET /fmp/insider-trades/{symbol}` - Transactions d'insiders
  - Query params: `limit` (number)
- `GET /fmp/hedge-fund-holdings/{symbol}` - Holdings de hedge funds
  - Query params: `limit` (number)

### Market Data
- `GET /fmp/market-news` - Actualités
  - Query params: `symbol` (optional), `limit` (number)
- `GET /fmp/economic-calendar` - Calendrier économique
  - Query params: `from` (YYYY-MM-DD), `to` (YYYY-MM-DD)
- `GET /fmp/earnings-calendar` - Calendrier des résultats
  - Query params: `from` (YYYY-MM-DD), `to` (YYYY-MM-DD)
- `GET /fmp/screener` - Screener
  - Query params: Tous les critères de screener FMP
- `GET /fmp/sec-filings/{symbol}` - Dépôts SEC
  - Query params: `type` (optional), `limit` (number)

---

## 🔧 Endpoints Unusual Whales Disponibles

### Institutional Data
- `GET /unusual-whales/institution-ownership/{ticker}` - Propriété institutionnelle
  - Query params: Tous les filtres UW, `force_refresh` (boolean)
- `GET /unusual-whales/institution-activity/{ticker}` - Activité institutionnelle
  - Query params: `institution_name` (optional), autres filtres UW

### Options Flow
- `GET /unusual-whales/options-flow/{ticker}` - Flow d'options
  - Query params: Tous les filtres UW (min_premium, max_premium, is_call, is_put, etc.)
- `GET /unusual-whales/flow-alerts/{ticker}` - Alertes de flow
  - Query params: Tous les filtres UW
- `GET /unusual-whales/greek-flow/{ticker}` - Greek flow
  - Query params: Tous les filtres UW

### Insider & Congress
- `GET /unusual-whales/insider-trades/{ticker}` - Transactions d'insiders
  - Query params: Tous les filtres UW
- `GET /unusual-whales/congress-trades/{ticker}` - Transactions du Congrès
  - Query params: Tous les filtres UW

### Options Data
- `GET /unusual-whales/option-chains/{ticker}` - Chaînes d'options
  - Query params: Tous les filtres UW
- `GET /unusual-whales/alerts` - Alertes
  - Query params: Tous les filtres UW (config_ids[], noti_types[], etc.)
- `GET /unusual-whales/alert-configurations` - Configurations d'alertes

---

## 📋 Format de Réponse Standardisé

Tous les endpoints retournent un format cohérent :

```typescript
{
  success: boolean;
  data: T | T[];           // Données (objet ou tableau)
  cached?: boolean;        // Indique si les données viennent du cache
  count?: number;          // Nombre d'éléments (pour les tableaux)
  timestamp: string;       // ISO timestamp
}
```

**Exemple de réponse** :
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "price": 150.25,
    "change": 2.5,
    "changePercent": 1.69
  },
  "cached": false,
  "timestamp": "2025-01-02T12:00:00.000Z"
}
```

---

## 🔐 Variables d'Environnement

### Backend (Lambda) - Variables SÉCURISÉES

Ces variables sont définies dans Terraform et injectées dans Lambda :

```bash
# FMP API
FMP_API_KEY=your_fmp_api_key_here

# Unusual Whales API
UNUSUAL_WHALES_API_KEY=your_unusual_whales_api_key_here
```

**⚠️ IMPORTANT** : Ces variables ne sont **PAS** exposées au client.

### Frontend - Variables à SUPPRIMER

```bash
# ❌ À SUPPRIMER
NEXT_PUBLIC_FMP_API_KEY=...
NEXT_PUBLIC_UNUSUAL_WHALES=...
```

---

## 🚀 Migration du Frontend

### Étape 1 : Créer un Client API Frontend

Créer un nouveau client qui appelle les routes backend au lieu des APIs externes directement :

```typescript
// lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-api-gateway-url.com';

export class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAccessToken()}`, // JWT token
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // FMP Methods
  async getFMPQuote(symbol: string, forceRefresh?: boolean) {
    return this.request(`/fmp/quote/${symbol}${forceRefresh ? '?force_refresh=true' : ''}`);
  }

  async getFMPHistoricalPrice(symbol: string, period: string = '1day') {
    return this.request(`/fmp/historical-price/${symbol}?period=${period}`);
  }

  // Unusual Whales Methods
  async getUWInstitutionOwnership(ticker: string, options?: Record<string, any>) {
    const params = new URLSearchParams(options || {});
    return this.request(`/unusual-whales/institution-ownership/${ticker}?${params.toString()}`);
  }

  // ... autres méthodes
}
```

### Étape 2 : Remplacer les Appels Directs

**AVANT** (Frontend - ❌ Clés exposées) :
```typescript
// lib/fmp/client.js
const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY; // ❌ Exposé
const response = await fetch(`https://financialmodelingprep.com/stable/quote?symbol=${symbol}&apikey=${apiKey}`);
```

**APRÈS** (Frontend - ✅ Sécurisé) :
```typescript
// lib/api-client.ts
const apiClient = new ApiClient();
const quote = await apiClient.getFMPQuote(symbol);
```

### Étape 3 : Mettre à Jour les Services

Remplacer tous les appels directs aux APIs par des appels au backend :

```typescript
// services/financialAnalysisService.js
// AVANT
import fmpClient from '@/lib/fmp/client';
const incomeStatement = await fmpClient.getIncomeStatement(symbol);

// APRÈS
import { apiClient } from '@/lib/api-client';
const incomeStatement = await apiClient.getFMPIncomeStatement(symbol);
```

---

## 📊 Statistiques de Migration

- **Fichiers utilisant FMP**: ~35 fichiers
- **Fichiers utilisant Unusual Whales**: ~72 fichiers
- **Endpoints FMP créés**: 20+ endpoints
- **Endpoints Unusual Whales créés**: 15+ endpoints
- **Services critiques**: 8 services
- **Pages critiques**: 15+ pages

---

## ✅ Checklist de Migration

### Backend (✅ COMPLÉTÉ)
- [x] Créer repositories FMP et Unusual Whales
- [x] Créer services FMP et Unusual Whales
- [x] Créer routes API pour FMP (`/fmp/*`)
- [x] Créer routes API pour Unusual Whales (`/unusual-whales/*`)
- [x] Implémenter rate limiting côté serveur (via ApiClientService)
- [x] Ajouter authentification JWT (déjà en place via API Gateway)
- [x] Implémenter cache centralisé
- [x] Gestion d'erreurs centralisée
- [x] Logger structuré
- [x] Documenter les nouvelles routes

### Frontend (À FAIRE)
- [ ] Créer client API frontend (`lib/api-client.ts`)
- [ ] Remplacer `lib/fmp/client.js` par appels backend
- [ ] Remplacer `lib/unusual-whales/client.js` par appels backend
- [ ] Mettre à jour tous les services utilisant FMP
- [ ] Mettre à jour tous les services utilisant Unusual Whales
- [ ] Mettre à jour toutes les pages
- [ ] Supprimer les variables `NEXT_PUBLIC_FMP_API_KEY` et `NEXT_PUBLIC_UNUSUAL_WHALES`
- [ ] Tester tous les endpoints
- [ ] Déployer en production

---

## 🔍 Tests

### Tester un Endpoint FMP

```bash
curl -X GET \
  "https://your-api-gateway-url.com/fmp/quote/AAPL" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Tester un Endpoint Unusual Whales

```bash
curl -X GET \
  "https://your-api-gateway-url.com/unusual-whales/institution-ownership/TSLA?limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📝 Notes Importantes

1. **Cache** : Les données sont mises en cache automatiquement (TTL: 24h par défaut)
2. **Rate Limiting** : Géré automatiquement par `ApiClientService` avec retry
3. **Authentification** : Toutes les routes nécessitent un JWT valide (géré par API Gateway)
4. **Format de réponse** : Tous les endpoints retournent le même format standardisé
5. **Gestion d'erreurs** : Toutes les erreurs sont capturées et formatées de manière cohérente

---

**Date de création**: 2025-01-02  
**Dernière mise à jour**: 2025-01-02  
**Priorité**: 🔴 **CRITIQUE** (Sécurité)
**Statut Backend**: ✅ **COMPLÉTÉ**  
**Statut Frontend**: ⏳ **EN ATTENTE**
