# 🌐 Endpoints API pour le Frontend

## Base URL

Remplacez `YOUR_API_GATEWAY_URL` par l'URL de votre API Gateway (ex: `https://xxxxx.execute-api.eu-west-3.amazonaws.com/prod`)

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'YOUR_API_GATEWAY_URL';
```

---

## 🔐 Authentification

Tous les endpoints nécessitent un **Access Token JWT** dans le header `Authorization` :

```typescript
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}
```

---

## 📊 FMP API Endpoints

### 1. Quote (Prix actuel)

```typescript
GET ${API_BASE_URL}/fmp/quote/{symbol}
```

**Exemple** :
```typescript
// URL complète
GET https://xxxxx.execute-api.eu-west-3.amazonaws.com/prod/fmp/quote/AAPL

// Avec fetch
const response = await fetch(`${API_BASE_URL}/fmp/quote/AAPL`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  }
});
const data = await response.json();
```

**Query Parameters** :
- `force_refresh` (boolean, optionnel) : Forcer le refresh (ignorer le cache)

**Réponse** :
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "price": 150.25,
    "change": 2.5,
    "changePercent": 1.69,
    "volume": 50000000,
    "marketCap": 2500000000000
  },
  "cached": false,
  "timestamp": "2025-01-02T12:00:00.000Z"
}
```

---

### 2. Historical Price (Historique des prix)

```typescript
GET ${API_BASE_URL}/fmp/historical-price/{symbol}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/fmp/historical-price/AAPL?period=1day&force_refresh=false
```

**Query Parameters** :
- `period` (string, optionnel) : `1day`, `5day`, `1month`, `3month`, `1year` (défaut: `1day`)
- `force_refresh` (boolean, optionnel)

