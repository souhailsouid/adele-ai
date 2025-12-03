# Tests - Unusual Whales API

## Structure

```
__tests__/
├── unit/                          # Tests unitaires
│   ├── router-expirations-parsing.test.ts    # Parsing des paramètres expirations[]
│   └── api-client-url-construction.test.ts   # Construction d'URL
└── integration/                   # Tests d'intégration
    ├── unusual-whales-expirations.test.ts    # Tests avec l'API réelle
    └── router-handlers.test.ts                # Tests des handlers du router
```

## Exécution

```bash
# Tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:coverage

# Tests spécifiques
npm test -- router-expirations-parsing
npm test -- unusual-whales-expirations
```

## Tests unitaires

Les tests unitaires vérifient la logique de parsing des paramètres `expirations[]` dans différents formats que API Gateway peut envoyer :

- Array direct : `{ 'expirations[]': ['2024-12-20', '2024-12-27'] }`
- String avec virgules : `{ 'expirations[]': '2024-12-20,2024-12-27' }`
- Paramètres indexés : `{ 'expirations[0]': '2024-12-20', 'expirations[1]': '2024-12-27' }`

## Tests d'intégration

Les tests d'intégration font des appels réels à l'API Unusual Whales pour vérifier que les endpoints fonctionnent correctement.

**Note** : Ces tests nécessitent une clé API valide dans `UNUSUAL_WHALES_API_KEY` ou utilisent une clé par défaut.

## Ajout de nouveaux tests

1. **Test unitaire** : Créer dans `__tests__/unit/`
2. **Test d'intégration** : Créer dans `__tests__/integration/`
3. Nommer le fichier avec `.test.ts` ou `.spec.ts`

