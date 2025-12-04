#!/bin/bash

# Script de test pour les endpoints FMP (Financial Modeling Prep)
# Usage: 
#   ./scripts/test-fmp-endpoints.sh [API_GATEWAY_URL] [ACCESS_TOKEN]
#   ou: ACCESS_TOKEN="your_token" ./scripts/test-fmp-endpoints.sh [API_GATEWAY_URL]
#
# Note: La clé API FMP est configurée côté backend dans Lambda via les variables d'environnement.
#       Le script teste les endpoints via l'API Gateway.

# Couleurs pour l'output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Token d'accès (peut être passé via variable d'environnement ou argument)
# Usage: ACCESS_TOKEN="your_token" ./scripts/test-fmp-endpoints.sh [API_GATEWAY_URL]
ACCESS_TOKEN="${ACCESS_TOKEN:-}"

# URL de l'API Gateway (par défaut ou depuis l'argument)
API_URL="${1:-https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod}"

# Vérifier que le token est fourni
if [ -z "$ACCESS_TOKEN" ]; then
  echo -e "${RED}Erreur: ACCESS_TOKEN est requis${NC}"
  echo -e "Usage: ACCESS_TOKEN=\"your_token\" ./scripts/test-fmp-endpoints.sh [API_GATEWAY_URL]"
  exit 1
fi

echo -e "${YELLOW}=== Test des endpoints FMP (Financial Modeling Prep) ===${NC}"
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

  if [[ -z "$http_code" || ! "$http_code" =~ ^[0-9]+$ ]]; then
    echo -e "  ${RED}✗ Error: Invalid HTTP status code: ${http_code}${NC}"
    echo -e "  Response: ${body}"
  elif [ "$http_code" -eq "$expected_status" ]; then
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

# ========== Quote & Market Data ==========
echo -e "${GREEN}=== Quote & Market Data ===${NC}"
test_endpoint "GET" "/fmp/quote/AAPL" "Quote"
test_endpoint "GET" "/fmp/quote/AAPL?force_refresh=true" "Quote (Force Refresh)"


# ========== Financial Statements ==========
echo -e "${GREEN}=== Financial Statements ===${NC}"
# Income Statement
test_endpoint "GET" "/fmp/income-statement/AAPL" "Income Statement (Annual)"
test_endpoint "GET" "/fmp/income-statement/AAPL?period=quarter" "Income Statement (Quarter)"
test_endpoint "GET" "/fmp/income-statement/AAPL?limit=10" "Income Statement (Limit 10)"

# Balance Sheet Statement
test_endpoint "GET" "/fmp/balance-sheet-statement/AAPL" "Balance Sheet Statement (Annual)"
test_endpoint "GET" "/fmp/balance-sheet-statement/AAPL?period=quarter" "Balance Sheet Statement (Quarter)"
test_endpoint "GET" "/fmp/balance-sheet-statement/AAPL?limit=10" "Balance Sheet Statement (Limit 10)"

# Cash Flow Statement
test_endpoint "GET" "/fmp/cash-flow-statement/AAPL" "Cash Flow Statement (Annual)"
test_endpoint "GET" "/fmp/cash-flow-statement/AAPL?period=quarter" "Cash Flow Statement (Quarter)"
test_endpoint "GET" "/fmp/cash-flow-statement/AAPL?limit=10" "Cash Flow Statement (Limit 10)"



# ========== Financial Metrics ==========
echo -e "${GREEN}=== Financial Metrics ===${NC}"
# Key Metrics
test_endpoint "GET" "/fmp/key-metrics/AAPL" "Key Metrics (Annual)"
test_endpoint "GET" "/fmp/key-metrics/AAPL?period=annual" "Key Metrics (Quarter)"
test_endpoint "GET" "/fmp/key-metrics/AAPL?limit=10" "Key Metrics (Limit 10)"
# Key Metrics TTM
test_endpoint "GET" "/fmp/key-metrics-ttm/AAPL" "Key Metrics TTM"
# Financial Ratios
test_endpoint "GET" "/fmp/financial-ratios/AAPL" "Financial Ratios (Annual)"
test_endpoint "GET" "/fmp/financial-ratios/AAPL?period=annual" "Financial Ratios (Quarter)"
test_endpoint "GET" "/fmp/financial-ratios/AAPL?limit=10" "Financial Ratios (Limit 10)"

