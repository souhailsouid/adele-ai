#!/bin/bash

# Script pour tester un seul endpoint
# Usage: ./scripts/test-single-endpoint.sh <ACCESS_TOKEN> <ENDPOINT> [QUERY_PARAMS]

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

API_URL="https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod"

if [ -z "$1" ] || [ -z "$2" ]; then
    echo -e "${RED}❌ Erreur: Token et endpoint requis${NC}"
    echo "Usage: $0 <ACCESS_TOKEN> <ENDPOINT> [QUERY_PARAMS]"
    echo ""
    echo "Exemples:"
    echo "  $0 'eyJraWQ...' '/ticker-activity/TSLA/quote'"
    echo "  $0 'eyJraWQ...' '/ticker-activity/TSLA/ownership' '?limit=5'"
    exit 1
fi

TOKEN="$1"
ENDPOINT="$2"
QUERY_PARAMS="${3:-}"

URL="${API_URL}${ENDPOINT}${QUERY_PARAMS}"

echo -e "${BLUE}🧪 Test Endpoint${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "URL: ${URL}"
echo -e "Token: ${TOKEN:0:50}..."
echo ""

echo -e "${YELLOW}📡 Requête...${NC}"
echo ""

HTTP_CODE=$(curl -s -o /tmp/api_response.json -w "%{http_code}" \
    -X "GET" \
    "${URL}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -v 2>&1 | grep -E "< HTTP" | tail -1 | awk '{print $3}')

echo ""
echo -e "${YELLOW}📥 Réponse:${NC}"
echo ""

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ HTTP ${HTTP_CODE} - Succès${NC}"
    echo ""
    cat /tmp/api_response.json | jq '.' 2>/dev/null || cat /tmp/api_response.json
elif [ "$HTTP_CODE" -eq 401 ]; then
    echo -e "${RED}❌ HTTP ${HTTP_CODE} - Non autorisé${NC}"
    cat /tmp/api_response.json | jq '.' 2>/dev/null || cat /tmp/api_response.json
elif [ "$HTTP_CODE" -eq 500 ]; then
    echo -e "${RED}❌ HTTP ${HTTP_CODE} - Erreur serveur${NC}"
    cat /tmp/api_response.json | jq '.' 2>/dev/null || cat /tmp/api_response.json
else
    echo -e "${RED}❌ HTTP ${HTTP_CODE} - Erreur${NC}"
    cat /tmp/api_response.json | jq '.' 2>/dev/null || cat /tmp/api_response.json
fi

