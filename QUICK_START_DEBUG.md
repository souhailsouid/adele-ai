# 🚀 Guide Rapide - Test et Débogage Local

## 📋 Scripts Disponibles

### 1. Test de l'API en Production

```bash
# Tester tous les endpoints
./scripts/test-ticker-activity-api.sh "YOUR_ACCESS_TOKEN" TSLA

# Tester un seul endpoint
./scripts/test-single-endpoint.sh "YOUR_ACCESS_TOKEN" "/ticker-activity/TSLA/quote"
```

### 2. Serveur Local pour Débogage

```bash
# Option A : Script automatique (recommandé)
./scripts/start-local-server.sh

# Option B : Manuel
cd services/api
SUPABASE_URL="..." SUPABASE_SERVICE_KEY="..." npm run dev
```

## 🐛 Débogage en Temps Réel

### Méthode 1 : Serveur Local Simple

```bash
# 1. Lancer le serveur
./scripts/start-local-server.sh

# 2. Dans un autre terminal, tester
TOKEN="YOUR_ACCESS_TOKEN"
curl http://localhost:3001/ticker-activity/TSLA/quote \
  -H "Authorization: Bearer $TOKEN"
```

### Méthode 2 : Avec VS Code Debugger

1. **Créer `.vscode/launch.json`** :

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Local Server",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}/services/api",
      "env": {
        "SUPABASE_URL": "https://nmynjtrppwhiwlxfdzdh.supabase.co",
        "SUPABASE_SERVICE_KEY": "sb_secret_025ZPExdwYIENsABogIRsw_jDhFPTo6",
        "COGNITO_ISSUER": "https://cognito-idp.eu-west-3.amazonaws.com/eu-west-3_FQDmhxV14",
        "COGNITO_AUDIENCE": "pkp4i82jnttthj2cbiltudgva",
        "UNUSUAL_WHALES_API_KEY": "925866f5-e97f-459d-850d-5d5856fef716",
        "FMP_API_KEY": "SEZmUVb6Q54FfrThfe3rzyKeG3vmXPQ5"
      },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

2. **Placer des breakpoints** dans `ticker-activity.ts`
3. **Appuyer sur F5** pour démarrer
4. **Faire des requêtes** avec curl ou Postman

## 🧪 Exemple Complet

```bash
# Terminal 1 : Lancer le serveur
./scripts/start-local-server.sh

# Terminal 2 : Tester
TOKEN="eyJraWQiOiIwekpSMTVhYjBqSk0xdnJmaFBSa0NveGJBaHhnXC9HblhkeU56Y09iRkRyND0iLCJhbGciOiJSUzI1NiJ9..."

# Test Quote
curl http://localhost:3001/ticker-activity/TSLA/quote \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Test Ownership
curl http://localhost:3001/ticker-activity/TSLA/ownership?limit=3 \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

## 📝 Variables d'Environnement

Les variables sont chargées depuis :
1. Variables d'environnement système
2. Fichier `.env.local` dans `scripts/` (si présent)

Pour définir manuellement :

```bash
export SUPABASE_URL="https://nmynjtrppwhiwlxfdzdh.supabase.co"
export SUPABASE_SERVICE_KEY="sb_secret_025ZPExdwYIENsABogIRsw_jDhFPTo6"
export UNUSUAL_WHALES_API_KEY="925866f5-e97f-459d-850d-5d5856fef716"
export FMP_API_KEY="SEZmUVb6Q54FfrThfe3rzyKeG3vmXPQ5"
```

## ✅ Checklist

- [ ] Scripts rendus exécutables (`chmod +x scripts/*.sh`)
- [ ] `tsx` installé (`npm install --save-dev tsx`)
- [ ] Variables d'environnement configurées
- [ ] Serveur local lancé
- [ ] Tests effectués avec succès

---

**Pour plus de détails**, voir `LOCAL_DEBUG_GUIDE.md`

