# 🚀 Ticker Activity Service - Implémentation Backend

## ✅ Ce qui a été développé

### 1. Migration Supabase
**Fichier** : `infra/supabase/migrations/006_ticker_activity_cache.sql`

Tables créées pour le cache :
- `ticker_quotes` - Cache des quotes (TTL: 1h)
- `institutional_ownership` - Cache de l'ownership institutionnel (TTL: 24h)
- `institutional_activity` - Cache des transactions institutionnelles (TTL: 24h)
- `insider_trades` - Cache des transactions insiders (TTL: 24h)
- `congress_trades` - Cache des transactions du Congrès (TTL: 24h)
- `options_flow` - Cache du flow d'options (TTL: 1h)
- `dark_pool_trades` - Cache des dark pool trades (TTL: 1h)

Toutes les tables incluent :
- Colonnes `cached_at` et `expires_at` pour la gestion du cache
- Colonne `data` (JSONB) pour stocker les données brutes
- Index pour optimiser les requêtes
- RLS (Row Level Security) activé avec politiques pour service_role

### 2. Module TypeScript
**Fichier** : `services/api/src/ticker-activity.ts`

9 endpoints implémentés :
1. `getTickerQuote()` - Quote actuel (FMP API)
2. `getTickerOwnership()` - Ownership institutionnel (Unusual Whales)
3. `getTickerActivity()` - Transactions institutionnelles (⚠️ LIMITE 10 institutions)
4. `getTickerHedgeFunds()` - Hedge funds uniquement
5. `getTickerInsiders()` - Transactions insiders (Unusual Whales)
6. `getTickerCongress()` - Transactions du Congrès (Unusual Whales)
7. `getTickerOptions()` - Options flow (Unusual Whales)
8. `getTickerDarkPool()` - Dark pool trades (Unusual Whales)
9. `getTickerStats()` - Statistiques agrégées

**Optimisations critiques** :
- ✅ Limite de 10 institutions maximum pour `/activity` (évite les boucles infinies)
- ✅ Délai de 1 seconde entre chaque appel API
- ✅ Cache-first strategy (vérifie le cache avant chaque appel API)
- ✅ Gestion d'erreurs robuste (continue même si une institution échoue)

### 3. Routes API
**Fichier** : `services/api/src/router.ts`

9 routes ajoutées :
- `GET /ticker-activity/{ticker}/quote`
- `GET /ticker-activity/{ticker}/ownership?limit=100`
- `GET /ticker-activity/{ticker}/activity?limit=100&force_refresh=false`
- `GET /ticker-activity/{ticker}/hedge-funds?limit=100`
- `GET /ticker-activity/{ticker}/insiders?limit=100`
- `GET /ticker-activity/{ticker}/congress?limit=100`
- `GET /ticker-activity/{ticker}/options?limit=100&min_premium=10000`
- `GET /ticker-activity/{ticker}/dark-pool?limit=100`
- `GET /ticker-activity/{ticker}/stats`

### 4. Infrastructure Terraform
**Fichiers** :
- `infra/terraform/api.tf` - 9 routes API Gateway ajoutées
- `infra/terraform/variables.tf` - Variables pour les clés API

Variables d'environnement ajoutées à la Lambda :
- `UNUSUAL_WHALES_API_KEY`
- `FMP_API_KEY`

## 📋 Étapes de Déploiement

### 1. Appliquer la migration Supabase

```bash
# Se connecter à Supabase et exécuter la migration
psql -h <supabase-host> -U postgres -d postgres -f infra/supabase/migrations/006_ticker_activity_cache.sql
```

Ou via l'interface Supabase :
1. Aller dans SQL Editor
2. Copier le contenu de `006_ticker_activity_cache.sql`
3. Exécuter la migration

### 2. Configurer les variables d'environnement Terraform

Ajouter dans `infra/terraform/terraform.tfvars` :

