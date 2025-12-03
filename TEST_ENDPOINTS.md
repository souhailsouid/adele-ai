# Guide de test des endpoints Unusual Whales

## Prérequis

1. **Access Token** : Utilisez le token d'accès (access_token) fourni, pas l'id_token
2. **URL de l'API Gateway** : Récupérez l'URL depuis Terraform outputs ou utilisez celle par défaut

## Récupérer l'URL de l'API Gateway

```bash
cd infra/terraform
terraform output api_gateway_url
```

Ou utilisez l'URL par défaut : `https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod`

## Méthodes de test

### 1. Script Bash

```bash
# Utiliser l'URL par défaut
./scripts/test-uw-endpoints.sh

# Ou spécifier une URL personnalisée
./scripts/test-uw-endpoints.sh https://votre-api-gateway-url.amazonaws.com/prod
```

### 2. Script Node.js

```bash
# Utiliser l'URL par défaut
node scripts/test-uw-endpoints.js

# Ou spécifier une URL personnalisée
node scripts/test-uw-endpoints.js https://votre-api-gateway-url.amazonaws.com/prod

# Ou via variable d'environnement
ACCESS_TOKEN="votre_token" API_GATEWAY_URL="https://..." node scripts/test-uw-endpoints.js
```

### 3. Commandes cURL individuelles

#### Shorts
```bash
# Short Data
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/shorts/AAPL/data" \
  -H "Authorization: Bearer eyJraWQiOiIwekpSMTVhYjBqSk0xdnJmaFBSa0NveGJBaHhnXC9HblhkeU56Y09iRkRyND0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1MTI5ODBiZS0wMGQxLTcwZmYtNTQ3Zi0zYTA3YzkyMzA3ODIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0zLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtM19GUURtaHhWMTQiLCJjbGllbnRfaWQiOiJwa3A0aTgyam50dHRoajJjYmlsdHVkZ3ZhIiwib3JpZ2luX2p0aSI6IjMzNTRmYmM2LTI4NWItNDE4OC04MTk5LWU3MmM5MTI4ZDAwOCIsImV2ZW50X2lkIjoiY2QwY2FhNTctZGQzNS00YmM3LWFjZjUtOGZkZTk2MjRlYjY0IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc2NDcwODkxNCwiZXhwIjoxNzY0NzEyNTE0LCJpYXQiOjE3NjQ3MDg5MTQsImp0aSI6ImVhOGVmZDE3LWVjOTItNGE5NS04NWQ2LTJmOGQ1ZDBjNWY5OSIsInVzZXJuYW1lIjoiNTEyOTgwYmUtMDBkMS03MGZmLTU0N2YtM2EwN2M5MjMwNzgyIn0.evrqLK43UX1nEeAg0W9L3oVhl7d-dXtHLXOM9l1l1_fqmXyYH_g-dXoa3ZRz9nNqtcvDDqi_vDHBD9A9ZcUgjXqsj995E8o4EHsJL4cfk8yW-aLV9EKpcliCEmrXD4rsm3ZxaIzKAGMUugZ-r-WCQGn1-R6AptGITGkLscYS-2x965nm_6a0pAKh26HO1h7ps9CI0iS3iGttmhbNtJ8NAvhqdXpzM2PoFpReLgupV7tbrSkOwxsBFCC631aov843o989sXIfw1df7lWvjtIifAxPihpoL99512I_ImYobSxSzZa5fH1lR6m4EzRnu_qJUFdRTk3AKb98wsVVAfUHJg" \
  -H "Content-Type: application/json"

# Failures to Deliver
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/shorts/AAPL/ftds" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"

# Short Interest and Float
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/shorts/AAPL/interest-float" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"
```

#### Seasonality
```bash
# Year-Month Price Change
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/seasonality/AAPL/year-month" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"

# Monthly Average Return
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/seasonality/AAPL/monthly" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"

# Month Performers (Mars = 3)
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/seasonality/3/performers?limit=10" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"

# Market Seasonality
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/seasonality/market" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"
```

#### Screener
```bash
# Analyst Ratings
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/screener/analysts?limit=10&ticker=AAPL" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"

# Option Contracts (Hottest Chains)
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/screener/option-contracts?limit=10" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"

# Stock Screener
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/screener/stocks?date=2024-01-18" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"
```

