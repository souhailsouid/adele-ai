# 📊 Guide API Frontend - 13F Filings, Options Flow, Market Tide

## 🎯 1. 13F Filings (Derniers filings institutionnels)

### ✅ Endpoint Recommandé (Combiné FMP + UW)
**Route** : `GET /13f-filings/latest`  
**API Gateway** : 1 (Application Principale - `@baseUrlMain`)  
**Description** : Combine les 13F filings de FMP et Unusual Whales, retourne les derniers publiés

**Exemple** :
```
GET {{baseUrlMain}}/13f-filings/latest?from=2025-09-07&to=2025-12-07&limit=100
```

**Paramètres** :
- `from` : Date de début (format: YYYY-MM-DD, optionnel, défaut: 90 jours en arrière)
- `to` : Date de fin (format: YYYY-MM-DD, optionnel, défaut: aujourd'hui)
- `limit` : Nombre de résultats (défaut: 100, max: 500)

**Retour** :
```json
{
  "success": true,
  "data": [
    {
      "cik": "0001364742",
      "institutionName": "BLACKROCK, INC.",
      "formType": "13F-HR",
      "filingDate": "2025-11-14",
      "reportDate": "2025-09-30",
      "source": "BOTH",
      "url": "https://www.sec.gov/...",
      "totalValue": 1234567890,
      "holdingsCount": 5000
    }
  ],
  "count": 100,
  "sources": {
    "fmp": { "count": 50, "status": "fulfilled" },
    "uw": { "count": 80, "status": "fulfilled" }
  },
  "timestamp": "2025-12-07T10:00:00Z"
}
```

### Alternative : Unusual Whales Direct
**Route** : `GET /unusual-whales/institutions/latest-filings`  
**API Gateway** : 2 (Données Brutes - `@baseUrlData`)

**Exemple** :
```
GET {{baseUrlData}}/unusual-whales/institutions/latest-filings?limit=100&order=filing_date&order_direction=desc
```

---

## 📈 2. Options Flow

### ✅ Endpoint Recommandé
**Route** : `GET /ticker-activity/{ticker}/options`  
**API Gateway** : 1 (Application Principale - `@baseUrlMain`)  
**Description** : Retourne les flows d'options récents avec filtres avancés

**Exemple** :
```
GET {{baseUrlMain}}/ticker-activity/AAPL/options?limit=100&min_premium=10000&is_call=true
```

**Paramètres** :
- `limit` : Nombre de résultats (défaut: 100, max: 200)
- `min_premium` : Premium minimum (défaut: 10000)
- `max_premium` : Premium maximum
- `is_call` : Filtrer les CALLs (true/false)
- `is_put` : Filtrer les PUTs (true/false)
- `is_sweep` : Filtrer les sweeps (true/false)
- `is_floor` : Filtrer les floor trades (true/false)
- `is_otm` : Filtrer les OTM (Out of The Money) (true/false)
- `min_size` / `max_size` : Taille
- `min_dte` / `max_dte` : Days to Expiry
- `min_volume` / `max_volume` : Volume

**Retour** :
```json
{
  "success": true,
  "data": [
    {
      "type": "CALL",
      "strike": 200,
      "total_premium": 500000,
      "premium": 500000,
      "volume": 1000,
      "expiry": "2026-01-15",
      "open_interest": 5000,
      "created_at": "2025-12-07T10:00:00Z"
    }
  ],
  "cached": false,
  "count": 100,
  "timestamp": "2025-12-07T10:00:00Z"
}
```

### Alternative : Unusual Whales Direct
**Route** : `GET /unusual-whales/options-flow/{ticker}`  
**API Gateway** : 2 (Données Brutes - `@baseUrlData`)

**Exemple** :
```
GET {{baseUrlData}}/unusual-whales/options-flow/AAPL?limit=100
```

---

## 🌊 3. Market Tide

### ✅ Endpoint Recommandé (Service Combiné)
**Route** : `GET /market-analysis/market-tide`  
**API Gateway** : 1 (Application Principale - `@baseUrlMain`)  
**Description** : Retourne le sentiment global du marché (0-100 score)

**Exemple** :
```
GET {{baseUrlMain}}/market-analysis/market-tide
```

**Retour** :
```json
{
  "success": true,
  "data": {
    "overall": 65,
    "sentiment": "BULLISH",
    "volatility": "MEDIUM",
    "sectors": {
      "strongest": ["Technology", "Healthcare"],
      "weakest": ["Energy", "Financial"]
    }
  },
  "timestamp": "2025-12-07T10:00:00Z"
}
```

**Valeurs possibles** :
- `overall` : Score 0-100 (0 = très bearish, 100 = très bullish)
- `sentiment` : "BULLISH" | "NEUTRAL" | "BEARISH"
- `volatility` : "LOW" | "MEDIUM" | "HIGH"

### Alternative : Unusual Whales Direct
**Route** : `GET /unusual-whales/market/market-tide`  
**API Gateway** : 2 (Données Brutes - `@baseUrlData`)

**Exemple** :
```
GET {{baseUrlData}}/unusual-whales/market/market-tide?date=2025-12-07&limit=1
```

**Retour** :
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-12-07",
      "tide": "0.75"
    }
  ],
  "cached": false,
  "count": 1,
  "timestamp": "2025-12-07T10:00:00Z"
}
```

**Note** : Le `tide` est une valeur entre 0 et 1. Multiplier par 100 pour obtenir un score 0-100.

---

## 📋 Récapitulatif des Endpoints

| Fonctionnalité | Endpoint Recommandé | API Gateway | Alternative |
|----------------|---------------------|-------------|-------------|
| **13F Filings** | `GET /13f-filings/latest` | 1 (`@baseUrlMain`) | `GET /unusual-whales/institutions/latest-filings` (Gateway 2) |
| **Options Flow** | `GET /ticker-activity/{ticker}/options` | 1 (`@baseUrlMain`) | `GET /unusual-whales/options-flow/{ticker}` (Gateway 2) |
| **Market Tide** | `GET /market-analysis/market-tide` | 1 (`@baseUrlMain`) | `GET /unusual-whales/market/market-tide` (Gateway 2) |

---

## 🔗 Exemples dans api-tests.http

### 13F Filings
```http
### Test 17: Vérifier que 13F Filings retourne des données
GET {{baseUrlMain}}/13f-filings/latest
Authorization: Bearer {{accessToken}}
```

### Options Flow
```http
### Ticker Options - Options
GET {{baseUrlMain}}/ticker-activity/AAPL/options?limit=10
Authorization: Bearer {{accessToken}}
```

### Market Tide
```http
### Market Tide - Sentiment global du marché
GET {{baseUrlMain}}/market-analysis/market-tide
Authorization: Bearer {{accessToken}}
```

---

## 💡 Recommandations Frontend

### Pour "Institutional Moves" (13F Filings)
- **Endpoint** : `GET /13f-filings/latest`
- **Paramètres** : `from` et `to` pour filtrer par période
- **Affichage** : Colonnes FUND, INSTITUTION, FORM, DATE, SOURCE, ACTIONS
- **Tri** : Par `filingDate` décroissant (les plus récents en premier)

### Pour "Options Flow"
- **Endpoint** : `GET /ticker-activity/{ticker}/options`
- **Filtres** : `is_call`, `is_put`, `min_premium` pour filtrer les flows significatifs
- **Affichage** : Tableau avec type, strike, premium, volume, expiry

### Pour "Market Tide"
- **Endpoint** : `GET /market-analysis/market-tide`
- **Affichage** : Badge coloré selon `sentiment` (BULLISH = vert, BEARISH = rouge, NEUTRAL = gris)
- **Score** : Afficher `overall` (0-100) avec barre de progression

---

**Date** : 2025-12-07  
**Version** : 1.0

---

## 📋 4. Visualiser les Transactions/Holdings d'un 13F Filing

### ✅ Endpoint Recommandé : Holdings d'une Institution
**Route** : `GET /unusual-whales/institution/{name}/holdings`  
**API Gateway** : 2 (Données Brutes - `@baseUrlData`)  
**Description** : Retourne tous les holdings d'une institution avec les changements de positions (transactions)

**Exemple** :
```
GET {{baseUrlData}}/unusual-whales/institution/0001364742/holdings?date=2025-09-30&limit=500&order=value&order_direction=desc
```

**Paramètres** :
- `name` : Nom de l'institution ou **CIK** (recommandé, ex: `0001364742` pour BlackRock)
- `date` : Date du rapport (format: YYYY-MM-DD, optionnel)
- `start_date` / `end_date` : Période pour filtrer (format: YYYY-MM-DD)
- `limit` : Nombre de résultats (défaut: 500, max: 500)
- `page` : Numéro de page (défaut: 0)
- `order` : Tri par champ (`date`, `ticker`, `value`, `units`, `units_change`, `avg_price`, etc.)
- `order_direction` : Direction du tri (`desc` ou `asc`, défaut: `desc`)
- `security_types[]` : Filtrer par type de sécurité (array)

**Retour** :
```json
{
  "success": true,
  "data": [
    {
      "ticker": "AAPL",
      "full_name": "APPLE INC",
      "units": 1000000,
      "units_change": 50000,
      "value": 175000000,
      "avg_price": "175.00",
      "close": "180.00",
      "date": "2025-09-30",
      "first_buy": "2020-01-15",
      "price_first_buy": "75.00",
      "units_change": 50000,
      "historical_units": [950000, 1000000],
      "shares_outstanding": "15000000000",
      "perc_of_total": 0.0067,
      "perc_of_share_value": 0.15,
      "security_type": "Share",
      "put_call": null,
      "sector": "Technology"
    }
  ],
  "cached": false,
  "count": 500,
  "timestamp": "2025-12-07T10:00:00Z"
}
```

**Champs importants pour visualiser les transactions** :
- `units_change` : **Changement d'unités** (positif = achat, négatif = vente)
- `units` : Nombre d'unités actuelles
- `value` : Valeur totale de la position
- `historical_units` : Historique des unités (8 périodes) - permet de voir l'évolution
- `first_buy` : Date du premier achat
- `date` : Date du rapport 13F

---

### Alternative : Activité de Trading
**Route** : `GET /unusual-whales/institution/{name}/activity`  
**API Gateway** : 2 (Données Brutes - `@baseUrlData`)  
**Description** : Retourne les activités de trading récentes d'une institution

**Exemple** :
```
GET {{baseUrlData}}/unusual-whales/institution/0001364742/activity?limit=100&date=2025-09-30
```

**Paramètres** :
- `name` : Nom de l'institution ou CIK
- `date` : Date du rapport (format: YYYY-MM-DD, optionnel)
- `limit` : Nombre de résultats (défaut: 500, max: 500)
- `page` : Numéro de page (défaut: 0)

**Retour** :
```json
{
  "success": true,
  "data": [
    {
      "ticker": "AAPL",
      "units": 1000000,
      "units_change": 50000,
      "avg_price": "23.49",
      "buy_price": "175.00",
      "sell_price": null,
      "close": "180.00",
      "filing_date": "2025-11-14",
      "report_date": "2025-09-30",
      "price_on_filing": "175.00",
      "price_on_report": "180.00",
      "security_type": "Share",
      "put_call": null,
      "shares_outstanding": "15000000000"
    }
  ],
  "cached": false,
  "count": 100,
  "timestamp": "2025-12-07T10:00:00Z"
}
```

---

## 💡 Recommandations Frontend pour Visualiser les Transactions 13F

### Workflow Recommandé

1. **Liste des 13F Filings** :
   - Utiliser `GET /13f-filings/latest` pour afficher la liste
   - Afficher : FUND, INSTITUTION, FORM, DATE, SOURCE

2. **Clic sur un Filing** → Afficher les Holdings :
   - Utiliser `GET /unusual-whales/institution/{cik}/holdings?date={reportDate}`
   - Filtrer par `date` = `reportDate` du filing sélectionné

3. **Visualisation des Transactions** :
   - Colonnes : TICKER, UNITS, UNITS_CHANGE, VALUE, DATE
   - **Colorier** `units_change` :
     - Vert si `units_change > 0` (achat)
     - Rouge si `units_change < 0` (vente)
     - Gris si `units_change = 0` (pas de changement)
   - Afficher `historical_units` comme graphique de ligne pour voir l'évolution

4. **Comparaison entre deux périodes** :
   - Appeler `holdings` avec `start_date` et `end_date`
   - Comparer les `units` entre les deux dates
   - Calculer les changements : `units_change = units_end - units_start`

### Exemple d'Affichage

**Tableau des Holdings** :
| TICKER | UNITS | CHANGE | VALUE | % OF TOTAL | DATE |
|--------|-------|--------|-------|------------|------|
| AAPL | 1,000,000 | +50,000 🟢 | $175M | 0.67% | 2025-09-30 |
| MSFT | 500,000 | -25,000 🔴 | $150M | 0.33% | 2025-09-30 |
| NVDA | 200,000 | 0 ⚪ | $100M | 0.13% | 2025-09-30 |

**Graphique d'Évolution** :
- Utiliser `historical_units` pour afficher un graphique de ligne
- X-axis : Périodes (8 points max)
- Y-axis : Nombre d'unités

---

## 🔗 Exemples dans api-tests.http

### Holdings d'une Institution (BlackRock)
```http
GET {{baseUrlData}}/unusual-whales/institution/0001364742/holdings?date=2025-09-30&limit=100&order=value&order_direction=desc
Authorization: Bearer {{accessToken}}
```

### Activité de Trading (BlackRock)
```http
GET {{baseUrlData}}/unusual-whales/institution/0001364742/activity?limit=100&date=2025-09-30
Authorization: Bearer {{accessToken}}
```

---

**Note** : Utilisez le **CIK** plutôt que le nom pour plus de fiabilité (ex: `0001364742` au lieu de "BlackRock").


---

## 🔥 5. Heatmap des Options par Strike et Expiration

### ✅ Endpoint Recommandé : Options Flow (50 flows récents)
**Route** : `GET /ticker-activity/{ticker}/options`  
**API Gateway** : 1 (Application Principale - `@baseUrlMain`)  
**Description** : Retourne les flows d'options récents avec strike et expiry. **À agréger côté frontend pour créer la heatmap.**

**Exemple** :
```
GET {{baseUrlMain}}/ticker-activity/AAPL/options?limit=50&min_premium=10000
```

**Paramètres** :
- `limit` : Nombre de flows (défaut: 100, max: 200) - **Utiliser 50 pour la heatmap**
- `min_premium` : Premium minimum (défaut: 10000) - Filtrer les flows significatifs
- `is_call` / `is_put` : Filtrer par type (true/false)
- `is_sweep` : Filtrer les sweeps (true/false)
- `is_otm` : Filtrer les OTM (true/false)

**Retour** :
```json
{
  "success": true,
  "data": [
    {
      "type": "CALL",
      "strike": 200,
      "premium": 500000,
      "total_premium": 500000,
      "volume": 1000,
      "expiry": "2026-01-15",
      "open_interest": 5000,
      "created_at": "2025-12-07T10:00:00Z"
    },
    {
      "type": "PUT",
      "strike": 195,
      "premium": 300000,
      "total_premium": 300000,
      "volume": 800,
      "expiry": "2026-01-15",
      "open_interest": 3000,
      "created_at": "2025-12-07T10:05:00Z"
    }
  ],
  "cached": false,
  "count": 50,
  "timestamp": "2025-12-07T10:00:00Z"
}
```

**Champs pour la heatmap** :
- `strike` : Prix de strike (axe X ou Y)
- `expiry` : Date d'expiration (axe Y ou X)
- `premium` : Valeur à afficher dans la cellule (intensité de la couleur)
- `volume` : Alternative pour l'intensité
- `type` : CALL ou PUT (peut être utilisé pour différencier les couleurs)

---

### Alternative 1 : Flow par Strike (agrégé)
**Route** : `GET /unusual-whales/stock/{ticker}/flow-per-strike`  
**API Gateway** : 2 (Données Brutes - `@baseUrlData`)  
**Description** : Retourne les flows agrégés par strike (sans expiry). **Limité pour une heatmap 2D.**

**Exemple** :
```
GET {{baseUrlData}}/unusual-whales/stock/AAPL/flow-per-strike?date=2025-12-07
```

**Retour** :
```json
{
  "success": true,
  "data": [
    {
      "strike": "200",
      "call_premium": "9908777.0",
      "put_premium": "163537151",
      "call_volume": 990943,
      "put_volume": 808326,
      "date": "2025-12-07",
      "ticker": "AAPL",
      "timestamp": "2025-12-07T16:35:52Z"
    }
  ],
  "cached": false,
  "count": 50,
  "timestamp": "2025-12-07T10:00:00Z"
}
```

---

### Alternative 2 : Flow par Expiry (agrégé)
**Route** : `GET /unusual-whales/stock/{ticker}/flow-per-expiry`  
**API Gateway** : 2 (Données Brutes - `@baseUrlData`)  
**Description** : Retourne les flows agrégés par expiry (sans strike). **Limité pour une heatmap 2D.**

**Exemple** :
```
GET {{baseUrlData}}/unusual-whales/stock/AAPL/flow-per-expiry
```

**Retour** :
```json
{
  "success": true,
  "data": [
    {
      "expiry": "2026-01-15",
      "call_premium": "9908777.0",
      "put_premium": "163537151",
      "call_volume": 990943,
      "put_volume": 808326,
      "date": "2025-12-07",
      "ticker": "AAPL"
    }
  ],
  "date": "2025-12-07",
  "cached": false,
  "count": 10,
  "timestamp": "2025-12-07T10:00:00Z"
}
```

---

## 💡 Recommandations Frontend pour la Heatmap

### Workflow Recommandé (Heatmap 2D : Strike × Expiry)

1. **Récupérer les 50 flows récents** :
   ```
   GET /ticker-activity/{ticker}/options?limit=50&min_premium=10000
   ```

2. **Agréger les données côté frontend** :
   ```javascript
   // Créer une map: { "strike-expiry": { premium, volume, count } }
   const heatmapData = {};
   
   flows.forEach(flow => {
     const key = `${flow.strike}-${flow.expiry}`;
     if (!heatmapData[key]) {
       heatmapData[key] = {
         strike: flow.strike,
         expiry: flow.expiry,
         premium: 0,
         volume: 0,
         count: 0,
         calls: 0,
         puts: 0
       };
     }
     heatmapData[key].premium += flow.premium;
     heatmapData[key].volume += flow.volume;
     heatmapData[key].count += 1;
     if (flow.type === 'CALL') heatmapData[key].calls += 1;
     if (flow.type === 'PUT') heatmapData[key].puts += 1;
   });
   ```

3. **Créer la matrice pour la heatmap** :
   ```javascript
   // Extraire les strikes et expiries uniques
   const strikes = [...new Set(flows.map(f => f.strike))].sort((a, b) => a - b);
   const expiries = [...new Set(flows.map(f => f.expiry))].sort();
   
   // Créer la matrice
   const matrix = expiries.map(expiry => 
     strikes.map(strike => {
       const key = `${strike}-${expiry}`;
       return heatmapData[key]?.premium || 0;
     })
   );
   ```

4. **Visualisation** :
   - **Axe X** : Strikes (triés)
   - **Axe Y** : Expiries (triées)
   - **Couleur** : Intensité basée sur `premium` (ou `volume`)
   - **Tooltip** : Afficher `premium`, `volume`, `count`, `calls`, `puts`

### Exemple de Heatmap

```
Expiry      | 195  | 200  | 205  | 210  | 215  |
------------|------|------|------|------|------|
2026-01-15  | 🔴   | 🟡   | 🟢   | 🟡   | 🔴   |
2026-02-19  | 🟡   | 🟢   | 🟢   | 🟡   | 🔴   |
2026-03-19  | 🟢   | 🟢   | 🟡   | 🔴   | 🔴   |
```

- 🔴 = Premium élevé (> 1M$)
- 🟡 = Premium moyen (100K$ - 1M$)
- 🟢 = Premium faible (< 100K$)

### Alternative : Heatmap 1D (Strike uniquement)

Si vous voulez une heatmap plus simple (1 dimension), utilisez :
```
GET /unusual-whales/stock/{ticker}/flow-per-strike
```

Afficher les strikes en X et l'intensité (premium) en couleur.

---

## 🔗 Exemples dans api-tests.http

### Options Flow (50 flows pour heatmap)
```http
GET {{baseUrlMain}}/ticker-activity/AAPL/options?limit=50&min_premium=10000
Authorization: Bearer {{accessToken}}
```

### Flow par Strike (agrégé)
```http
GET {{baseUrlData}}/unusual-whales/stock/AAPL/flow-per-strike?date=2025-12-07
Authorization: Bearer {{accessToken}}
```

### Flow par Expiry (agrégé)
```http
GET {{baseUrlData}}/unusual-whales/stock/AAPL/flow-per-expiry
Authorization: Bearer {{accessToken}}
```

---

**Note** : Pour une heatmap 2D complète (Strike × Expiry), utilisez `/ticker-activity/{ticker}/options?limit=50` et agrégez côté frontend. Les endpoints `/flow-per-strike` et `/flow-per-expiry` sont utiles pour des visualisations 1D.

