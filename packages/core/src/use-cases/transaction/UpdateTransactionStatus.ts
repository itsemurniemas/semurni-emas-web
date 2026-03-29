import { ApiUseCase } from "../../base/ApiUseCase";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface UpdateTransactionStatusRequest {
  status: "REJECTED" | "DONE";
}

export interface UpdateTransactionStatusResponse {
  id: string;
  status: string;
  message?: string;
}

export class UpdateTransactionStatus extends ApiUseCase<
  { id: string; request: UpdateTransactionStatusRequest },
  UpdateTransactionStatusResponse
> {
  async execute(params: {
    id: string;
    request: UpdateTransactionStatusRequest;
  }): Promise<UpdateTransactionStatusResponse> {
    const response = await this.request<
      ApiResponse<UpdateTransactionStatusResponse>
    >(`/transactions/${params.id}/status`, HttpMethod.PATCH, params.request);
    return response.data;
  }

  async executeMock(params: {
    id: string;
    request: UpdateTransactionStatusRequest;
  }): Promise<UpdateTransactionStatusResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: params.id,
          status: params.request.status,
          message: `Transaction ${params.id} status updated to ${params.request.status}`,
        });
      }, 1000);
    });
  }
}
