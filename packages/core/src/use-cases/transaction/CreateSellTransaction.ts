import { ApiUseCase } from "../../base/ApiUseCase";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";
import { TransactionCustomerInfo } from "./CreateBuyTransaction";

export interface SellTransactionLineItem {
  catalogId: string;
  quantity: number;
  subtotal: number;
  discount: number;
  finalSubtotal: number;
}

export interface CreateSellTransactionRequest {
  payments: Array<{
    paymentType: "CASH" | "QRIS" | "NON_CASH";
    amount: number;
    bankAccountNumber?: string | null;
    bankName?: string | null;
  }>;
  note?: string;
  /**
   * `customer` may be a string id for existing customer, or a full
   * customer object for newly-created customers. Null means no customer.
   */
  customer?: string | TransactionCustomerInfo | null;
  branch?: string;
  lineItems: SellTransactionLineItem[];
}

export interface CreateSellTransactionResponse {
  id: string;
  transactionNumber: string;
  status: string;
  createdAt: string;
}

export class CreateSellTransaction extends ApiUseCase<
  CreateSellTransactionRequest,
  CreateSellTransactionResponse
> {
  async execute(
    request: CreateSellTransactionRequest,
  ): Promise<CreateSellTransactionResponse> {
    const response = await this.request<
      ApiResponse<CreateSellTransactionResponse>
    >(`/transactions/sell`, HttpMethod.POST, request);
    return response.data;
  }

  async executeMock(
    request: CreateSellTransactionRequest,
  ): Promise<CreateSellTransactionResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "mock-id",
          transactionNumber: "TRX-" + Date.now(),
          status: "completed",
          createdAt: new Date().toISOString(),
        });
      }, 500);
    });
  }
}
