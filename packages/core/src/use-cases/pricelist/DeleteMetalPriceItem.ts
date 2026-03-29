import { ApiUseCase } from "../../base/ApiUseCase";
import { HttpMethod } from "../../api-config";

export interface DeletePriceItemRequest {
  category: string;
  itemId: string;
}

interface DeletePriceItemResponse {
  code: number;
  message: string;
  data?: any;
}

export class DeleteMetalPriceItem extends ApiUseCase<
  DeletePriceItemRequest,
  DeletePriceItemResponse
> {
  async execute(
    params: DeletePriceItemRequest,
  ): Promise<DeletePriceItemResponse> {
    const { category, itemId } = params;
    const categoryUpper = category.toUpperCase();

    let endpoint = "";

    if (categoryUpper === "GOLD_JEWELRY") {
      endpoint = `/gold-jewelry-items/${itemId}`;
    } else if (categoryUpper === "GOLD_BAR") {
      endpoint = `/gold-bar-items/${itemId}`;
    } else if (categoryUpper === "NON_GOLD") {
      endpoint = `/non-gold-items/${itemId}`;
    } else {
      throw new Error("Unknown category type");
    }

    const response = await this.request<DeletePriceItemResponse>(
      endpoint,
      HttpMethod.DELETE,
    );

    return response;
  }
}