# ========== Financial Scores & Growth ==========
echo -e "${GREEN}=== Financial Scores & Growth ===${NC}"
# Financial Scores
test_endpoint "GET" "/fmp/financial-scores/AAPL" "Financial Scores"
# Owner Earnings
test_endpoint "GET" "/fmp/owner-earnings/AAPL" "Owner Earnings"
test_endpoint "GET" "/fmp/owner-earnings/AAPL?limit=5" "Owner Earnings (Limit 5)"
# Enterprise Values
test_endpoint "GET" "/fmp/enterprise-values/AAPL" "Enterprise Values"
test_endpoint "GET" "/fmp/enterprise-values/AAPL?period=annual" "Enterprise Values (Annual)"
test_endpoint "GET" "/fmp/enterprise-values/AAPL?limit=10" "Enterprise Values (Limit 10)"
# Income Statement Growth
test_endpoint "GET" "/fmp/income-statement-growth/AAPL" "Income Statement Growth"
test_endpoint "GET" "/fmp/income-statement-growth/AAPL?period=annual" "Income Statement Growth (Annual)"
test_endpoint "GET" "/fmp/income-statement-growth/AAPL?limit=10" "Income Statement Growth (Limit 10)"
# Balance Sheet Statement Growth
test_endpoint "GET" "/fmp/balance-sheet-statement-growth/AAPL" "Balance Sheet Statement Growth"
test_endpoint "GET" "/fmp/balance-sheet-statement-growth/AAPL?period=annual" "Balance Sheet Statement Growth (Annual)"
test_endpoint "GET" "/fmp/balance-sheet-statement-growth/AAPL?limit=10" "Balance Sheet Statement Growth (Limit 10)"
# Cashflow Statement Growth
test_endpoint "GET" "/fmp/cash-flow-statement-growth/AAPL" "Cashflow Statement Growth"
test_endpoint "GET" "/fmp/cash-flow-statement-growth/AAPL?period=annual" "Cashflow Statement Growth (Annual)"
test_endpoint "GET" "/fmp/cash-flow-statement-growth/AAPL?limit=10" "Cashflow Statement Growth (Limit 10)"
# Financial Statement Growth
test_endpoint "GET" "/fmp/financial-growth/AAPL" "Financial Statement Growth"
test_endpoint "GET" "/fmp/financial-growth/AAPL?period=annual" "Financial Statement Growth (Annual)"
test_endpoint "GET" "/fmp/financial-growth/AAPL?limit=10" "Financial Statement Growth (Limit 10)"

# ========== Financial Reports ==========
echo -e "${GREEN}=== Financial Reports ===${NC}"
# Financial Reports Dates
test_endpoint "GET" "/fmp/financial-reports-dates/AAPL" "Financial Reports Dates"
# Financial Reports Form 10-K JSON
test_endpoint "GET" "/fmp/financial-reports-json/AAPL?year=2022&period=FY" "Financial Reports JSON (2022 FY)"
test_endpoint "GET" "/fmp/financial-reports-json/AAPL?year=2023&period=Q1" "Financial Reports JSON (2023 Q1)"
# Financial Reports Form 10-K XLSX
test_endpoint "GET" "/fmp/financial-reports-xlsx/AAPL?year=2022&period=FY" "Financial Reports XLSX (2022 FY)"
test_endpoint "GET" "/fmp/financial-reports-xlsx/AAPL?year=2023&period=Q1" "Financial Reports XLSX (2023 Q1)"

# ========== Revenue Segmentation ==========
echo -e "${GREEN}=== Revenue Segmentation ===${NC}"
# Revenue Product Segmentation
test_endpoint "GET" "/fmp/revenue-product-segmentation/AAPL" "Revenue Product Segmentation"
test_endpoint "GET" "/fmp/revenue-product-segmentation/AAPL?period=annual" "Revenue Product Segmentation (Annual)"
test_endpoint "GET" "/fmp/revenue-product-segmentation/AAPL?structure=flat" "Revenue Product Segmentation (Flat)"
# Revenue Geographic Segments
test_endpoint "GET" "/fmp/revenue-geographic-segmentation/AAPL" "Revenue Geographic Segments"
test_endpoint "GET" "/fmp/revenue-geographic-segmentation/AAPL?period=annual" "Revenue Geographic Segments (Annual)"
test_endpoint "GET" "/fmp/revenue-geographic-segmentation/AAPL?structure=flat" "Revenue Geographic Segments (Flat)"

