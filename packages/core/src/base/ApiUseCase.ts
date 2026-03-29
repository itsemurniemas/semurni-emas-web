import { ApiConfiguration, ApiVersion, HttpMethod } from "../api-config";
import { UseCase } from "./UseCase";
import { networkInterceptor } from "../extension/network-interceptor";

export abstract class ApiUseCase<IRequest, IResponse> extends UseCase<
  IRequest,
  IResponse
> {
  protected config: ApiConfiguration;

  constructor(config?: ApiConfiguration) {
    super();
    this.config =
      config ||
      new ApiConfiguration({
        version: ApiVersion.V1,
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
      });
  }

  private static _cache = new Map<string, { data: any; expiry: number }>();

  protected async request<T>(
    endpoint: string,
    method: HttpMethod = HttpMethod.GET,
    params?: unknown,
  ): Promise<T> {
    let url = `${this.config.baseUrl}/${this.config.version}/${this.config.prefix}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",

      // MARK: - Prevent caching
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",

      ...this.config.defaultHeaders,
    };

    // Add bearer token from localStorage if available
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let requestBody: string | undefined;

    if (params) {
      if (method === HttpMethod.GET || method === HttpMethod.DELETE) {
        const searchParams = new URLSearchParams();
        Object.entries(params as Record<string, any>).forEach(
          ([key, value]) => {
            if (value !== undefined && value !== null) {
              searchParams.append(key, String(value));
            }
          },
        );
        const query = searchParams.toString();
        if (query) {
          url += (url.includes("?") ? "&" : "?") + query;
        }
      } else {
        requestBody = JSON.stringify(params);
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body: requestBody,
    });

    // Handle 204 No Content as success
    if (response.status === 204) {
      return { code: 204, message: "Success" } as T;
    }

    const contentType = response.headers.get("Content-Type");
    const isJson = contentType && contentType.includes("application/json");

    if (!response.ok) {
      let errorData: any = {
        message: `API Request failed: ${response.statusText} (${response.status})`,
        status: response.status,
      };

      if (isJson) {
        try {
          const apiError = await response.json();
          errorData = { ...errorData, ...apiError };
        } catch {
          // Ignore parsing error
        }
      }

      const error = new Error(JSON.stringify(errorData));
      // Trigger network interceptor to handle the error
      await networkInterceptor.handleError(error);
      throw error;
    }

    if (!isJson) {
      const errorData = {
        message: response.redirected
          ? `Request was redirected to a non-JSON page (${response.url}). Check your middleware or API path.`
          : "Server returned an unexpected response format (HTML instead of JSON).",
        status: response.status,
        redirected: response.redirected,
        type: "INVALID_RESPONSE_FORMAT",
      };
      throw new Error(JSON.stringify(errorData));
    }

    return response.json();
  }

  protected async requestCached<T>(
    endpoint: string,
    seconds: number,
    method: HttpMethod = HttpMethod.GET,
    params?: unknown,
  ): Promise<T> {
    const cacheKey = JSON.stringify({ endpoint, method, params });
    const cachedEntry = ApiUseCase._cache.get(cacheKey);

    if (cachedEntry && cachedEntry.expiry > Date.now()) {
      return cachedEntry.data;
    }

    const response = await this.request<T>(endpoint, method, params);

    ApiUseCase._cache.set(cacheKey, {
      data: response,
      expiry: Date.now() + seconds * 1000,
    });

    return response;
  }
}
