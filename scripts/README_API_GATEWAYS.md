# 📚 Guide des Scripts de Test - API Gateways

## 🔀 Séparation des API Gateways

Après le déploiement, il y a maintenant **2 API Gateways** :

### API Gateway 1 : Application Principale
- **Nom** : `{project}-{stage}-http-app`
- **Routes** : Signals, Funds, Companies, Ticker Activity, Analysis, Scoring, etc.
- **Récupérer l'URL** : `terraform output api_gateway_url`

### API Gateway 2 : Données Brutes
- **Nom** : `{project}-{stage}-http-data-raw`
- **Routes** : `/fmp/*` et `/unusual-whales/*`
- **Récupérer l'URL** : `terraform output api_data_gateway_url`

---

## 📋 Scripts de Test

### Scripts utilisant API Gateway 1 (Application Principale)

#### `test-combined-analysis-endpoints.sh`
**Routes testées** : `/analysis/*`, `/screener/*`, `/institutions/*`

```bash
# Récupérer l'URL
cd infra/terraform
MAIN_URL=$(terraform output -raw api_gateway_url)

# Lancer les tests
ACCESS_TOKEN="your_token" ./scripts/test-combined-analysis-endpoints.sh "$MAIN_URL"
```

---

### Scripts utilisant API Gateway 2 (Données Brutes)

#### `test-fmp-endpoints.sh`
**Routes testées** : `/fmp/*`

```bash
# Récupérer l'URL
cd infra/terraform
DATA_URL=$(terraform output -raw api_data_gateway_url)

# Lancer les tests
ACCESS_TOKEN="your_token" ./scripts/test-fmp-endpoints.sh "$DATA_URL"
```

#### `test-uw-endpoints.sh`
**Routes testées** : `/unusual-whales/*`

```bash
# Récupérer l'URL
cd infra/terraform
DATA_URL=$(terraform output -raw api_data_gateway_url)

# Lancer les tests
ACCESS_TOKEN="your_token" ./scripts/test-uw-endpoints.sh "$DATA_URL"
```

#### `test-single-uw-endpoint.sh`
**Usage** : Tester un seul endpoint UW

```bash
DATA_URL=$(terraform output -raw api_data_gateway_url)
ACCESS_TOKEN="your_token" ./scripts/test-single-uw-endpoint.sh GET "/unusual-whales/stock/AAPL/greeks" "$DATA_URL"
```

---

### Scripts utilisant les deux API Gateways

#### `test-all-routes-with-report.sh`
**Routes testées** : Toutes les routes des deux API Gateways

```bash
# Récupérer les URLs
cd infra/terraform
MAIN_URL=$(terraform output -raw api_gateway_url)
DATA_URL=$(terraform output -raw api_data_gateway_url)

# Lancer les tests
ACCESS_TOKEN="your_token" ./scripts/test-all-routes-with-report.sh "$MAIN_URL" "$DATA_URL"
```

---

## 🚀 Récupération rapide des URLs

```bash
cd infra/terraform

# URLs individuelles
terraform output api_gateway_url        # API Gateway 1
terraform output api_data_gateway_url  # API Gateway 2

# Ou en une commande
terraform output -json | jq -r '.api_gateway_url.value'        # API Gateway 1
terraform output -json | jq -r '.api_data_gateway_url.value'   # API Gateway 2
```

---

## 📝 Mise à jour des scripts existants

Tous les scripts ont été mis à jour pour :
- ✅ Utiliser la bonne API Gateway selon le type de route
- ✅ Afficher clairement quelle API Gateway est utilisée
- ✅ Avertir si l'URL par défaut (placeholder) est utilisée
- ✅ Inclure des instructions pour récupérer les URLs

---

## 🔍 Identification rapide

| Préfixe de route | API Gateway | Script |
|-----------------|-------------|--------|
| `/fmp/*` | API Gateway 2 | `test-fmp-endpoints.sh` |
| `/unusual-whales/*` | API Gateway 2 | `test-uw-endpoints.sh` |
| Tout le reste | API Gateway 1 | `test-combined-analysis-endpoints.sh` |

---

**Dernière mise à jour** : 2025-01-05

