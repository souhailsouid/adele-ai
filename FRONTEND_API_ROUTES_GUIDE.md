# 🔗 Guide des Routes API - Frontend

## ⚠️ Problème Identifié

Vous appelez : `/api/ticker-activity-by-type?symbol=TSLA&type=ownership`

**Cette route n'existe pas dans le backend !**

## ✅ Routes Disponibles

Le backend utilise des routes RESTful avec le type dans le **path**, pas dans la **query string**.

### Format Correct

```
GET /ticker-activity/{ticker}/{type}
```

### Routes Disponibles

| Type | Route Backend | Exemple |
|------|--------------|---------|
| `quote` | `GET /ticker-activity/{ticker}/quote` | `/ticker-activity/TSLA/quote` |
| `ownership` | `GET /ticker-activity/{ticker}/ownership` | `/ticker-activity/TSLA/ownership` |
| `activity` | `GET /ticker-activity/{ticker}/activity` | `/ticker-activity/TSLA/activity` |
| `hedge-funds` | `GET /ticker-activity/{ticker}/hedge-funds` | `/ticker-activity/TSLA/hedge-funds` |
| `insiders` | `GET /ticker-activity/{ticker}/insiders` | `/ticker-activity/TSLA/insiders` |
| `congress` | `GET /ticker-activity/{ticker}/congress` | `/ticker-activity/TSLA/congress` |
| `options` | `GET /ticker-activity/{ticker}/options` | `/ticker-activity/TSLA/options` |
| `dark-pool` | `GET /ticker-activity/{ticker}/dark-pool` | `/ticker-activity/TSLA/dark-pool` |
| `stats` | `GET /ticker-activity/{ticker}/stats` | `/ticker-activity/TSLA/stats` |

## 🔧 Solution Frontend

### Option 1 : Utiliser les Routes Directement

```typescript
// ❌ Ancien format (ne fonctionne pas)
const response = await fetch('/api/ticker-activity-by-type?symbol=TSLA&type=ownership');

// ✅ Nouveau format (correct)
const response = await fetch('/api/ticker-activity/TSLA/ownership');
```

### Option 2 : Créer un Helper Function

```typescript
// utils/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod';

export async function getTickerActivity(
  ticker: string,
  type: 'quote' | 'ownership' | 'activity' | 'hedge-funds' | 'insiders' | 'congress' | 'options' | 'dark-pool' | 'stats',
  options?: {
    limit?: number;
    min_premium?: number;
    force_refresh?: boolean;
  }
) {
  const session = await Auth.currentSession();
  const accessToken = session.getAccessToken().getJwtToken();

  // Construire l'URL avec les query params
  const url = new URL(`${API_BASE_URL}/ticker-activity/${ticker}/${type}`);
  if (options?.limit) url.searchParams.set('limit', options.limit.toString());
  if (options?.min_premium) url.searchParams.set('min_premium', options.min_premium.toString());
  if (options?.force_refresh) url.searchParams.set('force_refresh', 'true');

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Utilisation
const ownership = await getTickerActivity('TSLA', 'ownership', { limit: 10 });
const quote = await getTickerActivity('TSLA', 'quote');
```

### Option 3 : Créer une Route API Next.js (Proxy)

Si vous voulez garder votre format actuel, créez une route API Next.js qui fait le mapping :

