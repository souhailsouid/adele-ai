# Guide Développeur Frontend - API 13F Filings

## 🔑 Informations essentielles

**Base URL API**: `https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod`  
**Authentification**: JWT Token (Cognito) - **Requis pour toutes les routes**  
**Format**: JSON

---

## 📡 Endpoints disponibles

### 1. Liste des fonds
```http
GET /funds
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "ARK Investment Management",
    "cik": "0001697748",
    "tier_influence": 8,
    "category": "hedge_fund",
    "created_at": "2025-11-19T..."
  }
]
```

### 2. Détails d'un fund
```http
GET /funds/{id}
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "id": 1,
  "name": "ARK Investment Management",
  "cik": "0001697748",
  "tier_influence": 8,
  "category": "hedge_fund",
  "created_at": "2025-11-19T..."
}
```

### 3. Holdings d'un fund
```http
GET /funds/{id}/holdings?limit=100
Authorization: Bearer <JWT_TOKEN>
```

**Query params:**
- `limit` (optionnel, défaut: 100): Nombre maximum de holdings

**Response:**
```json
[
  {
    "id": 123,
    "filing_id": 45,
    "ticker": "NVDA",
    "cusip": "67066G104",
    "shares": 5000000,
    "market_value": 2500000000,
    "type": "STOCK",
    "filing_date": "2025-10-26"
  }
]
```

**Note importante**: `market_value` est en **centimes** (diviser par 100 pour avoir des dollars, ou par 1000 pour avoir des milliers de dollars).

### 4. Filings 13F d'un fund
```http
GET /funds/{id}/filings
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
[
  {
    "id": 45,
    "accession_number": "0001697748-25-000001",
    "filing_date": "2025-10-26",
    "status": "PARSED",
    "form_type": "13F-HR",
    "created_at": "2025-11-19T...",
    "updated_at": "2025-11-19T..."
  }
]
```

**Status possibles:**
- `DISCOVERED`: Filing détecté, en attente de parsing
- `PARSED`: Parsing réussi, holdings disponibles
- `FAILED`: Erreur lors du parsing

### 5. Ajouter un fund
```http
POST /funds
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Bridgewater Associates",
  "cik": "0001350694",
  "tier_influence": 5,
  "category": "hedge_fund"
}
```

**Response:**
```json
{
  "fund": {
    "id": 6,
    "name": "Bridgewater Associates",
    "cik": "0001350694",
    "tier_influence": 5,
    "category": "hedge_fund",
    "created_at": "2025-11-19T..."
  },
  "message": "Fund created successfully. Filings discovery started."
}
```

**Catégories disponibles:**
- `hedge_fund`
- `family_office`
- `mutual_fund`
- `pension_fund`
- `other`

---

## 💻 Exemple de service API (TypeScript)

```typescript
// api/funds.ts

const API_BASE_URL = 'https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod';

// Types
export interface Fund {
  id: number;
  name: string;
  cik: string;
  tier_influence: number;
  category: string;
  created_at: string;
}

export interface Holding {
  id: number;
  filing_id: number;
  ticker: string | null;
  cusip: string | null;
  shares: number;
  market_value: number; // en centimes
  type: 'STOCK' | 'CALL' | 'PUT';
  filing_date: string;
}

export interface Filing {
  id: number;
  accession_number: string;
  filing_date: string;
  status: 'DISCOVERED' | 'PARSED' | 'FAILED';
  form_type: string;
  created_at: string;
  updated_at: string;
}

// Helper pour obtenir le token (à adapter selon votre système)
async function getAuthToken(): Promise<string> {
  // Exemple: return localStorage.getItem('jwt_token');
  // Ou avec AWS Amplify: const session = await Auth.currentSession(); return session.getIdToken().getJwtToken();
  throw new Error('Implement getAuthToken()');
}

// Helper pour les requêtes
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Fonctions API
export async function getFunds(): Promise<Fund[]> {
  return apiRequest<Fund[]>('/funds');
}

export async function getFund(id: number): Promise<Fund> {
  return apiRequest<Fund>(`/funds/${id}`);
}

export async function getFundHoldings(
  fundId: number,
  limit: number = 100
): Promise<Holding[]> {
  return apiRequest<Holding[]>(`/funds/${fundId}/holdings?limit=${limit}`);
}

export async function getFundFilings(fundId: number): Promise<Filing[]> {
  return apiRequest<Filing[]>(`/funds/${fundId}/filings`);
}

export async function createFund(input: {
  name: string;
  cik: string;
  tier_influence?: number;
  category?: string;
}): Promise<{ fund: Fund; message: string }> {
  return apiRequest('/funds', {
    method: 'POST',
    body: JSON.stringify({
      name: input.name,
      cik: input.cik,
      tier_influence: input.tier_influence ?? 3,
      category: input.category ?? 'hedge_fund',
    }),
  });
}
```

---

## 🎨 Exemple de composant React