# ========== As Reported Financial Statements ==========
echo -e "${GREEN}=== As Reported Financial Statements ===${NC}"
# As Reported Income Statements
test_endpoint "GET" "/fmp/income-statement-as-reported/AAPL" "As Reported Income Statements"
test_endpoint "GET" "/fmp/income-statement-as-reported/AAPL?period=annual" "As Reported Income Statements (Annual)"
test_endpoint "GET" "/fmp/income-statement-as-reported/AAPL?limit=10" "As Reported Income Statements (Limit 10)"
# As Reported Balance Statements
test_endpoint "GET" "/fmp/balance-sheet-statement-as-reported/AAPL" "As Reported Balance Statements"
test_endpoint "GET" "/fmp/balance-sheet-statement-as-reported/AAPL?period=annual" "As Reported Balance Statements (Annual)"
test_endpoint "GET" "/fmp/balance-sheet-statement-as-reported/AAPL?limit=10" "As Reported Balance Statements (Limit 10)"
# As Reported Cashflow Statements
test_endpoint "GET" "/fmp/cash-flow-statement-as-reported/AAPL" "As Reported Cashflow Statements"
test_endpoint "GET" "/fmp/cash-flow-statement-as-reported/AAPL?period=annual" "As Reported Cashflow Statements (Annual)"
test_endpoint "GET" "/fmp/cash-flow-statement-as-reported/AAPL?limit=10" "As Reported Cashflow Statements (Limit 10)"
# As Reported Financial Statements
test_endpoint "GET" "/fmp/financial-statement-full-as-reported/AAPL" "As Reported Financial Statements"
test_endpoint "GET" "/fmp/financial-statement-full-as-reported/AAPL?period=annual" "As Reported Financial Statements (Annual)"
test_endpoint "GET" "/fmp/financial-statement-full-as-reported/AAPL?limit=10" "As Reported Financial Statements (Limit 10)"




# ========== SEC Filings ==========
echo -e "${GREEN}=== SEC Filings ===${NC}"
# Latest 8-K SEC Filings
test_endpoint "GET" "/fmp/sec-filings/8k?from=2024-01-01&to=2024-03-01&page=0&limit=100" "Latest 8-K SEC Filings"
# Latest SEC Filings (Financials)
test_endpoint "GET" "/fmp/sec-filings/latest?from=2024-01-01&to=2024-03-01&page=0&limit=100" "Latest SEC Filings (Financials)"
# SEC Filings By Form Type
test_endpoint "GET" "/fmp/sec-filings/form-type?formType=8-K&from=2024-01-01&to=2024-03-01&page=0&limit=100" "SEC Filings By Form Type (8-K)"
test_endpoint "GET" "/fmp/sec-filings/form-type?formType=10-K&from=2024-01-01&to=2024-03-01&page=0&limit=100" "SEC Filings By Form Type (10-K)"
# SEC Filings By Symbol
test_endpoint "GET" "/fmp/sec-filings/symbol/AAPL?from=2024-01-01&to=2024-03-01&page=0&limit=100" "SEC Filings By Symbol (AAPL)"
# SEC Filings By CIK
test_endpoint "GET" "/fmp/sec-filings/cik/0000320193?from=2024-01-01&to=2024-03-01&page=0&limit=100" "SEC Filings By CIK"
# SEC Filings Company Search By Name
test_endpoint "GET" "/fmp/sec-filings/company-search/name?company=Berkshire" "SEC Company Search By Name"
# SEC Filings Company Search By Symbol
test_endpoint "GET" "/fmp/sec-filings/company-search/symbol/AAPL" "SEC Company Search By Symbol"
# SEC Filings Company Search By CIK
test_endpoint "GET" "/fmp/sec-filings/company-search/cik/0000320193" "SEC Company Search By CIK"
# SEC Company Full Profile
test_endpoint "GET" "/fmp/sec-filings/profile/AAPL" "SEC Company Full Profile"
test_endpoint "GET" "/fmp/sec-filings/profile/AAPL?cik=320193" "SEC Company Full Profile (with CIK)"
# Industry Classification List
test_endpoint "GET" "/fmp/industry-classification/list" "Industry Classification List"
test_endpoint "GET" "/fmp/industry-classification/list?industryTitle=SERVICES" "Industry Classification List (Filtered)"
# Industry Classification Search
test_endpoint "GET" "/fmp/industry-classification/search?symbol=AAPL" "Industry Classification Search (Symbol)"
test_endpoint "GET" "/fmp/industry-classification/search?cik=320193" "Industry Classification Search (CIK)"
# All Industry Classification
test_endpoint "GET" "/fmp/industry-classification/all?page=0&limit=100" "All Industry Classification"

