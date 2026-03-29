import { ApiUseCase } from "../../base/ApiUseCase";
import { CatalogModel } from "../../entities/catalog/CatalogModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface CreateCatalogRequest {
  displayName: string;
  totalWeightGram: number;
  netWeightGram: number;
  taraPrice?: number;
  quality?: string | null;
  approvedPurpose?: string;
  isDisplayed: boolean;
  quantity: number;
  productId: string;
  branchId: string;
  images: {
    image: string;
    position: number;
  }[];
}

export interface CreateCatalogResponse {
  id: string;
  displayName: string;
  message?: string;
}

export class CreateCatalog extends ApiUseCase<
  CreateCatalogRequest,
  CreateCatalogResponse
> {
  async execute(request: CreateCatalogRequest): Promise<CreateCatalogResponse> {
    const response = await this.request<ApiResponse<CreateCatalogResponse>>(
      `/catalogs`,
      HttpMethod.POST,
      request,
    );
    return response.data;
  }

  async executeMock(
    request: CreateCatalogRequest,
  ): Promise<CreateCatalogResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Math.random().toString(36).substring(7),
          displayName: request.displayName,
          message: "Katalog berhasil dibuat",
        });
      }, 2000);
    });
  }
}
