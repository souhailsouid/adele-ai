/**
 * Routes pour le service d'attribution
 */

import type { APIGatewayProxyEventV2 } from "aws-lambda";
import type { Route } from "./types";
import { AttributionService } from "../services/attribution.service";

const attributionService = new AttributionService();

// Helper functions
function getPathParam(event: APIGatewayProxyEventV2, key: string): string | undefined {
  return event.pathParameters?.[key];
}

function getQueryParam(event: APIGatewayProxyEventV2, key: string): string | undefined {
  return event.queryStringParameters?.[key];
}

function getBody(event: APIGatewayProxyEventV2): any {
  try {
    return event.body ? JSON.parse(event.body) : {};
  } catch {
    return {};
  }
}

export const attributionRoutes: Route[] = [
  // Attribuer un flow options à des entités
  {
    method: "POST",
    path: "/attribution/flow",
    handler: async (event) => {
      const body = getBody(event);
      if (!body.ticker || !body.flowType || !body.premium || !body.timestamp) {
        throw new Error("Missing required fields: ticker, flowType, premium, timestamp");
      }
      return await attributionService.attributeFlowToEntities(body);
    },
  },

  // Attribuer l'influence d'une institution sur un ticker
  {
    method: "GET",
    path: "/attribution/institution/{institutionId}/ticker/{ticker}",
    handler: async (event) => {
      const institutionId = getPathParam(event, "institutionId");
      const ticker = getPathParam(event, "ticker");
      const period = getQueryParam(event, "period") || "3M";
      
      if (!institutionId || !ticker) {
        throw new Error("Missing required parameters: institutionId, ticker");
      }

      return await attributionService.attributeInstitutionInfluence({
        institutionId: decodeURIComponent(institutionId),
        ticker: ticker.toUpperCase(),
        period,
      });
    },
  },

  // Trouver les entités dominantes pour un ticker
  {
    method: "GET",
    path: "/attribution/dominant-entities/{ticker}",
    handler: async (event) => {
      const ticker = getPathParam(event, "ticker");
      if (!ticker) {
        throw new Error("Missing ticker parameter");
      }
      return await attributionService.findDominantEntities(ticker.toUpperCase());
    },
  },

  // Clustering institutionnel
  {
    method: "GET",
    path: "/attribution/clusters",
    handler: async (event) => {
      const sector = getQueryParam(event, "sector");
      return await attributionService.clusterInstitutions(sector);
    },
  },

  // Tester la connexion Neo4j
  {
    method: "GET",
    path: "/graph/test-connection",
    handler: async (event) => {
      const { GraphService } = await import("../services/graph.service");
      const graphService = new GraphService();
      const isConnected = await graphService.testConnection();
      return {
        success: isConnected,
        message: isConnected ? "Neo4j connection successful" : "Neo4j connection failed",
        timestamp: new Date().toISOString(),
      };
    },
  },
];

