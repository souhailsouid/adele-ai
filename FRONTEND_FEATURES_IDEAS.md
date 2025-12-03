# Idées de fonctionnalités Frontend - 13F Filings

## 🎯 Fonctionnalités prioritaires

### 1. 🔗 Liens directs vers les filings SEC

**Description**: Créer des liens directs vers les documents 13F sur le site de la SEC.

**Format URL SEC** (CORRIGÉ - les 13F ne sont pas en XBRL):
```
https://www.sec.gov/Archives/edgar/data/{CIK_SANS_ZEROS}/{ACCESSION_SANS_TIRETS}/
```

**Exemple avec les données disponibles**:
```typescript
// Composant pour afficher un lien vers le filing SEC
interface FilingLinkProps {
  cik: string;
  accessionNumber: string;
  filingDate: string;
}

export function FilingSECLink({ cik, accessionNumber, filingDate }: FilingLinkProps) {
  // Nettoyer le CIK (enlever les zéros à gauche pour l'URL SEC)
  const cleanCik = cik.replace(/^0+/, '');
  
  // Nettoyer l'accession_number (enlever les tirets)
  const cleanAccession = accessionNumber.replace(/-/g, '');
  
  // Construire l'URL SEC (page d'index du filing)
  const secUrl = `https://www.sec.gov/Archives/edgar/data/${cleanCik}/${cleanAccession}/`;
  
  return (
    <a 
      href={secUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      📄 Voir sur SEC.gov
      <span className="ml-2 text-xs text-gray-500">
        ({new Date(filingDate).toLocaleDateString()})
      </span>
    </a>
  );
}

