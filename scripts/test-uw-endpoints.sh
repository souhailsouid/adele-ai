#!/bin/bash

# Script de test pour les endpoints Unusual Whales
# Usage: ./scripts/test-uw-endpoints.sh [API_GATEWAY_URL]

# Couleurs pour l'output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Token d'accès (peut être passé via variable d'environnement)
# Usage: ACCESS_TOKEN="your_token" ./scripts/test-uw-endpoints.sh [API_GATEWAY_URL]
ACCESS_TOKEN="${ACCESS_TOKEN:-}"

# URL de l'API Gateway (par défaut ou depuis l'argument)
API_URL="${1:-https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod}"

# Vérifier que le token est fourni
if [ -z "$ACCESS_TOKEN" ]; then
  echo -e "${RED}Erreur: ACCESS_TOKEN est requis${NC}"
  echo -e "Usage: ACCESS_TOKEN=\"your_token\" ./scripts/test-uw-endpoints.sh [API_GATEWAY_URL]"
  exit 1
fi

echo -e "${YELLOW}=== Test des endpoints Unusual Whales ===${NC}"
echo -e "API URL: ${API_URL}"
echo ""

# Fonction pour tester un endpoint
test_endpoint() {
  local method=$1
  local path=$2
  local description=$3
  local expected_status=${4:-200}
  
  echo -e "${YELLOW}Testing: ${description}${NC}"
  echo -e "  ${method} ${path}"
  
  response=$(curl -s -w "\n%{http_code}" -X "${method}" \
    "${API_URL}${path}" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H "Content-Type: application/json")
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  # Vérifier que http_code est un nombre valide
  if [ -z "$http_code" ] || ! [[ "$http_code" =~ ^[0-9]+$ ]]; then
    echo -e "  ${RED}✗ Error: Invalid HTTP status code: ${http_code}${NC}"
    echo -e "  Response: ${body}"
    echo ""
    return
  fi
  
  if [ "$http_code" -eq "$expected_status" ]; then
    echo -e "  ${GREEN}✓ Status: ${http_code}${NC}"
    # Afficher un aperçu de la réponse (premières 200 caractères)
    preview=$(echo "$body" | head -c 200)
    echo -e "  Preview: ${preview}..."
  else
    echo -e "  ${RED}✗ Status: ${http_code} (expected ${expected_status})${NC}"
    echo -e "  Response: ${body}"
  fi
  echo ""
}

# ========== Legacy Routes (pour compatibilité) ==========
echo -e "${GREEN}=== Legacy Routes (Compatibilité) ===${NC}"
test_endpoint "GET" "/unusual-whales/institution-ownership/AAPL" "Institution Ownership (Legacy)"
test_endpoint "GET" "/unusual-whales/institution-activity/AAPL" "Institution Activity (Legacy)"
test_endpoint "GET" "/unusual-whales/options-flow/AAPL" "Options Flow (Legacy)"
test_endpoint "GET" "/unusual-whales/flow-alerts/AAPL?limit=10" "Flow Alerts (Legacy)"
test_endpoint "GET" "/unusual-whales/greek-flow/AAPL" "Greek Flow (Legacy)"
test_endpoint "GET" "/unusual-whales/insider-trades/AAPL?limit=10" "Insider Trades (Legacy)"
test_endpoint "GET" "/unusual-whales/option-chains/AAPL" "Option Chains (Legacy)"

# ========== Alerts ==========
echo -e "${GREEN}=== Alerts Endpoints ===${NC}"
test_endpoint "GET" "/unusual-whales/alerts?limit=10" "Alerts"
test_endpoint "GET" "/unusual-whales/alert-configurations" "Alert Configurations"

# ========== Congress ==========
echo -e "${GREEN}=== Congress Endpoints ===${NC}"
test_endpoint "GET" "/unusual-whales/congress-trader?name=John%20Doe" "Congress Trader"
test_endpoint "GET" "/unusual-whales/congress-late-reports?limit=10" "Congress Late Reports"
test_endpoint "GET" "/unusual-whales/congress-recent-trades?limit=10" "Congress Recent Trades"
test_endpoint "GET" "/unusual-whales/congress-trades/AAPL?limit=10" "Congress Trades by Ticker"

