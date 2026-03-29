import { ApiConfiguration, ApiVersion, HttpMethod } from "../../api-config";
import { UseCase } from "../../base/UseCase";

export interface UploadTransactionRequest {
  file: File;
}

export interface UploadTransactionResponseData {
  message: string;
  created: number;
  updated: number;
  errors?: string[];
}

export interface UploadTransactionResponse {
  code: number;
  message: string;
  data: UploadTransactionResponseData;
}

export class UploadTransactionTemplate extends UseCase<
  UploadTransactionRequest,
  UploadTransactionResponse
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
    request: UploadTransactionRequest,
  ): Promise<UploadTransactionResponse> {
    let url = `${this.config.baseUrl}/${this.config.version}/${this.config.prefix}/transactions/upload`;

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
        message: `Failed to upload transactions: ${response.statusText} (${response.status})`,
        status: response.status,
      };

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const apiError = await response.json();
          errorData = {
            ...apiError,
            status: response.status,
          };
        } catch (e) {
          // Error parsing JSON
        }
      }

      throw new Error(
        errorData.message || "Failed to upload transactions XLSX",
      );
    }

    const data: UploadTransactionResponse = await response.json();
    return data;
  }
}
