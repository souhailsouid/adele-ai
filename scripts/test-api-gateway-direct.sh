#!/bin/bash

# Script pour tester directement l'API Gateway et voir les erreurs détaillées
# Usage: ./scripts/test-api-gateway-direct.sh <TOKEN> <ENDPOINT>

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
    echo "Usage: $0 <TOKEN> <ENDPOINT>"
    echo ""
    echo "Exemples:"
    echo "  $0 'eyJraWQ...' '/ticker-activity/TSLA/quote'"
    exit 1
fi

TOKEN="$1"
ENDPOINT="$2"
URL="${API_URL}${ENDPOINT}"

echo -e "${BLUE}🧪 Test Direct API Gateway${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "URL: ${URL}"
echo -e "Token: ${TOKEN:0:50}..."
echo ""

echo -e "${YELLOW}📡 Requête avec détails complets...${NC}"
echo ""

# Faire la requête avec verbose pour voir tous les détails
HTTP_CODE=$(curl -s -o /tmp/api_response.json -w "\nHTTP_CODE:%{http_code}\nTIME:%{time_total}\n" \
    -X "GET" \
    "${URL}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -v 2>&1 | tee /tmp/api_verbose.log)

echo ""
echo -e "${YELLOW}📥 Réponse HTTP:${NC}"
grep "HTTP_CODE" /tmp/api_verbose.log | tail -1

echo ""
echo -e "${YELLOW}📋 Headers de réponse:${NC}"
grep -E "^< HTTP|^< " /tmp/api_verbose.log | head -20

echo ""
echo -e "${YELLOW}📄 Corps de la réponse:${NC}"
cat /tmp/api_response.json | jq '.' 2>/dev/null || cat /tmp/api_response.json

echo ""
echo -e "${YELLOW}🔍 Analyse des erreurs:${NC}"

# Vérifier le code HTTP
if grep -q "HTTP_CODE:401" /tmp/api_verbose.log; then
    echo -e "${RED}❌ 401 - Problème d'authentification${NC}"
    echo "   - Vérifiez que le token est un Access Token (pas ID Token)"
    echo "   - Vérifiez que le token n'est pas expiré"
    echo "   - Vérifiez l'audience et l'issuer dans le token"
elif grep -q "HTTP_CODE:403" /tmp/api_verbose.log; then
    echo -e "${RED}❌ 403 - Accès refusé${NC}"
    echo "   - Problème avec l'authorizer JWT"
    echo "   - Vérifiez la configuration Cognito"
elif grep -q "HTTP_CODE:500" /tmp/api_verbose.log; then
    echo -e "${RED}❌ 500 - Erreur serveur${NC}"
    echo "   - La Lambda a crashé ou retourné une erreur"
    echo "   - Vérifiez les logs CloudWatch:"
    echo "     ./scripts/check-api-gateway-logs.sh"
    echo "   - Problèmes possibles:"
    echo "     * Handler ne retourne pas de réponse valide"
    echo "     * Erreur dans le code Lambda"
    echo "     * Timeout Lambda"
elif grep -q "HTTP_CODE:404" /tmp/api_verbose.log; then
    echo -e "${RED}❌ 404 - Route non trouvée${NC}"
    echo "   - Vérifiez que la route est bien configurée dans Terraform"
    echo "   - Vérifiez le format de l'endpoint"
elif grep -q "HTTP_CODE:200" /tmp/api_verbose.log; then
    echo -e "${GREEN}✅ 200 - Succès${NC}"
else
    echo -e "${YELLOW}⚠️  Code HTTP inattendu${NC}"
fi

echo ""
echo -e "${BLUE}💡 Pour voir les logs en temps réel:${NC}"
echo "   ./scripts/check-api-gateway-logs.sh"

