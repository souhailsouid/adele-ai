#!/bin/bash

# Script pour lancer le serveur local avec les variables d'environnement

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Démarrage du serveur local...${NC}"
echo ""

# Charger les variables d'environnement
export SUPABASE_URL="${SUPABASE_URL:-https://nmynjtrppwhiwlxfdzdh.supabase.co}"
export SUPABASE_SERVICE_KEY="${SUPABASE_SERVICE_KEY:-sb_secret_025ZPExdwYIENsABogIRsw_jDhFPTo6}"
export COGNITO_ISSUER="${COGNITO_ISSUER:-https://cognito-idp.eu-west-3.amazonaws.com/eu-west-3_FQDmhxV14}"
export COGNITO_AUDIENCE="${COGNITO_AUDIENCE:-pkp4i82jnttthj2cbiltudgva}"
export UNUSUAL_WHALES_API_KEY="${UNUSUAL_WHALES_API_KEY:-925866f5-e97f-459d-850d-5d5856fef716}"
export FMP_API_KEY="${FMP_API_KEY:-SEZmUVb6Q54FfrThfe3rzyKeG3vmXPQ5}"

echo -e "${GREEN}✅ Variables d'environnement chargées${NC}"
echo ""

# Aller dans le dossier services/api
cd "$(dirname "$0")/../services/api"

# Lancer le serveur
echo -e "${BLUE}📡 Lancement du serveur sur http://localhost:3001${NC}"
echo ""

npm run dev