**Réponse** :
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-01-02",
      "open": 150.0,
      "high": 151.0,
      "low": 149.5,
      "close": 150.25,
      "volume": 50000000
    }
  ],
  "cached": false,
  "count": 1,
  "timestamp": "2025-01-02T12:00:00.000Z"
}
```

---

### 3. Income Statement (État des résultats)

```typescript
GET ${API_BASE_URL}/fmp/income-statement/{symbol}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/fmp/income-statement/AAPL?period=annual&limit=5
```

**Query Parameters** :
- `period` (string, optionnel) : `annual` ou `quarter` (défaut: `annual`)
- `limit` (number, optionnel) : Nombre de périodes (défaut: `5`)

---

### 4. Balance Sheet (Bilan)

```typescript
GET ${API_BASE_URL}/fmp/balance-sheet/{symbol}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/fmp/balance-sheet/AAPL?period=annual&limit=5
```

**Query Parameters** : Même que Income Statement

---

### 5. Cash Flow (Flux de trésorerie)

```typescript
GET ${API_BASE_URL}/fmp/cash-flow/{symbol}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/fmp/cash-flow/AAPL?period=annual&limit=5
```

**Query Parameters** : Même que Income Statement

---

### 6. Key Metrics (Métriques clés)

```typescript
GET ${API_BASE_URL}/fmp/key-metrics/{symbol}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/fmp/key-metrics/AAPL?period=annual&limit=5
```

---

### 7. Ratios (Ratios financiers)

```typescript
GET ${API_BASE_URL}/fmp/ratios/{symbol}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/fmp/ratios/AAPL?period=annual&limit=5
```

---

### 8. DCF (Valuation DCF)

```typescript
GET ${API_BASE_URL}/fmp/dcf/{symbol}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/fmp/dcf/AAPL
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "dcf": 180.50,
    "date": "2025-01-02"
  },
  "cached": false,
  "timestamp": "2025-01-02T12:00:00.000Z"
}
```

---

### 9. Earnings (Résultats)

```typescript
GET ${API_BASE_URL}/fmp/earnings/{symbol}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/fmp/earnings/AAPL?limit=10
```

**Query Parameters** :
- `limit` (number, optionnel) : Nombre de résultats (défaut: `10`)

---

### 10. Insider Trades (Transactions d'insiders)

```typescript
GET ${API_BASE_URL}/fmp/insider-trades/{symbol}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/fmp/insider-trades/AAPL?limit=100
```

**Query Parameters** :
- `limit` (number, optionnel) : Nombre de transactions (défaut: `100`)

---

### 11. Hedge Fund Holdings (Holdings de hedge funds)

```typescript
GET ${API_BASE_URL}/fmp/hedge-fund-holdings/{symbol}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/fmp/hedge-fund-holdings/AAPL?limit=100
```

---

### 12. Market News (Actualités)

```typescript
GET ${API_BASE_URL}/fmp/market-news
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/fmp/market-news?symbol=AAPL&limit=50
```

**Query Parameters** :
- `symbol` (string, optionnel) : Filtrer par symbole
- `limit` (number, optionnel) : Nombre d'articles (défaut: `50`)

---

### 13. Economic Calendar (Calendrier économique)

```typescript
GET ${API_BASE_URL}/fmp/economic-calendar
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/fmp/economic-calendar?from=2025-01-01&to=2025-01-31
```

**Query Parameters** :
- `from` (string, **requis**) : Date de début (format: `YYYY-MM-DD`)
- `to` (string, **requis**) : Date de fin (format: `YYYY-MM-DD`)

---

### 14. Earnings Calendar (Calendrier des résultats)

```typescript
GET ${API_BASE_URL}/fmp/earnings-calendar
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/fmp/earnings-calendar?from=2025-01-01&to=2025-01-31
```

**Query Parameters** : Même que Economic Calendar

---

### 15. Screener (Screener de stocks)

```typescript
GET ${API_BASE_URL}/fmp/screener
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/fmp/screener?marketCapMoreThan=1000000000&priceMoreThan=50&sector=Technology
```

**Query Parameters** : Tous les critères FMP (voir documentation FMP)

---

### 16. SEC Filings (Dépôts SEC)

```typescript
GET ${API_BASE_URL}/fmp/sec-filings/{symbol}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/fmp/sec-filings/AAPL?type=10-K&limit=10
```

**Query Parameters** :
- `type` (string, optionnel) : Type de dépôt (`10-K`, `10-Q`, etc.)
- `limit` (number, optionnel) : Nombre de dépôts (défaut: `10`)

---

## 🐋 Unusual Whales API Endpoints

### 1. Institution Ownership (Propriété institutionnelle)

```typescript
GET ${API_BASE_URL}/unusual-whales/institution-ownership/{ticker}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/unusual-whales/institution-ownership/TSLA?limit=10&force_refresh=false
```

**Query Parameters** :
- `limit` (number, optionnel) : Nombre de résultats (défaut: `100`)
- `force_refresh` (boolean, optionnel) : Forcer le refresh

**Réponse** :
```json
{
  "success": true,
  "data": [
    {
      "name": "Vanguard Group Inc",
      "shares": 1000000,
      "value": 250000000,
      "is_hedge_fund": false
    }
  ],
  "cached": false,
  "count": 1,
  "timestamp": "2025-01-02T12:00:00.000Z"
}
```

---

### 2. Institution Activity (Activité institutionnelle)

```typescript
GET ${API_BASE_URL}/unusual-whales/institution-activity/{ticker}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/unusual-whales/institution-activity/TSLA?institution_name=Vanguard%20Group%20Inc&limit=20
```

**Query Parameters** :
- `institution_name` (string, optionnel) : Nom de l'institution
- `limit` (number, optionnel) : Nombre de transactions

---

### 3. Options Flow (Flow d'options)

```typescript
GET ${API_BASE_URL}/unusual-whales/options-flow/{ticker}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/unusual-whales/options-flow/TSLA?min_premium=10000&is_call=true&limit=100
```

**Query Parameters** :
- `min_premium` (number, optionnel) : Premium minimum
- `max_premium` (number, optionnel) : Premium maximum
- `is_call` (boolean, optionnel) : Filtrer les calls
- `is_put` (boolean, optionnel) : Filtrer les puts
- `is_sweep` (boolean, optionnel) : Filtrer les sweeps
- `is_floor` (boolean, optionnel) : Filtrer les floor trades
- `is_otm` (boolean, optionnel) : Filtrer les OTM
- `min_size` (number, optionnel) : Taille minimum
- `max_size` (number, optionnel) : Taille maximum
- `min_dte` (number, optionnel) : Days to expiration minimum
- `max_dte` (number, optionnel) : Days to expiration maximum
- `min_volume` (number, optionnel) : Volume minimum
- `max_volume` (number, optionnel) : Volume maximum
- `limit` (number, optionnel) : Nombre de résultats (défaut: `100`)

---

### 4. Flow Alerts (Alertes de flow)

```typescript
GET ${API_BASE_URL}/unusual-whales/flow-alerts/{ticker}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/unusual-whales/flow-alerts/TSLA?min_premium=50000&limit=50
```

**Query Parameters** : Même que Options Flow

---

### 5. Greek Flow

```typescript
GET ${API_BASE_URL}/unusual-whales/greek-flow/{ticker}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/unusual-whales/greek-flow/TSLA
```

---

### 6. Insider Trades (Transactions d'insiders)

```typescript
GET ${API_BASE_URL}/unusual-whales/insider-trades/{ticker}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/unusual-whales/insider-trades/TSLA?limit=100
```

**Query Parameters** :
- `limit` (number, optionnel) : Nombre de transactions

---

### 7. Congress Trades (Transactions du Congrès)

```typescript
GET ${API_BASE_URL}/unusual-whales/congress-trades/{ticker}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/unusual-whales/congress-trades/TSLA?limit=100
```

---

### 8. Option Chains (Chaînes d'options)

```typescript
GET ${API_BASE_URL}/unusual-whales/option-chains/{ticker}
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/unusual-whales/option-chains/TSLA?expiry=2025-01-17
```

**Query Parameters** :
- `expiry` (string, optionnel) : Date d'expiration (format: `YYYY-MM-DD`)

---

### 9. Alerts (Alertes)

```typescript
GET ${API_BASE_URL}/unusual-whales/alerts
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/unusual-whales/alerts?config_ids[]=123&config_ids[]=456&noti_types[]=email
```

**Query Parameters** :
- `config_ids[]` (array, optionnel) : IDs de configuration
- `noti_types[]` (array, optionnel) : Types de notifications

---

### 10. Alert Configurations (Configurations d'alertes)

```typescript
GET ${API_BASE_URL}/unusual-whales/alert-configurations
```

**Exemple** :
```typescript
GET ${API_BASE_URL}/unusual-whales/alert-configurations
```

---

## 💻 Exemple de Client API Frontend

```typescript
// lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'YOUR_API_GATEWAY_URL';

