/**
 * API Network Interceptor Setup for Dashboard
 * Configures global error handling for all API requests
 */

import { networkInterceptor } from "@repo/core";

/**
 * Initialize network interceptor with global error handlers
 * This should be called once when the app initializes
 */
export const setupNetworkInterceptor = (onUnauthorized?: () => void) => {
  // Handle 401 Unauthorized errors
  networkInterceptor.onStatusCode(401, (error) => {
    console.warn("Unauthorized request detected (401). Logging out...");
    if (onUnauthorized) {
      onUnauthorized();
    }
  });

  // Handle 403 Forbidden errors
  networkInterceptor.onStatusCode(403, (error) => {
    console.warn("Access forbidden (403):", error.message);
  });

  // Handle 500 Server errors
  networkInterceptor.onStatusCode(500, (error) => {
    console.error("Server error (500):", error.message);
  });
};
