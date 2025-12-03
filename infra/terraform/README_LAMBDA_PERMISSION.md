# ⚠️ Important : Permission Lambda pour API Gateway

## Problème

La ressource `aws_lambda_permission.api_invoke` est **critique** pour que l'API Gateway puisse invoquer la fonction Lambda. Cette permission peut être supprimée lors de certains déploiements Terraform.

## Solution

1. **Protection avec `lifecycle`** : La ressource est protégée avec `create_before_destroy = true`
2. **Dépendance explicite** : L'intégration Lambda dépend explicitement de la permission
3. **Vérification après déploiement** : Toujours vérifier que la permission existe après un déploiement

## Vérification

```bash
# Vérifier que la permission existe
aws lambda get-policy --function-name adel-ai-dev-api --region eu-west-3

# Si la permission n'existe pas, la recréer
cd infra/terraform
terraform apply -auto-approve -target=aws_lambda_permission.api_invoke
```

## En cas de problème

Si tous les endpoints retournent 500 avec l'erreur "The IAM role configured on the integration or API Gateway doesn't have permissions to call the integration", c'est que la permission Lambda a été supprimée.

**Solution rapide** :
```bash
cd infra/terraform
terraform apply -auto-approve -target=aws_lambda_permission.api_invoke
```