```typescript
// components/FundHoldings.tsx
import { useState, useEffect } from 'react';
import { getFundHoldings, Holding } from '../api/funds';

interface FundHoldingsProps {
  fundId: number;
}

export function FundHoldings({ fundId }: FundHoldingsProps) {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    async function loadHoldings() {
      try {
        setLoading(true);
        setError(null);
        const data = await getFundHoldings(fundId, 100);
        if (!cancelled) {
          setHoldings(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHoldings();
    
    return () => {
      cancelled = true;
    };
  }, [fundId]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-600">Erreur: {error}</div>;

  // Calculer le total pour les pourcentages
  const totalValue = holdings.reduce((sum, h) => sum + h.market_value, 0);

  return (
    <div>
      <h2>Holdings ({holdings.length})</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Shares</th>
            <th>Market Value</th>
            <th>% Portfolio</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {holdings
            .sort((a, b) => b.market_value - a.market_value)
            .map((holding) => (
              <tr key={holding.id}>
                <td>{holding.ticker || '-'}</td>
                <td>{holding.shares.toLocaleString()}</td>
                <td>${(holding.market_value / 1000).toFixed(2)}M</td>
                <td>{((holding.market_value / totalValue) * 100).toFixed(2)}%</td>
                <td>{holding.type}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 🔧 Gestion des erreurs

```typescript
try {
  const funds = await getFunds();
} catch (error: any) {
  if (error.message.includes('401')) {
    // Token expiré ou invalide
    // Rediriger vers login ou rafraîchir le token
    console.error('Non authentifié');
  } else if (error.message.includes('404')) {
    // Resource non trouvé
    console.error('Fund non trouvé');
  } else {
    // Erreur serveur
    console.error('Erreur serveur:', error);
  }
}
```

---

## 📊 Cas d'usage principaux

### 1. Dashboard des fonds
- Afficher la liste des fonds avec `GET /funds`
- Afficher le dernier filing avec `GET /funds/{id}/filings`
- Afficher le statut de parsing

### 2. Page détail d'un fund
- Informations du fund: `GET /funds/{id}`
- Holdings: `GET /funds/{id}/holdings?limit=100`
- Filings: `GET /funds/{id}/filings`
- Trier les holdings par `market_value` pour afficher les top holdings

### 3. Graphiques
- **Pie Chart**: Top 10 holdings par `market_value`
- **Bar Chart**: Évolution des holdings dans le temps (comparer plusieurs filings)
- **Tableau**: Liste complète avec tri et filtres

### 4. Recherche
- Filtrer les holdings par `ticker`
- Filtrer par `type` (STOCK, CALL, PUT)
- Rechercher un ticker dans tous les fonds (nécessite plusieurs appels)

---

## ⚠️ Points importants

1. **Authentification**: Toutes les routes nécessitent un JWT token valide
2. **Format market_value**: Les valeurs sont en centimes (diviser par 100 pour dollars)
3. **Status des filings**: Vérifier `status === 'PARSED'` avant d'afficher les holdings
4. **CIK format**: Toujours 10 chiffres avec zéros à gauche (ex: `"0001697748"`)
5. **Rate limiting**: Pas de limite connue, mais éviter les appels en boucle

---

## 🚀 Processus automatique

Quand un fund est créé via `POST /funds`:
1. ✅ Fund créé dans la base
2. ✅ Filings découverts automatiquement depuis SEC EDGAR
3. ✅ Parser déclenché automatiquement pour chaque filing
4. ✅ Holdings parsés et disponibles via `GET /funds/{id}/holdings`

**Note**: Le parsing peut prendre quelques minutes. Vérifier le `status` des filings pour savoir quand les données sont prêtes.

---

## 📝 Exemple complet avec React Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFunds, getFund, getFundHoldings, getFundFilings, createFund } from './api/funds';

// Hook pour lister les funds
export function useFunds() {
  return useQuery({
    queryKey: ['funds'],
    queryFn: getFunds,
  });
}

// Hook pour un fund spécifique
export function useFund(id: number) {
  return useQuery({
    queryKey: ['funds', id],
    queryFn: () => getFund(id),
    enabled: !!id,
  });
}

// Hook pour les holdings
export function useFundHoldings(fundId: number, limit: number = 100) {
  return useQuery({
    queryKey: ['funds', fundId, 'holdings', limit],
    queryFn: () => getFundHoldings(fundId, limit),
    enabled: !!fundId,
  });
}

// Hook pour les filings
export function useFundFilings(fundId: number) {
  return useQuery({
    queryKey: ['funds', fundId, 'filings'],
    queryFn: () => getFundFilings(fundId),
    enabled: !!fundId,
  });
}

// Hook pour créer un fund
export function useCreateFund() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createFund,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funds'] });
    },
  });
}
```

---

## 🎯 Checklist d'implémentation

- [ ] Service API avec authentification JWT
- [ ] Liste des fonds avec statut de parsing
- [ ] Page détail fund avec onglets (Holdings / Filings)
- [ ] Tableau des holdings avec tri et filtres
- [ ] Graphique pie chart pour top holdings
- [ ] Gestion des erreurs (401, 404, 500)
- [ ] Loading states
- [ ] Format des valeurs (market_value en dollars)

---

## 📞 Support

Pour toute question ou problème:
- Vérifier les logs CloudWatch de l'API Lambda
- Vérifier que le JWT token est valide
- Vérifier le format du CIK (10 chiffres)



