# 📋 Documentation - Filtres Options Flow Alerts

## 🎯 Endpoint

`GET /ticker-activity/{ticker}/options`

## 📝 Paramètres Disponibles

### Paramètres Requis/Optionnels de Base

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `ticker` | string | - | **Requis** - Le symbole du ticker (ex: TSLA) |
| `limit` | integer | 100 | Nombre d'éléments à retourner (max: 200) |
| `min_premium` | integer | 10000 | Premium minimum en dollars |

### Filtres Optionnels (selon doc Unusual Whales)

| Paramètre | Type | Description |
|-----------|------|-------------|
| `max_premium` | integer | Premium maximum en dollars |
| `is_call` | boolean | Filtrer uniquement les calls (true) ou exclure les calls (false) |
| `is_put` | boolean | Filtrer uniquement les puts (true) ou exclure les puts (false) |
| `is_sweep` | boolean | Filtrer uniquement les sweeps (true) ou exclure (false) |
| `is_floor` | boolean | Filtrer uniquement les floor trades (true) ou exclure (false) |
| `is_otm` | boolean | Filtrer uniquement les contrats out-of-the-money (true) |
| `min_size` | integer | Taille minimum (somme des tailles de toutes les transactions) |
| `max_size` | integer | Taille maximum |
| `min_dte` | integer | Jours minimum jusqu'à l'expiration (Days To Expiry) |
| `max_dte` | integer | Jours maximum jusqu'à l'expiration |
| `min_volume` | integer | Volume minimum sur le contrat |
| `max_volume` | integer | Volume maximum sur le contrat |

## 📚 Exemples d'Utilisation

### Exemple 1 : Options Calls uniquement avec premium élevé

```bash
GET /ticker-activity/TSLA/options?limit=50&min_premium=50000&is_call=true
```

### Exemple 2 : Puts OTM uniquement

```bash
GET /ticker-activity/TSLA/options?is_put=true&is_otm=true&min_premium=10000
```

### Exemple 3 : Sweeps uniquement avec taille minimum

```bash
GET /ticker-activity/TSLA/options?is_sweep=true&min_size=100&min_premium=25000
```

### Exemple 4 : Options avec expiration proche (0-7 jours)

```bash
GET /ticker-activity/TSLA/options?min_dte=0&max_dte=7&min_premium=15000
```

### Exemple 5 : Floor trades uniquement

```bash
GET /ticker-activity/TSLA/options?is_floor=true&min_premium=50000
```

### Exemple 6 : Combinaison de filtres

```bash
GET /ticker-activity/TSLA/options?limit=100&min_premium=20000&max_premium=100000&is_call=true&is_sweep=true&min_size=50&min_dte=1&max_dte=30
```

## 🔍 Filtres Disponibles dans l'API (non encore implémentés)

Ces filtres sont disponibles dans l'API Unusual Whales mais pas encore exposés dans notre endpoint. Ils peuvent être ajoutés si nécessaire :

- `all_opening` - Toutes les transactions sont des ouvertures
- `is_multi_leg` - Transactions multi-leg
- `issue_types[]` - Types d'instruments (Common Stock, ETF, Index, ADR)
- `min_ask_perc` / `max_ask_perc` - Pourcentage ask
- `min_bid_perc` / `max_bid_perc` - Pourcentage bid
- `min_bull_perc` / `max_bull_perc` - Pourcentage bull
- `min_bear_perc` / `max_bear_perc` - Pourcentage bear
- `min_diff` / `max_diff` - Différence OTM
- `min_iv_change` / `max_iv_change` - Changement IV
- `min_marketcap` / `max_marketcap` - Market cap
- `min_open_interest` / `max_open_interest` - Open interest
- `min_price` / `max_price` - Prix du sous-jacent
- `min_size_vol_ratio` / `max_size_vol_ratio` - Ratio taille/volume
- `min_skew` / `max_skew` - Skew
- `min_spread` / `max_spread` - Spread
- `min_volume_oi_ratio` / `max_volume_oi_ratio` - Ratio volume/OI
- `rule_name[]` - Noms de règles d'alerte
- `size_greater_oi` - Taille > Open Interest
- `vol_greater_oi` - Volume > Open Interest
- `newer_than` / `older_than` - Filtrage temporel

## 📊 Format de Réponse

```json
{
  "success": true,
  "data": [
    {
      "type": "call",
      "strike": 375,
      "total_premium": 186705,
      "premium": 186705,
      "volume": 2442,
      "expiry": "2023-12-22",
      "created_at": "2023-12-12T16:35:52.168490Z",
      "open_interest": 7913
    }
  ],
  "cached": false,
  "count": 1,
  "timestamp": "2025-12-02T..."
}
```

