# Routes pour le service d'alertes multi-signaux

# POST /alerts
resource "aws_apigatewayv2_route" "post_alerts" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "POST /alerts"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# GET /alerts
resource "aws_apigatewayv2_route" "get_alerts" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /alerts"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# GET /alerts/{id}
resource "aws_apigatewayv2_route" "get_alert" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /alerts/{id}"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# PUT /alerts/{id}
resource "aws_apigatewayv2_route" "put_alert" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "PUT /alerts/{id}"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# DELETE /alerts/{id}
resource "aws_apigatewayv2_route" "delete_alert" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "DELETE /alerts/{id}"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

# POST /alerts/{id}/test
resource "aws_apigatewayv2_route" "post_alert_test" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "POST /alerts/{id}/test"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

