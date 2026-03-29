import { ApiUseCase } from "../../base/ApiUseCase";
import { HttpMethod } from "../../api-config";

export interface UpdatePriceItemRequest {
  category: string;
  itemId: string;
  name: string;
  buyPricePerGram?: number;
  sellPricePerGram?: number;
  lowQualityBuyPricePerGram?: number;
  lowQualitySellPricePerGram?: number;
  highQualityBuyPricePerGram?: number;
  highQualitySellPricePerGram?: number;
}

interface UpdatePriceItemResponse {
  code: number;
  message: string;
  data?: any;
}

export class UpdateMetalPriceItem extends ApiUseCase<
  UpdatePriceItemRequest,
  UpdatePriceItemResponse
> {
  async execute(
    params: UpdatePriceItemRequest,
  ): Promise<UpdatePriceItemResponse> {
    const { category, itemId, name, ...priceData } = params;
    const categoryUpper = category.toUpperCase();

    let endpoint = "";
    let requestBody: any = { name };

    if (categoryUpper === "GOLD_JEWELRY") {
      endpoint = `/gold-jewelry-items/${itemId}`;
      requestBody.buyPricePerGram = priceData.buyPricePerGram || 0;
      requestBody.sellPricePerGram = priceData.sellPricePerGram || 0;
    } else if (categoryUpper === "GOLD_BAR") {
      endpoint = `/gold-bar-items/${itemId}`;
      requestBody.buyPricePerGram = priceData.buyPricePerGram || 0;
      requestBody.sellPricePerGram = priceData.sellPricePerGram || 0;
    } else if (categoryUpper === "NON_GOLD") {
      endpoint = `/non-gold-items/${itemId}`;
      requestBody.lowQualityBuyPricePerGram =
        priceData.lowQualityBuyPricePerGram || 0;
      requestBody.lowQualitySellPricePerGram =
        priceData.lowQualitySellPricePerGram || 0;
      requestBody.highQualityBuyPricePerGram =
        priceData.highQualityBuyPricePerGram || 0;
      requestBody.highQualitySellPricePerGram =
        priceData.highQualitySellPricePerGram || 0;
    } else {
      throw new Error("Unknown category type");
    }

    const response = await this.request<UpdatePriceItemResponse>(
      endpoint,
      HttpMethod.PATCH,
      requestBody,
    );

    return response;
  }
}
