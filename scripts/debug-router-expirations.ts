/**
 * Script pour simuler comment API Gateway passe les paramètres expirations[] au Lambda
 * Usage: tsx scripts/debug-router-expirations.ts
 */

// Simulation de ce que API Gateway envoie au Lambda
const simulateAPIGatewayEvent = {
  pathParameters: {
    ticker: 'AAPL',
  },
  queryStringParameters: {
    'expirations[]': ['2024-12-20', '2024-12-27'], // API Gateway peut passer comme array
  },
};

const simulateAPIGatewayEvent2 = {
  pathParameters: {
    ticker: 'AAPL',
  },
  queryStringParameters: {
    'expirations[0]': '2024-12-20',
    'expirations[1]': '2024-12-27',
  },
};

const simulateAPIGatewayEvent3 = {
  pathParameters: {
    ticker: 'AAPL',
  },
  queryStringParameters: {
    'expirations[]': '2024-12-20,2024-12-27', // API Gateway peut concaténer
  },
};

console.log('=== Simulation API Gateway Event 1 (array) ===');
console.log(JSON.stringify(simulateAPIGatewayEvent, null, 2));

// Parser comme dans le router
const expirations1 = simulateAPIGatewayEvent.queryStringParameters?.['expirations[]']
  ? Array.isArray(simulateAPIGatewayEvent.queryStringParameters['expirations[]'])
    ? simulateAPIGatewayEvent.queryStringParameters['expirations[]']
    : [simulateAPIGatewayEvent.queryStringParameters['expirations[]']]
  : [];
console.log('Parsed expirations:', expirations1);

console.log('\n=== Simulation API Gateway Event 2 (indexed) ===');
console.log(JSON.stringify(simulateAPIGatewayEvent2, null, 2));

const expirations2 = Object.entries(simulateAPIGatewayEvent2.queryStringParameters || {})
  .filter(([key]) => key.startsWith('expirations['))
  .map(([, value]) => value!)
  .filter(Boolean)
  .sort((a, b) => {
    const indexA = parseInt(a.match(/\[(\d+)\]/)?.[1] || '0');
    const indexB = parseInt(b.match(/\[(\d+)\]/)?.[1] || '0');
    return indexA - indexB;
  });
console.log('Parsed expirations:', expirations2);

console.log('\n=== Simulation API Gateway Event 3 (comma-separated) ===');
console.log(JSON.stringify(simulateAPIGatewayEvent3, null, 2));

const expParam3 = simulateAPIGatewayEvent3.queryStringParameters?.['expirations[]'];
const expirations3 = expParam3
  ? (Array.isArray(expParam3) ? expParam3 : expParam3.split(',').map(e => e.trim()))
  : [];
console.log('Parsed expirations:', expirations3);

console.log('\n=== Test avec URLSearchParams ===');
const queryParams = new URLSearchParams();
expirations1.forEach(exp => queryParams.append('expirations[]', exp));
console.log('URLSearchParams result:', queryParams.toString());
console.log('Decoded:', decodeURIComponent(queryParams.toString()));

