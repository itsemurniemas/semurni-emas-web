import { ApiUseCase } from "../../base/ApiUseCase";
import { CatalogModel } from "../../entities/catalog/CatalogModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export class GetCatalogById extends ApiUseCase<string, CatalogModel> {
  async execute(id: string): Promise<CatalogModel> {
    const response = await this.request<ApiResponse<CatalogModel>>(
      `/catalogs/${id}`,
      HttpMethod.GET,
    );
    return response.data;
  }

  async executeMock(id: string): Promise<CatalogModel> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: id,
          displayName: "Mock Catalog",
          totalWeightGram: 15.5,
          taraWeightGram: 0.5,
          grossWeightGram: 16.0,
          netWeightGram: 15.0,
          approvedPurpose: "SELLING",
          category: "RING",
          isDisplayed: true,
          quantity: 5,
          approvedByUserId: null,
          productId: "product-123",
          branchId: "branch-123",
          quality: "HIGH_QUALITY",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          images: [],
          product: {
            productType: "RING",
          } as any,
          branch: {
            id: "branch-123",
            name: "Mock Branch",
          } as any,
          approvedBy: null,
          taraPrice: 0,
        });
      }, 500);
    });
  }
}
