# Guide Frontend - API Funds

## 📡 Configuration de base

**Base URL**: `https://xoqwsona9k.execute-api.eu-west-3.amazonaws.com/prod`  
**Auth**: JWT Token (Cognito) - Requis pour toutes les routes  
**Headers**: 
```typescript
{
  'Authorization': `Bearer ${jwtToken}`,
  'Content-Type': 'application/json'
}
```

## 🎯 Routes disponibles

### 1. POST /funds - Créer un nouveau fund
### 2. GET /funds - Lister tous les funds
### 3. GET /funds/{id} - Détails d'un fund
### 4. GET /funds/{id}/holdings - Holdings d'un fund
### 5. GET /funds/{id}/filings - Filings d'un fund

## 🔧 Service API complet (TypeScript/React)

### Configuration

```typescript
// api/funds.ts - Service centralisé pour les funds

const API_BASE_URL = 'https://xoqwsona9k.execute-api.eu-west-3.amazonaws.com/prod';

// Helper pour obtenir le token JWT (à adapter selon votre système d'auth)
async function getAuthToken(): Promise<string> {
  // Exemple avec AWS Amplify
  // const session = await Auth.currentSession();
  // return session.getIdToken().getJwtToken();
  
  // Ou avec votre système d'auth
  // return localStorage.getItem('jwt_token');
  
  throw new Error('Implement getAuthToken()');
}

// Helper pour faire les requêtes
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
```

### 1. Créer un fund

```typescript
interface CreateFundInput {
  name: string;
  cik: string; // Format: "0001234567" (10 chiffres)
  tier_influence?: number; // 1-5, défaut: 3
  category?: 'hedge_fund' | 'family_office' | 'mutual_fund' | 'pension_fund' | 'other'; // défaut: 'hedge_fund'
}

interface CreateFundResponse {
  fund: {
    id: number;
    name: string;
    cik: string;
    tier_influence: number;
    category: string;
    created_at: string;
  };
  message: string;
}

export async function createFund(input: CreateFundInput): Promise<CreateFundResponse> {
  return apiRequest<CreateFundResponse>('/funds', {
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

### 2. Lister tous les funds

```typescript
interface Fund {
  id: number;
  name: string;
  cik: string;
  tier_influence: number;
  category: string;
  created_at: string;
}

export async function getFunds(): Promise<Fund[]> {
  return apiRequest<Fund[]>('/funds');
}
```

### 3. Obtenir un fund par ID

```typescript
export async function getFund(id: number): Promise<Fund> {
  return apiRequest<Fund>(`/funds/${id}`);
}
```

### 4. Obtenir les holdings d'un fund

```typescript
interface Holding {
  id: number;
  fund_id: number;
  filing_id: number;
  cik: string;
  ticker: string | null;
  cusip: string | null;
  shares: number;
  market_value: number; // en milliers de dollars
  type: 'stock' | 'call' | 'put';
  created_at: string;
}

export async function getFundHoldings(
  fundId: number,
  limit: number = 100
): Promise<Holding[]> {
  return apiRequest<Holding[]>(`/funds/${fundId}/holdings?limit=${limit}`);
}
```

### 5. Obtenir les filings d'un fund

```typescript
interface Filing {
  id: number;
  fund_id: number;
  cik: string;
  accession_number: string;
  form_type: string; // "13F-HR" ou "13F-HR/A"
  filing_date: string;
  status: 'DISCOVERED' | 'PARSED' | 'FAILED';
  created_at: string;
  updated_at: string;
}

export async function getFundFilings(fundId: number): Promise<Filing[]> {
  return apiRequest<Filing[]>(`/funds/${fundId}/filings`);
}
```

## 🎨 Exemple d'utilisation dans un composant React

```typescript
import { useState, useEffect } from 'react';
import { createFund, getFunds, getFund, getFundHoldings, getFundFilings } from './api/funds';

