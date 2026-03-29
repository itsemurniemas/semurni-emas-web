import { ApiConfiguration, ApiVersion, HttpMethod } from "../../api-config";
import { UseCase } from "../../base/UseCase";

export class DownloadTransactionTemplate extends UseCase<void, Blob> {
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

  async execute(): Promise<Blob> {
    let url = `${this.config.baseUrl}/${this.config.version}/${this.config.prefix}/transactions/template/download`;

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

    const response = await fetch(url, {
      method: HttpMethod.GET,
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to download transaction template: ${response.statusText}`,
      );
    }

    return await response.blob();
  }
}
