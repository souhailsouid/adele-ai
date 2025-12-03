# 🔐 ID Token vs Access Token - Guide Complet

## 📋 Résumé

**L'ID Token peut fonctionner** avec votre API Gateway car il a la même `audience` (client_id), mais **l'Access Token est recommandé** pour les APIs.

## ✅ Test avec votre ID Token

Votre ID Token a été testé et **fonctionne** avec l'API Gateway car :
- ✅ `aud` (audience) = `"pkp4i82jnttthj2cbiltudgva"` (correspond au client_id)
- ✅ `iss` (issuer) = URL Cognito correcte
- ✅ Signature valide

## 🔍 Différence entre les Tokens

### ID Token
```json
{
  "sub": "512980be-00d1-70ff-547f-3a07c9230782",
  "token_use": "id",
  "email": "souhailsouidpro@gmail.com",
  "email_verified": true,
  "aud": "pkp4i82jnttthj2cbiltudgva",
  "given_name": "souhail",
  "family_name": "souid"
}
```

**Caractéristiques** :
- ✅ Contient des informations utilisateur (email, name)
- ✅ Peut fonctionner avec API Gateway si `aud` correspond
- ⚠️ Conçu pour l'identité frontend, pas pour les APIs
- ⚠️ Pas de scopes pour l'autorisation

### Access Token
```json
{
  "sub": "512980be-00d1-70ff-547f-3a07c9230782",
  "token_use": "access",
  "scope": "aws.cognito.signin.user.admin",
  "client_id": "pkp4i82jnttthj2cbiltudgva",
  "username": "512980be-00d1-70ff-547f-3a07c9230782"
}
```

**Caractéristiques** :
- ✅ Conçu spécifiquement pour les APIs
- ✅ Contient des scopes pour l'autorisation
- ✅ Meilleure pratique pour l'authentification API
- ✅ Plus sécurisé pour les appels backend

## 🎯 Recommandation

### Pour le Frontend

**Utilisez l'Access Token** pour les appels API :

```typescript
import { Auth } from 'aws-amplify';

// ✅ CORRECT - Access Token
const session = await Auth.currentSession();
const accessToken = session.getAccessToken().getJwtToken();

const response = await fetch('/api/ticker-activity/TSLA/quote', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});
```

### Si l'ID Token fonctionne

Si vous testez et que l'ID Token fonctionne, c'est parce que :
1. L'API Gateway valide uniquement l'`audience` et l'`issuer`
2. Les deux tokens ont la même `audience` (client_id)
3. L'API Gateway ne vérifie pas le `token_use`

**Mais** :
- ⚠️ Ce n'est pas la meilleure pratique
- ⚠️ L'ID Token peut ne pas fonctionner avec d'autres services AWS
- ⚠️ Pas de scopes pour l'autorisation fine

## 🔧 Code Frontend Recommandé

```typescript
// utils/api.ts
import { Auth } from 'aws-amplify';

export async function getApiToken(): Promise<string> {
  try {
    const session = await Auth.currentSession();
    
    // Vérifier que la session est valide
    if (!session.isValid()) {
      // Rafraîchir la session
      await Auth.currentAuthenticatedUser();
      const newSession = await Auth.currentSession();
      return newSession.getAccessToken().getJwtToken();
    }
    
    // Utiliser l'Access Token (recommandé)
    return session.getAccessToken().getJwtToken();
  } catch (error) {
    console.error('Error getting API token:', error);
    throw new Error('Not authenticated. Please sign in first.');
  }
}

// Utilisation
export async function fetchTickerActivity(
  ticker: string,
  type: 'quote' | 'ownership' | 'activity' | 'insiders' | 'congress' | 'options' | 'dark-pool' | 'stats',
  options?: { limit?: number }
) {
  const token = await getApiToken();
  
  const url = new URL(
    `https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/ticker-activity/${ticker}/${type}`
  );
  if (options?.limit) {
    url.searchParams.set('limit', options.limit.toString());
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication required. Please sign in again.');
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}
```

## 🐛 Dépannage

### Erreur 401 avec ID Token

Si vous recevez une erreur 401 avec l'ID Token :

1. **Vérifier l'audience** :
   ```bash
   # Décoder le token
   echo "VOTRE_TOKEN" | cut -d'.' -f2 | base64 -d | jq '.aud'
   ```
   Doit correspondre à `pkp4i82jnttthj2cbiltudgva`

2. **Vérifier l'expiration** :
   ```bash
   echo "VOTRE_TOKEN" | cut -d'.' -f2 | base64 -d | jq '.exp'
   ```
   Doit être dans le futur

3. **Utiliser l'Access Token** :
   ```typescript
   const session = await Auth.currentSession();
   const accessToken = session.getAccessToken().getJwtToken();
   ```

### Erreur "Not authenticated"

Si vous recevez "Not authenticated. Please sign in first." :

1. **Vérifier que l'utilisateur est connecté** :
   ```typescript
   const user = await Auth.currentAuthenticatedUser();
   console.log('User:', user);
   ```

2. **Vérifier que la session est valide** :
   ```typescript
   const session = await Auth.currentSession();
   console.log('Session valid:', session.isValid());
   ```

3. **Rafraîchir la session** :
   ```typescript
   await Auth.currentAuthenticatedUser();
   const newSession = await Auth.currentSession();
   ```

## ✅ Résumé

| Token | Usage Recommandé | Fonctionne avec API Gateway ? |
|-------|------------------|------------------------------|
| **Access Token** | ✅ APIs backend | ✅ Oui (recommandé) |
| **ID Token** | ⚠️ Identité frontend | ✅ Oui (mais pas recommandé) |

**Conclusion** : Utilisez l'**Access Token** pour vos appels API. C'est la meilleure pratique et cela garantit la compatibilité avec tous les services AWS.

