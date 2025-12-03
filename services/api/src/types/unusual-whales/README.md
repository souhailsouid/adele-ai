# Types Unusual Whales

Ce dossier contient les types TypeScript stricts basés sur la documentation officielle de l'API Unusual Whales.

## Structure

```
types/unusual-whales/
├── alerts.ts          # Types pour les endpoints /alerts et /alerts/configuration
├── congress.ts        # Types pour les endpoints /congress/*
├── darkpool.ts        # Types pour les endpoints /darkpool/*
├── earnings.ts        # Types pour les endpoints /earnings/*
├── etf.ts             # Types pour les endpoints /etfs/*
├── group-flow.ts      # Types pour les endpoints /group-flow/*
├── insiders.ts        # Types pour les endpoints /insider/*
├── institutions.ts    # Types pour les endpoints /institution/* et /institutions/*
├── README.md          # Ce fichier
└── ...                # Autres endpoints à venir
```

## Principes

1. **Strictement basé sur la documentation officielle** : Tous les types reflètent exactement la documentation API
2. **TypeScript strict** : Utilisation de types stricts, pas de `any` sauf pour les configs dynamiques
3. **Documentation inline** : Chaque type est documenté avec des exemples de la doc
4. **Validation** : Les types permettent de valider les données à la compilation

## Utilisation

```typescript
import type {
  AlertsResponse,
  AlertConfigurationResponse,
  AlertsQueryParams,
  Alert,
  AlertConfiguration,
} from '../types/unusual-whales/alerts';

// Utiliser dans le repository
async getAlerts(params: AlertsQueryParams): Promise<AlertsResponse> {
  // ...
}

// Utiliser dans le service
const alerts: Alert[] = response.data;
```

## Endpoints couverts

### Alerts
- ✅ `/alerts` - Alertes déclenchées
- ✅ `/alerts/configuration` - Configurations d'alertes

### Congress
- ✅ `/congress/congress-trader` - Rapports récents par membre du Congrès
- ✅ `/congress/late-reports` - Rapports tardifs récents
- ✅ `/congress/recent-trades` - Trades récents du Congrès

### Dark Pool
- ✅ `/darkpool/recent` - Derniers dark pool trades
- ✅ `/darkpool/{ticker}` - Dark pool trades pour un ticker

### Earnings
- ✅ `/earnings/afterhours` - Earnings afterhours pour une date
- ✅ `/earnings/premarket` - Earnings premarket pour une date
- ✅ `/earnings/{ticker}` - Earnings historiques pour un ticker

### ETF
- ✅ `/etfs/{ticker}/exposure` - ETFs contenant un ticker donné
- ✅ `/etfs/{ticker}/holdings` - Holdings d'un ETF
- ✅ `/etfs/{ticker}/in-outflow` - Inflow/outflow d'un ETF
- ✅ `/etfs/{ticker}/info` - Informations sur un ETF
- ✅ `/etfs/{ticker}/weights` - Poids sectoriels et par pays d'un ETF

### Group Flow
- ✅ `/group-flow/{flow_group}/greek-flow` - Greek flow par flow group et minute
- ✅ `/group-flow/{flow_group}/greek-flow/{expiry}` - Greek flow par flow group, minute et expiry

### Insiders
- ✅ `/insider/transactions` - Dernières transactions d'insiders (avec nombreux filtres)
- ✅ `/insider/{sector}/sector-flow` - Flow d'insiders agrégé par secteur
- ✅ `/insider/{ticker}` - Tous les insiders pour un ticker
- ✅ `/insider/{ticker}/ticker-flow` - Flow d'insiders agrégé par ticker

### Institutions
- ✅ `/institution/{name}/activity` - Activités de trading d'une institution
- ✅ `/institution/{name}/holdings` - Holdings d'une institution
- ✅ `/institution/{name}/sectors` - Exposition sectorielle d'une institution
- ✅ `/institution/{ticker}/ownership` - Propriété institutionnelle d'un ticker
- ✅ `/institutions` - Liste des institutions
- ✅ `/institutions/latest_filings` - Derniers dépôts institutionnels

## Prochaines étapes

- [ ] Options Flow endpoints
- [ ] Options Data endpoints

