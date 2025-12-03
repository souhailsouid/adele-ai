#!/bin/bash

# Script de test pour l'API Ticker Activity
# Usage: ./scripts/test-ticker-activity-api.sh <ACCESS_TOKEN> [TICKER]

set -e

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_URL="https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod"
TICKER="${2:-TSLA}"

# Vérifier que le token est fourni
if [ -z "$1" ]; then
    echo -e "${RED}❌ Erreur: Access Token requis${NC}"
    echo "Usage: $0 <ACCESS_TOKEN> [TICKER]"
    echo "Exemple: $0 'eyJraWQ...' TSLA"
    exit 1
fi

TOKEN="$1"

echo -e "${BLUE}🧪 Test de l'API Ticker Activity${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "API URL: ${API_URL}"
echo -e "Ticker: ${TICKER}"
echo -e "Token: ${TOKEN:0:50}..."
echo ""

# Fonction pour tester un endpoint
test_endpoint() {
    local method=$1
    local path=$2
    local name=$3
    local description=$4
    
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}📡 Test: ${name}${NC}"
    echo -e "${BLUE}   ${description}${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    local url="${API_URL}${path}"
    local http_code=$(curl -s -o /tmp/api_response.json -w "%{http_code}" \
        -X "${method}" \
        "${url}" \
        -H "Authorization: Bearer ${TOKEN}" \
        -H "Content-Type: application/json")
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✅ HTTP ${http_code} - Succès${NC}"
        echo ""
        echo "Réponse:"
        cat /tmp/api_response.json | jq '.' 2>/dev/null || cat /tmp/api_response.json
    elif [ "$http_code" -eq 401 ]; then
        echo -e "${RED}❌ HTTP ${http_code} - Non autorisé${NC}"
        echo "Vérifiez que votre Access Token est valide et non expiré"
        cat /tmp/api_response.json | jq '.' 2>/dev/null || cat /tmp/api_response.json
    elif [ "$http_code" -eq 500 ]; then
        echo -e "${RED}❌ HTTP ${http_code} - Erreur serveur${NC}"
        echo "Vérifiez les logs CloudWatch pour plus de détails"
        cat /tmp/api_response.json | jq '.' 2>/dev/null || cat /tmp/api_response.json
    else
        echo -e "${RED}❌ HTTP ${http_code} - Erreur${NC}"
        cat /tmp/api_response.json | jq '.' 2>/dev/null || cat /tmp/api_response.json
    fi
    
    echo ""
    echo ""
}

# Tests
echo -e "${GREEN}🚀 Démarrage des tests...${NC}"
echo ""

# 1. Quote
test_endpoint "GET" "/ticker-activity/${TICKER}/quote" \
    "Quote" "Récupère le quote actuel du ticker"

# 2. Ownership
test_endpoint "GET" "/ticker-activity/${TICKER}/ownership?limit=3" \
    "Ownership" "Récupère l'ownership institutionnel (limite: 3)"

# 3. Activity
test_endpoint "GET" "/ticker-activity/${TICKER}/activity?limit=5" \
    "Activity" "Récupère les transactions institutionnelles (limite: 5)"

# 4. Hedge Funds
test_endpoint "GET" "/ticker-activity/${TICKER}/hedge-funds?limit=3" \
    "Hedge Funds" "Récupère les hedge funds uniquement (limite: 3)"

# 5. Insiders
test_endpoint "GET" "/ticker-activity/${TICKER}/insiders?limit=3" \
    "Insiders" "Récupère les transactions insiders (limite: 3)"

# 6. Congress
test_endpoint "GET" "/ticker-activity/${TICKER}/congress?limit=3" \
    "Congress" "Récupère les transactions du Congrès (limite: 3)"

# 7. Options
test_endpoint "GET" "/ticker-activity/${TICKER}/options?limit=3" \
    "Options" "Récupère le flow d'options (limite: 3)"

# 8. Dark Pool
test_endpoint "GET" "/ticker-activity/${TICKER}/dark-pool?limit=3" \
    "Dark Pool" "Récupère les dark pool trades (limite: 3)"

# 9. Stats
test_endpoint "GET" "/ticker-activity/${TICKER}/stats" \
    "Stats" "Récupère les statistiques agrégées"

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Tests terminés${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

