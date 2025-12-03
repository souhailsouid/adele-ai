#!/bin/bash

# Script de diagnostic pour vérifier l'état des routes API Gateway

API_ID="tsdd1sibd1"
REGION="eu-west-3"

echo "🔍 Diagnostic des routes API Gateway"
echo "===================================="
echo ""

# Vérifier les routes shorts
echo "📋 Routes 'shorts' dans API Gateway:"
aws apigatewayv2 get-routes --api-id $API_ID --region $REGION \
  --query "Items[?contains(RouteKey, 'shorts')].{RouteKey:RouteKey,Target:Target,AuthType:AuthorizationType}" \
  --output table

echo ""
echo "📋 Routes 'seasonality' dans API Gateway:"
aws apigatewayv2 get-routes --api-id $API_ID --region $REGION \
  --query "Items[?contains(RouteKey, 'seasonality')].{RouteKey:RouteKey,Target:Target,AuthType:AuthorizationType}" \
  --output table

echo ""
echo "📋 Routes 'screener' dans API Gateway:"
aws apigatewayv2 get-routes --api-id $API_ID --region $REGION \
  --query "Items[?contains(RouteKey, 'screener')].{RouteKey:RouteKey,Target:Target,AuthType:AuthorizationType}" \
  --output table

echo ""
echo "📋 Routes 'option-trade' dans API Gateway:"
aws apigatewayv2 get-routes --api-id $API_ID --region $REGION \
  --query "Items[?contains(RouteKey, 'option-trade')].{RouteKey:RouteKey,Target:Target,AuthType:AuthorizationType}" \
  --output table

echo ""
echo "📋 Routes 'option-contract' dans API Gateway:"
aws apigatewayv2 get-routes --api-id $API_ID --region $REGION \
  --query "Items[?contains(RouteKey, 'option-contract')].{RouteKey:RouteKey,Target:Target,AuthType:AuthorizationType}" \
  --output table

echo ""
echo "📋 Routes 'news' dans API Gateway:"
aws apigatewayv2 get-routes --api-id $API_ID --region $REGION \
  --query "Items[?contains(RouteKey, 'news')].{RouteKey:RouteKey,Target:Target,AuthType:AuthorizationType}" \
  --output table

echo ""
echo "🔗 Vérification de l'intégration Lambda:"
INTEGRATION_ID=$(aws apigatewayv2 get-integrations --api-id $API_ID --region $REGION \
  --query "Items[?IntegrationType=='AWS_PROXY'].IntegrationId" --output text)

if [ -z "$INTEGRATION_ID" ]; then
  echo "❌ Aucune intégration Lambda trouvée!"
else
  echo "✅ Intégration Lambda trouvée: $INTEGRATION_ID"
  aws apigatewayv2 get-integration --api-id $API_ID --integration-id $INTEGRATION_ID --region $REGION \
    --query "{Type:IntegrationType,Uri:IntegrationUri,PayloadVersion:PayloadFormatVersion}" \
    --output table
fi

echo ""
echo "🔐 Vérification de l'autorisation JWT:"
AUTHORIZER_ID=$(aws apigatewayv2 get-authorizers --api-id $API_ID --region $REGION \
  --query "Items[?AuthorizerType=='JWT'].AuthorizerId" --output text)

if [ -z "$AUTHORIZER_ID" ]; then
  echo "❌ Aucun authorizer JWT trouvé!"
else
  echo "✅ Authorizer JWT trouvé: $AUTHORIZER_ID"
  aws apigatewayv2 get-authorizer --api-id $API_ID --authorizer-id $AUTHORIZER_ID --region $REGION \
    --query "{Type:AuthorizerType,Issuer:JwtConfiguration.Issuer,Audience:JwtConfiguration.Audience[0]}" \
    --output table
fi

echo ""
echo "📊 État du stage 'prod':"
aws apigatewayv2 get-stage --api-id $API_ID --stage-name prod --region $REGION \
  --query "{Name:StageName,AutoDeploy:AutoDeploy,DeploymentId:DeploymentId,LastUpdated:LastUpdatedDate}" \
  --output table

echo ""
echo "✅ Diagnostic terminé"

