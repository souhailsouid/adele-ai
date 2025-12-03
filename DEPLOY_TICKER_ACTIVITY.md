# 🚀 Guide de Redéploiement - Ticker Activity

## 📋 Étapes pour Redéployer `ticker-activity.ts`

### 1. Bundler le Code API

```bash
cd services/api
npm run bundle
```

Cette commande va :
- Compiler le TypeScript (`npm run build`)
- Créer le fichier ZIP (`npm run zip`)
- Générer `api.zip` dans le dossier `services/api/`

### 2. Redéployer la Lambda avec Terraform

```bash
cd infra/terraform

# Option A : Redéployer uniquement la Lambda (recommandé)
terraform taint aws_lambda_function.api
terraform apply -target=aws_lambda_function.api

# Option B : Redéployer tout (si vous avez modifié d'autres ressources)
terraform apply
```

### 3. Vérifier le Déploiement

```bash
# Vérifier que la Lambda est bien déployée
aws lambda get-function --function-name adel-ai-dev-api --query 'Configuration.LastModified'
```

## 🔄 Script Complet (One-Liner)

```bash
cd /Users/souhailsouid/startup/personamy/backend && \
cd services/api && npm run bundle && \
cd ../../infra/terraform && \
terraform taint aws_lambda_function.api && \
terraform apply -auto-approve -target=aws_lambda_function.api
```

## 📝 Explication des Commandes

### `npm run bundle`
- Compile le TypeScript en JavaScript
- Crée un fichier ZIP avec toutes les dépendances
- Génère `api.zip` qui sera uploadé vers AWS Lambda

### `terraform taint aws_lambda_function.api`
- Marque la ressource Lambda comme "tainted"
- Force Terraform à la recréer au prochain `apply`
- Garantit que le nouveau code sera déployé

### `terraform apply -target=aws_lambda_function.api`
- Redéploie uniquement la Lambda (plus rapide)
- Utilise le fichier `api.zip` mis à jour
- Ne modifie pas les autres ressources

## ⚠️ Notes Importantes

1. **Temps de déploiement** : ~30-60 secondes
2. **Pas de downtime** : AWS Lambda gère le déploiement sans interruption
3. **Vérifier les logs** : Après le déploiement, vérifiez CloudWatch pour les erreurs

## 🧪 Tester Après Déploiement

```bash
# Attendre quelques secondes que le déploiement soit terminé
sleep 10

# Tester un endpoint
TOKEN="votre_access_token"
curl -X GET "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/ticker-activity/TSLA/quote" \
  -H "Authorization: Bearer $TOKEN"
```

## 🔍 Vérifier les Logs

```bash
# Voir les logs récents de la Lambda
aws logs tail /aws/lambda/adel-ai-dev-api --since 5m --format short
```

## 🐛 En Cas d'Erreur

Si le déploiement échoue :

1. **Vérifier que le bundle est créé** :
   ```bash
   ls -lh services/api/api.zip
   ```

2. **Vérifier les erreurs de compilation** :
   ```bash
   cd services/api
   npm run build
   ```

3. **Vérifier les logs Terraform** :
   ```bash
   cd infra/terraform
   terraform apply -target=aws_lambda_function.api
   ```

## ✅ Checklist de Déploiement

- [ ] Code modifié dans `ticker-activity.ts`
- [ ] Bundle créé avec `npm run bundle`
- [ ] Lambda taintée avec `terraform taint`
- [ ] Terraform apply exécuté
- [ ] Déploiement réussi (vérifier les logs)
- [ ] Test de l'endpoint réussi

---

**Temps total estimé** : 1-2 minutes

