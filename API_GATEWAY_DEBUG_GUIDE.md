# 🐛 Guide de Débogage API Gateway - Erreur 500

## 🔴 Problème Identifié

L'API Gateway renvoie **500 sans logs**, ce qui indique généralement un problème de:
1. **Mapping de route** (route non trouvée ou mal configurée)
2. **Authorizer JWT** (problème d'authentification)
3. **Handler Lambda** (ne retourne pas de réponse valide)

## ✅ Correction Appliquée

**Problème dans `router.ts` ligne 236** : Le `return` était commenté, donc le handler ne retournait rien.

```typescript
// ❌ AVANT (ne retourne rien)
handler: async (event) => {
  const ticker = getPathParam(event, "ticker");
  if (!ticker) throw new Error("Missing ticker parameter");
  // return await getTickerQuote(ticker);  // ← COMMENTÉ!
},

// ✅ APRÈS (retourne la réponse)
handler: async (event) => {
  const ticker = getPathParam(event, "ticker");
  if (!ticker) throw new Error("Missing ticker parameter");
  return await getTickerQuote(ticker);  // ← CORRIGÉ!
},
```

## 🔍 Scripts de Diagnostic

### 1. Vérifier les Logs CloudWatch

```bash
# Voir les 5 dernières minutes
./scripts/check-api-gateway-logs.sh

# Voir les 10 dernières minutes
./scripts/check-api-gateway-logs.sh 10

# Suivre en temps réel
aws logs tail /aws/lambda/adel-ai-dev-api --follow
```

### 2. Tester Directement avec Détails

```bash
./scripts/test-api-gateway-direct.sh "YOUR_TOKEN" "/ticker-activity/TSLA/quote"
```

Ce script affiche:
- Code HTTP
- Headers de réponse
- Corps de la réponse
- Analyse des erreurs

### 3. Vérifier les Routes API Gateway

```bash
./scripts/verify-api-gateway-routes.sh
```

## 🔧 Étapes de Débogage

### Étape 1: Vérifier que la Route Existe

```bash
# Vérifier dans Terraform
grep -A 5 "get_ticker_quote" infra/terraform/api.tf

# Vérifier dans AWS Console
# API Gateway > Routes > Chercher "GET /ticker-activity/{ticker}/quote"
```

### Étape 2: Vérifier l'Authorizer

```bash
# Tester avec un token valide
TOKEN="YOUR_ACCESS_TOKEN"
curl -v https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/ticker-activity/TSLA/quote \
  -H "Authorization: Bearer $TOKEN"
```

**Codes d'erreur possibles:**
- `401`: Token invalide ou expiré
- `403`: Problème avec l'authorizer (audience/issuer incorrects)
- `500`: Lambda crash ou ne retourne pas de réponse valide

### Étape 3: Vérifier les Logs Lambda

```bash
# Voir les logs récents
aws logs tail /aws/lambda/adel-ai-dev-api --since 5m

# Chercher les erreurs
aws logs filter-log-events \
  --log-group-name /aws/lambda/adel-ai-dev-api \
  --filter-pattern "ERROR" \
  --since 1h
```

### Étape 4: Vérifier le Format de Réponse Lambda

Le handler Lambda doit retourner un objet avec cette structure:

```typescript
{
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
}
```

**Erreurs communes:**
- Handler ne retourne rien → 500
- Handler retourne `undefined` → 500
- Handler retourne un objet invalide → 500
- Handler throw une exception non catchée → 500

## 🚀 Redéploiement

Après avoir corrigé le code:

```bash
# 1. Rebuild
cd services/api
npm run bundle

# 2. Redéployer avec Terraform
cd ../../infra/terraform
terraform apply
```

## 📋 Checklist de Débogage

- [ ] Route configurée dans Terraform (`api.tf`)
- [ ] Route présente dans API Gateway (console AWS)
- [ ] Authorizer JWT configuré correctement
- [ ] Handler Lambda retourne une réponse valide
- [ ] Variables d'environnement Lambda configurées
- [ ] Logs CloudWatch activés
- [ ] Permission Lambda pour API Gateway configurée

## 🔍 Commandes Utiles

```bash
# Voir toutes les routes API Gateway
aws apigatewayv2 get-routes --api-id tsdd1sibd1

# Voir la configuration d'une route spécifique
aws apigatewayv2 get-route --api-id tsdd1sibd1 --route-id <ROUTE_ID>

# Tester l'invocation Lambda directement
aws lambda invoke \
  --function-name adel-ai-dev-api \
  --payload '{"routeKey":"GET /ticker-activity/TSLA/quote","requestContext":{"authorizer":{"jwt":{"claims":{"sub":"test"}}}}}' \
  response.json

# Voir les erreurs récentes
aws logs filter-log-events \
  --log-group-name /aws/lambda/adel-ai-dev-api \
  --filter-pattern "ERROR" \
  --since 1h \
  --query 'events[*].message' \
  --output text
```

## 💡 Problèmes Courants

### 1. 500 sans logs Lambda

**Cause**: La Lambda n'est pas invoquée (problème de route ou authorizer)

**Solution**:
- Vérifier que la route existe dans API Gateway
- Vérifier que l'authorizer accepte le token
- Vérifier les logs API Gateway (pas Lambda)

### 2. 500 avec logs Lambda

**Cause**: Erreur dans le code Lambda

**Solution**:
- Vérifier les logs CloudWatch
- Vérifier que le handler retourne une réponse valide
- Vérifier les variables d'environnement

### 3. Route non trouvée (404)

**Cause**: Route non configurée ou format incorrect

**Solution**:
- Vérifier le format: `GET /ticker-activity/{ticker}/quote`
- Vérifier que la route est déployée
- Vérifier le stage (prod vs dev)

---

**Note**: Après correction du `router.ts`, redéployez la Lambda pour que les changements prennent effet.

