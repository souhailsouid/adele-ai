/**
 * Script de test pour les endpoints Unusual Whales
 * Usage: node scripts/test-uw-endpoints.js [API_GATEWAY_URL]
 */

const https = require('https');
const http = require('http');

const ACCESS_TOKEN =  "eyJraWQiOiIwekpSMTVhYjBqSk0xdnJmaFBSa0NveGJBaHhnXC9HblhkeU56Y09iRkRyND0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1MTI5ODBiZS0wMGQxLTcwZmYtNTQ3Zi0zYTA3YzkyMzA3ODIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0zLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtM19GUURtaHhWMTQiLCJjbGllbnRfaWQiOiJwa3A0aTgyam50dHRoajJjYmlsdHVkZ3ZhIiwib3JpZ2luX2p0aSI6IjhhYmE0NWFkLTcwMjYtNDJmZi1hYzNmLTc2OGQ0OTM3NGQ5YyIsImV2ZW50X2lkIjoiMDFmY2Y4MDQtMDk5Ny00NDc4LTk3ZmEtYTkxZTBmOTNkYTMwIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc2NDc1OTYyNSwiZXhwIjoxNzY0NzYzMjI1LCJpYXQiOjE3NjQ3NTk2MjUsImp0aSI6ImFmMTM1NzQ5LWM2OWUtNDZhYi04Yjg3LTU1YjQzMDE4NDVlYSIsInVzZXJuYW1lIjoiNTEyOTgwYmUtMDBkMS03MGZmLTU0N2YtM2EwN2M5MjMwNzgyIn0.M89bzVntEGRozNBtfpKkbRvR3XWefY7v-knCrQrj2M0NPoaOKM1bsWRRctCsBd2cTte2pEaKxT6CSMNwSneCXeenAz2KkpBZILEmFHNd65UCrkhHUm0YXkztFQfrAyXO8H4tHtBtm-lanoIc4ksujoJBcfKkDB7qck1PWfQD9jJQaKTMXjFpz0AqgrFp3RoF5fAq7K-2_1ah84aQW7p-oqKj1mP-kcCZy5cX8c7P2BqrPJ70rG7SXGsQobc4Ufy8f4qair73AM9HhKc_-FyIEDrnAgaqXnloJxQMg0tnGsiLPkwPCkMmV3h7MfS8ai6QMIQ2sQ6fBLM0Ge_6WCP04A";

const API_URL = "https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod";

// Fonction pour tester un endpoint
async function testEndpoint(method, path, description, expectedStatus = 200) {
  return new Promise((resolve) => {
    const url = new URL(`${API_URL}${path}`);
    const client = url.protocol === 'https:' ? https : http;
    
    console.log(`\n${description}`);
    console.log(`  ${method} ${path}`);
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };
    
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const status = res.statusCode;
        const isSuccess = status === expectedStatus;
        
        if (isSuccess) {
          console.log(`  ✓ Status: ${status}`);
          try {
            const json = JSON.parse(data);
            const preview = JSON.stringify(json).substring(0, 200);
            console.log(`  Preview: ${preview}...`);
          } catch (e) {
            console.log(`  Preview: ${data.substring(0, 200)}...`);
          }
        } else {
          console.log(`  ✗ Status: ${status} (expected ${expectedStatus})`);
          console.log(`  Response: ${data.substring(0, 500)}`);
        }
        
        resolve({ success: isSuccess, status, data });
      });
    });
    
    req.on('error', (error) => {
      console.log(`  ✗ Error: ${error.message}`);
      resolve({ success: false, error: error.message });
    });
    
    req.end();
  });
}

