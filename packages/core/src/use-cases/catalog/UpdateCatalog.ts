import { ApiUseCase } from "../../base/ApiUseCase";
import { CatalogModel } from "../../entities/catalog/CatalogModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface UpdateCatalogRequest {
  displayName?: string;
  totalWeightGram?: number;
  netWeightGram?: number;
  taraPrice?: number;
  quality?: string | null;
  category?: string;
  approvedPurpose?: string;
  isDisplayed?: boolean;
  quantity?: number;
  productId?: string;
  branchId?: string;
  images?: {
    image: string;
    position: number;
  }[];
}

export interface UpdateCatalogResponse {
  id: string;
  displayName: string;
  message?: string;
}

export class UpdateCatalog extends ApiUseCase<
  { id: string; request: UpdateCatalogRequest },
  UpdateCatalogResponse
> {
  async execute(params: {
    id: string;
    request: UpdateCatalogRequest;
  }): Promise<UpdateCatalogResponse> {
    const response = await this.request<ApiResponse<UpdateCatalogResponse>>(
      `/catalogs/${params.id}`,
      HttpMethod.PATCH,
      params.request,
    );
    return response.data;
  }

  async executeMock(params: {
    id: string;
    request: UpdateCatalogRequest;
  }): Promise<UpdateCatalogResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: params.id,
          displayName: params.request.displayName || "Updated Catalog",
          message: "Katalog berhasil diperbarui",
        });
      }, 2000);
    });
  }
}
