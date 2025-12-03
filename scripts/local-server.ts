import { createServer } from 'http';
import { handler } from '../services/api/src/index.js';

const PORT = 3001;

// Simuler un événement API Gateway V2
function createApiGatewayEvent(method: string, path: string, headers: Record<string, string> = {}) {
  // Extraire le token JWT des headers pour simuler la validation
  const authHeader = headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  // Décoder le token pour extraire les claims (simplifié)
  let jwtClaims: any = {
    sub: 'test-user-id',
    email: 'test@example.com',
  };

  if (token && token.includes('.')) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        jwtClaims = {
          sub: payload.sub || 'test-user-id',
          email: payload.email || 'test@example.com',
          ...payload,
        };
      }
    } catch (e) {
      console.warn('Could not decode JWT, using default claims');
    }
  }

  return {
    version: '2.0',
    routeKey: `${method} ${path}`,
    rawPath: path,
    rawQueryString: '',
    headers: {
      'content-type': 'application/json',
      'authorization': authHeader,
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
          claims: jwtClaims,
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

    console.log(`\n[${new Date().toISOString()}] ${method} ${path}`);

    // Récupérer tous les headers
    const headers: Record<string, string> = {};
    Object.entries(req.headers).forEach(([key, value]) => {
      headers[key] = Array.isArray(value) ? value[0] : value || '';
    });

    // Créer l'événement API Gateway
    const event = createApiGatewayEvent(method, path, headers);

    console.log('Event:', JSON.stringify(event, null, 2));

    // Appeler le handler Lambda
    const result = await handler(event as any);

    console.log('Response:', result.statusCode, result.body?.substring(0, 100));

    // Envoyer la réponse
    res.writeHead(result.statusCode || 200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end(result.body || JSON.stringify({ error: 'No response' }));
  } catch (error: any) {
    console.error('❌ Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: error.message, 
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }));
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 Serveur local démarré sur http://localhost:${PORT}`);
  console.log(`📡 Testez avec:`);
  console.log(`   curl http://localhost:${PORT}/ticker-activity/TSLA/quote \\`);
  console.log(`     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`);
  console.log(`\n💡 Appuyez sur Ctrl+C pour arrêter\n`);
});

