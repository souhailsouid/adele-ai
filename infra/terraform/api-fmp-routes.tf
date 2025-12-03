# Routes FMP API

# Quote
resource "aws_apigatewayv2_route" "get_fmp_quote" {
  api_id             = aws_apigatewayv2_api.http.id
  route_key          = "GET /fmp/quote/{symbol}"
  target             = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# Historical Price
resource "aws_apigatewayv2_route" "get_fmp_historical_price" {
  api_id             = aws_apigatewayv2_api.http.id
  route_key          = "GET /fmp/historical-price/{symbol}"
  target             = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# Income Statement
resource "aws_apigatewayv2_route" "get_fmp_income_statement" {
  api_id             = aws_apigatewayv2_api.http.id
  route_key          = "GET /fmp/income-statement/{symbol}"
  target             = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# Balance Sheet
resource "aws_apigatewayv2_route" "get_fmp_balance_sheet" {
  api_id             = aws_apigatewayv2_api.http.id
  route_key          = "GET /fmp/balance-sheet/{symbol}"
  target             = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# Cash Flow
resource "aws_apigatewayv2_route" "get_fmp_cash_flow" {
  api_id             = aws_apigatewayv2_api.http.id
  route_key          = "GET /fmp/cash-flow/{symbol}"
  target             = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# Key Metrics
resource "aws_apigatewayv2_route" "get_fmp_key_metrics" {
  api_id             = aws_apigatewayv2_api.http.id
  route_key          = "GET /fmp/key-metrics/{symbol}"
  target             = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# Ratios
resource "aws_apigatewayv2_route" "get_fmp_ratios" {
  api_id             = aws_apigatewayv2_api.http.id
  route_key          = "GET /fmp/ratios/{symbol}"
  target             = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# DCF
resource "aws_apigatewayv2_route" "get_fmp_dcf" {
  api_id             = aws_apigatewayv2_api.http.id
  route_key          = "GET /fmp/dcf/{symbol}"
  target             = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# Earnings
resource "aws_apigatewayv2_route" "get_fmp_earnings" {
  api_id             = aws_apigatewayv2_api.http.id
  route_key          = "GET /fmp/earnings/{symbol}"
  target             = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# Insider Trades
resource "aws_apigatewayv2_route" "get_fmp_insider_trades" {
  api_id             = aws_apigatewayv2_api.http.id
  route_key          = "GET /fmp/insider-trades/{symbol}"
  target             = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# Hedge Fund Holdings
resource "aws_apigatewayv2_route" "get_fmp_hedge_fund_holdings" {
  api_id             = aws_apigatewayv2_api.http.id
  route_key          = "GET /fmp/hedge-fund-holdings/{symbol}"
  target             = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# Market News
resource "aws_apigatewayv2_route" "get_fmp_market_news" {
  api_id             = aws_apigatewayv2_api.http.id
  route_key          = "GET /fmp/market-news"
  target             = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# Economic Calendar
resource "aws_apigatewayv2_route" "get_fmp_economic_calendar" {
  api_id             = aws_apigatewayv2_api.http.id
  route_key          = "GET /fmp/economic-calendar"
  target             = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# Earnings Calendar
resource "aws_apigatewayv2_route" "get_fmp_earnings_calendar" {
  api_id             = aws_apigatewayv2_api.http.id
  route_key          = "GET /fmp/earnings-calendar"
  target             = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# Screener
resource "aws_apigatewayv2_route" "get_fmp_screener" {
  api_id             = aws_apigatewayv2_api.http.id
  route_key          = "GET /fmp/screener"
  target             = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# SEC Filings
resource "aws_apigatewayv2_route" "get_fmp_sec_filings" {
  api_id             = aws_apigatewayv2_api.http.id
  route_key          = "GET /fmp/sec-filings/{symbol}"
  target             = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

