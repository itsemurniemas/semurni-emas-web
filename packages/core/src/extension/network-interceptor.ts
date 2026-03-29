/**
 * Network Interceptor for handling global API errors
 * Allows registering callbacks for specific HTTP status codes
 */

export type ErrorCallback = (error: any) => void | Promise<void>;

class NetworkInterceptor {
  private static instance: NetworkInterceptor;
  private errorHandlers: Map<number, ErrorCallback[]> = new Map();
  private globalErrorHandlers: ErrorCallback[] = [];

  private constructor() {}

  static getInstance(): NetworkInterceptor {
    if (!NetworkInterceptor.instance) {
      NetworkInterceptor.instance = new NetworkInterceptor();
    }
    return NetworkInterceptor.instance;
  }

  /**
   * Register a handler for a specific HTTP status code
   * @param statusCode - HTTP status code (e.g., 401, 403, 500)
   * @param callback - Function to execute when the error occurs
   */
  onStatusCode(statusCode: number, callback: ErrorCallback): void {
    if (!this.errorHandlers.has(statusCode)) {
      this.errorHandlers.set(statusCode, []);
    }
    this.errorHandlers.get(statusCode)!.push(callback);
  }

  /**
   * Register a global error handler
   * @param callback - Function to execute for any error
   */
  onError(callback: ErrorCallback): void {
    this.globalErrorHandlers.push(callback);
  }

  /**
   * Handle error and execute registered callbacks
   * @param error - Error object
   */
  async handleError(error: any): Promise<void> {
    try {
      const errorData =
        typeof error.message === "string" ? JSON.parse(error.message) : error;
      const statusCode = errorData.status || errorData.statusCode;

      // Execute status code specific handlers
      if (statusCode && this.errorHandlers.has(statusCode)) {
        const handlers = this.errorHandlers.get(statusCode)!;
        for (const handler of handlers) {
          await handler(errorData);
        }
      }

      // Execute global error handlers
      for (const handler of this.globalErrorHandlers) {
        await handler(errorData);
      }
    } catch (parseError) {
      // If we can't parse the error, just pass it to global handlers
      for (const handler of this.globalErrorHandlers) {
        await handler(error);
      }
    }
  }

  /**
   * Clear all handlers (useful for testing or cleanup)
   */
  clearHandlers(): void {
    this.errorHandlers.clear();
    this.globalErrorHandlers = [];
  }
}

export const networkInterceptor = NetworkInterceptor.getInstance();