// Composant pour ajouter un fund
function AddFundForm() {
  const [cik, setCik] = useState('');
  const [name, setName] = useState('');
  const [tierInfluence, setTierInfluence] = useState(3);
  const [category, setCategory] = useState<'hedge_fund' | 'family_office' | 'mutual_fund' | 'pension_fund' | 'other'>('hedge_fund');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await createFund({
        cik,
        name,
        tier_influence: tierInfluence,
        category,
      });
      
      console.log('Fund created:', result);
      setSuccess(true);
      // Reset form
      setCik('');
      setName('');
      
      // Optionnel: rediriger vers la page du fund
      // navigate(`/funds/${result.fund.id}`);
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding fund:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          CIK (10 chiffres) *
        </label>
        <input
          type="text"
          value={cik}
          onChange={(e) => setCik(e.target.value)}
          placeholder="0001234567"
          pattern="[0-9]{10}"
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Nom du fund *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Berkshire Hathaway"
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Tier Influence (1-5)
        </label>
        <input
          type="number"
          min="1"
          max="5"
          value={tierInfluence}
          onChange={(e) => setTierInfluence(parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Catégorie
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="hedge_fund">Hedge Fund</option>
          <option value="family_office">Family Office</option>
          <option value="mutual_fund">Mutual Fund</option>
          <option value="pension_fund">Pension Fund</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded">
          Fund créé avec succès ! Les filings sont en cours de découverte...
        </div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Ajout en cours...' : 'Ajouter le fund'}
      </button>
    </form>
  );
}

// Composant pour afficher la liste des funds
function FundsList() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFunds();
  }, []);

  const loadFunds = async () => {
    try {
      setLoading(true);
      const data = await getFunds();
      setFunds(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-600">Erreur: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Funds</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {funds.map((fund) => (
          <div key={fund.id} className="p-4 border rounded-lg hover:shadow-md">
            <h3 className="font-semibold text-lg">{fund.name}</h3>
            <p className="text-sm text-gray-600">CIK: {fund.cik}</p>
            <p className="text-sm text-gray-600">Tier: {fund.tier_influence}/5</p>
            <p className="text-sm text-gray-600">Catégorie: {fund.category}</p>
            <a
              href={`/funds/${fund.id}`}
              className="mt-2 inline-block text-blue-600 hover:underline"
            >
              Voir détails →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

// Composant pour afficher les détails d'un fund
function FundDetails({ fundId }: { fundId: number }) {
  const [fund, setFund] = useState<Fund | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [filings, setFilings] = useState<Filing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'holdings' | 'filings'>('holdings');

  useEffect(() => {
    loadFundData();
  }, [fundId]);

  const loadFundData = async () => {
    try {
      setLoading(true);
      const [fundData, holdingsData, filingsData] = await Promise.all([
        getFund(fundId),
        getFundHoldings(fundId),
        getFundFilings(fundId),
      ]);
      
      setFund(fundData);
      setHoldings(holdingsData);
      setFilings(filingsData);
    } catch (err) {
      console.error('Error loading fund data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!fund) return <div>Fund non trouvé</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{fund.name}</h1>
        <p className="text-gray-600">CIK: {fund.cik}</p>
        <p className="text-gray-600">Tier: {fund.tier_influence}/5</p>
        <p className="text-gray-600">Catégorie: {fund.category}</p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <button
          onClick={() => setActiveTab('holdings')}
          className={`px-4 py-2 ${activeTab === 'holdings' ? 'border-b-2 border-blue-600' : ''}`}
        >
          Holdings ({holdings.length})
        </button>
        <button
          onClick={() => setActiveTab('filings')}
          className={`px-4 py-2 ${activeTab === 'filings' ? 'border-b-2 border-blue-600' : ''}`}
        >
          Filings ({filings.length})
        </button>
      </div>

      {/* Holdings Tab */}
      {activeTab === 'holdings' && (
        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Ticker</th>
                <th className="text-left p-2">CUSIP</th>
                <th className="text-right p-2">Shares</th>
                <th className="text-right p-2">Market Value (K$)</th>
                <th className="text-left p-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => (
                <tr key={holding.id} className="border-b">
                  <td className="p-2">{holding.ticker || '-'}</td>
                  <td className="p-2">{holding.cusip || '-'}</td>
                  <td className="text-right p-2">{holding.shares.toLocaleString()}</td>
                  <td className="text-right p-2">${holding.market_value.toLocaleString()}</td>
                  <td className="p-2">{holding.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Filings Tab */}
      {activeTab === 'filings' && (
        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Accession Number</th>
                <th className="text-left p-2">Form Type</th>
                <th className="text-left p-2">Filing Date</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filings.map((filing) => (
                <tr key={filing.id} className="border-b">
                  <td className="p-2">{filing.accession_number}</td>
                  <td className="p-2">{filing.form_type}</td>
                  <td className="p-2">{new Date(filing.filing_date).toLocaleDateString()}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      filing.status === 'PARSED' ? 'bg-green-100 text-green-800' :
                      filing.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {filing.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

## 📋 Format des requêtes et réponses

### POST /funds - Créer un fund

**Request:**
```json
{
  "name": "Nom du fund",
  "cik": "0001234567",
  "tier_influence": 5,
  "category": "hedge_fund"
}
```

**Response:**
```json
{
  "fund": {
    "id": 3,
    "name": "Berkshire Hathaway",
    "cik": "0001067983",
    "tier_influence": 5,
    "category": "hedge_fund",
    "created_at": "2025-11-17T16:00:00Z"
  },
  "message": "Fund created successfully. Filings discovery started."
}
```

### GET /funds - Lister les funds

**Response:**
```json
[
  {
    "id": 1,
    "name": "ARK Investment Management",
    "cik": "0001697748",
    "tier_influence": 5,
    "category": "hedge_fund",
    "created_at": "2025-11-17T16:00:00Z"
  }
]
```

### GET /funds/{id}/holdings - Holdings

**Query params:**
- `limit` (optionnel, défaut: 100): Nombre maximum de holdings à retourner

**Response:**
```json
[
  {
    "id": 1,
    "fund_id": 1,
    "filing_id": 1,
    "cik": "0001697748",
    "ticker": "TSLA",
    "cusip": "88160R101",
    "shares": 1000000,
    "market_value": 250000,
    "type": "stock",
    "created_at": "2025-11-17T16:00:00Z"
  }
]
```

### GET /funds/{id}/filings - Filings

**Response:**
```json
[
  {
    "id": 1,
    "fund_id": 1,
    "cik": "0001697748",
    "accession_number": "0001697748-25-000001",
    "form_type": "13F-HR",
    "filing_date": "2025-11-15",
    "status": "PARSED",
    "created_at": "2025-11-17T16:00:00Z",
    "updated_at": "2025-11-17T16:05:00Z"
  }
]
```

## ⚠️ Gestion des erreurs

```typescript
try {
  const result = await createFund({ cik: '0001234567', name: 'Test Fund' });
} catch (error: any) {
  if (error.message.includes('400')) {
    // Erreur de validation (CIK invalide, champs manquants)
    console.error('Données invalides:', error);
  } else if (error.message.includes('401')) {
    // Non authentifié (JWT manquant ou invalide)
    console.error('Non authentifié, reconnectez-vous');
    // Rediriger vers la page de login
  } else if (error.message.includes('409')) {
    // Fund déjà existant
    console.error('Ce fund existe déjà');
  } else {
    // Erreur serveur
    console.error('Erreur serveur:', error);
  }
}
```

## 🔄 Processus automatique

Quand vous créez un fund via `POST /funds` :

1. ✅ Le fund est créé dans la base
2. ✅ Les filings sont découverts depuis EDGAR (13F-HR et 13F-HR/A)
3. ✅ Les filings sont insérés dans `fund_filings` avec le statut `DISCOVERED`
4. ✅ Le parser est déclenché automatiquement via EventBridge pour chaque filing
5. ✅ Les holdings sont parsés et insérés dans `fund_holdings`
6. ✅ Le statut du filing passe à `PARSED` ou `FAILED`

**Note**: Le parsing peut prendre quelques minutes selon le nombre de filings. Vous pouvez vérifier le statut via `GET /funds/{id}/filings`.

## 💡 Exemple d'utilisation simple (JavaScript vanilla)

```javascript
// Fonction pour ajouter un fund
async function addFund(cik, name) {
  // Récupérer le token depuis votre système d'auth
  const token = localStorage.getItem('jwt_token'); // ou votre méthode
  
  const response = await fetch(
    'https://xoqwsona9k.execute-api.eu-west-3.amazonaws.com/prod/funds',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        cik, // Format: "0001234567" (10 chiffres)
        tier_influence: tierInfluence, // 1-5
        category: 'hedge_fund', // ou 'family_office', 'mutual_fund', etc.
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Failed to add fund: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
}

// Utilisation dans un composant React
function AddFundForm() {
  const [cik, setCik] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await addFund(cik, name, 5);
      console.log('Fund created:', result);
      alert(`Fund "${result.fund.name}" créé avec succès!`);
      // Reset form
      setCik('');
      setName('');
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding fund:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          CIK (10 chiffres):
          <input
            type="text"
            value={cik}
            onChange={(e) => setCik(e.target.value)}
            placeholder="0001234567"
            pattern="[0-9]{10}"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Nom du fund:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Berkshire Hathaway"
            required
          />
        </label>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Ajout en cours...' : 'Ajouter le fund'}
      </button>
    </form>
  );
}
```

  
  const response = await fetch(
    'https://xoqwsona9k.execute-api.eu-west-3.amazonaws.com/prod/funds',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        cik,
        tier_influence: 5,
        category: 'hedge_fund',
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add fund');
  }

  return await response.json();
}

// Utilisation
addFund('0001067983', 'Berkshire Hathaway')
  .then(result => {
    console.log('Fund created:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

## 🚀 Exemple avec React Query (TanStack Query)

Pour une meilleure gestion du cache et des états :

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createFund, getFunds, getFund, getFundHoldings, getFundFilings } from './api/funds';

// Hook pour créer un fund
export function useCreateFund() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createFund,
    onSuccess: () => {
      // Invalider la liste des funds pour la rafraîchir
      queryClient.invalidateQueries({ queryKey: ['funds'] });
    },
  });
}

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

// Utilisation dans un composant
function AddFundButton() {
  const createFund = useCreateFund();
  
  const handleClick = () => {
    createFund.mutate({
      cik: '0001067983',
      name: 'Berkshire Hathaway',
      tier_influence: 5,
    });
  };
  
  return (
    <button onClick={handleClick} disabled={createFund.isPending}>
      {createFund.isPending ? 'Création...' : 'Créer fund'}
    </button>
  );
}
```

## 📚 Résumé des routes

| Route | Method | Description | Query Params |
|-------|--------|-------------|--------------|
| `/funds` | POST | Créer un nouveau fund | - |
| `/funds` | GET | Lister tous les funds | - |
| `/funds/{id}` | GET | Détails d'un fund | - |
| `/funds/{id}/holdings` | GET | Holdings d'un fund | `limit` (défaut: 100) |
| `/funds/{id}/filings` | GET | Filings d'un fund | - |

## 🔐 Authentification

Toutes les routes nécessitent un JWT token valide dans le header `Authorization` :

```
Authorization: Bearer <your-jwt-token>
```

Le token doit être obtenu via AWS Cognito. Si le token expire (erreur 401), vous devez :
1. Rafraîchir le token
2. Ou rediriger l'utilisateur vers la page de connexion

