/**
 * Tests d'intégration pour toutes les routes API Gateway
 * Teste réellement les routes via HTTP et vérifie le statut et la réponse
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import * as dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_GATEWAY_URL || 'https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod';
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || 'eyJraWQiOiIwekpSMTVhYjBqSk0xdnJmaFBSa0NveGJBaHhnXC9HblhkeU56Y09iRkRyND0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1MTI5ODBiZS0wMGQxLTcwZmYtNTQ3Zi0zYTA3YzkyMzA3ODIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0zLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtM19GUURtaHhWMTQiLCJjbGllbnRfaWQiOiJwa3A0aTgyam50dHRoajJjYmlsdHVkZ3ZhIiwib3JpZ2luX2p0aSI6ImI1YmUzYjJjLTJmYTEtNDhhNi05NzE4LWI3MjkzOGMzOGI2MiIsImV2ZW50X2lkIjoiYjk1NWIzZmYtZDFjOS00MDc2LWJlZjQtYjg2Yjk3NWFjNzczIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc2NDc2MzQ4MywiZXhwIjoxNzY0NzY3MDgzLCJpYXQiOjE3NjQ3NjM0ODMsImp0aSI6IjAzNmNiYTE3LTU5MTgtNDhiNS1hZjZmLTA1NzNhYzhjMTk5OCIsInVzZXJuYW1lIjoiNTEyOTgwYmUtMDBkMS03MGZmLTU0N2YtM2EwN2M5MjMwNzgyIn0.zuJ-QeOqgla5z8URh-wFQ4xFIdkuuupBx2JIKgmwHlTnAmjnj8u4KSGu-67Zr47d-aQ_N24n9hRDkC4u84CdXDXxqxGAPlZonvV6iAaNOLs1B3K2AnccX-1pvM7oTdRfOM5qti_Apm490_0lqD9uxh9mstBtMghtPI2d14jqQlIzZjibPmomFI1Mc2pFnTHAc3qAuL01gwGgrzO12y3MvBIZALHkNJRQChjwJFHMd_1O5tLA5U5Dz7tTwbuBsA5RWcRor6KwIM4gKev8k1zNQtcgPVXyY5vKLXINYk9gcKZW18Gkeo1ujfK2q7-ttqET7u6EmYqzlvzsoeswAZkp5Q';

interface RouteTest {
  method: string;
  path: string;
  description: string;
  expectedStatus?: number;
  category: string;
}

// Toutes les routes à tester (extrait du script bash)
const routes: RouteTest[] = [
  // Legacy Routes
  { method: 'GET', path: '/unusual-whales/institution-ownership/AAPL', description: 'Institution Ownership (Legacy)', category: 'Legacy' },
  { method: 'GET', path: '/unusual-whales/institution-activity/AAPL', description: 'Institution Activity (Legacy)', category: 'Legacy' },
  { method: 'GET', path: '/unusual-whales/options-flow/AAPL', description: 'Options Flow (Legacy)', category: 'Legacy' },
  { method: 'GET', path: '/unusual-whales/flow-alerts/AAPL?limit=10', description: 'Flow Alerts (Legacy)', category: 'Legacy' },
  { method: 'GET', path: '/unusual-whales/greek-flow/AAPL', description: 'Greek Flow (Legacy)', category: 'Legacy' },
  { method: 'GET', path: '/unusual-whales/insider-trades/AAPL?limit=10', description: 'Insider Trades (Legacy)', category: 'Legacy' },
  { method: 'GET', path: '/unusual-whales/option-chains/AAPL', description: 'Option Chains (Legacy)', category: 'Legacy' },
  
  // Alerts
  { method: 'GET', path: '/unusual-whales/alerts?limit=10', description: 'Alerts', category: 'Alerts' },
  { method: 'GET', path: '/unusual-whales/alert-configurations', description: 'Alert Configurations', category: 'Alerts' },
  
  // Congress
  { method: 'GET', path: '/unusual-whales/congress-trader?name=John%20Doe', description: 'Congress Trader', category: 'Congress' },
  { method: 'GET', path: '/unusual-whales/congress-late-reports?limit=10', description: 'Congress Late Reports', category: 'Congress' },
  { method: 'GET', path: '/unusual-whales/congress-recent-trades?limit=10', description: 'Congress Recent Trades', category: 'Congress' },
  { method: 'GET', path: '/unusual-whales/congress-trades/AAPL?limit=10', description: 'Congress Trades by Ticker', category: 'Congress' },
  
  // Dark Pool
  { method: 'GET', path: '/unusual-whales/dark-pool/recent?limit=10', description: 'Dark Pool Recent', category: 'Dark Pool' },
  { method: 'GET', path: '/unusual-whales/dark-pool/AAPL?limit=10', description: 'Dark Pool Ticker', category: 'Dark Pool' },
  
  // Earnings
  { method: 'GET', path: '/unusual-whales/earnings/afterhours?limit=10', description: 'Earnings Afterhours', category: 'Earnings' },
  { method: 'GET', path: '/unusual-whales/earnings/premarket?limit=10', description: 'Earnings Premarket', category: 'Earnings' },
  { method: 'GET', path: '/unusual-whales/earnings/AAPL?limit=10', description: 'Earnings Historical', category: 'Earnings' },
  
  // ETFs
  { method: 'GET', path: '/unusual-whales/etfs/SPY/exposure', description: 'ETF Exposure', category: 'ETFs' },
  { method: 'GET', path: '/unusual-whales/etfs/SPY/holdings?limit=10', description: 'ETF Holdings', category: 'ETFs' },
  { method: 'GET', path: '/unusual-whales/etfs/SPY/in-outflow', description: 'ETF In-Outflow', category: 'ETFs' },
  { method: 'GET', path: '/unusual-whales/etfs/SPY/info', description: 'ETF Info', category: 'ETFs' },
  { method: 'GET', path: '/unusual-whales/etfs/SPY/weights', description: 'ETF Weights', category: 'ETFs' },
  
  // Group Flow
  { method: 'GET', path: '/unusual-whales/group-flow/technology/greek-flow', description: 'Group Greek Flow (Technology)', category: 'Group Flow' },
  { method: 'GET', path: '/unusual-whales/group-flow/technology/greek-flow/2024-12-20', description: 'Group Greek Flow By Expiry', category: 'Group Flow' },
  
  // Insiders
  { method: 'GET', path: '/unusual-whales/insider/transactions?limit=10', description: 'Insider Transactions', category: 'Insiders' },
  { method: 'GET', path: '/unusual-whales/insider/Technology/sector-flow', description: 'Insider Sector Flow', category: 'Insiders' },
  { method: 'GET', path: '/unusual-whales/insider/AAPL', description: 'Insiders by Ticker', category: 'Insiders' },
  { method: 'GET', path: '/unusual-whales/insider/AAPL/ticker-flow', description: 'Insider Ticker Flow', category: 'Insiders' },
  
  // Institutions
  { method: 'GET', path: '/unusual-whales/institution/BLACKROCK%20INC/activity?limit=10', description: 'Institution Activity', category: 'Institutions' },
  { method: 'GET', path: '/unusual-whales/institution/BLACKROCK%20INC/holdings?limit=10', description: 'Institution Holdings', category: 'Institutions' },
  { method: 'GET', path: '/unusual-whales/institution/BLACKROCK%20INC/sectors', description: 'Institution Sector Exposure', category: 'Institutions' },
  { method: 'GET', path: '/unusual-whales/institution/AAPL/ownership?limit=10', description: 'Institution Ownership', category: 'Institutions' },
  { method: 'GET', path: '/unusual-whales/institutions?limit=10', description: 'Institutions List', category: 'Institutions' },
  { method: 'GET', path: '/unusual-whales/institutions/latest-filings?limit=10', description: 'Latest Filings', category: 'Institutions' },
  
  // Market
  { method: 'GET', path: '/unusual-whales/market/correlations?tickers=AAPL,SPY', description: 'Market Correlations', category: 'Market' },
  { method: 'GET', path: '/unusual-whales/market/economic-calendar?limit=10', description: 'Economic Calendar', category: 'Market' },
  { method: 'GET', path: '/unusual-whales/market/fda-calendar?limit=10', description: 'FDA Calendar', category: 'Market' },
  { method: 'GET', path: '/unusual-whales/market/insider-buy-sells', description: 'Total Insider Buy & Sells', category: 'Market' },
  { method: 'GET', path: '/unusual-whales/market/market-tide', description: 'Market Tide', category: 'Market' },
  { method: 'GET', path: '/unusual-whales/market/oi-change?limit=10', description: 'OI Change', category: 'Market' },
  { method: 'GET', path: '/unusual-whales/market/sector-etfs', description: 'Sector ETFs', category: 'Market' },
  { method: 'GET', path: '/unusual-whales/market/spike?limit=10', description: 'SPIKE', category: 'Market' },
  { method: 'GET', path: '/unusual-whales/market/top-net-impact?limit=10', description: 'Top Net Impact', category: 'Market' },
  { method: 'GET', path: '/unusual-whales/market/total-options-volume', description: 'Total Options Volume', category: 'Market' },
  { method: 'GET', path: '/unusual-whales/market/Technology/sector-tide', description: 'Sector Tide', category: 'Market' },
  { method: 'GET', path: '/unusual-whales/market/AAPL/etf-tide', description: 'ETF Tide', category: 'Market' },
  { method: 'GET', path: '/unusual-whales/net-flow/expiry?ticker=AAPL', description: 'Net Flow Expiry', category: 'Market' },
  
  // Stock - quelques exemples clés
  { method: 'GET', path: '/unusual-whales/stock/Basic%20Materials/tickers', description: 'Tickers in Sector', category: 'Stock' },
  { method: 'GET', path: '/unusual-whales/stock/AAPL/atm-chains?expirations[]=2024-12-20&expirations[]=2024-12-27', description: 'ATM Chains', category: 'Stock' },
  { method: 'GET', path: '/unusual-whales/stock/AAPL/flow-alerts?limit=10', description: 'Flow Alerts', category: 'Stock' },
  { method: 'GET', path: '/unusual-whales/stock/AAPL/info', description: 'Stock Information', category: 'Stock' },
  { method: 'GET', path: '/unusual-whales/stock/AAPL/option-chains', description: 'Option Chains', category: 'Stock' },
  { method: 'GET', path: '/unusual-whales/stock/AAPL/spot-exposures/expiry-strike?expirations[]=2025-12-05&expirations[]=2025-12-12', description: 'Spot GEX Exposures By Strike & Expiry', category: 'Stock' },
  
  // Shorts
  { method: 'GET', path: '/unusual-whales/shorts/AAPL/data', description: 'Short Data', category: 'Shorts' },
  { method: 'GET', path: '/unusual-whales/shorts/AAPL/ftds', description: 'Failures to Deliver', category: 'Shorts' },
  { method: 'GET', path: '/unusual-whales/shorts/AAPL/interest-float', description: 'Short Interest and Float', category: 'Shorts' },
  { method: 'GET', path: '/unusual-whales/shorts/AAPL/volume-and-ratio', description: 'Short Volume and Ratio', category: 'Shorts' },
  { method: 'GET', path: '/unusual-whales/shorts/AAPL/volumes-by-exchange', description: 'Short Volume By Exchange', category: 'Shorts' },
  
  // News
  { method: 'GET', path: '/unusual-whales/news/headlines?limit=10', description: 'News Headlines', category: 'News' },
];

describe('API Gateway Routes Integration Tests', () => {
  const results: Array<{
    route: RouteTest;
    status: number;
    success: boolean;
    responseTime: number;
    error?: string;
    responsePreview?: string;
  }> = [];

  beforeAll(() => {
    console.log(`\n🧪 Testing ${routes.length} routes against ${API_URL}\n`);
  });

  // Tester chaque route
  routes.forEach((route) => {
    it(`should test ${route.description} (${route.category})`, async () => {
      const startTime = Date.now();
      const expectedStatus = route.expectedStatus || 200;
      
      try {
        const url = `${API_URL}${route.path}`;
        const response = await fetch(url, {
          method: route.method,
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        const responseTime = Date.now() - startTime;
        const status = response.status;
        const body = await response.text();
        let responsePreview = '';
        
        try {
          const jsonBody = JSON.parse(body);
          responsePreview = JSON.stringify(jsonBody).substring(0, 200);
        } catch {
          responsePreview = body.substring(0, 200);
        }

        const success = status === expectedStatus;

        results.push({
          route,
          status,
          success,
          responseTime,
          responsePreview,
        });

        // Assertions
        expect(status).toBe(expectedStatus);
        expect(response.ok).toBe(true);
        
        // Vérifier que la réponse n'est pas vide (sauf pour 204)
        if (status !== 204) {
          expect(body).toBeTruthy();
        }

        // Vérifier le format de la réponse (doit être JSON valide)
        if (status === 200 && body) {
          expect(() => JSON.parse(body)).not.toThrow();
        }

      } catch (error: any) {
        const responseTime = Date.now() - startTime;
        results.push({
          route,
          status: 0,
          success: false,
          responseTime,
          error: error.message,
        });

        throw error;
      }
    }, 30000); // Timeout de 30 secondes
  });

  afterAll(() => {
    // Générer un rapport
    console.log('\n📊 Test Results Summary\n');
    console.log('='.repeat(80));
    
    const byCategory: Record<string, typeof results> = {};
    results.forEach(r => {
      if (!byCategory[r.route.category]) {
        byCategory[r.route.category] = [];
      }
      byCategory[r.route.category].push(r);
    });

    Object.entries(byCategory).forEach(([category, categoryResults]) => {
      const passed = categoryResults.filter(r => r.success).length;
      const failed = categoryResults.filter(r => !r.success).length;
      const avgTime = categoryResults.reduce((sum, r) => sum + r.responseTime, 0) / categoryResults.length;
      
      console.log(`\n${category}: ${passed}/${categoryResults.length} passed (avg ${avgTime.toFixed(0)}ms)`);
      
      categoryResults.filter(r => !r.success).forEach(r => {
        console.log(`  ❌ ${r.route.description}: ${r.status} - ${r.error || r.responsePreview}`);
      });
    });

    const totalPassed = results.filter(r => r.success).length;
    const totalFailed = results.filter(r => !r.success).length;
    const totalAvgTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

    console.log('\n' + '='.repeat(80));
    console.log(`\n📈 Overall: ${totalPassed}/${results.length} passed (${((totalPassed / results.length) * 100).toFixed(1)}%)`);
    console.log(`⏱️  Average response time: ${totalAvgTime.toFixed(0)}ms`);
    console.log(`✅ Passed: ${totalPassed}`);
    console.log(`❌ Failed: ${totalFailed}`);
  });
});

