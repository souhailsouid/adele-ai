#!/bin/bash

# Script pour vérifier les logs API Gateway et Lambda
# Usage: ./scripts/check-api-gateway-logs.sh [minutes]

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

MINUTES="${1:-5}"  # Par défaut, 5 dernières minutes
PROJECT="${PROJECT:-adel-ai}"
STAGE="${STAGE:-dev}"

echo -e "${BLUE}🔍 Vérification des logs API Gateway et Lambda${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Logs API Gateway
echo -e "${YELLOW}📡 Logs API Gateway (${MINUTES} dernières minutes)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

aws logs tail "/aws/apigw/${PROJECT}-${STAGE}" \
  --since "${MINUTES}m" \
  --format short \
  --follow false 2>&1 | head -50 || echo -e "${RED}❌ Aucun log API Gateway trouvé${NC}"

echo ""
echo ""

# Logs Lambda
echo -e "${YELLOW}⚡ Logs Lambda (${MINUTES} dernières minutes)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

aws logs tail "/aws/lambda/${PROJECT}-${STAGE}-api" \
  --since "${MINUTES}m" \
  --format short \
  --follow false 2>&1 | head -100 || echo -e "${RED}❌ Aucun log Lambda trouvé${NC}"

echo ""
echo -e "${GREEN}✅ Vérification terminée${NC}"
echo ""
echo -e "${BLUE}💡 Pour suivre en temps réel:${NC}"
echo -e "   aws logs tail /aws/lambda/${PROJECT}-${STAGE}-api --follow"