# ========== Company Search ==========
echo -e "${GREEN}=== Company Search ===${NC}"
test_endpoint "GET" "/fmp/search-symbol?query=AAPL" "Search Symbol"
test_endpoint "GET" "/fmp/search-symbol?query=AAPL&limit=5" "Search Symbol (Limit 5)"
test_endpoint "GET" "/fmp/search-symbol?query=AAPL&exchange=NASDAQ" "Search Symbol (Exchange)"
test_endpoint "GET" "/fmp/search-name?query=Apple" "Search Name"
test_endpoint "GET" "/fmp/search-name?query=Apple&limit=10" "Search Name (Limit 10)"
test_endpoint "GET" "/fmp/search-cik?cik=320193" "Search CIK"
test_endpoint "GET" "/fmp/search-cik?cik=320193&limit=5" "Search CIK (Limit 5)"
test_endpoint "GET" "/fmp/search-cusip?cusip=037833100" "Search CUSIP"
test_endpoint "GET" "/fmp/search-isin?isin=US0378331005" "Search ISIN"
# test_endpoint "GET" "/fmp/company-screener?sector=Technology&limit=10" "Company Screener"
test_endpoint "GET" "/fmp/company-screener?marketCapMoreThan=1000000000&sector=Technology" "Company Screener (Market Cap)"
test_endpoint "GET" "/fmp/company-screener?priceMoreThan=100&priceLowerThan=200" "Company Screener (Price Range)"
test_endpoint "GET" "/fmp/search-exchange-variants?symbol=AAPL" "Search Exchange Variants"

# ========== Market Hours ==========
echo -e "${GREEN}=== Market Hours ===${NC}"
# Exchange Market Hours
test_endpoint "GET" "/fmp/exchange-market-hours?exchange=NASDAQ" "Exchange Market Hours (NASDAQ)"
test_endpoint "GET" "/fmp/exchange-market-hours?exchange=NYSE" "Exchange Market Hours (NYSE)"
# Holidays By Exchange
test_endpoint "GET" "/fmp/holidays-by-exchange?exchange=NASDAQ" "Holidays By Exchange (NASDAQ)"
test_endpoint "GET" "/fmp/holidays-by-exchange?exchange=NYSE" "Holidays By Exchange (NYSE)"
# All Exchange Market Hours
test_endpoint "GET" "/fmp/all-exchange-market-hours" "All Exchange Market Hours"

# ========== Commodity ==========
echo -e "${GREEN}=== Commodity ===${NC}"
# Commodities List
test_endpoint "GET" "/fmp/commodities-list" "Commodities List"
# Commodities Quote
test_endpoint "GET" "/fmp/commodities-quote?symbol=GCUSD" "Commodities Quote (Gold)"
# Commodities Quote Short
test_endpoint "GET" "/fmp/commodities-quote-short?symbol=GCUSD" "Commodities Quote Short (Gold)"

# Light Chart
test_endpoint "GET" "/fmp/commodities/light-chart/GCUSD" "Light Chart (Gold)"
test_endpoint "GET" "/fmp/commodities/light-chart/GCUSD?from=2025-07-20&to=2025-10-20" "Light Chart (Gold with dates)"
# Full Chart
test_endpoint "GET" "/fmp/commodities/full-chart/GCUSD" "Full Chart (Gold)"
test_endpoint "GET" "/fmp/commodities/full-chart/GCUSD?from=2025-07-20&to=2025-10-20" "Full Chart (Gold with dates)"


# 5-Minute Interval Chart
test_endpoint "GET" "/fmp/commodities/chart/5min/GCUSD?from=2024-01-01&to=2024-03-01" "5-Minute Chart (Gold)"