```hcl
unusual_whales_api_key = "your_unusual_whales_api_key_here"
fmp_api_key           = "your_fmp_api_key_here"
```

### 3. Déployer l'infrastructure Terraform

```bash
cd infra/terraform
terraform init
terraform plan
terraform apply
```

### 4. Builder et déployer l'API Lambda

```bash
cd services/api
npm install
npm run bundle  # Crée api.zip
```

Le fichier `api.zip` sera automatiquement utilisé par Terraform lors du déploiement.

### 5. Tester les endpoints

```bash
# Exemple avec curl
curl -X GET "https://<api-gateway-url>/api/ticker-activity/TSLA/quote" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔑 Variables d'Environnement Requises

### Dans Terraform
- `unusual_whales_api_key` - Clé API Unusual Whales
- `fmp_api_key` - Clé API Financial Modeling Prep

### Déjà configurées
- `SUPABASE_URL` - URL Supabase
- `SUPABASE_SERVICE_KEY` - Clé service Supabase
- `COGNITO_ISSUER` - Issuer Cognito
- `COGNITO_AUDIENCE` - Audience Cognito

## 📊 Performance Attendue

- **Cache hit** : < 50ms
- **Cache miss** : < 20 secondes (max 10 institutions pour `/activity`)
- **Taux de cache hit** : > 80% (après quelques heures)

## ⚠️ Points d'Attention

1. **Limite de 10 institutions** : CRITIQUE pour `/activity` - ne pas augmenter sans réfléchir
2. **Rate limits** :
   - Unusual Whales : 60 req/min
   - FMP : 250 req/jour (Starter)
3. **Cache TTL** :
   - Quotes, Options, Dark Pool : 1 heure
   - Autres : 24 heures
4. **Délai entre appels** : 1 seconde minimum pour respecter les rate limits

## 🧪 Tests

Pour tester un endpoint :

```bash
# Quote
curl -X GET "https://<api-url>/api/ticker-activity/TSLA/quote" \
  -H "Authorization: Bearer <token>"

# Ownership
curl -X GET "https://<api-url>/api/ticker-activity/TSLA/ownership?limit=10" \
  -H "Authorization: Bearer <token>"

# Activity (peut prendre jusqu'à 20 secondes)
curl -X GET "https://<api-url>/api/ticker-activity/TSLA/activity?limit=50" \
  -H "Authorization: Bearer <token>"

# Stats
curl -X GET "https://<api-url>/api/ticker-activity/TSLA/stats" \
  -H "Authorization: Bearer <token>"
```

## 📚 Documentation Complémentaire

- **BACKEND_SPEC_TICKER_ACTIVITY.md** - Spécification backend complète
- **API_ENDPOINTS_REFERENCE.md** - Référence des endpoints
- **EXTERNAL_APIS_REFERENCE.md** - Référence des APIs externes
- **FRONTEND_SPEC_TICKER_ACTIVITY.md** - Spécification frontend (pour référence)

## 🔄 Prochaines Étapes (Optionnel)

1. **Jobs asynchrones** : Créer un worker Lambda pour rafraîchir le cache en arrière-plan
2. **Monitoring** : Ajouter des métriques CloudWatch pour surveiller les performances
3. **Rate limiting** : Implémenter un rate limiter côté backend
4. **Nettoyage automatique** : Créer un cron job pour nettoyer les données expirées

## 🐛 Dépannage

### Erreur "Missing required environment variable"
Vérifier que les variables d'environnement sont bien configurées dans Terraform.

### Erreur "Rate limit exceeded"
- Vérifier les headers de réponse des APIs externes
- Augmenter le délai entre les appels si nécessaire
- Vérifier le nombre d'appels par minute

### Erreur "Table does not exist"
Vérifier que la migration Supabase a bien été exécutée.

### Cache ne fonctionne pas
Vérifier que les colonnes `expires_at` sont bien remplies et que les requêtes utilisent `gt("expires_at", ...)`.

