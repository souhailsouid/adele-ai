# Guide de dépannage - "Failed to fetch"

## ✅ Tests backend effectués

Le backend API **fonctionne correctement** :
- ✅ API Gateway accessible
- ✅ Réponse correcte sans auth (HTTP 401)
- ✅ CORS preflight fonctionne (HTTP 204)

**URL API correcte**: `https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod`

---

## 🔍 Diagnostic "Failed to fetch"

### 1. Vérifier l'URL dans votre code frontend

**❌ URL incorrecte (ancienne):**
```
https://xoqwsona9k.execute-api.eu-west-3.amazonaws.com/prod
```

**✅ URL correcte:**
```
https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod
```

### 2. Vérifier CORS dans la console navigateur

Ouvrez la console (F12) et regardez l'erreur exacte :

**Erreur CORS typique:**
```
Access to fetch at 'https://...' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution**: Vérifiez que votre origine frontend est dans la liste `frontend_allowed_origins` dans Terraform.

### 3. Vérifier le token JWT

**Erreur typique:**
```
Failed to fetch
```

**Vérifications:**
- Le token JWT est-il présent dans le header `Authorization` ?
- Le token est-il valide et non expiré ?
- Le format est-il correct : `Bearer <token>` ?

### 4. Test rapide dans la console navigateur

```javascript
// Test 1: Vérifier la connectivité
fetch('https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/funds', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE',
    'Content-Type': 'application/json'
  }
})
.then(res => {
  console.log('Status:', res.status);
  return res.json();
})
.then(data => console.log('Data:', data))
.catch(err => console.error('Error:', err));
```

**Résultats attendus:**
- ✅ `Status: 200` → Tout fonctionne
- ❌ `Status: 401` → Token invalide ou manquant
- ❌ `Failed to fetch` → Problème CORS ou réseau

### 5. Vérifier les headers CORS

Dans la console navigateur, onglet Network :
1. Faites une requête
2. Regardez la requête OPTIONS (preflight)
3. Vérifiez les headers de réponse :
   - `Access-Control-Allow-Origin`
   - `Access-Control-Allow-Methods`
   - `Access-Control-Allow-Headers`

**Si ces headers sont absents** → CORS non configuré pour votre origine

---

## 🔧 Solutions

### Solution 1: Mettre à jour l'URL

```typescript
// Avant
const API_BASE_URL = 'https://xoqwsona9k.execute-api.eu-west-3.amazonaws.com/prod';

// Après
const API_BASE_URL = 'https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod';
```

### Solution 2: Vérifier CORS dans Terraform

Vérifiez que votre origine frontend est dans `frontend_allowed_origins` :

```hcl
# infra/terraform/terraform.tfvars
frontend_allowed_origins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://votre-domaine.com"
]
```

Puis redéployez :
```bash
cd infra/terraform
terraform apply
```

### Solution 3: Vérifier le token JWT

```typescript
// Exemple de vérification
const token = localStorage.getItem('jwt_token'); // ou votre méthode
if (!token) {
  console.error('Token JWT manquant');
  // Rediriger vers login
}

// Vérifier l'expiration (si le token contient un payload JWT)
const payload = JSON.parse(atob(token.split('.')[1]));
const expiration = payload.exp * 1000; // Convertir en millisecondes
if (Date.now() > expiration) {
  console.error('Token expiré');
  // Rafraîchir le token
}
```

### Solution 4: Gestion d'erreur améliorée

```typescript
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      // Log détaillé pour le debug
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: endpoint,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      const error = await response.json().catch(() => ({ 
        error: response.statusText 
      }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error: any) {
    // Gestion spécifique de "Failed to fetch"
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      console.error('Network error - vérifiez:');
      console.error('1. URL correcte:', API_BASE_URL);
      console.error('2. CORS configuré');
      console.error('3. Token JWT valide');
      throw new Error('Erreur de connexion. Vérifiez votre connexion réseau et la configuration CORS.');
    }
    throw error;
  }
}
```

---

## 📋 Checklist de vérification

- [ ] URL API correcte : `https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod`
- [ ] Token JWT présent et valide
- [ ] Format du header : `Authorization: Bearer <token>`
- [ ] Origine frontend dans `frontend_allowed_origins`
- [ ] Pas d'erreur CORS dans la console navigateur
- [ ] Requête OPTIONS (preflight) réussit (HTTP 204)
- [ ] Headers CORS présents dans la réponse

---

## 🧪 Script de test

Un script de test est disponible :
```bash
./scripts/test-api-backend.sh
```

Ce script vérifie :
- ✅ Connectivité API Gateway
- ✅ Réponse sans auth (401)
- ✅ CORS preflight
- ✅ Logs CloudWatch

---

## 📞 Informations de debug

Si le problème persiste, collectez ces informations :

1. **Console navigateur (F12)** :
   - Erreur exacte
   - Headers de la requête
   - Headers de la réponse
   - Status code

2. **Network tab** :
   - Requête OPTIONS (preflight)
   - Requête GET/POST
   - Status codes
   - Headers CORS

3. **Code frontend** :
   - URL utilisée
   - Headers envoyés
   - Méthode d'authentification

---

## ✅ Backend confirmé fonctionnel

Les tests confirment que le backend fonctionne :
- ✅ API Gateway accessible
- ✅ Endpoints répondent correctement
- ✅ CORS preflight fonctionne
- ✅ Authentification JWT requise

Le problème est probablement côté frontend (URL, CORS, ou token).



