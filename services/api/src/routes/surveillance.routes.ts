/**
 * Routes pour le service de surveillance
 */

import type { APIGatewayProxyEventV2 } from "aws-lambda";
import type { Route } from "./types";
import { SurveillanceService } from "../services/surveillance.service";
import type {
  SurveillanceConfig,
} from "../types/surveillance";

const surveillanceService = new SurveillanceService();

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

export const surveillanceRoutes: Route[] = [
  /**
   * POST /surveillance/watch
   * Créer une surveillance pour un ticker
   */
  {
    method: "POST",
    path: "/surveillance/watch",
    handler: async (event) => {
      const userId = getUserId(event);
      const body = getBody(event);
      
      const config: SurveillanceConfig = {
        ticker: body.ticker,
        minPremium: body.minPremium,
        callVolumeThreshold: body.callVolumeThreshold,
        putVolumeThreshold: body.putVolumeThreshold,
        darkPoolVolumeThreshold: body.darkPoolVolumeThreshold,
        shortInterestThreshold: body.shortInterestThreshold,
        insiderChangeThreshold: body.insiderChangeThreshold,
        checkInterval: body.checkInterval,
        notificationChannels: body.notificationChannels,
        active: body.active !== false,
      };

      return await surveillanceService.createWatch(userId, config);
    },
  },

  /**
   * GET /surveillance/watches
   * Récupérer toutes les surveillances de l'utilisateur
   */
  {
    method: "GET",
    path: "/surveillance/watches",
    handler: async (event) => {
      const userId = getUserId(event);
      return await surveillanceService.getWatches(userId);
    },
  },

  /**
   * DELETE /surveillance/watch/{id}
   * Supprimer une surveillance
   */
  {
    method: "DELETE",
    path: "/surveillance/watch/{id}",
    handler: async (event) => {
      const watchId = getPathParam(event, "id");
      if (!watchId) throw new Error("Missing watch ID");
      
      const userId = getUserId(event);
      return await surveillanceService.deleteWatch(watchId, userId);
    },
  },

  /**
   * GET /surveillance/watch/{id}/alerts
   * Récupérer les alertes d'une surveillance
   */
  {
    method: "GET",
    path: "/surveillance/watch/{id}/alerts",
    handler: async (event) => {
      const watchId = getPathParam(event, "id");
      if (!watchId) throw new Error("Missing watch ID");
      
      const userId = getUserId(event);
      return await surveillanceService.getAlerts(watchId, userId);
    },
  },

  /**
   * POST /surveillance/watch/{id}/check
   * Déclencher manuellement la vérification d'une surveillance (pour tests)
   */
  {
    method: "POST",
    path: "/surveillance/watch/{id}/check",
    handler: async (event) => {
      const watchId = getPathParam(event, "id");
      if (!watchId) throw new Error("Missing watch ID");
      
      const userId = getUserId(event);
      
      // Vérifier que la surveillance appartient à l'utilisateur
      const watches = await surveillanceService.getWatches(userId);
      const watch = watches.data?.watches.find((w) => w.id === watchId);
      
      if (!watch) {
        throw new Error("Watch not found or unauthorized");
      }
      
      // Déclencher la vérification
      await surveillanceService.checkWatch(watchId);
      
      // Retourner les alertes générées
      return await surveillanceService.getAlerts(watchId, userId);
    },
  },
];