# 1-Hour Interval Chart
test_endpoint "GET" "/fmp/commodities/chart/1hour/GCUSD?from=2024-01-01&to=2024-03-01" "1-Hour Chart (Gold)"


# ========== DCF (Discounted Cash Flow) ==========
echo -e "${GREEN}=== DCF (Discounted Cash Flow) ===${NC}"
# DCF Valuation
test_endpoint "GET" "/fmp/dcf/AAPL" "DCF Valuation"
# Levered DCF
test_endpoint "GET" "/fmp/dcf/levered/AAPL" "Levered DCF"
# Custom DCF Advanced (avec quelques paramètres optionnels)
test_endpoint "GET" "/fmp/dcf/custom/AAPL" "Custom DCF Advanced (Default)"
test_endpoint "GET" "/fmp/dcf/custom/AAPL?revenueGrowthPct=0.1&taxRate=0.15&beta=1.2" "Custom DCF Advanced (With Params)"
# Custom DCF Levered
test_endpoint "GET" "/fmp/dcf/custom-levered/AAPL" "Custom DCF Levered (Default)"
test_endpoint "GET" "/fmp/dcf/custom-levered/AAPL?revenueGrowthPct=0.1&taxRate=0.15&beta=1.2" "Custom DCF Levered (With Params)"

# ========== Crypto ==========
echo -e "${GREEN}=== Crypto ===${NC}"
# Cryptocurrency List
test_endpoint "GET" "/fmp/crypto/list" "Cryptocurrency List"
# Cryptocurrency Quote
test_endpoint "GET" "/fmp/crypto/quote?symbol=BTCUSD" "Cryptocurrency Quote (Bitcoin)"
test_endpoint "GET" "/fmp/crypto/quote?symbol=ETHUSD" "Cryptocurrency Quote (Ethereum)"
# Cryptocurrency Quote Short
test_endpoint "GET" "/fmp/crypto/quote-short?symbol=BTCUSD" "Cryptocurrency Quote Short (Bitcoin)"
test_endpoint "GET" "/fmp/crypto/quote-short?symbol=ETHUSD" "Cryptocurrency Quote Short (Ethereum)"

# Light Chart
test_endpoint "GET" "/fmp/crypto/light-chart/BTCUSD" "Light Chart (Bitcoin)"
test_endpoint "GET" "/fmp/crypto/light-chart/BTCUSD?from=2024-01-01&to=2024-03-01" "Light Chart (Bitcoin with dates)"
# Full Chart
test_endpoint "GET" "/fmp/crypto/full-chart/BTCUSD" "Full Chart (Bitcoin)"
test_endpoint "GET" "/fmp/crypto/full-chart/BTCUSD?from=2024-01-01&to=2024-03-01" "Full Chart (Bitcoin with dates)"
# 5-Minute Interval Chart
test_endpoint "GET" "/fmp/crypto/chart/5min/BTCUSD?from=2024-01-01&to=2024-03-01" "5-Minute Chart (Bitcoin)"
test_endpoint "GET" "/fmp/crypto/chart/5min/ETHUSD?from=2024-01-01&to=2024-03-01" "5-Minute Chart (Ethereum)"
# 1-Hour Interval Chart
test_endpoint "GET" "/fmp/crypto/chart/1hour/BTCUSD?from=2024-01-01&to=2024-03-01" "1-Hour Chart (Bitcoin)"
test_endpoint "GET" "/fmp/crypto/chart/1hour/ETHUSD?from=2024-01-01&to=2024-03-01" "1-Hour Chart (Ethereum)"