async function getAccessToken(): Promise<string> {
  // Récupérer le token depuis Cognito/Amplify
  // Voir FRONTEND_AUTHENTICATION_GUIDE.md
  return accessToken;
}

export class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = await getAccessToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // ========== FMP Methods ==========
  
  async getFMPQuote(symbol: string, forceRefresh?: boolean) {
    const params = forceRefresh ? '?force_refresh=true' : '';
    return this.request(`/fmp/quote/${symbol}${params}`);
  }

  async getFMPHistoricalPrice(symbol: string, period: string = '1day', forceRefresh?: boolean) {
    const params = new URLSearchParams({ period });
    if (forceRefresh) params.append('force_refresh', 'true');
    return this.request(`/fmp/historical-price/${symbol}?${params.toString()}`);
  }

  async getFMPIncomeStatement(symbol: string, period: string = 'annual', limit: number = 5) {
    return this.request(`/fmp/income-statement/${symbol}?period=${period}&limit=${limit}`);
  }

  async getFMPBalanceSheet(symbol: string, period: string = 'annual', limit: number = 5) {
    return this.request(`/fmp/balance-sheet/${symbol}?period=${period}&limit=${limit}`);
  }

  async getFMPCashFlow(symbol: string, period: string = 'annual', limit: number = 5) {
    return this.request(`/fmp/cash-flow/${symbol}?period=${period}&limit=${limit}`);
  }

  async getFMPKeyMetrics(symbol: string, period: string = 'annual', limit: number = 5) {
    return this.request(`/fmp/key-metrics/${symbol}?period=${period}&limit=${limit}`);
  }

  async getFMPRatios(symbol: string, period: string = 'annual', limit: number = 5) {
    return this.request(`/fmp/ratios/${symbol}?period=${period}&limit=${limit}`);
  }

  async getFMPDCF(symbol: string) {
    return this.request(`/fmp/dcf/${symbol}`);
  }

  async getFMPEarnings(symbol: string, limit: number = 10) {
    return this.request(`/fmp/earnings/${symbol}?limit=${limit}`);
  }

  async getFMPInsiderTrades(symbol: string, limit: number = 100) {
    return this.request(`/fmp/insider-trades/${symbol}?limit=${limit}`);
  }

  async getFMPHedgeFundHoldings(symbol: string, limit: number = 100) {
    return this.request(`/fmp/hedge-fund-holdings/${symbol}?limit=${limit}`);
  }

  async getFMPMarketNews(symbol?: string, limit: number = 50) {
    const params = new URLSearchParams({ limit: String(limit) });
    if (symbol) params.append('symbol', symbol);
    return this.request(`/fmp/market-news?${params.toString()}`);
  }

  async getFMPEconomicCalendar(from: string, to: string) {
    return this.request(`/fmp/economic-calendar?from=${from}&to=${to}`);
  }

  async getFMPEarningsCalendar(from: string, to: string) {
    return this.request(`/fmp/earnings-calendar?from=${from}&to=${to}`);
  }

  async getFMPScreener(criteria: Record<string, any>) {
    const params = new URLSearchParams();
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    return this.request(`/fmp/screener?${params.toString()}`);
  }

  async getFMPSECFilings(symbol: string, type?: string, limit: number = 10) {
    const params = new URLSearchParams({ limit: String(limit) });
    if (type) params.append('type', type);
    return this.request(`/fmp/sec-filings/${symbol}?${params.toString()}`);
  }

  // ========== Unusual Whales Methods ==========

  async getUWInstitutionOwnership(ticker: string, options?: Record<string, any>, forceRefresh?: boolean) {
    const params = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    if (forceRefresh) params.append('force_refresh', 'true');
    return this.request(`/unusual-whales/institution-ownership/${ticker}?${params.toString()}`);
  }

  async getUWInstitutionActivity(ticker: string, institutionName?: string, options?: Record<string, any>) {
    const params = new URLSearchParams();
    if (institutionName) params.append('institution_name', institutionName);
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return this.request(`/unusual-whales/institution-activity/${ticker}?${params.toString()}`);
  }

  async getUWOptionsFlow(ticker: string, options?: Record<string, any>) {
    const params = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return this.request(`/unusual-whales/options-flow/${ticker}?${params.toString()}`);
  }

  async getUWFlowAlerts(ticker: string, options?: Record<string, any>) {
    const params = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return this.request(`/unusual-whales/flow-alerts/${ticker}?${params.toString()}`);
  }

  async getUWGreekFlow(ticker: string, options?: Record<string, any>) {
    const params = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return this.request(`/unusual-whales/greek-flow/${ticker}?${params.toString()}`);
  }

  async getUWInsiderTrades(ticker: string, options?: Record<string, any>) {
    const params = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return this.request(`/unusual-whales/insider-trades/${ticker}?${params.toString()}`);
  }

  async getUWCongressTrades(ticker: string, options?: Record<string, any>) {
    const params = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return this.request(`/unusual-whales/congress-trades/${ticker}?${params.toString()}`);
  }

  async getUWOptionChains(ticker: string, options?: Record<string, any>) {
    const params = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return this.request(`/unusual-whales/option-chains/${ticker}?${params.toString()}`);
  }

  async getUWAlerts(options?: Record<string, any>) {
    const params = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(`${key}[]`, String(v)));
        } else if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return this.request(`/unusual-whales/alerts?${params.toString()}`);
  }

  async getUWAlertConfigurations() {
    return this.request('/unusual-whales/alert-configurations');
  }
}

// Export singleton
export const apiClient = new ApiClient();
```

---

## 📝 Exemple d'Utilisation

```typescript
// Dans votre composant/service
import { apiClient } from '@/lib/api-client';

// Récupérer le quote d'AAPL
const quote = await apiClient.getFMPQuote('AAPL');
console.log(quote.data.price); // 150.25

// Récupérer les options flow de TSLA avec filtres
const optionsFlow = await apiClient.getUWOptionsFlow('TSLA', {
  min_premium: 10000,
  is_call: true,
  limit: 50
});
console.log(optionsFlow.data); // Array d'options
```

---

## ⚠️ Important

1. **Remplacez `YOUR_API_GATEWAY_URL`** par votre vraie URL API Gateway
2. **Utilisez l'Access Token** (pas l'ID Token) - voir `FRONTEND_AUTHENTICATION_GUIDE.md`
3. **Tous les endpoints nécessitent l'authentification** JWT
4. **Format de réponse standardisé** : `{ success, data, cached?, count?, timestamp }`

---

**Pour trouver votre URL API Gateway** : Voir `infra/terraform/outputs.tf` ou votre console AWS API Gateway

