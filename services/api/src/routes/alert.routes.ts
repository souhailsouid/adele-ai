/**
 * Routes pour le service d'alertes multi-signaux
 */

import type { APIGatewayProxyEventV2 } from "aws-lambda";
import type { Route } from "./types";
import { AlertService } from "../services/alert.service";
import type {
  MultiSignalAlertConfig,
} from "../types/alerts";

const alertService = new AlertService();

// Helper functions
function getPathParam(event: APIGatewayProxyEventV2, key: string): string | undefined {
  return event.pathParameters?.[key];
}

function getBody(event: APIGatewayProxyEventV2): any {
  try {
    return event.body ? JSON.parse(event.body) : {};
  } catch {
    return {};
  }
}

function getUserId(event: APIGatewayProxyEventV2): string {
  // Extraire le userId depuis les JWT claims (déjà validé par API Gateway)
  const jwtClaims = (event.requestContext as any)?.authorizer?.jwt?.claims;
  if (jwtClaims?.sub) {
    return jwtClaims.sub;
  }
  // Fallback si pas de JWT (pour développement/test)
  return event.headers?.["x-user-id"] || event.queryStringParameters?.["userId"] || "default-user";
}

export const alertRoutes: Route[] = [
  /**
   * POST /alerts
   * Créer une alerte personnalisée
   */
  {
    method: "POST",
    path: "/alerts",
    handler: async (event) => {
      const userId = getUserId(event);
      const body = getBody(event);
      
      const config: MultiSignalAlertConfig = {
        userId,
        ticker: body.ticker,
        name: body.name,
        description: body.description,
        conditions: body.conditions || [],
        logic: body.logic || "AND",
        notificationChannels: body.notificationChannels || ["webhook"],
        active: body.active !== false,
      };

      return await alertService.createAlert(config);
    },
  },

  /**
   * GET /alerts
   * Récupérer toutes les alertes de l'utilisateur
   */
  {
    method: "GET",
    path: "/alerts",
    handler: async (event) => {
      const userId = getUserId(event);
      return await alertService.getAlerts(userId);
    },
  },

  /**
   * GET /alerts/{id}
   * Récupérer une alerte par ID
   */
  {
    method: "GET",
    path: "/alerts/{id}",
    handler: async (event) => {
      const alertId = getPathParam(event, "id");
      if (!alertId) throw new Error("Missing alert ID");
      
      const userId = getUserId(event);
      return await alertService.getAlert(alertId, userId);
    },
  },

  /**
   * PUT /alerts/{id}
   * Mettre à jour une alerte
   */
  {
    method: "PUT",
    path: "/alerts/{id}",
    handler: async (event) => {
      const alertId = getPathParam(event, "id");
      if (!alertId) throw new Error("Missing alert ID");
      
      const userId = getUserId(event);
      const body = getBody(event);
      
      const updates: Partial<MultiSignalAlertConfig> = {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.conditions && { conditions: body.conditions }),
        ...(body.logic && { logic: body.logic }),
        ...(body.notificationChannels && { notificationChannels: body.notificationChannels }),
        ...(body.active !== undefined && { active: body.active }),
      };

      return await alertService.updateAlert(alertId, userId, updates);
    },
  },

  /**
   * DELETE /alerts/{id}
   * Supprimer une alerte
   */
  {
    method: "DELETE",
    path: "/alerts/{id}",
    handler: async (event) => {
      const alertId = getPathParam(event, "id");
      if (!alertId) throw new Error("Missing alert ID");
      
      const userId = getUserId(event);
      return await alertService.deleteAlert(alertId, userId);
    },
  },

  /**
   * POST /alerts/{id}/test
   * Tester une alerte (vérifier si elle se déclencherait maintenant)
   */
  {
    method: "POST",
    path: "/alerts/{id}/test",
    handler: async (event) => {
      const alertId = getPathParam(event, "id");
      if (!alertId) throw new Error("Missing alert ID");
      
      const userId = getUserId(event);
      return await alertService.testAlert(alertId, userId);
    },
  },
];

