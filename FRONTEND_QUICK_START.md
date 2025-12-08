# 🚀 Quick Start Frontend - FMP + Unusual Whales

## ⚡ En 30 secondes

**2 API Gateways** :
- `@baseUrlMain` : Application (analyse, scoring, surveillance, alertes)
- `@baseUrlData` : Données brutes (FMP + UW)

**14 nouveaux endpoints** disponibles - voir `FRONTEND_BRIEF.md` pour les détails complets.

---

## 📍 URLs

```typescript
const API_MAIN_URL = 'https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod';
const API_DATA_URL = 'https://faq9dl95v7.execute-api.eu-west-3.amazonaws.com/prod';
```

---

## 🔑 Authentification

```typescript
headers: {
  'Authorization': `Bearer ${ACCESS_TOKEN}`
}
```

---

## 🎯 Endpoints Principaux

### Analyse
- `GET /analysis/{ticker}/complete` - Analyse complète
- `GET /analysis/{ticker}/score` - Score 0-100
- `GET /analysis/{ticker}/gamma-squeeze` - Détection gamma squeeze

### Surveillance
- `POST /surveillance/watch` - Créer une surveillance
- `GET /surveillance/watches` - Liste des surveillances
- `GET /surveillance/watch/{id}/alerts` - Alertes générées

### Smart Money
- `GET /smart-money/top-hedge-funds?period=3M` - Top hedge funds
- `GET /smart-money/institution/{cik}/copy-trades/{ticker}` - Copy trades

### Market
- `GET /market-analysis/sector-rotation` - Rotations sectorielles
- `GET /market-analysis/market-tide` - Sentiment global

---

## ⚠️ Points Clés

1. **CIK pour institutions** : Utiliser `0001697748` au lieu de `Berkshire Hathaway` si erreur 500
2. **Performance** : Endpoints combinés = 2-5 secondes → Loading state requis
3. **Erreurs** : Toujours vérifier `success === true` avant d'utiliser `data`
4. **Valeurs suspectes** : `score = 50` = valeur par défaut (données absentes)

---

## 📚 Documentation Complète

- **Brief complet** : `FRONTEND_BRIEF.md` (593 lignes)
- **Tests HTTP** : `api-tests.http`
- **Résumé implémentation** : `RESUME_IMPLEMENTATION.md`

---

## 💡 Exemple Rapide

```typescript
// Récupérer le score d'un ticker
const response = await fetch(
  `${API_MAIN_URL}/ticker-analysis/AAPL/score`,
  { headers: { 'Authorization': `Bearer ${token}` } }
);
const { success, data } = await response.json();

if (success) {
  console.log(`Score: ${data.overall}/100`);
  console.log(`Recommandation: ${data.recommendation}`);
}
```

