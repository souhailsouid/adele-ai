# 🔧 Fix Timeout Lambda - POST /attribution/flow

## ❌ Problème
Timeout Lambda après 10 secondes sur `POST /attribution/flow`

## 🔍 Cause
Trop d'appels API séquentiels et parallèles :
- `getRecentInstitutionalPositions` (UW API)
- `getRecentInsiderTransactions` (UW API + Graph)
- `analyzeHistoricalPatterns` (UW API + Graph)
- Pour chaque institution :
  - `flowSignatureService.matchFlowSignature` (UW API)
  - `graphService.getAdvancedCentralityMetrics` (Neo4j complexe)
- `detectConflictingEntities` (3 appels UW API : short interest, PUT flows, dark pool)

## ✅ Solutions Appliquées

### 1. Parallélisation avec Timeouts
- `getRecentInstitutionalPositions` : timeout 3s
- `getRecentInsiderTransactions` : timeout 3s
- `analyzeHistoricalPatterns` : timeout 2s
- Fallback gracieux si timeout (retourne tableau vide)

### 2. Limitation du Nombre d'Institutions
- Traite uniquement les **top 20 institutions** par valeur
- Réduit drastiquement le nombre d'appels API

### 3. Centralité Simplifiée
- Utilise `getEntityCentrality` (simple) au lieu de `getAdvancedCentralityMetrics`
- Timeout 1s
- Évite les requêtes Neo4j complexes

### 4. Flow Signature Matching Désactivé
- **DÉSACTIVÉ temporairement** (trop lent)
- TODO: Réactiver avec cache ou requête optimisée

### 5. Insider Registry avec Timeout
- Timeout 1.5s
- Fallback gracieux si timeout

### 6. Conflict Engine avec Timeouts
- Short interest : timeout 2s
- PUT/CALL flows : timeout 2s
- Dark pool : timeout 2s

## 📊 Impact Attendu

| Avant | Après |
|-------|-------|
| ~10s (timeout) | ~5-6s |
| Toutes institutions | Top 20 seulement |
| Centralité avancée (lente) | Centralité simple (rapide) |
| Flow Signature (lent) | Désactivé |
| Pas de timeout | Timeouts partout |

## 🚀 Prochaines Étapes

1. **Réactiver Flow Signature Matching** :
   - Implémenter un cache (Redis ou DynamoDB)
   - Stocker les signatures historiques
   - Requête optimisée (limite de résultats)

2. **Optimiser Neo4j** :
   - Index sur les propriétés fréquemment requêtées
   - Requêtes Cypher optimisées
   - Cache des résultats de centralité

3. **Augmenter Timeout Lambda** (si nécessaire) :
   - Actuellement : 10s
   - Peut être augmenté à 15-30s dans Terraform
   - Mais préférer optimiser le code

4. **Monitoring** :
   - Ajouter des métriques CloudWatch
   - Tracker le temps d'exécution de chaque étape
   - Identifier les goulots d'étranglement

---

**Date** : 2025-12-07  
**Statut** : ✅ Optimisations appliquées, prêt pour test
