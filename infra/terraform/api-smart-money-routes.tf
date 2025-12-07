# Routes pour le service Smart Money

# GET /smart-money/top-hedge-funds
resource "aws_apigatewayv2_route" "get_smart_money_top_hedge_funds" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /smart-money/top-hedge-funds"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# GET /smart-money/institution/{name}/copy-trades/{ticker}
resource "aws_apigatewayv2_route" "get_smart_money_copy_trades" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /smart-money/institution/{name}/copy-trades/{ticker}"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

