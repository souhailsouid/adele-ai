# 🔀 Séparation des API Gateways

## Problème
- **Limite AWS API Gateway** : 300 routes par API Gateway
- **Routes actuelles** : 301 routes (dépassement de la limite)
- **Solution** : Création d'une deuxième API Gateway

## Architecture

### API Gateway 1 : Application principale
**Fichier** : `api.tf` + `api-combined-analysis-routes.tf`

**Routes** (~40 routes) :
- ✅ Signals (ADEL AI) : `/signals`, `/search`, `/chat`
- ✅ Funds : `/funds/*`
- ✅ Companies : `/companies/*`
- ✅ Ticker Activity : `/ticker-activity/{ticker}/*`
- ✅ Ticker Insights : `/ticker-insights/{ticker}`
- ✅ Analysis combinée : `/analysis/{ticker}/*`, `/screener/*`, `/institutions/*`
- ✅ Scoring : `/ticker-analysis/{ticker}/score`, `/ticker-analysis/{ticker}/breakdown`
- ✅ Gamma Squeeze : `/ticker-analysis/{ticker}/gamma-squeeze`

**URL** : `https://{api-id}.execute-api.{region}.amazonaws.com/prod`

### API Gateway 2 : Données brutes
**Fichiers** : `api-data.tf` + `api-data-fmp-routes.tf` + `api-data-uw-routes.tf`

**Routes** (~260 routes) :
- ✅ FMP (Financial Modeling Prep) : `/fmp/*`
- ✅ UW (Unusual Whales) : `/unusual-whales/*`

**URL** : `https://{api-data-id}.execute-api.{region}.amazonaws.com/prod`

## Migration

### Fichiers créés
1. `api-data.tf` : Configuration de la nouvelle API Gateway
2. `api-data-fmp-routes.tf` : Routes FMP migrées
3. `api-data-uw-routes.tf` : Routes UW migrées

### Fichiers modifiés
1. `api-fmp-routes.tf` : Conservé pour référence (routes migrées)
2. `api-uw-routes.tf` : Conservé pour référence (routes migrées)
3. `outputs.tf` : Ajout des outputs pour la nouvelle API Gateway

### Changements techniques
- **Même Lambda** : Les deux API Gateways pointent vers la même Lambda
- **Même Authorizer** : Configuration JWT identique
- **Même CORS** : Configuration CORS identique
- **Logs séparés** : CloudWatch logs séparés pour chaque API Gateway

## Déploiement

```bash
cd infra/terraform
terraform plan  # Vérifier les changements
terraform apply  # Déployer
```

## Utilisation

### Frontend
Le frontend devra utiliser deux URLs différentes :
- **API principale** : Pour les routes métier
- **API données** : Pour les routes FMP et UW

### Exemple
```typescript
const API_MAIN_URL = process.env.REACT_APP_API_MAIN_URL;
const API_DATA_URL = process.env.REACT_APP_API_DATA_URL;

// Routes principales
fetch(`${API_MAIN_URL}/ticker-insights/AAPL`)

// Routes de données brutes
fetch(`${API_DATA_URL}/fmp/quote/AAPL`)
fetch(`${API_DATA_URL}/unusual-whales/options-flow/AAPL`)
```

## Avantages

1. ✅ **Respect de la limite** : Chaque API Gateway < 300 routes
2. ✅ **Séparation logique** : Routes métier vs données brutes
3. ✅ **Scalabilité** : Possibilité d'ajouter une 3ème API Gateway si nécessaire
4. ✅ **Maintenance** : Plus facile de gérer les routes par catégorie
5. ✅ **Coûts** : Pas d'impact sur les coûts (même Lambda, même nombre de routes)

## Prochaines étapes

- [ ] Mettre à jour le frontend avec les deux URLs
- [ ] Mettre à jour la documentation API
- [ ] Mettre à jour les tests d'intégration
- [ ] Surveiller les logs CloudWatch pour les deux API Gateways

