import { APIGatewayProxyEventV2 } from "aws-lambda";
import { getSignals, createSignal, getSignal, searchSignals } from "./signals";
import { chatWithData } from "./chat";
import { createFund, getFunds, getFund, getFundHoldings, getFundFilings } from "./funds";

type RouteHandler = (event: APIGatewayProxyEventV2) => Promise<any>;

interface Route {
  method: string;
  path: string;
  handler: RouteHandler;
}

// Helper pour parser le body
function parseBody(event: APIGatewayProxyEventV2): any {
  if (!event.body) return undefined;
  try {
    return JSON.parse(event.body);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Helper pour extraire les query params
function getQueryParam(event: APIGatewayProxyEventV2, key: string): string | undefined {
  return event.queryStringParameters?.[key];
}

// Helper pour extraire les path params
function getPathParam(event: APIGatewayProxyEventV2, key: string): string | undefined {
  return event.pathParameters?.[key];
}

// Routes
const routes: Route[] = [
  // Signals
  {
    method: "GET",
    path: "/signals",
    handler: async (event) => {
      const source = getQueryParam(event, "source");
      const type = getQueryParam(event, "type");
      const limit = getQueryParam(event, "limit") ? parseInt(getQueryParam(event, "limit")!) : 100;
      const offset = getQueryParam(event, "offset") ? parseInt(getQueryParam(event, "offset")!) : 0;
      const min_importance = getQueryParam(event, "min_importance") 
        ? parseInt(getQueryParam(event, "min_importance")!) 
        : undefined;
      
      return await getSignals({ source, type, limit, offset, min_importance });
    },
  },
  {
    method: "GET",
    path: "/signals/{id}",
    handler: async (event) => {
      const id = getPathParam(event, "id");
      if (!id) throw new Error("Missing id parameter");
      return await getSignal(id);
    },
  },
  {
    method: "POST",
    path: "/signals",
    handler: async (event) => {
      const body = parseBody(event);
      return await createSignal(body);
    },
  },
  {
    method: "POST",
    path: "/search",
    handler: async (event) => {
      const body = parseBody(event);
      const query = body?.query || getQueryParam(event, "q");
      if (!query) {
        throw new Error("query parameter required");
      }
      const limit = body?.limit || (getQueryParam(event, "limit") ? parseInt(getQueryParam(event, "limit")!) : 20);
      return await searchSignals(query, limit);
    },
  },
  {
    method: "POST",
    path: "/chat",
    handler: async (event) => {
      const body = parseBody(event);
      const userQuery = body?.query || body?.message;
      if (!userQuery) {
        throw new Error("query or message required");
      }
      return await chatWithData(userQuery);
    },
  },
  // Funds
  {
    method: "POST",
    path: "/funds",
    handler: async (event) => {
      console.log("[DEBUG] POST /funds route matched");
      const body = parseBody(event);
      console.log("[DEBUG] JSON received:", JSON.stringify(body));
      return await createFund(body);
    },
  },
  {
    method: "GET",
    path: "/funds",
    handler: async (event) => {
      return await getFunds();
    },
  },
  {
    method: "GET",
    path: "/funds/{id}",
    handler: async (event) => {
      const id = getPathParam(event, "id");
      if (!id) throw new Error("Missing id parameter");
      return await getFund(parseInt(id));
    },
  },
  {
    method: "GET",
    path: "/funds/{id}/holdings",
    handler: async (event) => {
      const id = getPathParam(event, "id");
      if (!id) throw new Error("Missing id parameter");
      const limit = getQueryParam(event, "limit") ? parseInt(getQueryParam(event, "limit")!) : 100;
      return await getFundHoldings(parseInt(id), limit);
    },
  },
  {
    method: "GET",
    path: "/funds/{id}/filings",
    handler: async (event) => {
      const id = getPathParam(event, "id");
      if (!id) throw new Error("Missing id parameter");
      return await getFundFilings(parseInt(id));
    },
  },
];

// Router principal
export function findRoute(event: APIGatewayProxyEventV2): RouteHandler | null {
  const routeKey = event.routeKey; // Format: "POST /funds" ou "POST /funds/{id}/discover"
  
  console.log(`[ROUTER] Looking for route: ${routeKey}`);
  
  // Chercher la route correspondante
  for (const route of routes) {
    // Construire le pattern de route: "METHOD /path"
    const routePattern = `${route.method} ${route.path}`;
    
    if (routeKey === routePattern) {
      console.log(`[ROUTER] Route matched: ${routePattern}`);
      return route.handler;
    }
  }
  
  console.log(`[ROUTER] No route found for: ${routeKey}`);
  return null;
}

