#!/bin/bash

# Script pour ajouter NVIDIA comme entreprise à suivre
# Usage: ./scripts/add-nvidia-company.sh [JWT_TOKEN]

set -e

# Configuration
API_URL="${API_URL:-https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod}"
JWT_TOKEN="${1:-${JWT_TOKEN}}"

if [ -z "$JWT_TOKEN" ]; then
  echo "❌ Erreur: JWT token requis"
  echo "Usage: $0 <JWT_TOKEN>"
  echo "Ou définir la variable d'environnement JWT_TOKEN"
  exit 1
fi

echo "🚀 Ajout de NVIDIA Corporation..."

# Données NVIDIA
PAYLOAD=$(cat <<EOF
{
  "ticker": "NVDA",
  "cik": "0001045810",
  "name": "NVIDIA Corporation",
  "sector": "Technology",
  "industry": "Semiconductors",
  "headquarters_country": "USA",
  "headquarters_state": "CA"
}
EOF
)

# Faire la requête POST
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/companies" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "${PAYLOAD}")

# Extraire le code HTTP et le body
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

# Afficher le résultat
if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ NVIDIA ajouté avec succès !"
  echo ""
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  echo ""
  echo "📋 Prochaines étapes:"
  echo "   - Le collector SEC découvrira automatiquement les filings (8-K, 10-K, 10-Q, Form 4)"
  echo "   - Vérifier les filings: GET ${API_URL}/companies/{id}/filings"
else
  echo "❌ Erreur HTTP $HTTP_CODE"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  exit 1
fi

