import { ApiUseCase } from "../../base/ApiUseCase";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface DeleteCatalogRequest {
  id: string;
}

export interface DeleteCatalogResponse {
  id: string;
  message?: string;
}

export class DeleteCatalog extends ApiUseCase<
  DeleteCatalogRequest,
  DeleteCatalogResponse
> {
  async execute(request: DeleteCatalogRequest): Promise<DeleteCatalogResponse> {
    const response = await this.request<ApiResponse<DeleteCatalogResponse>>(
      `/catalogs/${request.id}`,
      HttpMethod.DELETE,
      null,
    );
    return response.data;
  }

  async executeMock(
    request: DeleteCatalogRequest,
  ): Promise<DeleteCatalogResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: request.id,
          message: "Katalog berhasil dihapus",
        });
      }, 1000);
    });
  }
}
