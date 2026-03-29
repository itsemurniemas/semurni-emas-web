import { ApiUseCase } from "../../base/ApiUseCase";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface TransactionCustomerInfo {
  name?: string;
  telp?: string;
  birthDate?: number;
  city?: string;
  province?: string;
  subdistrict?: string;
  ward?: string;
  postalCode?: string;
  fullAddress?: string;
  shortAddress?: string;
  isMember?: boolean;
}

export interface BuyTransactionImage {
  image: string;
  position: number;
}

export interface BuyTransactionLineItem {
  displayName: string;
  totalWeightGram: number;
  netWeightGram: number;
  taraPrice: number;
  quality: "LOW_QUALITY" | "HIGH_QUALITY" | undefined;
  category: string;
  quantity: number;
  productId: string;
  subtotal: number;
  finalSubtotal: number;
  images: BuyTransactionImage[];
}

export interface CreateBuyTransactionRequest {
  payments: Array<{
    paymentType: "CASH" | "QRIS" | "NON_CASH";
    amount: number;
    bankAccountNumber?: string | null;
    bankName?: string | null;
  }>;
  note?: string;
  /**
   * `customer` supports either a string id (existing customer) or a
   * full `TransactionCustomerInfo` object (new customer). The server expects
   * `customer` to be either a string or an object — not both.
   */
  customer?: string | TransactionCustomerInfo;
  branch: string;
  lineItems: BuyTransactionLineItem[];
}

export interface CreateBuyTransactionResponse {
  id: string;
  transactionNumber: string;
  status: string;
  createdAt: string;
}

export class CreateBuyTransaction extends ApiUseCase<
  CreateBuyTransactionRequest,
  CreateBuyTransactionResponse
> {
  async execute(
    request: CreateBuyTransactionRequest,
  ): Promise<CreateBuyTransactionResponse> {
    const response = await this.request<
      ApiResponse<CreateBuyTransactionResponse>
    >(`/transactions/buy`, HttpMethod.POST, request);
    return response.data;
  }

  async executeMock(
    request: CreateBuyTransactionRequest,
  ): Promise<CreateBuyTransactionResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "mock-buy-id",
          transactionNumber: "BUY-" + Date.now(),
          status: "completed",
          createdAt: new Date().toISOString(),
        });
      }, 500);
    });
  }
}
