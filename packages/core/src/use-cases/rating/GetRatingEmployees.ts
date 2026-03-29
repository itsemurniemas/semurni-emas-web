import { ApiUseCase } from "../../base/ApiUseCase";
import { EmployeeModel } from "../../entities";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface GetRatingEmployeesRequest {
  transactionNumber: string;
}

export interface GetRatingEmployeesResponse {
  transactionNumber: string;
  employee: EmployeeModel | null;
}

export class GetRatingEmployees extends ApiUseCase<
  GetRatingEmployeesRequest,
  GetRatingEmployeesResponse
> {
  async execute(
    request: GetRatingEmployeesRequest,
  ): Promise<GetRatingEmployeesResponse> {
    try {
      const response = await this.request<ApiResponse<any>>(
        `/ratings/transaction/${request.transactionNumber}`,
        HttpMethod.GET,
      );

      // Handle both single employee and multiple employees responses
      const data = response.data;
      return {
        transactionNumber: data.transactionNumber,
        employee: data.employee || null,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        try {
          throw new Error(error.message);
        } catch {
          throw new Error("Transaksi tidak ditemukan");
        }
      }
      throw new Error("Transaksi tidak ditemukan");
    }
  }

  async executeMock(
    _request: GetRatingEmployeesRequest,
  ): Promise<GetRatingEmployeesResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          transactionNumber: _request.transactionNumber,
          employee: null,
        });
      }, 1000);
    });
  }
}