# ========== Dark Pool ==========
echo -e "${GREEN}=== Dark Pool Endpoints ===${NC}"
test_endpoint "GET" "/unusual-whales/dark-pool/recent?limit=10" "Dark Pool Recent"
test_endpoint "GET" "/unusual-whales/dark-pool/AAPL?limit=10" "Dark Pool Ticker"

# ========== Earnings ==========
echo -e "${GREEN}=== Earnings Endpoints ===${NC}"
test_endpoint "GET" "/unusual-whales/earnings/afterhours?limit=10" "Earnings Afterhours"
test_endpoint "GET" "/unusual-whales/earnings/premarket?limit=10" "Earnings Premarket"
test_endpoint "GET" "/unusual-whales/earnings/AAPL?limit=10" "Earnings Historical"

# ========== ETFs ==========
echo -e "${GREEN}=== ETFs Endpoints ===${NC}"
test_endpoint "GET" "/unusual-whales/etfs/SPY/exposure" "ETF Exposure"
test_endpoint "GET" "/unusual-whales/etfs/SPY/holdings?limit=10" "ETF Holdings"
test_endpoint "GET" "/unusual-whales/etfs/SPY/in-outflow" "ETF In-Outflow"
test_endpoint "GET" "/unusual-whales/etfs/SPY/info" "ETF Info"
test_endpoint "GET" "/unusual-whales/etfs/SPY/weights" "ETF Weights"

# ========== Group Flow ==========
echo -e "${GREEN}=== Group Flow Endpoints ===${NC}"
# Utiliser un flow_group valide (technology au lieu de call qui n'est pas valide)
test_endpoint "GET" "/unusual-whales/group-flow/technology/greek-flow" "Group Greek Flow (Technology)"
# Utiliser une date d'expiration passée ou actuelle (format YYYY-MM-DD)
test_endpoint "GET" "/unusual-whales/group-flow/technology/greek-flow/2024-12-20" "Group Greek Flow By Expiry"

# # ========== Insiders ==========
echo -e "${GREEN}=== Insiders Endpoints ===${NC}"
test_endpoint "GET" "/unusual-whales/insider/transactions?limit=10" "Insider Transactions"
test_endpoint "GET" "/unusual-whales/insider/Technology/sector-flow" "Insider Sector Flow"
test_endpoint "GET" "/unusual-whales/insider/AAPL" "Insiders by Ticker"
test_endpoint "GET" "/unusual-whales/insider/AAPL/ticker-flow" "Insider Ticker Flow"

# ========== Institutions ==========
echo -e "${GREEN}=== Institutions Endpoints ===${NC}"
test_endpoint "GET" "/unusual-whales/institution/BLACKROCK%20INC/activity?limit=10" "Institution Activity"
test_endpoint "GET" "/unusual-whales/institution/BLACKROCK%20INC/holdings?limit=10" "Institution Holdings"
test_endpoint "GET" "/unusual-whales/institution/BLACKROCK%20INC/sectors" "Institution Sector Exposure"
test_endpoint "GET" "/unusual-whales/institution/AAPL/ownership?limit=10" "Institution Ownership"
test_endpoint "GET" "/unusual-whales/institutions?limit=10" "Institutions List"
test_endpoint "GET" "/unusual-whales/institutions/latest-filings?limit=10" "Latest Filings"

# ========== Market ==========
echo -e "${GREEN}=== Market Endpoints ===${NC}"
test_endpoint "GET" "/unusual-whales/market/correlations?tickers=AAPL,SPY" "Market Correlations"
test_endpoint "GET" "/unusual-whales/market/economic-calendar?limit=10" "Economic Calendar"
test_endpoint "GET" "/unusual-whales/market/fda-calendar?limit=10" "FDA Calendar"
test_endpoint "GET" "/unusual-whales/market/insider-buy-sells" "Total Insider Buy & Sells"
test_endpoint "GET" "/unusual-whales/market/market-tide" "Market Tide"
test_endpoint "GET" "/unusual-whales/market/oi-change?limit=10" "OI Change"
test_endpoint "GET" "/unusual-whales/market/sector-etfs" "Sector ETFs"
test_endpoint "GET" "/unusual-whales/market/spike?limit=10" "SPIKE"
test_endpoint "GET" "/unusual-whales/market/top-net-impact?limit=10" "Top Net Impact"
test_endpoint "GET" "/unusual-whales/market/total-options-volume" "Total Options Volume"
test_endpoint "GET" "/unusual-whales/market/Technology/sector-tide" "Sector Tide"
test_endpoint "GET" "/unusual-whales/market/AAPL/etf-tide" "ETF Tide"
test_endpoint "GET" "/unusual-whales/net-flow/expiry?ticker=AAPL" "Net Flow Expiry"