# ========== Technical Indicators ==========
echo -e "${GREEN}=== Technical Indicators ===${NC}"
test_endpoint "GET" "/fmp/technical-indicators/sma/AAPL?periodLength=10&timeframe=1day" "SMA (Simple Moving Average)"
test_endpoint "GET" "/fmp/technical-indicators/ema/AAPL?periodLength=10&timeframe=1day" "EMA (Exponential Moving Average)"
test_endpoint "GET" "/fmp/technical-indicators/wma/AAPL?periodLength=10&timeframe=1day" "WMA (Weighted Moving Average)"
test_endpoint "GET" "/fmp/technical-indicators/dema/AAPL?periodLength=10&timeframe=1day" "DEMA (Double Exponential Moving Average)"
test_endpoint "GET" "/fmp/technical-indicators/tema/AAPL?periodLength=10&timeframe=1day" "TEMA (Triple Exponential Moving Average)"
test_endpoint "GET" "/fmp/technical-indicators/rsi/AAPL?periodLength=10&timeframe=1day" "RSI (Relative Strength Index)"
test_endpoint "GET" "/fmp/technical-indicators/standard-deviation/AAPL?periodLength=10&timeframe=1day" "Standard Deviation"
test_endpoint "GET" "/fmp/technical-indicators/williams/AAPL?periodLength=10&timeframe=1day" "Williams"
test_endpoint "GET" "/fmp/technical-indicators/adx/AAPL?periodLength=10&timeframe=1day" "ADX (Average Directional Index)"

# ========== ETF & Mutual Funds ==========
echo -e "${GREEN}=== ETF & Mutual Funds ===${NC}"
test_endpoint "GET" "/fmp/etf/info/SPY" "ETF & Mutual Fund Information"
test_endpoint "GET" "/fmp/etf/country-allocation/SPY" "ETF & Fund Country Allocation"

test_endpoint "GET" "/fmp/etf/sector-weighting/SPY" "ETF Sector Weighting"

# ========== Economics ==========
echo -e "${GREEN}=== Economics ===${NC}"
test_endpoint "GET" "/fmp/economics/treasury-rates" "Treasury Rates"
test_endpoint "GET" "/fmp/economics/treasury-rates?from=2024-01-01&to=2024-03-01" "Treasury Rates (With Dates)"
test_endpoint "GET" "/fmp/economics/indicators?name=GDP" "Economic Indicators (GDP)"
test_endpoint "GET" "/fmp/economics/indicators?name=unemploymentRate&from=2024-01-01&to=2024-03-01" "Economic Indicators (Unemployment Rate)"
test_endpoint "GET" "/fmp/economics/calendar?from=2025-01-01&to=2025-03-01" "Economic Calendar"
test_endpoint "GET" "/fmp/economics/market-risk-premium" "Market Risk Premium"

# ========== Earnings, Dividends, Splits ==========
echo -e "${GREEN}=== Earnings, Dividends, Splits ===${NC}"
test_endpoint "GET" "/fmp/dividends/AAPL" "Dividends Company"
test_endpoint "GET" "/fmp/dividends-calendar?from=2025-01-01&to=2025-03-01" "Dividends Calendar"
test_endpoint "GET" "/fmp/earnings/AAPL" "Earnings Report"
test_endpoint "GET" "/fmp/earnings-calendar?from=2025-01-01&to=2025-03-01" "Earnings Calendar"
test_endpoint "GET" "/fmp/ipos-calendar?from=2025-01-01&to=2025-03-01" "IPOs Calendar"
test_endpoint "GET" "/fmp/ipos-disclosure?from=2025-01-01&to=2025-03-01" "IPOs Disclosure"
test_endpoint "GET" "/fmp/ipos-prospectus?from=2025-01-01&to=2025-03-01" "IPOs Prospectus"
test_endpoint "GET" "/fmp/splits/AAPL" "Stock Split Details"
test_endpoint "GET" "/fmp/splits-calendar?from=2025-01-01&to=2025-03-01" "Stock Splits Calendar"



# ========== News ==========
echo -e "${GREEN}=== News ===${NC}"
test_endpoint "GET" "/fmp/news/fmp-articles" "FMP Articles"
test_endpoint "GET" "/fmp/news/fmp-articles?page=0&limit=10" "FMP Articles (With Pagination)"
test_endpoint "GET" "/fmp/news/general" "General News"
test_endpoint "GET" "/fmp/news/general?page=0&limit=10" "General News (With Pagination)"
test_endpoint "GET" "/fmp/news/stock" "Stock News"
test_endpoint "GET" "/fmp/news/stock?page=0&limit=10" "Stock News (With Pagination)"
test_endpoint "GET" "/fmp/news/crypto" "Crypto News"
test_endpoint "GET" "/fmp/news/crypto?page=0&limit=10" "Crypto News (With Pagination)"

