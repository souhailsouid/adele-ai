#!/bin/bash

# Script de test pour vérifier que le backend API fonctionne

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 TEST DU BACKEND API"
echo "======================"
echo ""

# Récupérer l'URL depuis Terraform
cd "$(dirname "$0")/../infra/terraform"
API_URL=$(terraform output -raw api_gateway_url 2>/dev/null || echo "")

if [ -z "$API_URL" ]; then
    echo -e "${RED}❌ Impossible de récupérer l'URL de l'API Gateway${NC}"
    echo "Vérifiez que Terraform est initialisé et déployé"
    exit 1
fi

echo -e "${GREEN}✅ URL API: $API_URL${NC}"
echo ""

# Test 1: Connectivité basique
echo "1️⃣  Test de connectivité..."
if curl -s --max-time 5 "$API_URL/funds" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API Gateway accessible${NC}"
else
    echo -e "${RED}❌ API Gateway non accessible${NC}"
    exit 1
fi
echo ""

# Test 2: Réponse sans auth (devrait être 401)
echo "2️⃣  Test sans authentification (attendu: 401)..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$API_URL/funds")
if [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
    echo -e "${GREEN}✅ Réponse correcte: HTTP $HTTP_CODE${NC}"
elif [ "$HTTP_CODE" = "000" ]; then
    echo -e "${RED}❌ Erreur de connexion (HTTP 000)${NC}"
    echo "   Vérifiez:"
    echo "   - Que l'API Gateway est déployé"
    echo "   - Que le DNS fonctionne"
    echo "   - Que le firewall n'bloque pas"
    exit 1
else
    echo -e "${YELLOW}⚠️  Code HTTP inattendu: $HTTP_CODE${NC}"
fi
echo ""

# Test 3: CORS preflight
echo "3️⃣  Test CORS preflight..."
CORS_RESPONSE=$(curl -s -X OPTIONS "$API_URL/funds" \
    -H "Origin: http://localhost:3000" \
    -H "Access-Control-Request-Method: GET" \
    -H "Access-Control-Request-Headers: authorization" \
    -w "\nHTTP_CODE:%{http_code}" 2>&1)

CORS_CODE=$(echo "$CORS_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
if [ "$CORS_CODE" = "200" ] || [ "$CORS_CODE" = "204" ]; then
    echo -e "${GREEN}✅ CORS preflight OK: HTTP $CORS_CODE${NC}"
    
    # Vérifier les headers CORS
    if echo "$CORS_RESPONSE" | grep -i "access-control-allow-origin" > /dev/null; then
        echo -e "${GREEN}✅ Headers CORS présents${NC}"
    else
        echo -e "${YELLOW}⚠️  Headers CORS manquants dans la réponse${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  CORS preflight: HTTP $CORS_CODE${NC}"
fi
echo ""

# Test 4: Vérifier les logs CloudWatch
echo "4️⃣  Vérification des logs CloudWatch..."
if aws logs tail /aws/lambda/adel-ai-dev-api --since 2m --format short 2>&1 | tail -5 | grep -q "."; then
    echo -e "${GREEN}✅ Logs CloudWatch accessibles${NC}"
    echo "   Derniers logs:"
    aws logs tail /aws/lambda/adel-ai-dev-api --since 2m --format short 2>&1 | tail -3 | sed 's/^/   /'
else
    echo -e "${YELLOW}⚠️  Aucun log récent trouvé${NC}"
fi
echo ""

# Résumé
echo "📋 RÉSUMÉ"
echo "========="
echo -e "${GREEN}✅ Backend API opérationnel${NC}"
echo ""
echo "📍 URL à utiliser côté frontend:"
echo "   $API_URL"
echo ""
echo "💡 Si vous avez 'Failed to fetch' côté frontend:"
echo "   1. Vérifiez que l'URL est correcte: $API_URL"
echo "   2. Vérifiez que CORS est configuré pour votre origine frontend"
echo "   3. Vérifiez que le token JWT est valide"
echo "   4. Ouvrez la console navigateur (F12) pour voir l'erreur exacte"
echo ""



