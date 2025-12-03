# Guide de test rapide - Endpoints Unusual Whales

## 🚀 Test rapide après déploiement

### 1. Récupérer l'URL de l'API Gateway

```bash
cd infra/terraform
terraform output api_gateway_url
```

Ou utilisez l'URL par défaut : `https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod`

### 2. Tester avec les scripts fournis

#### Script Bash (teste tous les endpoints)
```bash
./scripts/test-uw-endpoints.sh
```

#### Script Node.js (teste tous les endpoints)
```bash
node scripts/test-uw-endpoints.js
```

#### Tester un seul endpoint
```bash
./scripts/test-single-uw-endpoint.sh GET "/unusual-whales/shorts/AAPL/data"
```

### 3. Test manuel avec cURL

#### Configuration rapide
```bash
export API_URL="https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod"
export TOKEN="eyJraWQiOiIwekpSMTVhYjBqSk0xdnJmaFBSa0NveGJBaHhnXC9HblhkeU56Y09iRkRyND0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1MTI5ODBiZS0wMGQxLTcwZmYtNTQ3Zi0zYTA3YzkyMzA3ODIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0zLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtM19GUURtaHhWMTQiLCJjbGllbnRfaWQiOiJwa3A0aTgyam50dHRoajJjYmlsdHVkZ3ZhIiwib3JpZ2luX2p0aSI6IjMzNTRmYmM2LTI4NWItNDE4OC04MTk5LWU3MmM5MTI4ZDAwOCIsImV2ZW50X2lkIjoiY2QwY2FhNTctZGQzNS00YmM3LWFjZjUtOGZkZTk2MjRlYjY0IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc2NDcwODkxNCwiZXhwIjoxNzY0NzEyNTE0LCJpYXQiOjE3NjQ3MDg5MTQsImp0aSI6ImVhOGVmZDE3LWVjOTItNGE5NS04NWQ2LTJmOGQ1ZDBjNWY5OSIsInVzZXJuYW1lIjoiNTEyOTgwYmUtMDBkMS03MGZmLTU0N2YtM2EwN2M5MjMwNzgyIn0.evrqLK43UX1nEeAg0W9L3oVhl7d-dXtHLXOM9l1l1_fqmXyYH_g-dXoa3ZRz9nNqtcvDDqi_vDHBD9A9ZcUgjXqsj995E8o4EHsJL4cfk8yW-aLV9EKpcliCEmrXD4rsm3ZxaIzKAGMUugZ-r-WCQGn1-R6AptGITGkLscYS-2x965nm_6a0pAKh26HO1h7ps9CI0iS3iGttmhbNtJ8NAvhqdXpzM2PoFpReLgupV7tbrSkOwxsBFCC631aov843o989sXIfw1df7lWvjtIifAxPihpoL99512I_ImYobSxSzZa5fH1lR6m4EzRnu_qJUFdRTk3AKb98wsVVAfUHJg"
```

#### Exemples de tests

**Shorts**
```bash
# Short Data
curl -X GET "${API_URL}/unusual-whales/shorts/AAPL/data" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Failures to Deliver
curl -X GET "${API_URL}/unusual-whales/shorts/AAPL/ftds" \
  -H "Authorization: Bearer ${TOKEN}" | jq
```

**Seasonality**
```bash
# Year-Month Price Change
curl -X GET "${API_URL}/unusual-whales/seasonality/AAPL/year-month" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Monthly Average Return
curl -X GET "${API_URL}/unusual-whales/seasonality/AAPL/monthly" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Month Performers (Mars = 3)
curl -X GET "${API_URL}/unusual-whales/seasonality/3/performers?limit=10" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Market Seasonality
curl -X GET "${API_URL}/unusual-whales/seasonality/market" \
  -H "Authorization: Bearer ${TOKEN}" | jq
```

**Screener**
```bash
# Analyst Ratings
curl -X GET "${API_URL}/unusual-whales/screener/analysts?limit=10&ticker=AAPL" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Option Contracts
curl -X GET "${API_URL}/unusual-whales/screener/option-contracts?limit=10" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Stock Screener
curl -X GET "${API_URL}/unusual-whales/screener/stocks?date=2024-01-18" \
  -H "Authorization: Bearer ${TOKEN}" | jq
```

**Option Trade**
```bash
# Flow Alerts
curl -X GET "${API_URL}/unusual-whales/option-trades/flow-alerts?limit=10" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Full Tape (retourne une URL)
curl -X GET "${API_URL}/unusual-whales/option-trades/full-tape/2024-01-18" \
  -H "Authorization: Bearer ${TOKEN}" | jq
```

**Option Contract**
```bash
# Flow Data
curl -X GET "${API_URL}/unusual-whales/option-contract/AAPL240621C00190000/flow?limit=10" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Historic Data
curl -X GET "${API_URL}/unusual-whales/option-contract/AAPL240621C00190000/historic?limit=10" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Intraday Data
curl -X GET "${API_URL}/unusual-whales/option-contract/AAPL240621C00190000/intraday" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Volume Profile
curl -X GET "${API_URL}/unusual-whales/option-contract/AAPL240621C00190000/volume-profile" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Expiry Breakdown
curl -X GET "${API_URL}/unusual-whales/stock/AAPL/expiry-breakdown" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Stock Option Contracts
curl -X GET "${API_URL}/unusual-whales/stock/AAPL/option-contracts?limit=10" \
  -H "Authorization: Bearer ${TOKEN}" | jq
```

**News**
```bash
# News Headlines
curl -X GET "${API_URL}/unusual-whales/news/headlines?limit=10" \
  -H "Authorization: Bearer ${TOKEN}" | jq
```

## ⚠️ Notes importantes

1. **Token** : Utilisez l'**access_token**, pas l'id_token
2. **Expiration** : Les tokens expirent après 1 heure. Si vous obtenez une erreur 401, régénérez un nouveau token
3. **Format de réponse** : Tous les endpoints retournent du JSON avec cette structure :
   ```json
   {
     "success": true,
     "data": [...],
     "cached": false,
     "count": 10,
     "timestamp": "2024-01-18T12:00:00.000Z"
   }
   ```
4. **Full Tape** : L'endpoint `/option-trades/full-tape/{date}` retourne une URL pour télécharger le fichier ZIP

## 🔍 Dépannage

### Erreur 401 (Unauthorized)
- Vérifiez que vous utilisez l'access_token, pas l'id_token
- Vérifiez que le token n'a pas expiré
- Vérifiez le format : `Authorization: Bearer [TOKEN]`

### Erreur 404 (Not Found)
- Vérifiez que les routes ont été déployées via Terraform
- Vérifiez l'URL de l'API Gateway
- Vérifiez le chemin de l'endpoint (sensible à la casse)

### Erreur 500 (Internal Server Error)
- Vérifiez les logs CloudWatch de la Lambda
- Vérifiez que les variables d'environnement sont configurées (UNUSUAL_WHALES_API_KEY)
- Vérifiez que l'API Unusual Whales est accessible

## 📊 Liste complète des endpoints

Voir `TEST_ENDPOINTS.md` pour la liste complète avec tous les paramètres disponibles.

