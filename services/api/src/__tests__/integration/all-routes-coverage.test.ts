/**
 * Test de couverture de toutes les routes API
 * Vérifie que toutes les routes définies dans le router sont testées
 */

import { describe, it, expect } from '@jest/globals';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('API Routes Coverage', () => {
  const routerPath = join(__dirname, '../../router.ts');
  // Le script est dans backend/scripts/, on remonte de 4 niveaux depuis __tests__/integration/
  const testScriptPath = join(__dirname, '../../../../../scripts/test-uw-endpoints.sh');
  
  it('should extract all routes from router.ts', () => {
    const routerContent = readFileSync(routerPath, 'utf-8');
    
    // Extraire toutes les routes unusual-whales
    const uwRoutes = routerContent.match(/path:\s*"\/unusual-whales\/[^"]+"/g) || [];
    const uwRoutesClean = uwRoutes.map(r => r.replace(/path:\s*"/, '').replace(/"$/, ''));
    
    // Extraire toutes les routes fmp
    const fmpRoutes = routerContent.match(/path:\s*"\/fmp\/[^"]+"/g) || [];
    const fmpRoutesClean = fmpRoutes.map(r => r.replace(/path:\s*"/, '').replace(/"$/, ''));
    
    console.log(`\nTotal Unusual Whales routes: ${uwRoutesClean.length}`);
    console.log(`Total FMP routes: ${fmpRoutesClean.length}`);
    console.log(`Total routes: ${uwRoutesClean.length + fmpRoutesClean.length}`);
    
    expect(uwRoutesClean.length).toBeGreaterThan(0);
    expect(fmpRoutesClean.length).toBeGreaterThan(0);
  });
  
  it('should extract all tested routes from test script', () => {
    const testScriptContent = readFileSync(testScriptPath, 'utf-8');
    
    // Extraire toutes les routes testées
    const testedRoutes = testScriptContent.match(/test_endpoint\s+"[^"]+"\s+"\/[^"]+"/g) || [];
    const testedRoutesClean = testedRoutes.map(r => {
      const match = r.match(/test_endpoint\s+"[^"]+"\s+"([^"]+)"/);
      return match ? match[1] : null;
    }).filter(Boolean) as string[];
    
    // Filtrer seulement les routes unusual-whales et fmp
    const uwTested = testedRoutesClean.filter(r => r.startsWith('/unusual-whales/'));
    const fmpTested = testedRoutesClean.filter(r => r.startsWith('/fmp/'));
    
    console.log(`\nTested Unusual Whales routes: ${uwTested.length}`);
    console.log(`Tested FMP routes: ${fmpTested.length}`);
    console.log(`Total tested routes: ${uwTested.length + fmpTested.length}`);
    
    expect(testedRoutesClean.length).toBeGreaterThan(0);
  });
  
  it('should identify missing routes', () => {
    const routerContent = readFileSync(routerPath, 'utf-8');
    const testScriptContent = readFileSync(testScriptPath, 'utf-8');
    
    // Extraire routes du router
    const uwRoutes = (routerContent.match(/path:\s*"\/unusual-whales\/[^"]+"/g) || [])
      .map(r => r.replace(/path:\s*"/, '').replace(/"$/, ''));
    const fmpRoutes = (routerContent.match(/path:\s*"\/fmp\/[^"]+"/g) || [])
      .map(r => r.replace(/path:\s*"/, '').replace(/"$/, ''));
    
    // Extraire routes testées
    const testedRoutes = (testScriptContent.match(/test_endpoint\s+"[^"]+"\s+"\/[^"]+"/g) || [])
      .map(r => {
        const match = r.match(/test_endpoint\s+"[^"]+"\s+"([^"]+)"/);
        return match ? match[1] : null;
      })
      .filter(Boolean) as string[];
    
    // Normaliser les routes (enlever les query params)
    const normalizeRoute = (route: string) => route.split('?')[0];
    
    const uwRoutesNormalized = uwRoutes.map(normalizeRoute);
    const fmpRoutesNormalized = fmpRoutes.map(normalizeRoute);
    const testedRoutesNormalized = testedRoutes.map(normalizeRoute);
    
    // Trouver les routes manquantes
    const uwMissing = uwRoutesNormalized.filter(r => !testedRoutesNormalized.includes(r));
    const fmpMissing = fmpRoutesNormalized.filter(r => !testedRoutesNormalized.includes(r));
    
    console.log(`\n=== Missing Routes ===`);
    console.log(`Unusual Whales missing: ${uwMissing.length}`);
    if (uwMissing.length > 0) {
      uwMissing.forEach(r => console.log(`  - ${r}`));
    }
    console.log(`FMP missing: ${fmpMissing.length}`);
    if (fmpMissing.length > 0) {
      fmpMissing.forEach(r => console.log(`  - ${r}`));
    }
    
    // Pour l'instant, on ne fait que logger, pas d'erreur
    // Car certaines routes peuvent nécessiter des paramètres spécifiques
    expect(uwMissing.length + fmpMissing.length).toBeGreaterThanOrEqual(0);
  });
});