# ========== Financial Estimates ==========
echo -e "${GREEN}=== Financial Estimates ===${NC}"
test_endpoint "GET" "/fmp/financial-estimates/AAPL?period=annual" "Financial Estimates (Annual)"
test_endpoint "GET" "/fmp/ratings-snapshot/AAPL" "Ratings Snapshot"
test_endpoint "GET" "/fmp/ratings-historical/AAPL" "Historical Ratings"
test_endpoint "GET" "/fmp/ratings-historical/AAPL?limit=10" "Historical Ratings (Limit 10)"
test_endpoint "GET" "/fmp/price-target-summary/AAPL" "Price Target Summary"
test_endpoint "GET" "/fmp/price-target-consensus/AAPL" "Price Target Consensus"
test_endpoint "GET" "/fmp/grades/AAPL" "Stock Grades"
test_endpoint "GET" "/fmp/grades-historical/AAPL" "Historical Stock Grades"
test_endpoint "GET" "/fmp/grades-historical/AAPL?limit=50" "Historical Stock Grades (Limit 50)"
test_endpoint "GET" "/fmp/grades-consensus/AAPL" "Stock Grades Summary"

# ========== Market Performance ==========
echo -e "${GREEN}=== Market Performance ===${NC}"
test_endpoint "GET" "/fmp/market/sector-performance-snapshot?date=2025-02-01" "Market Sector Performance Snapshot"
test_endpoint "GET" "/fmp/market/sector-performance-snapshot?date=2025-02-01&exchange=NASDAQ" "Market Sector Performance Snapshot (NASDAQ)"
test_endpoint "GET" "/fmp/market/industry-performance-snapshot?date=2025-02-01" "Industry Performance Snapshot"
test_endpoint "GET" "/fmp/market/industry-performance-snapshot?date=2025-02-01&exchange=NASDAQ" "Industry Performance Snapshot (NASDAQ)"
test_endpoint "GET" "/fmp/market/historical-sector-performance?sector=Energy" "Historical Market Sector Performance"
test_endpoint "GET" "/fmp/market/historical-sector-performance?sector=Energy&from=2025-02-01&to=2025-03-01" "Historical Market Sector Performance (With Dates)"
test_endpoint "GET" "/fmp/market/historical-industry-performance?industry=Biotechnology" "Historical Industry Performance"
test_endpoint "GET" "/fmp/market/historical-industry-performance?industry=Biotechnology&from=2025-02-01&to=2025-03-01" "Historical Industry Performance (With Dates)"
test_endpoint "GET" "/fmp/market/sector-pe-snapshot?date=2025-02-01" "Sector PE Snapshot"
test_endpoint "GET" "/fmp/market/sector-pe-snapshot?date=2025-02-01&exchange=NASDAQ" "Sector PE Snapshot (NASDAQ)"
test_endpoint "GET" "/fmp/market/industry-pe-snapshot?date=2025-02-01" "Industry PE Snapshot"
test_endpoint "GET" "/fmp/market/industry-pe-snapshot?date=2025-02-01&exchange=NASDAQ" "Industry PE Snapshot (NASDAQ)"
test_endpoint "GET" "/fmp/market/historical-sector-pe?sector=Energy" "Historical Sector PE"
test_endpoint "GET" "/fmp/market/historical-sector-pe?sector=Energy&from=2025-02-01&to=2025-03-01" "Historical Sector PE (With Dates)"
test_endpoint "GET" "/fmp/market/historical-industry-pe?industry=Biotechnology" "Historical Industry PE"
test_endpoint "GET" "/fmp/market/historical-industry-pe?industry=Biotechnology&from=2025-02-01&to=2025-03-01" "Historical Industry PE (With Dates)"
test_endpoint "GET" "/fmp/market/biggest-gainers" "Biggest Stock Gainers"
test_endpoint "GET" "/fmp/market/biggest-losers" "Biggest Stock Losers"
test_endpoint "GET" "/fmp/market/most-actives" "Top Traded Stocks"