#### Option Trade
```bash
# Flow Alerts
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/option-trades/flow-alerts?limit=10" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"

# Full Tape (retourne une URL pour télécharger le ZIP)
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/option-trades/full-tape/2024-01-18" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"
```

#### Option Contract
```bash
# Flow Data
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/option-contract/AAPL240621C00190000/flow?limit=10" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"

# Historic Data
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/option-contract/AAPL240621C00190000/historic?limit=10" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"

# Intraday Data
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/option-contract/AAPL240621C00190000/intraday" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"

# Volume Profile
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/option-contract/AAPL240621C00190000/volume-profile" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"

# Expiry Breakdown
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/stock/AAPL/expiry-breakdown" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"

# Stock Option Contracts
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/stock/AAPL/option-contracts?limit=10" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"
```

#### News
```bash
# News Headlines
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/unusual-whales/news/headlines?limit=10" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"
```

## Test rapide avec cURL (exemple complet)

Remplacez `[API_URL]` par votre URL API Gateway et `[ACCESS_TOKEN]` par votre token :

```bash
# Variable pour simplifier
API_URL="https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod"
TOKEN="eyJraWQiOiIwekpSMTVhYjBqSk0xdnJmaFBSa0NveGJBaHhnXC9HblhkeU56Y09iRkRyND0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1MTI5ODBiZS0wMGQxLTcwZmYtNTQ3Zi0zYTA3YzkyMzA3ODIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0zLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtM19GUURtaHhWMTQiLCJjbGllbnRfaWQiOiJwa3A0aTgyam50dHRoajJjYmlsdHVkZ3ZhIiwib3JpZ2luX2p0aSI6IjMzNTRmYmM2LTI4NWItNDE4OC04MTk5LWU3MmM5MTI4ZDAwOCIsImV2ZW50X2lkIjoiY2QwY2FhNTctZGQzNS00YmM3LWFjZjUtOGZkZTk2MjRlYjY0IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc2NDcwODkxNCwiZXhwIjoxNzY0NzEyNTE0LCJpYXQiOjE3NjQ3MDg5MTQsImp0aSI6ImVhOGVmZDE3LWVjOTItNGE5NS04NWQ2LTJmOGQ1ZDBjNWY5OSIsInVzZXJuYW1lIjoiNTEyOTgwYmUtMDBkMS03MGZmLTU0N2YtM2EwN2M5MjMwNzgyIn0.evrqLK43UX1nEeAg0W9L3oVhl7d-dXtHLXOM9l1l1_fqmXyYH_g-dXoa3ZRz9nNqtcvDDqi_vDHBD9A9ZcUgjXqsj995E8o4EHsJL4cfk8yW-aLV9EKpcliCEmrXD4rsm3ZxaIzKAGMUugZ-r-WCQGn1-R6AptGITGkLscYS-2x965nm_6a0pAKh26HO1h7ps9CI0iS3iGttmhbNtJ8NAvhqdXpzM2PoFpReLgupV7tbrSkOwxsBFCC631aov843o989sXIfw1df7lWvjtIifAxPihpoL99512I_ImYobSxSzZa5fH1lR6m4EzRnu_qJUFdRTk3AKb98wsVVAfUHJg"

# Test Short Data
curl -X GET "${API_URL}/unusual-whales/shorts/AAPL/data" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" | jq

# Test Seasonality
curl -X GET "${API_URL}/unusual-whales/seasonality/AAPL/monthly" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" | jq

# Test News Headlines
curl -X GET "${API_URL}/unusual-whales/news/headlines?limit=5" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" | jq
```

## Notes importantes

1. **Token** : Utilisez toujours l'**access_token**, pas l'id_token
2. **Format** : Tous les endpoints retournent du JSON sauf `/full-tape` qui retourne une URL
3. **Erreurs** : En cas d'erreur 401, vérifiez que le token n'a pas expiré
4. **Rate Limiting** : Les endpoints sont limités par l'API Unusual Whales

## Exemples de réponses

### Succès (200)
```json
{
  "success": true,
  "data": [...],
  "cached": false,
  "count": 10,
  "timestamp": "2024-01-18T12:00:00.000Z"
}
```

### Erreur (401)
```json
{
  "error": "Authentication required",
  "message": "Not authenticated. Please sign in first."
}
```

### Erreur (500)
```json
{
  "error": "Internal Server Error",
  "message": "Error details..."
}
```

