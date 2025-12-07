/**
 * Routes pour le service Smart Money
 */

import type { APIGatewayProxyEventV2 } from "aws-lambda";
import type { Route } from "./types";
import { SmartMoneyService } from "../services/smart-money.service";

const smartMoneyService = new SmartMoneyService();

// Helper functions
function getPathParam(event: APIGatewayProxyEventV2, key: string): string | undefined {
  return event.pathParameters?.[key];
}

function getQueryParam(event: APIGatewayProxyEventV2, key: string): string | undefined {
  return event.queryStringParameters?.[key];
}

export const smartMoneyRoutes: Route[] = [
  /**
   * GET /smart-money/top-hedge-funds
   * Top 10 hedge funds par performance
   */
  {
    method: "GET",
    path: "/smart-money/top-hedge-funds",
    handler: async (event) => {
      const period = (getQueryParam(event, "period") as '1M' | '3M' | '6M' | '1Y') || '3M';
      return await smartMoneyService.getTopPerformingHedgeFunds(period);
    },
  },

  /**
   * GET /smart-money/institution/{name}/copy-trades/{ticker}
   * Trades à copier d'une institution pour un ticker
   */
  {
    method: "GET",
    path: "/smart-money/institution/{name}/copy-trades/{ticker}",
    handler: async (event) => {
      const institutionName = getPathParam(event, "name");
      const ticker = getPathParam(event, "ticker");
      
      if (!institutionName) throw new Error("Missing institution name");
      if (!ticker) throw new Error("Missing ticker");
      
      return await smartMoneyService.copyInstitutionTrades(institutionName, ticker);
    },
  },
];

