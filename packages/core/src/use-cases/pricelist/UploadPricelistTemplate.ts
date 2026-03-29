import { ApiConfiguration, ApiVersion, HttpMethod } from "../../api-config";
import { UseCase } from "../../base/UseCase";

export interface UploadPricelistRequest {
  file: File;
}

export interface UploadPricelistResponseData {
  message: string;
  created: number;
  updated: number;
  errors?: string[];
}

export interface UploadPricelistResponse {
  code: number;
  message: string;
  data: UploadPricelistResponseData;
}

export class UploadPricelistTemplate extends UseCase<
  UploadPricelistRequest,
  UploadPricelistResponse
> {
  private config: ApiConfiguration;

  constructor(config?: ApiConfiguration) {
    super();
    this.config =
      config ||
      new ApiConfiguration({
        version: ApiVersion.V1,
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
      });
  }

  async execute(
    request: UploadPricelistRequest,
  ): Promise<UploadPricelistResponse> {
    let url = `${this.config.baseUrl}/${this.config.version}/${this.config.prefix}/products/pricelist/upload`;

    const headers: Record<string, string> = {
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

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("file", request.file);

    // Remove Content-Type header to let browser set it with boundary
    delete headers["Content-Type"];

    const response = await fetch(url, {
      method: HttpMethod.POST,
      headers,
      body: formData,
    });

    if (!response.ok) {
      let errorData: any = {
        message: `Failed to upload pricelist: ${response.statusText} (${response.status})`,
        status: response.status,
      };

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const apiError = await response.json();
          errorData = { ...errorData, ...apiError };
        } catch {
          // Ignore parsing error
        }
      }

      throw new Error(JSON.stringify(errorData));
    }

    // API returns 200 for both success and failure cases
    const contentType = response.headers.get("Content-Type");
    const isJson = contentType && contentType.includes("application/json");

    if (isJson) {
      return response.json();
    }

    // If not JSON, throw error
    throw new Error("API returned non-JSON response");
  }
}
