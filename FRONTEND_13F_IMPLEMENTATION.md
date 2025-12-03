# Guide d'implémentation Frontend pour les 13F Filings

## 📋 Vue d'ensemble

Ce guide explique comment intégrer les données 13F (holdings des fonds d'investissement) dans votre frontend.

## 🔌 API Endpoints disponibles

### Endpoints existants

#### 1. Liste des fonds
```typescript
GET /funds
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "data": [
    {
      "id": 1,
      "name": "ARK Investment Management",
      "cik": "0001697748",
      "tier_influence": 8,
      "category": "hedge_fund",
      "created_at": "2025-11-19T..."
    }
  ]
}
```

#### 2. Détails d'un fund
```typescript
GET /funds/{id}
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "data": {
    "id": 1,
    "name": "ARK Investment Management",
    "cik": "0001697748",
    ...
  }
}
```

#### 3. Holdings d'un fund
```typescript
GET /funds/{id}/holdings?limit=100
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "data": [
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
}
```

#### 4. Filings d'un fund
```typescript
GET /funds/{id}/filings
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "data": [
    {
      "id": 45,
      "accession_number": "0001697748-25-000001",
      "filing_date": "2025-10-26",
      "status": "PARSED",
      "holdings_count": 150
    }
  ]
}
```

#### 5. Ajouter un fund
```typescript
POST /funds
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Body:
{
  "name": "Bridgewater Associates",
  "cik": "0001350694",
  "tier_influence": 5,
  "category": "hedge_fund"
}

Response:
{
  "data": {
    "id": 6,
    "name": "Bridgewater Associates",
    ...
  }
}
```

## 🎨 Composants Frontend suggérés

### 1. Dashboard des Fonds

```typescript
// components/FundsDashboard.tsx
import { useEffect, useState } from 'react';

interface Fund {
  id: number;
  name: string;
  cik: string;
  tier_influence: number;
  category: string;
}

export function FundsDashboard() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/funds', {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setFunds(data.data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Fonds d'investissement</h1>
      {funds.map(fund => (
        <FundCard key={fund.id} fund={fund} />
      ))}
    </div>
  );
}
```

### 2. Visualisation des Holdings

```typescript
// components/FundHoldings.tsx
interface Holding {
  ticker: string;
  shares: number;
  market_value: number;
  type: string;
}

export function FundHoldings({ fundId }: { fundId: number }) {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [sortBy, setSortBy] = useState<'value' | 'shares'>('value');

  useEffect(() => {
    fetch(`/api/funds/${fundId}/holdings?limit=100`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const sorted = data.data.sort((a, b) => 
          sortBy === 'value' 
            ? b.market_value - a.market_value
            : b.shares - a.shares
        );
        setHoldings(sorted);
      });
  }, [fundId, sortBy]);

  return (
    <div>
      <h2>Top Holdings</h2>
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Shares</th>
            <th>Market Value</th>
            <th>% of Portfolio</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map(holding => (
            <tr key={holding.ticker}>
              <td>{holding.ticker}</td>
              <td>{holding.shares.toLocaleString()}</td>
              <td>${(holding.market_value / 1000).toFixed(2)}M</td>
              <td>{calculatePercentage(holding, holdings)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 3. Graphique Pie Chart (Top Holdings)

```typescript
// components/HoldingsPieChart.tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

export function HoldingsPieChart({ holdings }: { holdings: Holding[] }) {
  const top10 = holdings.slice(0, 10);
  const totalValue = holdings.reduce((sum, h) => sum + h.market_value, 0);
  
  const data = top10.map(h => ({
    name: h.ticker,
    value: (h.market_value / totalValue) * 100
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', ...];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
```

### 4. Recherche de Ticker

```typescript
// components/TickerSearch.tsx
export function TickerSearch() {
  const [ticker, setTicker] = useState('');
  const [results, setResults] = useState([]);

  const search = async () => {
    // Note: Cet endpoint devra être créé
    const res = await fetch(`/api/holdings/search?ticker=${ticker}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    const data = await res.json();
    setResults(data.data);
  };

  return (
    <div>
      <input 
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        placeholder="Rechercher un ticker (ex: NVDA)"
      />
      <button onClick={search}>Rechercher</button>
      
      {results.map(result => (
        <div key={result.fund_id}>
          <strong>{result.fund_name}</strong>: {result.shares.toLocaleString()} shares
        </div>
      ))}
    </div>
  );
}
```

### 5. Comparaison de Fonds

```typescript
// components/FundComparison.tsx
export function FundComparison({ fundIds }: { fundIds: number[] }) {
  const [holdings, setHoldings] = useState<Record<number, Holding[]>>({});

  useEffect(() => {
    Promise.all(
      fundIds.map(id => 
        fetch(`/api/funds/${id}/holdings?limit=100`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        }).then(res => res.json())
      )
    ).then(results => {
      const holdingsMap = {};
      results.forEach((result, index) => {
        holdingsMap[fundIds[index]] = result.data;
      });
      setHoldings(holdingsMap);
    });
  }, [fundIds]);

  // Trouver les holdings communs
  const commonHoldings = findCommonHoldings(holdings);

  return (
    <div>
      <h2>Holdings communs</h2>
      {commonHoldings.map(ticker => (
        <div key={ticker}>
          <strong>{ticker}</strong>
          {fundIds.map(fundId => (
            <span key={fundId}>
              Fund {fundId}: {getHoldingValue(holdings[fundId], ticker)}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
```

## 📊 Endpoints supplémentaires à créer (optionnel)

### 1. Top Holdings
```typescript
GET /funds/{id}/holdings/top?limit=10
→ Retourne les top N holdings par valeur
```

### 2. Recherche de ticker
```typescript
GET /holdings/search?ticker=NVDA
→ Retourne tous les fonds qui détiennent ce ticker
```

### 3. Comparaison de fonds
```typescript
GET /funds/compare?ids=1,2,3
→ Compare les holdings de plusieurs fonds
```

### 4. Évolution des positions
```typescript
GET /funds/{id}/holdings/history?ticker=NVDA
→ Évolution d'une position dans le temps
```

## 🎯 Exemple d'intégration React complète

```typescript
// pages/FundDetail.tsx
import { useParams } from 'react-router-dom';
import { FundHoldings } from '../components/FundHoldings';
import { HoldingsPieChart } from '../components/HoldingsPieChart';
import { FundFilings } from '../components/FundFilings';

export function FundDetailPage() {
  const { id } = useParams();
  const [fund, setFund] = useState(null);
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    // Charger les données du fund
    Promise.all([
      fetch(`/api/funds/${id}`).then(r => r.json()),
      fetch(`/api/funds/${id}/holdings?limit=100`).then(r => r.json())
    ]).then(([fundData, holdingsData]) => {
      setFund(fundData.data);
      setHoldings(holdingsData.data);
    });
  }, [id]);

  return (
    <div>
      <h1>{fund?.name}</h1>
      
      <div className="grid grid-cols-2">
        <div>
          <h2>Top Holdings</h2>
          <FundHoldings holdings={holdings} />
        </div>
        
        <div>
          <h2>Répartition</h2>
          <HoldingsPieChart holdings={holdings} />
        </div>
      </div>
      
      <div>
        <h2>Filings 13F</h2>
        <FundFilings fundId={id} />
      </div>
    </div>
  );
}
```

## 🔐 Authentification

Tous les endpoints nécessitent un JWT token dans le header:
```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## 📝 Notes importantes

1. **Rate Limiting**: Les endpoints peuvent avoir des limites de taux
2. **Pagination**: Utilisez `limit` et `offset` pour les grandes listes
3. **Caching**: Cachez les données des holdings (changent trimestriellement)
4. **Format des valeurs**: Les `market_value` sont en centimes (diviser par 100 pour avoir des dollars)

## 🚀 Prochaines étapes

1. Partagez votre repo frontend
2. Je pourrai adapter ces exemples à votre stack (React, Vue, etc.)
3. Créer les endpoints supplémentaires si nécessaire
4. Ajouter des fonctionnalités spécifiques selon vos besoins



