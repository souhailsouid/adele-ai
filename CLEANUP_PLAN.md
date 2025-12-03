# Plan de Nettoyage du Projet

## Fichiers à Supprimer

### 1. Fichiers .md Obsolètes (Documentation temporaire/debug)

#### Guides de Fix/Debug (obsolètes après résolution)
- `FIX_API_GATEWAY_500.md`
- `FIX_DARKPOOL_DATE.md`
- `FIX_HEDGE_FUNDS_500.md`
- `FIX_OPTIONS_404.md`
- `FIX_OPTIONS_ENDPOINT.md`
- `FIX_TICKER_ACTIVITY_500.md`
- `IMMEDIATE_FIX.md`
- `DEBUG_FUNDS_500.md`
- `API_GATEWAY_DEBUG_GUIDE.md`
- `QUICK_START_DEBUG.md`
- `LOCAL_DEBUG_GUIDE.md`

#### Résumés/Status temporaires
- `TICKER_ACTIVITY_SUCCESS.md`
- `TICKER_ACTIVITY_FINAL_STATUS.md`
- `TICKER_ACTIVITY_TEST_RESULTS.md`
- `TICKER_ACTIVITY_DEPLOYMENT.md`
- `TICKER_ACTIVITY_IMPLEMENTATION.md`
- `ACCESS_TOKEN_TEST_RESULTS.md`
- `CLEANUP_SUMMARY.md`
- `REFACTORING_SUMMARY.md`
- `REFACTORING_PLAN.md`
- `BACKEND_SUMMARY.md`
- `RESUME_COMPLET.md`

#### Guides Frontend obsolètes (migration terminée)
- `FRONTEND_API_ENDPOINTS.md` (remplacé par ROUTES_COVERAGE.md)
- `FRONTEND_API_ROUTES_GUIDE.md` (remplacé par ROUTES_COVERAGE.md)
- `FRONTEND_AUTHENTICATION_GUIDE.md` (intégré dans README.md)
- `FRONTEND_TROUBLESHOOTING.md`
- `FRONTEND_SEC_URL_FIX.md`
- `FRONTEND_ADD_FUND_EXAMPLE.md`
- `FRONTEND_13F_DEVELOPER_GUIDE.md`
- `FRONTEND_13F_IMPLEMENTATION.md`
- `FRONTEND_FEATURES_IDEAS.md`

#### Guides Backend obsolètes
- `BACKEND_SPEC_TICKER_ACTIVITY.md`
- `BACKEND_API_MIGRATION_SUMMARY.md`
- `SECURITY_API_MIGRATION.md`
- `DEPLOY_TICKER_ACTIVITY.md`
- `DEPLOY_FMP_UW_ROUTES.md`
- `ALERTS_ENDPOINTS_IMPLEMENTATION.md`
- `API_ENDPOINTS_REFERENCE.md` (remplacé par ROUTES_COVERAGE.md)
- `EXTERNAL_APIS_REFERENCE.md`
- `OPTIONS_FILTERS_DOC.md`
- `EXPLICATION_FUND_HOLDINGS.md`
- `STRATEGY_COMPANIES_ANALYSIS.md`
- `STRATEGY_EARNINGS_AUTOMATION.md`

#### Guides de test obsolètes (remplacés par tests Jest)
- `TEST_ENDPOINTS.md` (remplacé par TESTING_GUIDE.md)
- `QUICK_TEST_GUIDE.md` (intégré dans TESTING_GUIDE.md)
- `ID_TOKEN_VS_ACCESS_TOKEN.md` (intégré dans README.md)

### 2. Scripts de Debug Obsolètes

#### Scripts de debug temporaires (remplacés par tests Jest)
- `scripts/debug-expirations.ts` (remplacé par tests Jest)
- `scripts/debug-router-expirations.ts` (remplacé par tests Jest)
- `scripts/test-expirations-parsing.ts` (remplacé par tests Jest)

#### Scripts de test redondants
- `scripts/test-uw-endpoints.js` (redondant avec test-uw-endpoints.sh)
- `scripts/test-single-endpoint.sh` (redondant avec test-single-uw-endpoint.sh)
- `scripts/test-api-backend.sh` (redondant avec test-uw-endpoints.sh)
- `scripts/test-api-gateway-direct.sh` (redondé par tests Jest)
- `scripts/diagnose-api-gateway-routes.sh` (redondé par tests Jest)
- `scripts/verify-api-gateway-routes.sh` (redondé par tests Jest)

### 3. Fichiers de Code Obsolètes

- `services/api/src/ticker-activity.refactored.ts` (fichier de transition, non utilisé)

### 4. Fichiers Backup

- `FRONTEND_13F_DEVELOPER_GUIDE.md.bak`

### 5. Fichiers Temporaires

- `API_FILES_LIST.txt` (liste temporaire)
- `test-endpoints-quick.sh` (redondant)

## Fichiers à CONSERVER

### Documentation Essentielle
- `README.md` (documentation principale)
- `ARCHITECTURE.md` (architecture du projet)
- `TESTING_GUIDE.md` (guide de test actuel)
- `ROUTES_COVERAGE.md` (couverture des routes)
- `scripts/README.md` (documentation des scripts)
- `scripts/SETUP.md` (setup des scripts)
- `services/api/src/__tests__/README.md` (documentation des tests)
- `services/api/src/types/unusual-whales/README.md` (documentation des types)
- `infra/terraform/README_LAMBDA_PERMISSION.md` (documentation importante)
- `infra/terraform/CORS_FIX.md` (peut être utile)
- `DOCUMENTATIONS/TECH_SEC_FILINGS.md` (documentation technique)

### Scripts Utiles
- `scripts/test-uw-endpoints.sh` (script principal de test)
- `scripts/test-all-routes-with-report.sh` (génération de rapport)
- `scripts/test-single-uw-endpoint.sh` (test d'un endpoint)
- `scripts/local-server.ts` (serveur local)
- `scripts/start-local-server.sh` (démarrage serveur local)
- Scripts Python utiles (analyse, parsing, etc.)

## Actions

1. Commit des changements actuels
2. Suppression des fichiers identifiés
3. Vérification que tout fonctionne encore

