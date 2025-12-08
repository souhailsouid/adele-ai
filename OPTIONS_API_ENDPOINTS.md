# 📊 API Endpoints pour les Options d'un Ticker

## 🎯 Endpoints Principaux

### 1. **Options Flow (Recommandé)**
**Route** : `GET /ticker-activity/{ticker}/options`  
**API Gateway** : 1 (Application Principale)  
**Description** : Retourne les flows d'options récents avec filtres avancés

**Exemple** :
```
GET {{baseUrlMain}}/ticker-activity/AAPL/options?limit=100&min_premium=10000
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
- `min_size` : Taille minimum
- `max_size` : Taille maximum
- `min_dte` : Days to Expiry minimum
- `max_dte` : Days to Expiry maximum
- `min_volume` : Volume minimum
- `max_volume` : Volume maximum

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
      "open_interest": 5000
    }
  ],
  "cached": false,
  "count": 100,
  "timestamp": "2025-12-07T10:00:00Z"
}
```

---

### 2. **Option Chains**
**Route** : `GET /unusual-whales/stock/{ticker}/option-chains`  
**API Gateway** : 2 (Données Brutes)  
**Description** : Retourne les chaînes d'options complètes

**Exemple** :
```
GET {{baseUrlData}}/unusual-whales/stock/AAPL/option-chains?date=2025-12-07
```

**Paramètres** :
- `date` : Date pour les chaînes (format: YYYY-MM-DD)

---

### 3. **Option Contracts**
**Route** : `GET /unusual-whales/stock/{ticker}/option-contracts`  
**API Gateway** : 2 (Données Brutes)  
**Description** : Retourne les contrats d'options avec détails

**Exemple** :
```
GET {{baseUrlData}}/unusual-whales/stock/AAPL/option-contracts?limit=100&option_type=call
```

**Paramètres** :
- `limit` : Nombre de résultats
- `option_type` : "call" ou "put"
- `date` : Date de filtrage
- `strike` : Strike price
- `expiry` : Date d'expiration

---

### 4. **Options Flow (Unusual Whales direct)**
**Route** : `GET /unusual-whales/options-flow/{ticker}`  
**API Gateway** : 2 (Données Brutes)  
**Description** : Flow d'options depuis Unusual Whales (format brut)

**Exemple** :
```
GET {{baseUrlData}}/unusual-whales/options-flow/AAPL?limit=100
```

---

### 5. **Options Volume**
**Route** : `GET /unusual-whales/stock/{ticker}/options-volume`  
**API Gateway** : 2 (Données Brutes)  
**Description** : Volume d'options par strike/expiry

**Exemple** :
```
GET {{baseUrlData}}/unusual-whales/stock/AAPL/options-volume?date=2025-12-07
```

---

## 📝 Recommandation

**Pour la plupart des cas d'usage** : Utilisez `/ticker-activity/{ticker}/options`

**Avantages** :
- ✅ API Gateway 1 (plus rapide, cache intégré)
- ✅ Filtres avancés (CALL/PUT, sweep, OTM, etc.)
- ✅ Format standardisé et propre
- ✅ Cache Supabase intégré

**Pour des données brutes** : Utilisez les endpoints `/unusual-whales/stock/{ticker}/...`

---

## 🔗 Exemples dans api-tests.http

Voir lignes 240-243 pour un exemple d'utilisation :
```
GET {{baseUrlMain}}/ticker-activity/AAPL/options?limit=10
```

---

**Date** : 2025-12-07