```typescript
// pages/api/ticker-activity-by-type.ts (ou app/api/ticker-activity-by-type/route.ts)
import { NextApiRequest, NextApiResponse } from 'next';
import { Auth } from 'aws-amplify';

const API_BASE_URL = 'https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbol, type } = req.query;

  if (!symbol || !type) {
    return res.status(400).json({ error: 'Missing symbol or type parameter' });
  }

  try {
    // Récupérer le token
    const session = await Auth.currentSession();
    const accessToken = session.getAccessToken().getJwtToken();

    // Mapper le type vers la route backend
    const typeMap: Record<string, string> = {
      'ownership': 'ownership',
      'quote': 'quote',
      'activity': 'activity',
      'hedge-funds': 'hedge-funds',
      'hedgeFunds': 'hedge-funds', // Support camelCase
      'insiders': 'insiders',
      'congress': 'congress',
      'options': 'options',
      'dark-pool': 'dark-pool',
      'darkPool': 'dark-pool', // Support camelCase
      'stats': 'stats',
    };

    const backendType = typeMap[type as string];
    if (!backendType) {
      return res.status(400).json({ error: `Invalid type: ${type}` });
    }

    // Construire l'URL backend
    const backendUrl = `${API_BASE_URL}/ticker-activity/${symbol}/${backendType}`;
    
    // Ajouter les query params supplémentaires
    const url = new URL(backendUrl);
    Object.entries(req.query).forEach(([key, value]) => {
      if (key !== 'symbol' && key !== 'type' && value) {
        url.searchParams.set(key, value as string);
      }
    });

    // Appeler le backend
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      return res.status(response.status).json(error);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('API Error:', error);
    
    // Vérifier si c'est une erreur d'authentification
    if (error.message?.includes('No current user') || error.message?.includes('not authenticated')) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Not authenticated. Please sign in first.',
      });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

## 🔍 Vérification de l'Authentification

### Vérifier que le Token est Envoyé

```typescript
// Debug helper
async function debugAuth() {
  try {
    const session = await Auth.currentSession();
    const accessToken = session.getAccessToken().getJwtToken();
    
    console.log('Token présent:', !!accessToken);
    console.log('Token valide:', session.isValid());
    console.log('Token expire dans:', new Date(session.getAccessToken().getExpiration() * 1000));
    
    // Décoder le token (pour debug)
    const parts = accessToken.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      console.log('Token payload:', payload);
    }
  } catch (error) {
    console.error('Erreur auth:', error);
  }
}
```

### Vérifier les Headers

```typescript
// Vérifier que le header Authorization est bien envoyé
const response = await fetch('/api/ticker-activity/TSLA/ownership', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});

// Dans les DevTools Network, vérifier :
// - Request Headers → Authorization: Bearer eyJ...
// - Status: 200 (pas 401)
```

## 🐛 Dépannage

### Erreur 401 "Authentication required"

**Causes possibles** :
1. ❌ Token non envoyé → Vérifier le header `Authorization`
2. ❌ Token expiré → Rafraîchir la session
3. ❌ Mauvais token (ID au lieu d'Access) → Utiliser `accessToken`
4. ❌ Route inexistante → Utiliser les routes correctes ci-dessus

**Solution** :
```typescript
// Vérifier la session
const session = await Auth.currentSession();
if (!session.isValid()) {
  // Rafraîchir
  await Auth.currentAuthenticatedUser();
}

// Utiliser le bon token
const accessToken = session.getAccessToken().getJwtToken();

// Utiliser la bonne route
const response = await fetch(
  'https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod/ticker-activity/TSLA/ownership',
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  }
);
```

## 📝 Exemple Complet

```typescript
// hooks/useTickerActivity.ts
import { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

const API_BASE_URL = 'https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod';

export function useTickerActivity(
  ticker: string,
  type: 'quote' | 'ownership' | 'activity' | 'insiders' | 'congress' | 'options' | 'dark-pool' | 'stats',
  options?: { limit?: number }
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Récupérer le token
        const session = await Auth.currentSession();
        if (!session.isValid()) {
          throw new Error('Session expired. Please sign in again.');
        }
        
        const accessToken = session.getAccessToken().getJwtToken();

        // Construire l'URL
        const url = new URL(`${API_BASE_URL}/ticker-activity/${ticker}/${type}`);
        if (options?.limit) {
          url.searchParams.set('limit', options.limit.toString());
        }

        // Appel API
        const response = await fetch(url.toString(), {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    if (ticker && type) {
      fetchData();
    }
  }, [ticker, type, options?.limit]);

  return { data, loading, error };
}

// Utilisation dans un composant
function TickerOwnership({ ticker }: { ticker: string }) {
  const { data, loading, error } = useTickerActivity(ticker, 'ownership', { limit: 10 });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div>
      <h2>Ownership ({data.count})</h2>
      {data.data.map((item: any) => (
        <div key={item.name}>
          {item.name}: {item.shares} shares
        </div>
      ))}
    </div>
  );
}
```

---

## ✅ Résumé

1. **Utilisez les routes RESTful** : `/ticker-activity/{ticker}/{type}`
2. **Utilisez l'Access Token** : `Authorization: Bearer {accessToken}`
3. **Vérifiez que la session est valide** avant d'appeler l'API
4. **Créez un proxy Next.js** si vous voulez garder votre format actuel