# ========== Stock ==========
echo -e "${GREEN}=== Stock Endpoints ===${NC}"
test_endpoint "GET" "/unusual-whales/stock/Basic%20Materials/tickers" "Tickers in Sector"
# L'API accepte expirations[]=date1&expirations[]=date2 (plusieurs paramètres avec [])
# Utiliser des dates passées récentes pour avoir des données
test_endpoint "GET" "/unusual-whales/stock/AAPL/atm-chains?expirations[]=2024-12-20&expirations[]=2024-12-27" "ATM Chains"
test_endpoint "GET" "/unusual-whales/stock/AAPL/flow-alerts?limit=10" "Flow Alerts"
test_endpoint "GET" "/unusual-whales/stock/AAPL/flow-per-expiry" "Flow Per Expiry"
test_endpoint "GET" "/unusual-whales/stock/AAPL/flow-per-strike" "Flow Per Strike"
test_endpoint "GET" "/unusual-whales/stock/AAPL/flow-per-strike-intraday" "Flow Per Strike Intraday"
test_endpoint "GET" "/unusual-whales/stock/AAPL/flow-recent?limit=10" "Recent Flows"
test_endpoint "GET" "/unusual-whales/stock/AAPL/greek-exposure" "Greek Exposure"
test_endpoint "GET" "/unusual-whales/stock/AAPL/greek-exposure/expiry" "Greek Exposure By Expiry"
test_endpoint "GET" "/unusual-whales/stock/AAPL/greek-exposure/strike" "Greek Exposure By Strike"
test_endpoint "GET" "/unusual-whales/stock/AAPL/greek-exposure/strike-expiry?expiry=2024-02-02" "Greek Exposure By Strike And Expiry"
test_endpoint "GET" "/unusual-whales/stock/AAPL/greek-flow" "Greek Flow"
test_endpoint "GET" "/unusual-whales/stock/AAPL/greek-flow/2025-12-19" "Greek Flow By Expiry"
test_endpoint "GET" "/unusual-whales/stock/AAPL/greeks?expiry=2024-02-02" "Greeks"
test_endpoint "GET" "/unusual-whales/stock/AAPL/historical-risk-reversal-skew?delta=0.610546281537814&expiry=2024-02-02" "Historical Risk Reversal Skew"
test_endpoint "GET" "/unusual-whales/stock/AAPL/info" "Stock Information"
test_endpoint "GET" "/unusual-whales/stock/AAPL/insider-buy-sells" "Insider Buy & Sells"
test_endpoint "GET" "/unusual-whales/stock/AAPL/interpolated-iv" "Interpolated IV"
test_endpoint "GET" "/unusual-whales/stock/AAPL/iv-rank" "IV Rank"
test_endpoint "GET" "/unusual-whales/stock/AAPL/max-pain" "Max Pain"
test_endpoint "GET" "/unusual-whales/stock/AAPL/net-prem-ticks" "Net Premium Ticks"
test_endpoint "GET" "/unusual-whales/stock/AAPL/nope" "NOPE"
test_endpoint "GET" "/unusual-whales/stock/AAPL/ohlc/1d" "OHLC"
test_endpoint "GET" "/unusual-whales/stock/AAPL/oi-change" "OI Change"
test_endpoint "GET" "/unusual-whales/stock/AAPL/oi-per-expiry" "OI Per Expiry"
test_endpoint "GET" "/unusual-whales/stock/AAPL/oi-per-strike" "OI Per Strike"
test_endpoint "GET" "/unusual-whales/stock/AAPL/option-chains" "Option Chains"
test_endpoint "GET" "/unusual-whales/stock/AAPL/option/stock-price-levels" "Option Stock Price Levels"
test_endpoint "GET" "/unusual-whales/stock/AAPL/option/volume-oi-expiry" "Volume & OI Per Expiry"
test_endpoint "GET" "/unusual-whales/stock/AAPL/options-volume" "Options Volume"
test_endpoint "GET" "/unusual-whales/stock/AAPL/spot-exposures" "Spot GEX Exposures"
test_endpoint "GET" "/unusual-whales/stock/AAPL/spot-exposures/expiry-strike?expirations[]=2025-12-05&expirations[]=2025-12-12" "Spot GEX Exposures By Strike & Expiry"
test_endpoint "GET" "/unusual-whales/stock/AAPL/spot-exposures/strike" "Spot GEX Exposures By Strike"
test_endpoint "GET" "/unusual-whales/stock/AAPL/stock-state" "Stock State"
test_endpoint "GET" "/unusual-whales/stock/AAPL/stock-volume-price-levels" "Stock Volume Price Levels"
test_endpoint "GET" "/unusual-whales/stock/AAPL/volatility/realized" "Realized Volatility"
test_endpoint "GET" "/unusual-whales/stock/AAPL/volatility/stats" "Volatility Statistics"
test_endpoint "GET" "/unusual-whales/stock/AAPL/volatility/term-structure" "Implied Volatility Term Structure"

