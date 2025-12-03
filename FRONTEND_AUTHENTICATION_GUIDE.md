# 🔐 Guide d'Authentification Frontend - API Backend

## 📋 Réponse Rapide

**Utilisez l'ACCESS TOKEN** pour authentifier vos requêtes vers l'API backend.

## 🔑 Types de Tokens Cognito

### Access Token
- **Usage** : Authentification des APIs
- **Contient** : `sub`, `scope`, `client_id`, `token_use: "access"`
- **Audience** : `client_id` (correspond à `COGNITO_AUDIENCE`)
- **Durée** : Généralement 1 heure

### ID Token
- **Usage** : Identité de l'utilisateur (frontend)
- **Contient** : `sub`, `email`, `name`, `token_use: "id"`
- **Audience** : `client_id` (peut aussi fonctionner)
- **Durée** : Généralement 1 heure

## ✅ Pourquoi utiliser l'Access Token ?

D'après votre configuration Terraform :

```hcl
jwt_configuration {
  audience = [aws_cognito_user_pool_client.web.id]  # ← client_id
  issuer   = "https://cognito-idp.${var.region}.amazonaws.com/${aws_cognito_user_pool.this.id}"
}
```

L'API Gateway valide le JWT en vérifiant :
1. ✅ L'**audience** (`aud`) doit correspondre au `client_id`
2. ✅ L'**issuer** (`iss`) doit correspondre à l'URL Cognito
3. ✅ La **signature** doit être valide

**L'Access Token est conçu pour les APIs** et contient les scopes nécessaires pour l'autorisation.

## 📝 Exemple d'Utilisation Frontend

### React / Next.js

```typescript
// Récupérer les tokens depuis Cognito
const { accessToken, idToken } = await Auth.currentSession();

// Utiliser l'ACCESS TOKEN pour les appels API
const response = await fetch('https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/ticker-activity/TSLA/quote', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,  // ← ACCESS TOKEN
    'Content-Type': 'application/json',
  },
});

const data = await response.json();
```

### Avec AWS Amplify

```typescript
import { Auth } from 'aws-amplify';

// Méthode 1 : Utiliser Amplify API
import { API } from 'aws-amplify';

const data = await API.get('api', '/ticker-activity/TSLA/quote', {
  headers: {
    Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
  },
});

// Méthode 2 : Fetch manuel
const session = await Auth.currentSession();
const accessToken = session.getAccessToken().getJwtToken();

const response = await fetch('https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/ticker-activity/TSLA/quote', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});
```

### Avec fetch natif

```typescript
// Fonction helper pour récupérer le token
async function getAccessToken() {
  const session = await Auth.currentSession();
  return session.getAccessToken().getJwtToken();
}

// Utilisation
const token = await getAccessToken();
const response = await fetch('https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/ticker-activity/TSLA/quote', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## 🔍 Vérification du Token

Pour vérifier quel token vous avez, décodez-le sur [jwt.io](https://jwt.io) :

### Access Token contient :
```json
{
  "sub": "512980be-00d1-70ff-547f-3a07c9230782",
  "token_use": "access",
  "scope": "aws.cognito.signin.user.admin",
  "auth_time": 1764598323,
  "iss": "https://cognito-idp.eu-west-3.amazonaws.com/eu-west-3_FQDmhxV14",
  "exp": 1764601923,
  "iat": 1764598323,
  "client_id": "pkp4i82jnttthj2cbiltudgva",
  "username": "512980be-00d1-70ff-547f-3a07c9230782"
}
```

### ID Token contient :
```json
{
  "sub": "512980be-00d1-70ff-547f-3a07c9230782",
  "token_use": "id",
  "email": "souhailsouidpro@gmail.com",
  "email_verified": true,
  "auth_time": 1764598323,
  "iss": "https://cognito-idp.eu-west-3.amazonaws.com/eu-west-3_FQDmhxV14",
  "exp": 1764601923,
  "iat": 1764598323,
  "aud": "pkp4i82jnttthj2cbiltudgva",
  "cognito:username": "512980be-00d1-70ff-547f-3a07c9230782"
}
```

## ⚠️ Points Importants

1. **Format du Header** :
   ```
   Authorization: Bearer {ACCESS_TOKEN}
   ```
   ⚠️ N'oubliez pas le préfixe `Bearer ` (avec l'espace)

2. **Expiration** :
   - Les tokens expirent après 1 heure (par défaut)
   - Gérer le refresh automatique avec Amplify

3. **CORS** :
   - Les headers `authorization` sont déjà autorisés dans votre configuration
   - Pas besoin de configuration supplémentaire

## 🐛 Dépannage

### Erreur 401 Unauthorized

**Causes possibles** :
1. Token expiré → Rafraîchir la session
2. Mauvais token (ID au lieu d'Access) → Utiliser `accessToken`
3. Format incorrect → Vérifier `Bearer {token}`

**Solution** :
```typescript
// Vérifier que le token n'est pas expiré
const session = await Auth.currentSession();
if (session.isValid()) {
  const token = session.getAccessToken().getJwtToken();
  // Utiliser le token
} else {
  // Rafraîchir la session
  await Auth.currentAuthenticatedUser();
}
```

### Erreur CORS

Si vous avez des erreurs CORS, vérifiez que votre origine frontend est dans :
```hcl
frontend_allowed_origins = [
  "http://localhost:3000",
  "https://main.d15muhyy3o82qt.amplifyapp.com"
]
```

## 📚 Ressources

- [AWS Cognito Access Token vs ID Token](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html)
- [AWS Amplify Auth Documentation](https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/)

---

## ✅ Résumé

**Utilisez l'ACCESS TOKEN** dans le header `Authorization: Bearer {accessToken}` pour toutes vos requêtes vers l'API backend.

