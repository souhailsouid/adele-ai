# Couverture des Routes API

## Résumé

Ce document liste toutes les routes API et leur statut de test.

## Routes Unusual Whales

### Total: 107 routes définies dans le router

### Routes testées dans `test-uw-endpoints.sh`: ~108 endpoints

**Note**: Le script teste certains endpoints avec des variantes (query params différents), donc le nombre peut être supérieur au nombre de routes uniques.

### Catégories de routes

1. **Legacy Routes** (7) - Routes de compatibilité
2. **Alerts** (2)
3. **Congress** (4)
4. **Dark Pool** (2)
5. **Earnings** (3)
6. **ETFs** (5)
7. **Group Flow** (2)
8. **Insiders** (4)
9. **Institutions** (6)
10. **Market** (13)
11. **Stock** (40)
12. **Shorts** (5)
13. **Seasonality** (4)
14. **Screener** (3)
15. **Option Trade** (2)
16. **Option Contract** (6)
17. **News** (1)

## Routes FMP

### Total: 16 routes définies dans le router

**Note**: Les routes FMP ne sont pas encore testées dans le script `test-uw-endpoints.sh`.

### Routes FMP disponibles

1. GET /fmp/quote/{symbol}
2. GET /fmp/historical-price/{symbol}
3. GET /fmp/income-statement/{symbol}
4. GET /fmp/balance-sheet/{symbol}
5. GET /fmp/cash-flow/{symbol}
6. GET /fmp/key-metrics/{symbol}
7. GET /fmp/ratios/{symbol}
8. GET /fmp/dcf/{symbol}
9. GET /fmp/earnings/{symbol}
10. GET /fmp/insider-trades/{symbol}
11. GET /fmp/hedge-fund-holdings/{symbol}
12. GET /fmp/market-news
13. GET /fmp/economic-calendar
14. GET /fmp/earnings-calendar
15. GET /fmp/screener
16. GET /fmp/sec-filings/{symbol}

## Tests disponibles

### 1. Script Bash (`test-uw-endpoints.sh`)
- Teste tous les endpoints Unusual Whales
- Affiche le statut et un aperçu de la réponse
- Inclut maintenant une documentation complète des routes

### 2. Script avec Rapport (`test-all-routes-with-report.sh`)
- Teste toutes les routes et génère un rapport Markdown
- Inclut les métriques de performance (temps de réponse)
- Groupe les résultats par catégorie
- Liste les routes échouées avec détails

### 3. Tests Jest
- **Unitaires**: Parsing des paramètres, construction d'URL
- **Intégration**: Tests avec l'API réelle
- **Couverture**: Vérifie que toutes les routes sont testées

## Vérification de la couverture

Exécutez le test de couverture pour identifier les routes manquantes :

```bash
cd services/api
npm test -- all-routes-coverage
```

Ce test :
- Extrait toutes les routes du router
- Compare avec les routes testées dans le script bash
- Identifie les routes manquantes
- Affiche un rapport détaillé

## Prochaines étapes

1. ✅ Ajouter les tests pour les routes FMP dans `test-uw-endpoints.sh`
2. ✅ Améliorer le script pour générer un rapport automatique
3. ✅ Créer des tests d'intégration pour toutes les routes
4. ⏳ Ajouter des tests de performance (temps de réponse)
5. ⏳ Ajouter des tests de validation des réponses (schémas)

