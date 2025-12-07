# Routes pour le service de surveillance

# POST /surveillance/watch
resource "aws_apigatewayv2_route" "post_surveillance_watch" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "POST /surveillance/watch"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# GET /surveillance/watches
resource "aws_apigatewayv2_route" "get_surveillance_watches" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /surveillance/watches"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# DELETE /surveillance/watch/{id}
resource "aws_apigatewayv2_route" "delete_surveillance_watch" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "DELETE /surveillance/watch/{id}"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# GET /surveillance/watch/{id}/alerts
resource "aws_apigatewayv2_route" "get_surveillance_watch_alerts" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /surveillance/watch/{id}/alerts"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# POST /surveillance/watch/{id}/check
resource "aws_apigatewayv2_route" "post_surveillance_watch_check" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "POST /surveillance/watch/{id}/check"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

