# 🐛 Guide de Débogage Local - Ticker Activity API

## 📋 Options de Débogage

Il y a plusieurs façons de déboguer l'API en local :

1. **AWS SAM Local** (recommandé pour Lambda)
2. **Serveur Node.js local** (plus simple)
3. **Tests unitaires** (pour les fonctions individuelles)

---

## 🚀 Option 1 : AWS SAM Local (Recommandé)

### Installation

```bash
# Installer AWS SAM CLI
brew install aws-sam-cli  # macOS
# ou
pip install aws-sam-cli  # Linux/Windows
```

### Configuration

Créez un fichier `template.yaml` à la racine :

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
  ApiFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: index.handler
      Runtime: nodejs20.x
      CodeUri: services/api/dist/
      Environment:
        Variables:
          SUPABASE_URL: ${SUPABASE_URL}
          SUPABASE_SERVICE_KEY: ${SUPABASE_SERVICE_KEY}
          COGNITO_ISSUER: ${COGNITO_ISSUER}
          COGNITO_AUDIENCE: ${COGNITO_AUDIENCE}
          UNUSUAL_WHALES_API_KEY: ${UNUSUAL_WHALES_API_KEY}
          FMP_API_KEY: ${FMP_API_KEY}
      Events:
        ApiEvent:
          Type: HttpApi
          Properties:
            Path: /{proxy+}
            Method: ANY
```

### Débogage avec SAM

```bash
# 1. Compiler le code
cd services/api
npm run build

# 2. Lancer SAM local
cd ../..
sam local start-api --port 3001 --env-vars env.json
```

Créez `env.json` :

```json
{
  "ApiFunction": {
    "SUPABASE_URL": "https://nmynjtrppwhiwlxfdzdh.supabase.co",
    "SUPABASE_SERVICE_KEY": "sb_secret_025ZPExdwYIENsABogIRsw_jDhFPTo6",
    "COGNITO_ISSUER": "https://cognito-idp.eu-west-3.amazonaws.com/eu-west-3_FQDmhxV14",
    "COGNITO_AUDIENCE": "pkp4i82jnttthj2cbiltudgva",
    "UNUSUAL_WHALES_API_KEY": "925866f5-e97f-459d-850d-5d5856fef716",
    "FMP_API_KEY": "SEZmUVb6Q54FfrThfe3rzyKeG3vmXPQ5"
  }
}
```

### Tester en Local

```bash
# Tester un endpoint
curl http://localhost:3001/ticker-activity/TSLA/quote \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🎯 Option 2 : Serveur Node.js Local (Plus Simple)

### Créer un Serveur de Test

Créez `scripts/local-server.ts` :

```typescript
import { createServer } from 'http';
import { handler } from '../services/api/src/index';

const PORT = 3001;

// Simuler un événement API Gateway
function createApiGatewayEvent(method: string, path: string, headers: Record<string, string> = {}) {
  return {
    version: '2.0',
    routeKey: `${method} ${path}`,
    rawPath: path,
    rawQueryString: '',
    headers: {
      'content-type': 'application/json',
      'authorization': headers.authorization || '',
      ...headers,
    },
    requestContext: {
      http: {
        method,
        path,
        protocol: 'HTTP/1.1',
      },
      authorizer: {
        jwt: {
          claims: {
            sub: 'test-user-id',
            email: 'test@example.com',
          },
        },
      },
    },
    body: null,
    isBase64Encoded: false,
  };
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const path = url.pathname;
    const method = req.method || 'GET';

    console.log(`[${new Date().toISOString()}] ${method} ${path}`);

    // Récupérer le token depuis les headers
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    // Créer l'événement API Gateway
    const event = createApiGatewayEvent(method, path, {
      authorization: authHeader,
    });

    // Appeler le handler Lambda
    const result = await handler(event as any);

    // Envoyer la réponse
    res.writeHead(result.statusCode || 200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(result.body || JSON.stringify({ error: 'No response' }));
  } catch (error: any) {
    console.error('Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message, stack: error.stack }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Serveur local démarré sur http://localhost:${PORT}`);
  console.log(`📡 Testez avec: curl http://localhost:${PORT}/ticker-activity/TSLA/quote`);
  console.log(`   -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`);
});
```

### Lancer le Serveur

```bash
# Installer ts-node si nécessaire
npm install -g ts-node