# ========== Insider Trades ==========
echo -e "${GREEN}=== Insider Trades ===${NC}"
test_endpoint "GET" "/fmp/insider-trading/latest" "Latest Insider Trading"
test_endpoint "GET" "/fmp/insider-trading/latest?page=0&limit=10" "Latest Insider Trading (With Pagination)"
test_endpoint "GET" "/fmp/insider-trading/search?symbol=AAPL" "Search Insider Trades (By Symbol)"
test_endpoint "GET" "/fmp/insider-trading/search?symbol=AAPL&transactionType=S-Sale" "Search Insider Trades (By Symbol & Type)"
test_endpoint "GET" "/fmp/insider-trading/reporting-name?name=Zuckerberg" "Search Insider Trades by Reporting Name"
test_endpoint "GET" "/fmp/insider-trading/transaction-types" "All Insider Transaction Types"
test_endpoint "GET" "/fmp/insider-trading/statistics/AAPL" "Insider Trade Statistics"
test_endpoint "GET" "/fmp/acquisition-ownership/AAPL" "Acquisition Ownership"

# ========== Indexes ==========
echo -e "${GREEN}=== Indexes ===${NC}"
test_endpoint "GET" "/fmp/indexes/list" "Stock Market Indexes List"
test_endpoint "GET" "/fmp/indexes/quote?symbol=^GSPC" "Index Quote (S&P 500)"
test_endpoint "GET" "/fmp/indexes/quote?symbol=^DJI" "Index Quote (Dow Jones)"
test_endpoint "GET" "/fmp/indexes/quote-short?symbol=^GSPC" "Index Short Quote (S&P 500)"
test_endpoint "GET" "/fmp/indexes/light-chart/^GSPC" "Light Chart (S&P 500)"
test_endpoint "GET" "/fmp/indexes/light-chart/^GSPC?from=2024-01-01&to=2024-03-01" "Light Chart (S&P 500 with dates)"
test_endpoint "GET" "/fmp/indexes/full-chart/^GSPC" "Full Chart (S&P 500)"
test_endpoint "GET" "/fmp/indexes/full-chart/^GSPC?from=2024-01-01&to=2024-03-01" "Full Chart (S&P 500 with dates)"

test_endpoint "GET" "/fmp/indexes/chart/5min/^GSPC?from=2024-01-01&to=2024-03-01" "5-Minute Chart (S&P 500)"
test_endpoint "GET" "/fmp/indexes/chart/1hour/^GSPC?from=2024-01-01&to=2024-03-01" "1-Hour Chart (S&P 500)"

# ========== Senate ==========
echo -e "${GREEN}=== Senate ==========${NC}"
test_endpoint "GET" "/fmp/senate/latest" "Latest Senate Financial Disclosures"
test_endpoint "GET" "/fmp/senate/latest?page=0&limit=10" "Latest Senate Financial Disclosures (With Pagination)"
test_endpoint "GET" "/fmp/house/latest" "Latest House Financial Disclosures"
test_endpoint "GET" "/fmp/house/latest?page=0&limit=10" "Latest House Financial Disclosures (With Pagination)"
test_endpoint "GET" "/fmp/senate/trades/AAPL" "Senate Trading Activity"
test_endpoint "GET" "/fmp/senate/trades-by-name?name=Jerry" "Senate Trades By Name"
test_endpoint "GET" "/fmp/house/trades/AAPL" "U.S. House Trades"
test_endpoint "GET" "/fmp/house/trades-by-name?name=James" "House Trades By Name"

# ========== Quote ==========
echo -e "${GREEN}=== Quote ===${NC}"
test_endpoint "GET" "/fmp/quote/AAPL" "Stock Quote"
test_endpoint "GET" "/fmp/quote/MSFT" "Stock Quote (Microsoft)"
test_endpoint "GET" "/fmp/quote-short/AAPL" "Stock Quote Short"
test_endpoint "GET" "/fmp/quote-short/MSFT" "Stock Quote Short (Microsoft)"
test_endpoint "GET" "/fmp/aftermarket-trade/AAPL" "Aftermarket Trade"
test_endpoint "GET" "/fmp/aftermarket-quote/AAPL" "Aftermarket Quote"
test_endpoint "GET" "/fmp/stock-price-change/AAPL" "Stock Price Change"
test_endpoint "GET" "/fmp/stock-price-change/MSFT" "Stock Price Change (Microsoft)"

# Compteur de résultats
TOTAL_TESTS=$(grep -c "^test_endpoint" "$0")
echo -e "${GREEN}=== Tests terminés ===${NC}"
echo -e "Total des endpoints testés: ${TOTAL_TESTS}"

