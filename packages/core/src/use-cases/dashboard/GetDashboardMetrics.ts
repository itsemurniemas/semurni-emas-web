import { ApiUseCase } from "../../base/ApiUseCase";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface PeriodMetric {
  total: number;
  percentageChange: number | null;
  trend: "UP" | "DOWN" | null;
}

export interface TransactionMetrics {
  daily: PeriodMetric;
  monthly: PeriodMetric;
  alltime: PeriodMetric;
}

export interface DashboardMetricsResponse {
  buy: TransactionMetrics;
  sell: TransactionMetrics;
  totalEmployeeCount: number;
  totalCustomerCount: number;
}

export interface GetDashboardMetricsRequest {
  branchId?: string;
}

export class GetDashboardMetrics extends ApiUseCase<
  GetDashboardMetricsRequest | void,
  DashboardMetricsResponse
> {
  async execute(
    request?: GetDashboardMetricsRequest,
  ): Promise<DashboardMetricsResponse> {
    const params = request?.branchId
      ? { branchId: request.branchId }
      : undefined;

    const response = await this.request<ApiResponse<DashboardMetricsResponse>>(
      `/insights`,
      HttpMethod.GET,
      params,
    );
    return response.data;
  }

  async executeMock(): Promise<DashboardMetricsResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          buy: {
            daily: {
              total: 1,
              percentageChange: 100,
              trend: "UP",
            },
            monthly: {
              total: 3,
              percentageChange: 200,
              trend: "UP",
            },
            alltime: {
              total: 20,
              percentageChange: null,
              trend: null,
            },
          },
          sell: {
            daily: {
              total: 0,
              percentageChange: null,
              trend: null,
            },
            monthly: {
              total: 7,
              percentageChange: 16.67,
              trend: "UP",
            },
            alltime: {
              total: 60,
              percentageChange: null,
              trend: null,
            },
          },
          totalEmployeeCount: 5,
          totalCustomerCount: 10,
        });
      }, 1000);
    });
  }
}
