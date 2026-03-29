import { ApiConfiguration, ApiVersion, HttpMethod } from "../../api-config";
import { UseCase } from "../../base/UseCase";

export interface DownloadExcelRecapRequest {
  startDate?: string;
  endDate?: string;
  branchId?: string;
}

export class DownloadExcelRecap extends UseCase<
  DownloadExcelRecapRequest | void,
  Blob
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

  async execute(request?: DownloadExcelRecapRequest): Promise<Blob> {
    const params = new URLSearchParams();

    if (request?.startDate) params.append("startDate", request.startDate);
    if (request?.endDate) params.append("endDate", request.endDate);
    if (request?.branchId) params.append("branchId", request.branchId);

    const queryString = params.toString();
    let url = `${this.config.baseUrl}/${this.config.version}/${this.config.prefix}/recap/download`;
    if (queryString) {
      url += `?${queryString}`;
    }

    const headers: Record<string, string> = {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      ...this.config.defaultHeaders,
    };

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
      throw new Error(`Failed to download excel recap: ${response.statusText}`);
    }

    return await response.blob();
  }
}
