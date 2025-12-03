#!/bin/bash

# Script pour vérifier que toutes les routes sont bien configurées dans API Gateway
# Usage: ./scripts/verify-api-gateway-routes.sh

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

API_ID="${API_GATEWAY_ID:-tsdd1sibd1}"  # ID de votre API Gateway

echo -e "${BLUE}🔍 Vérification des routes API Gateway${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Routes attendues pour ticker-activity
EXPECTED_ROUTES=(
    "GET /ticker-activity/{ticker}/quote"
    "GET /ticker-activity/{ticker}/ownership"
    "GET /ticker-activity/{ticker}/activity"
    "GET /ticker-activity/{ticker}/hedge-funds"
    "GET /ticker-activity/{ticker}/insiders"
    "GET /ticker-activity/{ticker}/congress"
    "GET /ticker-activity/{ticker}/options"
    "GET /ticker-activity/{ticker}/dark-pool"
    "GET /ticker-activity/{ticker}/stats"
)

echo -e "${YELLOW}📋 Routes attendues:${NC}"
for route in "${EXPECTED_ROUTES[@]}"; do
    echo "   - ${route}"
done

echo ""
echo -e "${YELLOW}🔍 Récupération des routes depuis AWS...${NC}"

# Récupérer les routes depuis AWS (nécessite l'API ID complet)
# Note: Vous devrez peut-être ajuster cette commande selon votre configuration
if command -v aws &> /dev/null; then
    echo ""
    echo -e "${BLUE}Routes configurées dans API Gateway:${NC}"
    
    # Essayer de récupérer les routes
    aws apigatewayv2 get-routes \
        --api-id "${API_ID}" \
        --query 'Items[*].[RouteKey,AuthorizationType,Target]' \
        --output table 2>/dev/null || \
    echo -e "${YELLOW}⚠️  Impossible de récupérer les routes automatiquement${NC}"
    echo -e "${YELLOW}   Vérifiez manuellement dans la console AWS${NC}"
else
    echo -e "${YELLOW}⚠️  AWS CLI non installé${NC}"
    echo -e "${YELLOW}   Installez-le avec: brew install awscli${NC}"
fi

echo ""
echo -e "${BLUE}💡 Vérifications manuelles:${NC}"
echo "   1. Allez dans AWS Console > API Gateway"
echo "   2. Sélectionnez votre API"
echo "   3. Vérifiez que toutes les routes sont présentes"
echo "   4. Vérifiez que chaque route a:"
echo "      - Authorization: JWT"
echo "      - Authorizer: votre authorizer Cognito"
echo "      - Integration: votre Lambda"

