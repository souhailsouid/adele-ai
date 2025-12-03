/**
 * Test unitaire pour vérifier le parsing des expirations[]
 * Usage: tsx scripts/test-expirations-parsing.ts
 */

// Simuler différents formats que API Gateway peut envoyer
const testCases = [
  {
    name: 'Format 1: Array direct',
    queryStringParameters: {
      'expirations[]': ['2024-12-20', '2024-12-27'],
    },
  },
  {
    name: 'Format 2: String avec virgules (API Gateway concatène)',
    queryStringParameters: {
      'expirations[]': '2024-12-20,2024-12-27',
    },
  },
  {
    name: 'Format 3: String unique',
    queryStringParameters: {
      'expirations[]': '2024-12-20',
    },
  },
  {
    name: 'Format 4: Paramètres indexés',
    queryStringParameters: {
      'expirations[0]': '2024-12-20',
      'expirations[1]': '2024-12-27',
    },
  },
];

function parseExpirations(queryStringParameters: Record<string, any>): string[] {
  let expirations: string[] = [];
  
  if (queryStringParameters) {
    const expParam = queryStringParameters['expirations[]'];
    
    if (expParam) {
      // Si c'est une seule valeur avec virgules, la split
      if (typeof expParam === 'string' && expParam.includes(',')) {
        expirations = expParam.split(',').map(e => e.trim());
      } else {
        // Sinon, convertir en array
        expirations = Array.isArray(expParam) ? expParam : [expParam];
      }
    } else {
      // Méthode 2: Chercher toutes les clés qui commencent par expirations[
      expirations = Object.entries(queryStringParameters)
        .filter(([key]) => key.startsWith('expirations[') || key === 'expirations')
        .map(([, value]) => value!)
        .filter(Boolean);
    }
  }
  
  return expirations;
}

console.log('=== Test du parsing des expirations[] ===\n');

testCases.forEach((testCase, index) => {
  console.log(`\nTest ${index + 1}: ${testCase.name}`);
  console.log('Input:', JSON.stringify(testCase.queryStringParameters, null, 2));
  
  const result = parseExpirations(testCase.queryStringParameters);
  console.log('Parsed:', result);
  
  if (result.length >= 1) {
    console.log('✅ SUCCESS');
  } else {
    console.log('❌ FAILED - No expirations found');
  }
});

// Test avec le format réel de l'erreur
console.log('\n=== Test avec le format de l\'erreur ===');
const errorFormat = {
  queryStringParameters: {
    'expirations[]': '2024-12-20,2024-12-27', // API Gateway a concaténé
  },
};
const errorResult = parseExpirations(errorFormat.queryStringParameters);
console.log('Input (error format):', JSON.stringify(errorFormat.queryStringParameters));
console.log('Parsed:', errorResult);
console.log('Expected: ["2024-12-20", "2024-12-27"]');
console.log('Match:', JSON.stringify(errorResult) === JSON.stringify(['2024-12-20', '2024-12-27']) ? '✅' : '❌');