// Tests
async function runTests() {
  console.log('=== Test des endpoints Unusual Whales ===');
  console.log(`API URL: ${API_URL}\n`);
  
  const results = {
    passed: 0,
    failed: 0,
  };
  
  // ========== Shorts ==========
  console.log('\n=== Shorts Endpoints ===');
  let result = await testEndpoint('GET', '/unusual-whales/shorts/AAPL/data', 'Short Data');
  if (result.success) results.passed++; else results.failed++;
  
  result = await testEndpoint('GET', '/unusual-whales/shorts/AAPL/ftds', 'Failures to Deliver');
  if (result.success) results.passed++; else results.failed++;
  
  result = await testEndpoint('GET', '/unusual-whales/shorts/AAPL/interest-float', 'Short Interest and Float');
  if (result.success) results.passed++; else results.failed++;
  
  result = await testEndpoint('GET', '/unusual-whales/shorts/AAPL/volume-and-ratio', 'Short Volume and Ratio');
  if (result.success) results.passed++; else results.failed++;
  
  result = await testEndpoint('GET', '/unusual-whales/shorts/AAPL/volumes-by-exchange', 'Short Volume By Exchange');
  if (result.success) results.passed++; else results.failed++;
  
  // ========== Seasonality ==========
  console.log('\n=== Seasonality Endpoints ===');
  result = await testEndpoint('GET', '/unusual-whales/seasonality/AAPL/year-month', 'Year-Month Price Change');
  if (result.success) results.passed++; else results.failed++;
  
  result = await testEndpoint('GET', '/unusual-whales/seasonality/AAPL/monthly', 'Monthly Average Return');
  if (result.success) results.passed++; else results.failed++;
  
  result = await testEndpoint('GET', '/unusual-whales/seasonality/3/performers?limit=10', 'Month Performers (March)');
  if (result.success) results.passed++; else results.failed++;
  
  result = await testEndpoint('GET', '/unusual-whales/seasonality/market', 'Market Seasonality');
  if (result.success) results.passed++; else results.failed++;
  
  // ========== Screener ==========
  console.log('\n=== Screener Endpoints ===');
  result = await testEndpoint('GET', '/unusual-whales/screener/analysts?limit=10', 'Analyst Ratings');
  if (result.success) results.passed++; else results.failed++;
  
  result = await testEndpoint('GET', '/unusual-whales/screener/option-contracts?limit=10', 'Option Contracts (Hottest Chains)');
  if (result.success) results.passed++; else results.failed++;
  
  // Utiliser une date récente (l'API limite à 7 jours de trading)
  result = await testEndpoint('GET', '/unusual-whales/screener/stocks', 'Stock Screener');
  if (result.success) results.passed++; else results.failed++;
  
  // ========== Option Trade ==========
  console.log('\n=== Option Trade Endpoints ===');
  result = await testEndpoint('GET', '/unusual-whales/option-trades/flow-alerts?limit=10', 'Flow Alerts');
  if (result.success) results.passed++; else results.failed++;
  
  result = await testEndpoint('GET', '/unusual-whales/option-trades/full-tape/2024-01-18', 'Full Tape');
  if (result.success) results.passed++; else results.failed++;
  
  // ========== Option Contract ==========
  console.log('\n=== Option Contract Endpoints ===');
  result = await testEndpoint('GET', '/unusual-whales/option-contract/AAPL240621C00190000/flow?limit=10', 'Option Contract Flow');
  if (result.success) results.passed++; else results.failed++;
  
  result = await testEndpoint('GET', '/unusual-whales/option-contract/AAPL240621C00190000/historic?limit=10', 'Option Contract Historic');
  if (result.success) results.passed++; else results.failed++;
  
  result = await testEndpoint('GET', '/unusual-whales/option-contract/AAPL240621C00190000/intraday', 'Option Contract Intraday');
  if (result.success) results.passed++; else results.failed++;
  
  result = await testEndpoint('GET', '/unusual-whales/option-contract/AAPL240621C00190000/volume-profile', 'Option Contract Volume Profile');
  if (result.success) results.passed++; else results.failed++;
  
  result = await testEndpoint('GET', '/unusual-whales/stock/AAPL/expiry-breakdown', 'Expiry Breakdown');
  if (result.success) results.passed++; else results.failed++;
  
  result = await testEndpoint('GET', '/unusual-whales/stock/AAPL/option-contracts?limit=10', 'Stock Option Contracts');
  if (result.success) results.passed++; else results.failed++;
  
  // ========== News ==========
  console.log('\n=== News Endpoints ===');
  result = await testEndpoint('GET', '/unusual-whales/news/headlines?limit=10', 'News Headlines');
  if (result.success) results.passed++; else results.failed++;
  
  // Résumé
  console.log('\n=== Résumé ===');
  console.log(`✓ Réussis: ${results.passed}`);
  console.log(`✗ Échoués: ${results.failed}`);
  console.log(`Total: ${results.passed + results.failed}`);
}

runTests().catch(console.error);

