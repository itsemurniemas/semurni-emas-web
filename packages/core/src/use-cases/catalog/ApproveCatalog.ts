import { ApiUseCase } from "../../base/ApiUseCase";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface ApproveCatalogRequest {
  approvedPurpose: "SELLING" | "PROCESS" | "SHOT" | "STOCK";
}

export interface ApproveCatalogResponse {
  id: string;
  message?: string;
}

export class ApproveCatalog extends ApiUseCase<
  { id: string; request: ApproveCatalogRequest },
  ApproveCatalogResponse
> {
  async execute(params: {
    id: string;
    request: ApproveCatalogRequest;
  }): Promise<ApproveCatalogResponse> {
    const response = await this.request<ApiResponse<ApproveCatalogResponse>>(
      `/catalogs/approval/${params.id}`,
      HttpMethod.PATCH,
      params.request,
    );
    return response.data;
  }

  async executeMock(params: {
    id: string;
    request: ApproveCatalogRequest;
  }): Promise<ApproveCatalogResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: params.id,
          message: `Catalog ${params.id} approved with purpose: ${params.request.approvedPurpose}`,
        });
      }, 1000);
    });
  }
}