// Utilisation dans un tableau de filings
export function FundFilingsTable({ filings }: { filings: Filing[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Accession Number</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filings.map(filing => (
          <tr key={filing.id}>
            <td>{new Date(filing.filing_date).toLocaleDateString()}</td>
            <td className="font-mono text-sm">{filing.accession_number}</td>
            <td>
              <StatusBadge status={filing.status} />
            </td>
            <td>
              <FilingSECLink 
                cik={filing.cik}
                accessionNumber={filing.accession_number}
                filingDate={filing.filing_date}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

**Alternative - URL directe vers le document**:
```typescript
// URL directe vers le document XML/HTML
const docUrl = `https://www.sec.gov/Archives/edgar/data/${cleanCik}/${accessionNumber.replace(/-/g, '')}/infotable.xml`;
```

---

### 2. 📊 Comparaison entre fonds

**Description**: Comparer les holdings de plusieurs fonds pour trouver les positions communes.

```typescript
// Composant de comparaison
interface FundComparisonProps {
  fundIds: number[];
}

export function FundComparison({ fundIds }: FundComparisonProps) {
  const [holdings, setHoldings] = useState<Record<number, Holding[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHoldings() {
      const allHoldings = await Promise.all(
        fundIds.map(id => getFundHoldings(id, 100))
      );
      
      const holdingsMap: Record<number, Holding[]> = {};
      fundIds.forEach((id, index) => {
        holdingsMap[id] = allHoldings[index];
      });
      
      setHoldings(holdingsMap);
      setLoading(false);
    }
    
    loadHoldings();
  }, [fundIds]);

  // Trouver les tickers communs
  const commonTickers = findCommonTickers(holdings);
  
  // Trouver les tickers uniques à chaque fund
  const uniqueTickers = findUniqueTickers(holdings);

  return (
    <div>
      <h2>Comparaison des fonds</h2>
      
      {/* Holdings communs */}
      <section>
        <h3>Holdings communs ({commonTickers.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Ticker</th>
              {fundIds.map(id => (
                <th key={id}>Fund {id} (Shares)</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {commonTickers.map(ticker => (
              <tr key={ticker}>
                <td>{ticker}</td>
                {fundIds.map(fundId => {
                  const holding = holdings[fundId]?.find(h => h.ticker === ticker);
                  return (
                    <td key={fundId}>
                      {holding ? holding.shares.toLocaleString() : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      
      {/* Holdings uniques */}
      <section>
        <h3>Holdings uniques</h3>
        {fundIds.map(fundId => (
          <div key={fundId}>
            <h4>Fund {fundId}</h4>
            <ul>
              {uniqueTickers[fundId]?.map(ticker => (
                <li key={ticker}>{ticker}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}

function findCommonTickers(holdings: Record<number, Holding[]>): string[] {
  const tickerSets = Object.values(holdings).map(h => 
    new Set(h.map(holding => holding.ticker).filter(Boolean))
  );
  
  if (tickerSets.length === 0) return [];
  
  const common = Array.from(tickerSets[0]).filter(ticker =>
    tickerSets.every(set => set.has(ticker))
  );
  
  return common;
}
```

---

### 3. 🔍 Recherche de ticker

**Description**: Rechercher un ticker dans tous les fonds pour voir qui le détient.

```typescript
export function TickerSearch() {
  const [ticker, setTicker] = useState('');
  const [results, setResults] = useState<Array<{
    fundId: number;
    fundName: string;
    shares: number;
    marketValue: number;
    filingDate: string;
  }>>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!ticker) return;
    
    setLoading(true);
    try {
      // Récupérer tous les funds
      const funds = await getFunds();
      
      // Rechercher le ticker dans chaque fund
      const allResults = await Promise.all(
        funds.map(async (fund) => {
          const holdings = await getFundHoldings(fund.id, 1000);
          const holding = holdings.find(h => 
            h.ticker?.toUpperCase() === ticker.toUpperCase()
          );
          
          if (holding) {
            return {
              fundId: fund.id,
              fundName: fund.name,
              shares: holding.shares,
              marketValue: holding.market_value,
              filingDate: holding.filing_date
            };
          }
          return null;
        })
      );
      
      setResults(allResults.filter(Boolean) as any);
    } catch (error) {
      console.error('Error searching ticker:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Rechercher un ticker (ex: NVDA)"
          className="px-4 py-2 border rounded"
          onKeyPress={(e) => e.key === 'Enter' && search()}
        />
        <button 
          onClick={search} 
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? 'Recherche...' : 'Rechercher'}
        </button>
      </div>
      
      {results.length > 0 && (
        <div className="mt-4">
          <h3>Résultats pour {ticker} ({results.length} fonds)</h3>
          <table>
            <thead>
              <tr>
                <th>Fund</th>
                <th>Shares</th>
                <th>Market Value</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.fundName}</td>
                  <td>{result.shares.toLocaleString()}</td>
                  <td>${(result.marketValue / 1000).toFixed(2)}M</td>
                  <td>{new Date(result.filingDate).toLocaleDateString()}</td>
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

---

### 4. 📈 Graphiques d'évolution

**Description**: Visualiser l'évolution des positions d'un ticker dans le temps.

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function TickerEvolutionChart({ 
  fundId, 
  ticker 
}: { 
  fundId: number; 
  ticker: string;
}) {
  const [data, setData] = useState<Array<{
    date: string;
    shares: number;
    marketValue: number;
  }>>([]);

  useEffect(() => {
    async function loadEvolution() {
      // Récupérer tous les filings
      const filings = await getFundFilings(fundId);
      const parsedFilings = filings.filter(f => f.status === 'PARSED');
      
      // Pour chaque filing, récupérer les holdings
      const evolutionData = await Promise.all(
        parsedFilings.map(async (filing) => {
          const holdings = await getFundHoldings(fundId, 1000);
          const holding = holdings.find(h => 
            h.ticker?.toUpperCase() === ticker.toUpperCase() &&
            h.filing_date === filing.filing_date
          );
          
          if (holding) {
            return {
              date: filing.filing_date,
              shares: holding.shares,
              marketValue: holding.market_value / 1000 // en millions
            };
          }
          return null;
        })
      );
      
      setData(evolutionData.filter(Boolean) as any);
    }
    
    loadEvolution();
  }, [fundId, ticker]);

  return (
    <div>
      <h3>Évolution de {ticker}</h3>
      <LineChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="shares" 
          stroke="#8884d8" 
          name="Shares"
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="marketValue" 
          stroke="#82ca9d" 
          name="Market Value (M$)"
        />
      </LineChart>
    </div>
  );
}
```

---

### 5. 📥 Export des données

**Description**: Exporter les holdings en CSV ou Excel.

```typescript
export function ExportHoldingsButton({ 
  holdings, 
  fundName 
}: { 
  holdings: Holding[]; 
  fundName: string;
}) {
  const exportToCSV = () => {
    const headers = ['Ticker', 'CUSIP', 'Shares', 'Market Value', 'Type', 'Date'];
    const rows = holdings.map(h => [
      h.ticker || '',
      h.cusip || '',
      h.shares.toString(),
      (h.market_value / 1000).toFixed(2),
      h.type,
      h.filing_date
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fundName}_holdings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button 
      onClick={exportToCSV}
      className="px-4 py-2 bg-green-600 text-white rounded"
    >
      📥 Exporter en CSV
    </button>
  );
}
```

---

### 6. 🔔 Alertes et notifications

**Description**: Notifier l'utilisateur des nouveaux filings ou changements importants.

```typescript
export function useFundAlerts(fundId: number) {
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  
  useEffect(() => {
    const interval = setInterval(async () => {
      const filings = await getFundFilings(fundId);
      const newFilings = filings.filter(f => 
        new Date(f.created_at) > lastCheck &&
        f.status === 'PARSED'
      );
      
      if (newFilings.length > 0) {
        // Afficher une notification
        newFilings.forEach(filing => {
          showNotification({
            title: 'Nouveau filing 13F',
            message: `Nouveau filing détecté pour ${filing.filing_date}`,
            type: 'info'
          });
        });
        
        setLastCheck(new Date());
      }
    }, 60000); // Vérifier toutes les minutes
    
    return () => clearInterval(interval);
  }, [fundId, lastCheck]);
}
```

---

### 7. 🎨 Visualisations interactives

**Description**: Graphiques interactifs pour explorer les données.

```typescript
// Pie chart interactif pour les top holdings
export function InteractiveHoldingsChart({ holdings }: { holdings: Holding[] }) {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  
  const top10 = holdings
    .sort((a, b) => b.market_value - a.market_value)
    .slice(0, 10);
  
  const data = top10.map(h => ({
    name: h.ticker || 'Unknown',
    value: h.market_value / 1000, // en millions
    shares: h.shares
  }));

  return (
    <div>
      <PieChart width={600} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          onClick={(data) => setSelectedSector(data.name)}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      
      {selectedSector && (
        <div className="mt-4">
          <h4>Détails: {selectedSector}</h4>
          {/* Afficher les détails du holding sélectionné */}
        </div>
      )}
    </div>
  );
}
```

---

### 8. 🔍 Filtres avancés

**Description**: Filtrer les holdings par différents critères.

```typescript
export function HoldingsFilters({ 
  holdings, 
  onFilter 
}: { 
  holdings: Holding[]; 
  onFilter: (filtered: Holding[]) => void;
}) {
  const [filters, setFilters] = useState({
    minValue: 0,
    maxValue: Infinity,
    type: 'all' as 'all' | 'STOCK' | 'CALL' | 'PUT',
    ticker: ''
  });

  useEffect(() => {
    const filtered = holdings.filter(h => {
      if (filters.ticker && !h.ticker?.toUpperCase().includes(filters.ticker.toUpperCase())) {
        return false;
      }
      if (filters.type !== 'all' && h.type !== filters.type) {
        return false;
      }
      const value = h.market_value / 1000; // en millions
      if (value < filters.minValue || value > filters.maxValue) {
        return false;
      }
      return true;
    });
    
    onFilter(filtered);
  }, [holdings, filters, onFilter]);

  return (
    <div className="flex gap-4 p-4 bg-gray-100 rounded">
      <div>
        <label>Valeur min (M$)</label>
        <input
          type="number"
          value={filters.minValue}
          onChange={(e) => setFilters({ ...filters, minValue: Number(e.target.value) })}
        />
      </div>
      <div>
        <label>Valeur max (M$)</label>
        <input
          type="number"
          value={filters.maxValue === Infinity ? '' : filters.maxValue}
          onChange={(e) => setFilters({ 
            ...filters, 
            maxValue: e.target.value ? Number(e.target.value) : Infinity 
          })}
        />
      </div>
      <div>
        <label>Type</label>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
        >
          <option value="all">Tous</option>
          <option value="STOCK">Stock</option>
          <option value="CALL">Call</option>
          <option value="PUT">Put</option>
        </select>
      </div>
      <div>
        <label>Rechercher ticker</label>
        <input
          type="text"
          value={filters.ticker}
          onChange={(e) => setFilters({ ...filters, ticker: e.target.value })}
          placeholder="NVDA, TSLA..."
        />
      </div>
    </div>
  );
}
```

---

### 9. 📱 Vue mobile optimisée

**Description**: Interface responsive pour mobile.

```typescript
export function MobileFundView({ fundId }: { fundId: number }) {
  const [fund, setFund] = useState<Fund | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'filings'>('overview');

  return (
    <div className="mobile-container">
      {/* Header avec onglets swipeables */}
      <div className="tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Vue d'ensemble
        </button>
        <button 
          className={activeTab === 'holdings' ? 'active' : ''}
          onClick={() => setActiveTab('holdings')}
        >
          Holdings
        </button>
        <button 
          className={activeTab === 'filings' ? 'active' : ''}
          onClick={() => setActiveTab('filings')}
        >
          Filings
        </button>
      </div>

      {/* Contenu selon l'onglet */}
      {activeTab === 'holdings' && (
        <HoldingsList 
          holdings={holdings} 
          compact={true}
        />
      )}
    </div>
  );
}
```

---

### 10. 🔗 Intégration avec d'autres données

**Description**: Enrichir les données avec des informations externes.

```typescript
// Exemple: Ajouter le prix actuel du ticker
export function EnrichedHolding({ holding }: { holding: Holding }) {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  
  useEffect(() => {
    if (holding.ticker) {
      // Appel à une API de prix (ex: Alpha Vantage, Yahoo Finance, etc.)
      fetch(`/api/stock-price/${holding.ticker}`)
        .then(res => res.json())
        .then(data => setCurrentPrice(data.price))
        .catch(err => console.error('Error fetching price:', err));
    }
  }, [holding.ticker]);

  const currentValue = currentPrice ? currentPrice * holding.shares : null;
  const change = currentValue && holding.market_value 
    ? ((currentValue - holding.market_value) / holding.market_value) * 100
    : null;

  return (
    <div>
      <div>{holding.ticker}</div>
      <div>Shares: {holding.shares.toLocaleString()}</div>
      <div>Filing Value: ${(holding.market_value / 1000).toFixed(2)}M</div>
      {currentValue && (
        <>
          <div>Current Value: ${(currentValue / 1000).toFixed(2)}M</div>
          <div className={change && change > 0 ? 'text-green-600' : 'text-red-600'}>
            {change ? `${change > 0 ? '+' : ''}${change.toFixed(2)}%` : ''}
          </div>
        </>
      )}
    </div>
  );
}
```

---

## 📋 Checklist d'implémentation

### Priorité Haute
- [ ] 🔗 Liens directs vers les filings SEC
- [ ] 🔍 Recherche de ticker dans tous les fonds
- [ ] 📊 Graphiques pie chart pour top holdings
- [ ] 📥 Export CSV des holdings

### Priorité Moyenne
- [ ] 📈 Graphiques d'évolution dans le temps
- [ ] 🔍 Filtres avancés (valeur, type, ticker)
- [ ] 📊 Comparaison entre fonds
- [ ] 🎨 Visualisations interactives

### Priorité Basse
- [ ] 🔔 Alertes et notifications
- [ ] 📱 Vue mobile optimisée
- [ ] 🔗 Intégration avec données externes (prix actuels)
- [ ] 📊 Dashboard avec métriques agrégées

---

## 💡 Endpoints API supplémentaires à créer (optionnel)

Pour certaines fonctionnalités, vous pourriez avoir besoin d'endpoints supplémentaires :

```typescript
// 1. Recherche globale de ticker
GET /holdings/search?ticker=NVDA
→ Retourne tous les fonds qui détiennent ce ticker

// 2. Top holdings agrégés
GET /holdings/top?limit=20
→ Top 20 holdings par valeur totale (tous fonds confondus)

// 3. Évolution d'un ticker
GET /holdings/evolution?ticker=NVDA&fund_id=1
→ Évolution des positions dans le temps

// 4. Comparaison de fonds
GET /funds/compare?ids=1,2,3
→ Holdings communs et différences
```

---

## 🚀 Exemple de page complète

```typescript
export function FundDetailPage({ fundId }: { fundId: number }) {
  const { data: fund } = useFund(fundId);
  const { data: holdings } = useFundHoldings(fundId);
  const { data: filings } = useFundFilings(fundId);
  
  return (
    <div>
      <header>
        <h1>{fund?.name}</h1>
        <p>CIK: {fund?.cik}</p>
      </header>
      
      <nav>
        <Tabs>
          <Tab label="Holdings">
            <HoldingsFilters holdings={holdings || []} />
            <InteractiveHoldingsChart holdings={holdings || []} />
            <HoldingsTable holdings={holdings || []} />
            <ExportHoldingsButton 
              holdings={holdings || []} 
              fundName={fund?.name || ''} 
            />
          </Tab>
          
          <Tab label="Filings">
            <FundFilingsTable filings={filings || []} />
          </Tab>
          
          <Tab label="Évolution">
            <TickerSearch />
            {/* Afficher les graphiques d'évolution */}
          </Tab>
        </Tabs>
      </nav>
    </div>
  );
}
```

