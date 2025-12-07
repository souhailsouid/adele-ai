#!/bin/bash

# Script pour tester un seul endpoint Unusual Whales
# Usage: ACCESS_TOKEN="your_token" ./scripts/test-single-uw-endpoint.sh [METHOD] [PATH] [API_DATA_GATEWAY_URL]
#
# Note: 
#   - Les routes UW sont maintenant sur l'API Gateway 2 (données brutes)
#   - Récupérer l'URL avec: terraform output api_data_gateway_url

ACCESS_TOKEN="${ACCESS_TOKEN:-}"

METHOD="${1:-GET}"
PATH="${2:-/unusual-whales/shorts/AAPL/data}"
# URL de l'API Gateway 2 (données brutes)
API_URL="${3:-https://YOUR_API_DATA_GATEWAY_ID.execute-api.eu-west-3.amazonaws.com/prod}"

if [ -z "$ACCESS_TOKEN" ]; then
  echo "Erreur: ACCESS_TOKEN est requis"
  echo "Usage: ACCESS_TOKEN=\"your_token\" ./scripts/test-single-uw-endpoint.sh [METHOD] [PATH] [API_DATA_GATEWAY_URL]"
  exit 1
fi

echo "Testing: ${METHOD} ${API_URL}${PATH}"
echo "API Gateway 2 (Données Brutes)"
echo ""

curl -v -X "${METHOD}" \
  "${API_URL}${PATH}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  | jq '.' 2>/dev/null || cat

echo ""
