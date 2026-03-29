import { ApiUseCase } from "../base/ApiUseCase";
import { GoldPrice } from "../entities/GoldPrice";

export class GetGoldPrices extends ApiUseCase<void, GoldPrice[]> {
  async execute(): Promise<GoldPrice[]> {
    // Mock implementation for now
    return [
      { karat: "24K", pricePerGram: 100, lastUpdated: new Date().toISOString() },
      { karat: "22K", pricePerGram: 90, lastUpdated: new Date().toISOString() },
    ];
  }
}