# ========== Shorts ==========
echo -e "${GREEN}=== Shorts Endpoints ===${NC}"
test_endpoint "GET" "/unusual-whales/shorts/AAPL/data" "Short Data"
test_endpoint "GET" "/unusual-whales/shorts/AAPL/ftds" "Failures to Deliver"
test_endpoint "GET" "/unusual-whales/shorts/AAPL/interest-float" "Short Interest and Float"
test_endpoint "GET" "/unusual-whales/shorts/AAPL/volume-and-ratio" "Short Volume and Ratio"
test_endpoint "GET" "/unusual-whales/shorts/AAPL/volumes-by-exchange" "Short Volume By Exchange"

# ========== Seasonality ==========
echo -e "${GREEN}=== Seasonality Endpoints ===${NC}"
test_endpoint "GET" "/unusual-whales/seasonality/AAPL/year-month" "Year-Month Price Change"
test_endpoint "GET" "/unusual-whales/seasonality/AAPL/monthly" "Monthly Average Return"
test_endpoint "GET" "/unusual-whales/seasonality/3/performers?limit=10" "Month Performers (March)"
test_endpoint "GET" "/unusual-whales/seasonality/market" "Market Seasonality"

# ========== Screener ==========
echo -e "${GREEN}=== Screener Endpoints ===${NC}"
test_endpoint "GET" "/unusual-whales/screener/analysts?limit=10" "Analyst Ratings"
test_endpoint "GET" "/unusual-whales/screener/option-contracts?limit=10" "Option Contracts (Hottest Chains)"
# Utiliser une date récente (l'API limite à 7 jours de trading)
test_endpoint "GET" "/unusual-whales/screener/stocks" "Stock Screener"

# ========== Option Trade ==========
echo -e "${GREEN}=== Option Trade Endpoints ===${NC}"
test_endpoint "GET" "/unusual-whales/option-trades/flow-alerts?limit=10" "Flow Alerts"
test_endpoint "GET" "/unusual-whales/option-trades/full-tape/2024-01-18" "Full Tape"

# ========== Option Contract ==========
echo -e "${GREEN}=== Option Contract Endpoints ===${NC}"
test_endpoint "GET" "/unusual-whales/option-contract/AAPL240621C00190000/flow?limit=10" "Option Contract Flow"
test_endpoint "GET" "/unusual-whales/option-contract/AAPL240621C00190000/historic?limit=10" "Option Contract Historic"
test_endpoint "GET" "/unusual-whales/option-contract/AAPL240621C00190000/intraday" "Option Contract Intraday"
test_endpoint "GET" "/unusual-whales/option-contract/AAPL240621C00190000/volume-profile" "Option Contract Volume Profile"
test_endpoint "GET" "/unusual-whales/stock/AAPL/expiry-breakdown" "Expiry Breakdown"
test_endpoint "GET" "/unusual-whales/stock/AAPL/option-contracts?limit=10" "Stock Option Contracts"

# ========== News ==========
echo -e "${GREEN}=== News Endpoints ===${NC}"
test_endpoint "GET" "/unusual-whales/news/headlines?limit=10" "News Headlines"

