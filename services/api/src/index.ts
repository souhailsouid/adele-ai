import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { findRoute } from "./router";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  // Log initial
  try {
    console.log("=== HANDLER CALLED ===");
    console.log("Event routeKey:", event?.routeKey || "MISSING");
    console.log("Event rawPath:", event?.rawPath || "MISSING");
    console.log("Event keys:", Object.keys(event || {}));
  } catch (logError) {
    // Si même les logs échouent, on continue
  }

  try {
    const { requestContext } = event;

    // Log pour déboguer
    console.log("API Handler called:", {
      routeKey: event.routeKey,
      rawPath: event.rawPath,
      method: requestContext?.http?.method,
      path: requestContext?.http?.path,
      hasJWT: !!(requestContext as any)?.authorizer?.jwt,
    });

    // Auth - API Gateway valide déjà le JWT, extraire les claims
    const jwtClaims = (requestContext as any)?.authorizer?.jwt?.claims;
    console.log("JWT Claims:", jwtClaims ? "present" : "missing");

    if (!jwtClaims) {
      console.log("No JWT claims, returning 401");
      return { statusCode: 401, body: JSON.stringify({ error: "unauthorized" }) };
    }

    // jwtClaims contient: sub (userId), email, etc.
    const userId = jwtClaims.sub;
    console.log("User ID:", userId);

    // Trouver la route
    const routeHandler = findRoute(event);

    if (!routeHandler) {
      console.log("No matching route, returning 404. routeKey was:", event.routeKey);
      return { statusCode: 404, body: JSON.stringify({ error: "not_found" }) };
    }

    // Exécuter le handler de la route
    console.log("[HANDLER] Executing route handler...");
    const result = await routeHandler(event);
    console.log("[HANDLER] Route handler completed successfully");

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (e: any) {
    console.error("ERROR in handler:", e);
    console.error("Error name:", e?.name);
    console.error("Error message:", e?.message);
    console.error("Error stack:", e?.stack);

    // Retourner 500 pour les erreurs serveur, 400 pour les erreurs client
    const statusCode =
      e?.name === "ZodError" || e?.message?.includes("validation") || e?.message?.includes("required")
        ? 400
        : 500;

    return {
      statusCode,
      body: JSON.stringify({
        error: e.message || "Internal server error",
        details: e?.issues || (process.env.NODE_ENV === "development" ? e?.stack : undefined),
      }),
    };
  }
};
