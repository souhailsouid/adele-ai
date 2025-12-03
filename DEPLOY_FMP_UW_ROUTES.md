# 🚀 Déploiement des Routes FMP et Unusual Whales

## ⚠️ Problème

Les routes FMP et Unusual Whales retournent **404** car elles ne sont pas configurées dans Terraform.

## ✅ Solution

Deux nouveaux fichiers Terraform ont été créés :
- `infra/terraform/api-fmp-routes.tf` - 16 routes FMP
- `infra/terraform/api-uw-routes.tf` - 10 routes Unusual Whales

## 📋 Étapes de Déploiement

### 1. Vérifier les fichiers créés

```bash
cd infra/terraform
ls -la api-fmp-routes.tf api-uw-routes.tf
```

### 2. Initialiser Terraform (si nécessaire)

```bash
terraform init
```

### 3. Vérifier le plan

```bash
terraform plan
```

Vous devriez voir 26 nouvelles routes à créer :
- 16 routes FMP
- 10 routes Unusual Whales

### 4. Appliquer les changements

```bash
terraform apply
```

Terraform va créer toutes les routes dans API Gateway.

### 5. Vérifier le déploiement

```bash
# Vérifier que les routes sont créées
terraform output api_gateway_url

# Tester une route (remplacez YOUR_TOKEN par votre access token)
curl -X GET \
  "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/fmp/quote/AAPL" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📊 Routes Créées

### FMP Routes (16)
- `GET /fmp/quote/{symbol}`
- `GET /fmp/historical-price/{symbol}`
- `GET /fmp/income-statement/{symbol}`
- `GET /fmp/balance-sheet/{symbol}`
- `GET /fmp/cash-flow/{symbol}`
- `GET /fmp/key-metrics/{symbol}`
- `GET /fmp/ratios/{symbol}`
- `GET /fmp/dcf/{symbol}`
- `GET /fmp/earnings/{symbol}`
- `GET /fmp/insider-trades/{symbol}`
- `GET /fmp/hedge-fund-holdings/{symbol}`
- `GET /fmp/market-news`
- `GET /fmp/economic-calendar`
- `GET /fmp/earnings-calendar`
- `GET /fmp/screener`
- `GET /fmp/sec-filings/{symbol}`

### Unusual Whales Routes (10)
- `GET /unusual-whales/institution-ownership/{ticker}`
- `GET /unusual-whales/institution-activity/{ticker}`
- `GET /unusual-whales/options-flow/{ticker}`
- `GET /unusual-whales/flow-alerts/{ticker}`
- `GET /unusual-whales/greek-flow/{ticker}`
- `GET /unusual-whales/insider-trades/{ticker}`
- `GET /unusual-whales/congress-trades/{ticker}`
- `GET /unusual-whales/option-chains/{ticker}`
- `GET /unusual-whales/alerts`
- `GET /unusual-whales/alert-configurations`

## ⚠️ Important

1. **Toutes les routes nécessitent l'authentification JWT** (Access Token)
2. **Le déploiement est automatique** grâce à `auto_deploy = true` dans le stage
3. **Les routes sont créées immédiatement** après `terraform apply`

## 🔍 Vérification Post-Déploiement

Après le déploiement, testez quelques endpoints :

```bash
# FMP Quote
curl -X GET \
  "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/fmp/quote/AAPL" \
  -H "Authorization: Bearer YOUR_TOKEN"

# UW Institution Ownership
curl -X GET \
  "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/institution-ownership/TSLA?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Si vous obtenez toujours 404, vérifiez :
1. Que `terraform apply` s'est bien terminé
2. Que les routes apparaissent dans la console AWS API Gateway
3. Que vous utilisez le bon Access Token

## 📝 Notes

- Les routes utilisent le même authorizer JWT que les autres routes
- Toutes les routes pointent vers la même Lambda (`api_lambda`)
- Le router Lambda gère le routage interne vers les bonnes fonctions

