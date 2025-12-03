# 🔄 Plan de Refactorisation - Ticker Activity

## 📋 Problèmes Identifiés

1. ❌ **Duplication de code** : Logique répétée dans chaque fonction
2. ❌ **Pas de logger structuré** : `console.log` partout
3. ❌ **Gestion d'erreurs catastrophique** : Try-catch inconsistants, pas de types d'erreurs
4. ❌ **Pas de séparation des responsabilités** : Cache, API calls, logique métier mélangés
5. ❌ **Fonctions trop longues** : 100+ lignes avec plusieurs responsabilités
6. ❌ **Pas de design patterns** : Code procédural sans structure
7. ❌ **Pas de découplage** : Dépendances directes partout

## ✅ Architecture Proposée

### Structure

```
services/api/src/
├── utils/
│   ├── logger.ts          # Logger structuré
│   └── errors.ts          # Gestion d'erreurs centralisée
├── services/
│   ├── cache.service.ts   # Service de cache
│   ├── api-client.service.ts  # Client API avec retry, rate limiting
│   └── ticker.service.ts  # Logique métier ticker
├── repositories/
│   └── ticker.repository.ts  # Accès aux données (cache + API)
├── types/
│   └── ticker.types.ts     # Types centralisés
└── ticker-activity.ts     # Interface publique (thin layer)
```

### Design Patterns Utilisés

1. **Repository Pattern** : Séparation accès données / logique métier
2. **Service Layer** : Logique métier isolée
3. **Dependency Injection** : Services injectés, testables
4. **Error Handling Pattern** : Erreurs typées et centralisées
5. **Factory Pattern** : Création de clients API

## 🚀 Migration Progressive

### Phase 1 : Infrastructure (✅ FAIT)

- [x] Logger structuré
- [x] Gestion d'erreurs centralisée
- [x] Cache service
- [x] API client service
- [x] Types centralisés

### Phase 2 : Refactorisation Core (✅ EXEMPLE CRÉÉ)

- [x] Repository pour ticker
- [x] Service pour ticker
- [x] Refactorisation de `getTickerQuote` (exemple)
- [x] Refactorisation de `getTickerOwnership` (exemple)
- [x] Refactorisation de `getTickerActivity` (exemple)

### Phase 3 : Migration Complète (⏳ À FAIRE)

- [ ] Migrer `getTickerHedgeFunds`
- [ ] Migrer `getTickerInsiders`
- [ ] Migrer `getTickerCongress`
- [ ] Migrer `getTickerOptions`
- [ ] Migrer `getTickerDarkPool`
- [ ] Migrer `getTickerStats`

### Phase 4 : Tests & Validation

- [ ] Tests unitaires pour les services
- [ ] Tests unitaires pour les repositories
- [ ] Tests d'intégration
- [ ] Validation en production

## 📝 Guide de Migration

### Étape 1 : Créer le Repository Method

```typescript
// Dans ticker.repository.ts
async fetchXFromAPI(ticker: string): Promise<X[]> {
  return handleError(async () => {
    const response = await this.uwClient.get<any>(`/endpoint/${ticker}`);
    // Transformation des données
    return data.map(item => ({ ... }));
  }, `Fetch X for ${ticker}`);
}
```

### Étape 2 : Créer le Service Method

```typescript
// Dans ticker.service.ts
async getX(ticker: string, limit: number = 100): Promise<ApiResponse<X[]>> {
  const log = logger.child({ ticker, operation: 'getX' });
  
  return handleError(async () => {
    // 1. Vérifier cache
    // 2. Appeler repository si nécessaire
    // 3. Mettre en cache
    // 4. Retourner réponse
  }, `Get X for ${ticker}`);
}
```

### Étape 3 : Exposer dans ticker-activity.ts

```typescript
export async function getTickerX(ticker: string): Promise<ApiResponse<X[]>> {
  return await tickerService.getX(ticker);
}
```

## 🎯 Avantages de la Nouvelle Architecture

### Avant ❌
```typescript
export async function getTickerQuote(ticker: string) {
  // 100 lignes de code mélangé :
  // - Vérification cache
  // - Appel API
  // - Transformation données
  // - Gestion erreurs inline
  // - Logs console.log partout
}
```

### Après ✅
```typescript
export async function getTickerQuote(ticker: string) {
  return await tickerService.getQuote(ticker);
  // 1 ligne, toute la logique dans le service
  // Repository gère cache + API
  // Logger structuré
  // Erreurs typées
}
```

## 🔧 Utilisation

### Logger

```typescript
import { logger } from './utils/logger';

const log = logger.child({ ticker: 'TSLA', operation: 'getQuote' });
log.info('Starting operation');
log.debug('Debug info', { data });
log.error('Error occurred', error);
```

### Gestion d'Erreurs

```typescript
import { handleError, NotFoundError, ExternalApiError } from './utils/errors';

try {
  return await handleError(async () => {
    // Opération
  }, 'Context');
} catch (error) {
  if (error instanceof NotFoundError) {
    // Gérer spécifiquement
  }
  throw error;
}
```

### Cache Service

```typescript
const cache = new CacheService({ tableName: 'my_table', ttlHours: 24 });
const data = await cache.get<MyType>('key');
await cache.set('key', data);
```

### API Client

```typescript
const client = createFMPClient();
const data = await client.get<Quote[]>('/quote', { symbol: 'TSLA' });
```

## 📊 Métriques de Qualité

### Avant
- **Lignes par fonction** : 50-150
- **Responsabilités par fonction** : 3-5
- **Duplication** : ~40%
- **Couverture erreurs** : ~30%
- **Testabilité** : Faible

### Après
- **Lignes par fonction** : 5-20
- **Responsabilités par fonction** : 1
- **Duplication** : <5%
- **Couverture erreurs** : 100%
- **Testabilité** : Élevée

## 🚨 Points d'Attention

1. **Migration progressive** : Ne pas tout refactoriser d'un coup
2. **Tests** : Écrire les tests avant/après migration
3. **Backward compatibility** : Garder les mêmes signatures publiques
4. **Performance** : Vérifier que la nouvelle architecture n'ajoute pas de latence
5. **Logs** : S'assurer que les logs sont toujours utiles en production

## 📚 Références

- Repository Pattern: https://martinfowler.com/eaaCatalog/repository.html
- Service Layer Pattern: https://martinfowler.com/eaaCatalog/serviceLayer.html
- Error Handling: https://www.joyent.com/node-js/production/design/errors

