import { ApiUseCase } from "../../base/ApiUseCase";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface SubmitEmployeeRatingsRequest {
  transactionNumber: string;
  score: number;
  comment?: string;
}

export interface SubmitEmployeeRatingsResponse {
  success: boolean;
  message: string;
}

export class SubmitEmployeeRatings extends ApiUseCase<
  SubmitEmployeeRatingsRequest,
  SubmitEmployeeRatingsResponse
> {
  async execute(
    request: SubmitEmployeeRatingsRequest,
  ): Promise<SubmitEmployeeRatingsResponse> {
    try {
      const response = await this.request<
        ApiResponse<SubmitEmployeeRatingsResponse>
      >("/ratings", HttpMethod.POST, request);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        try {
          const parsedError = JSON.parse(error.message);
          throw new Error(parsedError.message);
        } catch {
          throw error;
        }
      }
      throw error;
    }
  }

  async executeMock(
    _request: SubmitEmployeeRatingsRequest,
  ): Promise<SubmitEmployeeRatingsResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Rating berhasil disimpan",
        });
      }, 1500);
    });
  }
}
