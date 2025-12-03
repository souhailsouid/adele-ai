# 🔧 Fix Erreur 500 API Gateway sur `/funds`

## 🔍 Diagnostic

L'erreur 500 se produit au niveau d'API Gateway **avant** d'atteindre la Lambda. Cela signifie que :
- La Lambda n'est pas invoquée (pas de logs dans `/aws/lambda/adel-ai-dev-api`)
- Le problème est dans la configuration API Gateway

## ✅ Actions Effectuées

1. ✅ **Réappliqué l'intégration Lambda** : `aws_apigatewayv2_integration.api_lambda`
2. ✅ **Réappliqué la permission Lambda** : `aws_lambda_permission.api_invoke`
3. ✅ **Vérifié que la route existe** : `GET /funds` est bien configurée

## 🧪 Test

Testez maintenant l'endpoint :

```bash
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/funds" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔍 Si l'erreur persiste

### 1. Vérifier les logs API Gateway

```bash
aws logs tail /aws/apigw/adel-ai-dev --since 5m --format short
```

### 2. Vérifier l'autorisation JWT

L'erreur pourrait venir de l'autorisation JWT. Vérifiez :
- Le token JWT est valide
- Le token n'est pas expiré
- Le token correspond au bon Cognito User Pool

### 3. Vérifier l'intégration Lambda

```bash
# Récupérer l'ID de l'intégration
INTEGRATION_ID=$(aws apigatewayv2 get-integrations --api-id tsdd1sibd1 --query 'Items[?IntegrationType==`AWS_PROXY`].IntegrationId' --output text)

# Vérifier l'intégration
aws apigatewayv2 get-integration --api-id tsdd1sibd1 --integration-id $INTEGRATION_ID
```

### 4. Vérifier les permissions Lambda

```bash
aws lambda get-policy --function-name adel-ai-dev-api
```

### 5. Forcer la mise à jour de l'intégration

Si le problème persiste, forcez la mise à jour complète :

```bash
cd infra/terraform
terraform taint aws_apigatewayv2_integration.api_lambda
terraform apply -auto-approve -target=aws_apigatewayv2_integration.api_lambda
```

## 📝 Notes

- L'intégration Lambda pointe vers : `arn:aws:lambda:eu-west-3:956633302249:function:adel-ai-dev-api`
- La permission Lambda autorise : `arn:aws:execute-api:eu-west-3:956633302249:tsdd1sibd1/*/*`
- La route `GET /funds` utilise l'autorisation JWT

## 🚀 Prochaines Étapes

1. **Tester l'endpoint** avec un JWT valide
2. **Vérifier les logs** si l'erreur persiste
3. **Vérifier la migration RLS** dans Supabase (migration `007_fix_funds_rls_policies.sql`)

