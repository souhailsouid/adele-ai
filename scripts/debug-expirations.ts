/**
 * Script de debug pour tester les formats expirations[]
 * Usage: tsx scripts/debug-expirations.ts
 */

const API_KEY = '925866f5-e97f-459d-850d-5d5856fef716';
const BASE_URL = 'https://api.unusualwhales.com/api';

async function testFormat(name: string, url: string) {
  console.log(`\n=== ${name} ===`);
  console.log('URL:', url);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json, text/plain',
      },
    });
    
    const text = await response.text();
    console.log(`Status: ${response.status}`);
    console.log('Response:', text.substring(0, 500));
    
    if (response.ok) {
      console.log('✅ SUCCESS');
      return true;
    } else {
      console.log('❌ FAILED');
      return false;
    }
  } catch (error: any) {
    console.log('❌ ERROR:', error.message);
    return false;
  }
}

async function main() {
  const ticker = 'AAPL';
  const expirations = ['2024-12-20', '2024-12-27'];
  
  console.log('Testing ATM Chains endpoint with different expirations[] formats\n');
  
  // Format 1: URLSearchParams avec append (format actuel)
  const params1 = new URLSearchParams();
  expirations.forEach(exp => params1.append('expirations[]', exp));
  const url1 = `${BASE_URL}/stock/${ticker}/atm-chains?${params1.toString()}`;
  await testFormat('Format 1: URLSearchParams.append', url1);
  
  // Format 2: Construction manuelle avec &
  const url2 = `${BASE_URL}/stock/${ticker}/atm-chains?expirations[]=2024-12-20&expirations[]=2024-12-27`;
  await testFormat('Format 2: Manual construction', url2);
  
  // Format 3: Virgules dans un seul paramètre
  const url3 = `${BASE_URL}/stock/${ticker}/atm-chains?expirations=2024-12-20,2024-12-27`;
  await testFormat('Format 3: Comma-separated', url3);
  
  // Format 4: URLSearchParams avec set (remplace au lieu d'append)
  const params4 = new URLSearchParams();
  params4.set('expirations[]', expirations[0]);
  params4.set('expirations[]', expirations[1]);
  const url4 = `${BASE_URL}/stock/${ticker}/atm-chains?${params4.toString()}`;
  await testFormat('Format 4: URLSearchParams.set', url4);
  
  // Format 5: Encodage manuel
  const url5 = `${BASE_URL}/stock/${ticker}/atm-chains?expirations%5B%5D=2024-12-20&expirations%5B%5D=2024-12-27`;
  await testFormat('Format 5: Manual encoding', url5);
  
  console.log('\n\n=== Testing Spot Exposures endpoint ===\n');
  
  // Test pour spot-exposures/expiry-strike
  const params6 = new URLSearchParams();
  expirations.forEach(exp => params6.append('expirations[]', exp));
  const url6 = `${BASE_URL}/stock/${ticker}/spot-exposures/expiry-strike?${params6.toString()}`;
  await testFormat('Spot Exposures: URLSearchParams.append', url6);
  
  const url7 = `${BASE_URL}/stock/${ticker}/spot-exposures/expiry-strike?expirations[]=2025-12-05&expirations[]=2025-12-12`;
  await testFormat('Spot Exposures: Manual construction', url7);
}

main().catch(console.error);

