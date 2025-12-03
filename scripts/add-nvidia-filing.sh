#!/bin/bash
# Script pour ajouter le filing NVIDIA et déclencher le parser

set -e

FILING_URL="https://www.sec.gov/ix?doc=/Archives/edgar/data/0001045810/000104581025000230/nvda-20251026.htm"
CIK="0001045810"
ACCESSION_NUMBER="0001045810-25-000230"
COMPANY_ID=1
FORM_TYPE="8-K"
FILING_DATE="2025-10-26"

# Charger les variables d'environnement depuis Terraform
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$ROOT_DIR/infra/terraform"
SUPABASE_URL=$(terraform output -raw supabase_url 2>/dev/null || echo "")
SUPABASE_KEY="${SUPABASE_SERVICE_KEY:-}"  # À définir dans l'environnement

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
  echo "❌ Variables d'environnement manquantes"
  echo "   Définissez SUPABASE_SERVICE_KEY dans votre environnement"
  exit 1
fi

echo "🔍 Ajout du filing NVIDIA..."
echo "URL: $FILING_URL"
echo "Accession Number: $ACCESSION_NUMBER"
echo ""

# 1. Vérifier si le filing existe déjà
echo "📋 Vérification du filing dans la base..."
EXISTING=$(curl -s -X GET \
  "$SUPABASE_URL/rest/v1/company_filings?accession_number=eq.$ACCESSION_NUMBER&select=id" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" | jq -r '.[0].id // empty')

if [ -n "$EXISTING" ]; then
  echo "✅ Filing existe déjà (ID: $EXISTING)"
  FILING_ID=$EXISTING
  # Supprimer les événements existants (si 8-K)
  if [ "$FORM_TYPE" = "8-K" ]; then
    echo "🗑️  Suppression des événements existants..."
    DELETED=$(curl -s -X DELETE \
      "$SUPABASE_URL/rest/v1/company_events?filing_id=eq.$FILING_ID" \
      -H "apikey: $SUPABASE_KEY" \
      -H "Authorization: Bearer $SUPABASE_KEY" \
      -H "Prefer: return=representation" | jq 'length')
    echo "   ✅ $DELETED événement(s) supprimé(s)"
  fi
  # Remettre le statut à DISCOVERED pour reparser
  echo "🔄 Remise du statut à DISCOVERED..."
  curl -s -X PATCH \
    "$SUPABASE_URL/rest/v1/company_filings?id=eq.$FILING_ID" \
    -H "apikey: $SUPABASE_KEY" \
    -H "Authorization: Bearer $SUPABASE_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"status\": \"DISCOVERED\"}" > /dev/null
  echo "✅ Statut remis à DISCOVERED"
else
  # 2. Ajouter le filing
  echo "➕ Ajout du filing..."
  FILING_RESPONSE=$(curl -s -X POST \
    "$SUPABASE_URL/rest/v1/company_filings" \
    -H "apikey: $SUPABASE_KEY" \
    -H "Authorization: Bearer $SUPABASE_KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" \
    -d "{
      \"company_id\": $COMPANY_ID,
      \"cik\": \"$CIK\",
      \"form_type\": \"$FORM_TYPE\",
      \"accession_number\": \"$ACCESSION_NUMBER\",
      \"filing_date\": \"$FILING_DATE\",
      \"document_url\": \"$FILING_URL\",
      \"status\": \"DISCOVERED\"
    }")
  
  FILING_ID=$(echo "$FILING_RESPONSE" | jq -r '.[0].id // .id // empty')
  
  if [ -z "$FILING_ID" ]; then
    echo "❌ Erreur lors de l'ajout du filing:"
    echo "$FILING_RESPONSE" | jq '.'
    exit 1
  fi
  
  echo "✅ Filing ajouté (ID: $FILING_ID)"
fi

echo ""

# 3. Vérifier si le parser Lambda existe
PARSER_ARN=$(aws lambda get-function \
  --function-name adel-ai-dev-parser-company-filing \
  --query 'Configuration.FunctionArn' \
  --output text 2>/dev/null || echo "")

if [ -z "$PARSER_ARN" ]; then
  echo "❌ Lambda parser non trouvée. Déployez d'abord avec:"
  echo "   cd infra/terraform && terraform apply"
  exit 1
fi

echo "✅ Parser Lambda trouvée"
echo ""

# 4. Déclencher le parser
EVENT=$(cat <<EOF
{
  "detail": {
    "filing_id": $FILING_ID,
    "company_id": $COMPANY_ID,
    "cik": "$CIK",
    "form_type": "$FORM_TYPE",
    "accession_number": "$ACCESSION_NUMBER",
    "document_url": "$FILING_URL",
    "filing_url": "$FILING_URL"
  }
}
EOF
)

echo "📤 Invocation de la Lambda parser..."
aws lambda invoke \
  --function-name adel-ai-dev-parser-company-filing \
  --payload "$(echo $EVENT | jq -c .)" \
  --cli-binary-format raw-in-base64-out \
  /tmp/parser-response.json

echo ""
echo "✅ Réponse du parser:"
cat /tmp/parser-response.json | jq '.'

echo ""
echo "📊 Vérifiez les événements extraits dans Supabase:"
echo "   SELECT * FROM company_events WHERE company_id = $COMPANY_ID ORDER BY created_at DESC LIMIT 5;"