# Lancer le serveur
cd services/api
npx ts-node ../../scripts/local-server.ts
```

---

## 🧪 Option 3 : Tests Unitaires

Créez `services/api/src/__tests__/ticker-activity.test.ts` :

```typescript
import { getTickerQuote, getTickerOwnership } from '../ticker-activity';

// Mock des variables d'environnement
process.env.UNUSUAL_WHALES_API_KEY = 'test-key';
process.env.FMP_API_KEY = 'test-key';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_KEY = 'test-key';

describe('Ticker Activity', () => {
  test('getTickerQuote should return quote data', async () => {
    const result = await getTickerQuote('TSLA');
    expect(result.success).toBe(true);
    expect(result.data.symbol).toBe('TSLA');
  });

  test('getTickerOwnership should return ownership data', async () => {
    const result = await getTickerOwnership('TSLA', 10);
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });
});
```

---

## 🔧 Script de Test Rapide

Utilisez le script fourni :

```bash
# Rendre le script exécutable
chmod +x scripts/test-ticker-activity-api.sh

# Tester tous les endpoints
./scripts/test-ticker-activity-api.sh "YOUR_ACCESS_TOKEN" TSLA

# Tester un seul endpoint
chmod +x scripts/test-single-endpoint.sh
./scripts/test-single-endpoint.sh "YOUR_ACCESS_TOKEN" "/ticker-activity/TSLA/quote"
```

---

## 🐛 Débogage avec VS Code

### Configuration Launch

Créez `.vscode/launch.json` :

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Local Server",
      "runtimeExecutable": "npx",
      "runtimeArgs": ["ts-node", "scripts/local-server.ts"],
      "cwd": "${workspaceFolder}",
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

### Utilisation

1. Placez des breakpoints dans votre code
2. Appuyez sur F5 pour démarrer le débogage
3. Faites des requêtes avec curl ou Postman
4. Le débogueur s'arrêtera aux breakpoints

---

## 📝 Exemple de Test Complet

```bash
#!/bin/bash
# test-local.sh

TOKEN="YOUR_ACCESS_TOKEN"
LOCAL_URL="http://localhost:3001"

echo "🧪 Test Local API"
echo ""

# Test Quote
echo "1. Testing Quote..."
curl -s "${LOCAL_URL}/ticker-activity/TSLA/quote" \
  -H "Authorization: Bearer ${TOKEN}" | jq '.'

echo ""
echo "2. Testing Ownership..."
curl -s "${LOCAL_URL}/ticker-activity/TSLA/ownership?limit=3" \
  -H "Authorization: Bearer ${TOKEN}" | jq '.'
```

---

## ✅ Avantages de Chaque Méthode

| Méthode | Avantages | Inconvénients |
|---------|-----------|--------------|
| **SAM Local** | ✅ Environnement identique à AWS<br>✅ Support complet Lambda | ⚠️ Installation plus complexe<br>⚠️ Plus lent |
| **Serveur Node.js** | ✅ Simple et rapide<br>✅ Débogage facile | ⚠️ Environnement différent<br>⚠️ Pas de validation API Gateway |
| **Tests Unitaires** | ✅ Rapide<br>✅ Isolé | ⚠️ Nécessite des mocks<br>⚠️ Pas de test end-to-end |

---

## 🎯 Recommandation

Pour un débogage rapide, utilisez le **Serveur Node.js Local**. Pour un environnement identique à la production, utilisez **AWS SAM Local**.

