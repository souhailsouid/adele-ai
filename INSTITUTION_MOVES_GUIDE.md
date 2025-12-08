# 📊 Guide : Institution Moves (Mouvements d'Institutions)

## 🎯 Endpoints pour Vérifier les Institution Moves

### 1️⃣ **Derniers Filings (Nouveaux Mouvements) - RECOMMANDÉ**

**Route** : `GET /13f-filings/latest`  
**API Gateway** : 1 (`@baseUrlMain`)  
**Description** : Retourne les derniers 13F filings publiés (combine FMP + UW)

**Exemple** :
```
GET {{baseUrlMain}}/13f-filings/latest?from=2025-09-07&to=2025-12-07&limit=100
```

**URL complète** :
```
https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/13f-filings/latest?from=2025-09-07&to=2025-12-07&limit=100
```

**Paramètres** :
- `from` : Date de début (format: YYYY-MM-DD)
- `to` : Date de fin (format: YYYY-MM-DD)
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
  "count": 100
}
```

**Utilisation** : Pour afficher la liste des institutions qui ont publié de nouveaux filings récemment.

---

### 2️⃣ **Holdings d'une Institution avec Changements - RECOMMANDÉ**

**Route** : `GET /unusual-whales/institution/{cik}/holdings`  
**API Gateway** : 2 (`@baseUrlData`)  
**Description** : Retourne les holdings avec les changements de positions (`units_change`)

**Exemple** :
```
GET {{baseUrlData}}/unusual-whales/institution/0001364742/holdings?date=2025-09-30&limit=100&order=units_change&order_direction=desc
```

**URL complète** :
```
https://faq9dl95v7.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/institution/0001364742/holdings?date=2025-09-30&limit=100&order=units_change&order_direction=desc
```

**Paramètres** :
- `cik` : CIK de l'institution (ex: `0001364742` pour BlackRock)
- `date` : Date du rapport (format: YYYY-MM-DD)
- `order=units_change` : **Trier par changements** (les plus gros mouvements en premier)
- `order_direction=desc` : Ordre décroissant
- `limit` : Nombre de résultats (défaut: 500, max: 500)

**Retour** :
```json
{
  "success": true,
  "data": [
    {
      "ticker": "AAPL",
      "units": 1000000,
      "units_change": 50000,  // ← POSITIF = ACHAT
      "value": 175000000,
      "date": "2025-09-30"
    },
    {
      "ticker": "MSFT",
      "units": 500000,
      "units_change": -25000,  // ← NÉGATIF = VENTE
      "value": 150000000,
      "date": "2025-09-30"
    }
  ]
}
```

**Utilisation** : Pour voir les mouvements d'une institution spécifique (achats/ventes).

---

### 3️⃣ **Activité de Trading d'une Institution**

**Route** : `GET /unusual-whales/institution/{cik}/activity`  
**API Gateway** : 2 (`@baseUrlData`)  
**Description** : Retourne les activités de trading récentes avec buy_price/sell_price

**Exemple** :
```
GET {{baseUrlData}}/unusual-whales/institution/0001364742/activity?limit=100&date=2025-09-30
```

**URL complète** :
```
https://faq9dl95v7.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/institution/0001364742/activity?limit=100&date=2025-09-30
```

**Retour** :
```json
{
  "success": true,
  "data": [
    {
      "ticker": "AAPL",
      "units_change": 50000,
      "buy_price": "175.00",
      "sell_price": null,
      "filing_date": "2025-11-14",
      "report_date": "2025-09-30"
    }
  ]
}
```

**Utilisation** : Pour voir les prix d'achat/vente des transactions.

---

### 4️⃣ **Derniers Filings de Toutes les Institutions**

**Route** : `GET /unusual-whales/institutions/latest-filings`  
**API Gateway** : 2 (`@baseUrlData`)  
**Description** : Retourne les derniers filings de toutes les institutions

**Exemple** :
```
GET {{baseUrlData}}/unusual-whales/institutions/latest-filings?limit=100&order=filing_date&order_direction=desc
```

**URL complète** :
```
https://faq9dl95v7.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/institutions/latest-filings?limit=100&order=filing_date&order_direction=desc
```

**Utilisation** : Pour voir tous les nouveaux filings récents (alternative à `/13f-filings/latest`).

---

## 🎯 Workflow Recommandé pour "Institution Moves"

### Scénario 1 : Voir les Nouveaux Mouvements (Toutes Institutions)

1. **Appeler** : `GET /13f-filings/latest?from=2025-09-07&to=2025-12-07&limit=100`
2. **Afficher** : Liste des institutions avec leurs nouveaux filings
3. **Clic sur une institution** → Voir les détails

### Scénario 2 : Voir les Mouvements d'une Institution Spécifique

1. **Appeler** : `GET /unusual-whales/institution/{cik}/holdings?order=units_change&order_direction=desc`
2. **Filtrer** : `units_change != 0` pour voir uniquement les changements
3. **Afficher** :
   - 🟢 `units_change > 0` = Achat
   - 🔴 `units_change < 0` = Vente
   - ⚪ `units_change = 0` = Pas de changement

### Scénario 3 : Comparer Deux Périodes

1. **Appeler** : `GET /unusual-whales/institution/{cik}/holdings?start_date=2025-06-30&end_date=2025-09-30`
2. **Comparer** : Les `units` entre les deux dates
3. **Calculer** : `units_change = units_end - units_start`

---

## 📋 CIK des Institutions Principales

- **BlackRock** : `0001364742`
- **Vanguard** : `0000102909`
- **Berkshire Hathaway** : `0001697748`
- **State Street** : `0000093751`
- **FMR LLC** : `0000003159`

---

## 🔗 URLs Complètes (Production)

### API Gateway 1 (Application)
```
https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod
```

### API Gateway 2 (Données Brutes)
```
https://faq9dl95v7.execute-api.eu-west-3.amazonaws.com/prod
```

---

## ✅ Résumé : Quelle API Utiliser ?

| Besoin | Endpoint | API Gateway |
|--------|----------|-------------|
| **Nouveaux filings récents** | `GET /13f-filings/latest` | 1 (`@baseUrlMain`) |
| **Mouvements d'une institution** | `GET /unusual-whales/institution/{cik}/holdings?order=units_change` | 2 (`@baseUrlData`) |
| **Transactions récentes** | `GET /unusual-whales/institution/{cik}/activity` | 2 (`@baseUrlData`) |
| **Tous les derniers filings** | `GET /unusual-whales/institutions/latest-filings` | 2 (`@baseUrlData`) |

