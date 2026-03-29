import { ApiUseCase } from "../../base/ApiUseCase";
import { CatalogListResponse } from "../../entities/catalog/CatalogModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface GetCatalogListRequest {
  page?: number;
  limit?: number;
  branchId?: string;
  search?: string;
  approvedPurpose?:
    | "SELLING"
    | "PROCESS"
    | "SHOT"
    | "STOCK"
    | "null"
    | undefined;
  type?: string; // Comma-separated: GOLD_JEWELRY,NON_GOLD
  category?: string; // Comma-separated: RING,NECKLACE
  minPrice?: number;
  maxPrice?: number;
}

export class GetCatalogList extends ApiUseCase<
  GetCatalogListRequest | void,
  CatalogListResponse
> {
  async execute(request?: GetCatalogListRequest): Promise<CatalogListResponse> {
    const params = {
      page: request?.page || 1,
      limit: request?.limit || 10,
      ...(request?.branchId && { branchId: request.branchId }),
      ...(request?.search && { search: request.search }),
      ...(request?.approvedPurpose && {
        approvedPurpose: request.approvedPurpose,
      }),
      ...(request?.type && { type: request.type }),
      ...(request?.category && { category: request.category }),
      ...(request?.minPrice !== undefined && { minPrice: request.minPrice }),
      ...(request?.maxPrice !== undefined && { maxPrice: request.maxPrice }),
    };

    const response = await this.request<ApiResponse<CatalogListResponse>>(
      `/catalogs`,
      HttpMethod.GET,
      params,
    );
    return response.data;
  }

  async executeMock(
    request?: GetCatalogListRequest,
  ): Promise<CatalogListResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [],
          hasMore: false,
          nextPageUrl: null,
          total: 0,
          totalPages: 0,
          currentPage: request?.page || 1,
        });
      }, 1000);
    });
  }
}
