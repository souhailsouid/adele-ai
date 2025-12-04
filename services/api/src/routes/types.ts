/**
 * Types communs pour les routes
 */

import type { APIGatewayProxyEventV2 } from "aws-lambda";

export type RouteHandler = (event: APIGatewayProxyEventV2) => Promise<any>;

export interface Route {
  method: string;
  path: string;
  handler: RouteHandler;
}

