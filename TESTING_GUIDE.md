# Guide de Test des Routes API

## Types de Tests Disponibles

### 1. ✅ Tests d'Intégration API Gateway (`api-gateway-routes.test.ts`)

**Ce que ça fait :**
- ✅ Teste **réellement** toutes les routes via HTTP vers l'API Gateway
- ✅ Vérifie le **statut HTTP** (200, 404, 500, etc.)
- ✅ Vérifie le **format de la réponse** (JSON valide)
- ✅ Mesure le **temps de réponse** pour chaque route
- ✅ Génère un **rapport détaillé** par catégorie
- ✅ Identifie les routes qui échouent avec les erreurs

**Exécution :**
```bash
cd services/api
npm test -- api-gateway-routes
```

**Résultat :**
```
📈 Overall: 60/60 passed (100.0%)
⏱️  Average response time: 299ms
✅ Passed: 60
❌ Failed: 0
```

### 2. ⚠️ Test de Couverture (`all-routes-coverage.test.ts`)

**Ce que ça fait :**
- ⚠️ **Ne teste PAS** les routes API
- ✅ Vérifie que toutes les routes définies dans le router sont listées dans le script bash
- ✅ Identifie les routes manquantes dans les tests

**Exécution :**
```bash
cd services/api
npm test -- all-routes-coverage
```

### 3. ✅ Tests Unitaires (`router-expirations-parsing.test.ts`, etc.)

**Ce que ça fait :**
- ✅ Teste la logique de parsing des paramètres
- ✅ Teste la construction d'URL
- ⚠️ **Ne teste PAS** les routes API réelles

**Exécution :**
```bash
cd services/api
npm test -- router-expirations-parsing
```

### 4. ✅ Script Bash (`test-uw-endpoints.sh`)

**Ce que ça fait :**
- ✅ Teste **réellement** toutes les routes via HTTP vers l'API Gateway
- ✅ Vérifie le **statut HTTP**
- ✅ Affiche un aperçu de la **réponse**
- ✅ Documentation intégrée de toutes les routes

**Exécution :**
```bash
./scripts/test-uw-endpoints.sh [API_GATEWAY_URL]
```

## Comparaison

| Test | Teste les Routes API ? | Vérifie le Statut ? | Vérifie la Réponse ? | Mesure Performance ? |
|------|------------------------|---------------------|----------------------|---------------------|
| `api-gateway-routes.test.ts` | ✅ Oui | ✅ Oui | ✅ Oui | ✅ Oui |
| `all-routes-coverage.test.ts` | ❌ Non | ❌ Non | ❌ Non | ❌ Non |
| `router-expirations-parsing.test.ts` | ❌ Non | ❌ Non | ❌ Non | ❌ Non |
| `test-uw-endpoints.sh` | ✅ Oui | ✅ Oui | ✅ Oui | ❌ Non |

## Recommandation

Pour tester **réellement** toutes les routes API avec vérification du statut et de la réponse, utilisez :

1. **Tests Jest** (automatisable, CI/CD) :
   ```bash
   npm test -- api-gateway-routes
   ```

2. **Script Bash** (manuel, documentation) :
   ```bash
   ./scripts/test-uw-endpoints.sh
   ```

## Configuration

Les tests utilisent ces variables d'environnement :

- `API_GATEWAY_URL` : URL de l'API Gateway (défaut: `https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod`)
- `ACCESS_TOKEN` : Token JWT pour l'authentification

Vous pouvez les définir dans un fichier `.env` ou les passer en ligne de commande :

```bash
API_GATEWAY_URL=https://your-api.com/prod ACCESS_TOKEN=your-token npm test -- api-gateway-routes
```