# Compteur de résultats
TOTAL_TESTS=$(grep -c "test_endpoint" "$0")
echo -e "${GREEN}=== Tests terminés ===${NC}"
echo -e "${YELLOW}Total des endpoints testés: ${TOTAL_TESTS}${NC}"
echo ""
echo -e "${BLUE}=== Documentation des Routes ===${NC}"
echo ""
echo "Ce script teste les endpoints suivants :"
echo ""
echo "## Routes Unusual Whales"
echo ""
echo "### Legacy Routes (7)"
echo "- GET /unusual-whales/institution-ownership/{ticker}"
echo "- GET /unusual-whales/institution-activity/{ticker}"
echo "- GET /unusual-whales/options-flow/{ticker}"
echo "- GET /unusual-whales/flow-alerts/{ticker}"
echo "- GET /unusual-whales/greek-flow/{ticker}"
echo "- GET /unusual-whales/insider-trades/{ticker}"
echo "- GET /unusual-whales/option-chains/{ticker}"
echo ""
echo "### Alerts (2)"
echo "- GET /unusual-whales/alerts"
echo "- GET /unusual-whales/alert-configurations"
echo ""
echo "### Congress (4)"
echo "- GET /unusual-whales/congress-trader"
echo "- GET /unusual-whales/congress-late-reports"
echo "- GET /unusual-whales/congress-recent-trades"
echo "- GET /unusual-whales/congress-trades/{ticker}"
echo ""
echo "### Dark Pool (2)"
echo "- GET /unusual-whales/dark-pool/recent"
echo "- GET /unusual-whales/dark-pool/{ticker}"
echo ""
echo "### Earnings (3)"
echo "- GET /unusual-whales/earnings/afterhours"
echo "- GET /unusual-whales/earnings/premarket"
echo "- GET /unusual-whales/earnings/{ticker}"
echo ""
echo "### ETFs (5)"
echo "- GET /unusual-whales/etfs/{ticker}/exposure"
echo "- GET /unusual-whales/etfs/{ticker}/holdings"
echo "- GET /unusual-whales/etfs/{ticker}/in-outflow"
echo "- GET /unusual-whales/etfs/{ticker}/info"
echo "- GET /unusual-whales/etfs/{ticker}/weights"
echo ""
echo "### Group Flow (2)"
echo "- GET /unusual-whales/group-flow/{flow_group}/greek-flow"
echo "- GET /unusual-whales/group-flow/{flow_group}/greek-flow/{expiry}"
echo ""
echo "### Insiders (4)"
echo "- GET /unusual-whales/insider/transactions"
echo "- GET /unusual-whales/insider/{sector}/sector-flow"
echo "- GET /unusual-whales/insider/{ticker}"
echo "- GET /unusual-whales/insider/{ticker}/ticker-flow"
echo ""
echo "### Institutions (6)"
echo "- GET /unusual-whales/institution/{name}/activity"
echo "- GET /unusual-whales/institution/{name}/holdings"
echo "- GET /unusual-whales/institution/{name}/sectors"
echo "- GET /unusual-whales/institution/{ticker}/ownership"
echo "- GET /unusual-whales/institutions"
echo "- GET /unusual-whales/institutions/latest-filings"
echo ""
echo "### Market (13)"
echo "- GET /unusual-whales/market/correlations"
echo "- GET /unusual-whales/market/economic-calendar"
echo "- GET /unusual-whales/market/fda-calendar"
echo "- GET /unusual-whales/market/insider-buy-sells"
echo "- GET /unusual-whales/market/market-tide"
echo "- GET /unusual-whales/market/oi-change"
echo "- GET /unusual-whales/market/sector-etfs"
echo "- GET /unusual-whales/market/spike"
echo "- GET /unusual-whales/market/top-net-impact"
echo "- GET /unusual-whales/market/total-options-volume"
echo "- GET /unusual-whales/market/{sector}/sector-tide"
echo "- GET /unusual-whales/market/{ticker}/etf-tide"
echo "- GET /unusual-whales/net-flow/expiry"
echo ""
echo "### Stock (40)"
echo "- GET /unusual-whales/stock/{sector}/tickers"
echo "- GET /unusual-whales/stock/{ticker}/atm-chains"
echo "- GET /unusual-whales/stock/{ticker}/flow-alerts"
echo "- GET /unusual-whales/stock/{ticker}/flow-per-expiry"
echo "- GET /unusual-whales/stock/{ticker}/flow-per-strike"
echo "- GET /unusual-whales/stock/{ticker}/flow-per-strike-intraday"
echo "- GET /unusual-whales/stock/{ticker}/flow-recent"
echo "- GET /unusual-whales/stock/{ticker}/greek-exposure"
echo "- GET /unusual-whales/stock/{ticker}/greek-exposure/expiry"
echo "- GET /unusual-whales/stock/{ticker}/greek-exposure/strike"
echo "- GET /unusual-whales/stock/{ticker}/greek-exposure/strike-expiry"
echo "- GET /unusual-whales/stock/{ticker}/greek-flow"
echo "- GET /unusual-whales/stock/{ticker}/greek-flow/{expiry}"
echo "- GET /unusual-whales/stock/{ticker}/greeks"
echo "- GET /unusual-whales/stock/{ticker}/historical-risk-reversal-skew"
echo "- GET /unusual-whales/stock/{ticker}/info"
echo "- GET /unusual-whales/stock/{ticker}/insider-buy-sells"
echo "- GET /unusual-whales/stock/{ticker}/interpolated-iv"
echo "- GET /unusual-whales/stock/{ticker}/iv-rank"
echo "- GET /unusual-whales/stock/{ticker}/max-pain"
echo "- GET /unusual-whales/stock/{ticker}/net-prem-ticks"
echo "- GET /unusual-whales/stock/{ticker}/nope"
echo "- GET /unusual-whales/stock/{ticker}/ohlc/{candle_size}"
echo "- GET /unusual-whales/stock/{ticker}/oi-change"
echo "- GET /unusual-whales/stock/{ticker}/oi-per-expiry"
echo "- GET /unusual-whales/stock/{ticker}/oi-per-strike"
echo "- GET /unusual-whales/stock/{ticker}/option-chains"
echo "- GET /unusual-whales/stock/{ticker}/option/stock-price-levels"
echo "- GET /unusual-whales/stock/{ticker}/option/volume-oi-expiry"
echo "- GET /unusual-whales/stock/{ticker}/options-volume"
echo "- GET /unusual-whales/stock/{ticker}/spot-exposures"
echo "- GET /unusual-whales/stock/{ticker}/spot-exposures/expiry-strike"
echo "- GET /unusual-whales/stock/{ticker}/spot-exposures/strike"
echo "- GET /unusual-whales/stock/{ticker}/stock-state"
echo "- GET /unusual-whales/stock/{ticker}/stock-volume-price-levels"
echo "- GET /unusual-whales/stock/{ticker}/volatility/realized"
echo "- GET /unusual-whales/stock/{ticker}/volatility/stats"
echo "- GET /unusual-whales/stock/{ticker}/volatility/term-structure"
echo ""
echo "### Shorts (5)"
echo "- GET /unusual-whales/shorts/{ticker}/data"
echo "- GET /unusual-whales/shorts/{ticker}/ftds"
echo "- GET /unusual-whales/shorts/{ticker}/interest-float"
echo "- GET /unusual-whales/shorts/{ticker}/volume-and-ratio"
echo "- GET /unusual-whales/shorts/{ticker}/volumes-by-exchange"
echo ""
echo "### Seasonality (4)"
echo "- GET /unusual-whales/seasonality/{ticker}/year-month"
echo "- GET /unusual-whales/seasonality/{ticker}/monthly"
echo "- GET /unusual-whales/seasonality/{month}/performers"
echo "- GET /unusual-whales/seasonality/market"
echo ""
echo "### Screener (3)"
echo "- GET /unusual-whales/screener/analysts"
echo "- GET /unusual-whales/screener/option-contracts"
echo "- GET /unusual-whales/screener/stocks"
echo ""
echo "### Option Trade (2)"
echo "- GET /unusual-whales/option-trades/flow-alerts"
echo "- GET /unusual-whales/option-trades/full-tape/{date}"
echo ""
echo "### Option Contract (6)"
echo "- GET /unusual-whales/option-contract/{id}/flow"
echo "- GET /unusual-whales/option-contract/{id}/historic"
echo "- GET /unusual-whales/option-contract/{id}/intraday"
echo "- GET /unusual-whales/option-contract/{id}/volume-profile"
echo "- GET /unusual-whales/stock/{ticker}/expiry-breakdown"
echo "- GET /unusual-whales/stock/{ticker}/option-contracts"
echo ""
echo "### News (1)"
echo "- GET /unusual-whales/news/headlines"
echo ""
echo "## Routes FMP"
echo ""
echo "Note: Les routes FMP ne sont pas encore testées dans ce script."
echo ""
echo "Total: ${TOTAL_TESTS} endpoints testés"

