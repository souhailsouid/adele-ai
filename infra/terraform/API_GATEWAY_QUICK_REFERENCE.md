# 🚀 Guide Rapide : Routes par API Gateway

## 📍 Règle Simple

| Préfixe de route | API Gateway | Nom |
|-----------------|-------------|-----|
| `/fmp/*` | **API Gateway 2** | `{project}-{stage}-http-data-raw` |
| `/unusual-whales/*` | **API Gateway 2** | `{project}-{stage}-http-data-raw` |
| **Tout le reste** | **API Gateway 1** | `{project}-{stage}-http-app` |

---

## 🎯 API Gateway 1 : Application Principale

**Nom** : `{project}-{stage}-http-app`  
**Description** : Routes de l'application principale (signals, funds, companies, analysis, scoring)  
**Routes** : 38

### Catégories de routes :

#### 🔹 Signals (ADEL AI)
- `/signals`, `/signals/{id}`, `/search`, `/chat`

#### 🔹 Funds
- `/funds`, `/funds/{id}`, `/funds/{id}/holdings`, `/funds/{id}/filings`

#### 🔹 Companies
- `/companies`, `/companies/{id}`, `/companies/ticker/{ticker}`, `/companies/{id}/filings`, `/companies/{id}/events`, `/companies/{id}/insider-trades`

#### 🔹 Ticker Activity
- `/ticker-activity/{ticker}/*` (quote, ownership, activity, hedge-funds, insiders, congress, options, dark-pool, stats)

#### 🔹 Ticker Insights
- `/ticker-insights/{ticker}`

#### 🔹 Analysis Combinée
- `/analysis/{ticker}/*` (complete, divergence, valuation, earnings-prediction, risk)
- `/analysis/sector/{sector}`
- `/screener/multi-criteria`
- `/institutions/{name}/tracking`

#### 🔹 Scoring & Gamma Squeeze
- `/ticker-analysis/{ticker}/score`
- `/ticker-analysis/{ticker}/breakdown`
- `/ticker-analysis/{ticker}/gamma-squeeze`

---

## 📦 API Gateway 2 : Données Brutes

**Nom** : `{project}-{stage}-http-data-raw`  
**Description** : Routes de données brutes (FMP et Unusual Whales)  
**Routes** : 263

### Catégories de routes :

#### 🔹 FMP (Financial Modeling Prep)
**Préfixe** : `/fmp/*`

- Quote & Market Data
- Financial Statements (Income, Balance Sheet, Cash Flow)
- Financial Ratios & Key Metrics
- Company Profile & Executives
- Earnings & Estimates
- SEC Filings
- Stock Screener
- Market News
- ETFs & Mutual Funds
- Commodities, Forex, Crypto
- Economic Indicators
- ... (~100 routes)

#### 🔹 Unusual Whales
**Préfixe** : `/unusual-whales/*`

- Institutions (ownership, activity, holdings, sectors)
- Options Flow (recent, per expiry, per strike, alerts)
- Dark Pool (recent, by ticker)
- Insiders (trades, transactions, sector flow)
- Congress (traders, late reports, recent trades)
- Options & Greeks (chains, greeks, greek flow, greek exposure)
- Short Interest (data, FTDs, interest-float, volume-ratio)
- Earnings (afterhours, premarket, historical)
- ETFs (exposure, holdings, in-outflow, info, weights)
- Market Data (correlations, economic calendar, FDA calendar, market tide, sector tide, ETF tide)
- Stock Data (info, OHLC, max pain, spot exposures, volatility)
- Alerts & Configurations
- ... (~150 routes)

---

## 💻 Utilisation dans le code

### Frontend / Backend

```typescript
// Configuration
const API_MAIN = process.env.REACT_APP_API_MAIN_URL;  // API Gateway 1
const API_DATA = process.env.REACT_APP_API_DATA_URL;  // API Gateway 2

// Exemples d'utilisation
// ✅ API Gateway 1 (application)
fetch(`${API_MAIN}/ticker-insights/AAPL`);
fetch(`${API_MAIN}/analysis/AAPL/complete`);
fetch(`${API_MAIN}/ticker-analysis/AAPL/score`);

// ✅ API Gateway 2 (données brutes)
fetch(`${API_DATA}/fmp/quote/AAPL`);
fetch(`${API_DATA}/unusual-whales/options-flow/AAPL`);
fetch(`${API_DATA}/unusual-whales/stock/AAPL/greeks`);
```

### Variables d'environnement

```bash
# .env
REACT_APP_API_MAIN_URL=https://xxx.execute-api.eu-west-3.amazonaws.com/prod
REACT_APP_API_DATA_URL=https://yyy.execute-api.eu-west-3.amazonaws.com/prod
```

---

## 📊 Statistiques

| API Gateway | Routes | Préfixes |
|------------|--------|----------|
| **API Gateway 1** | 38 | `/signals`, `/funds`, `/companies`, `/ticker-activity`, `/ticker-insights`, `/analysis`, `/screener`, `/institutions`, `/ticker-analysis` |
| **API Gateway 2** | 263 | `/fmp/*`, `/unusual-whales/*` |
| **Total** | 301 | - |

---

## 🔍 Comment identifier rapidement ?

### Dans l'URL de l'API Gateway AWS Console :
- **API Gateway 1** : Nom contient `-http-app`
- **API Gateway 2** : Nom contient `-http-data-raw`

### Dans les routes :
- **API Gateway 1** : Routes **sans** préfixe `/fmp/` ou `/unusual-whales/`
- **API Gateway 2** : Routes **avec** préfixe `/fmp/` ou `/unusual-whales/`

---

**Dernière mise à jour** : 2025-01-05

