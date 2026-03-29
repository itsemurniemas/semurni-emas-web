import { ApiUseCase } from "../../base/ApiUseCase";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";
import {
  StatisticsChartModel,
  StatisticsApiResponse,
} from "../../entities/dashboard/StatisticsChartModel";

export type PeriodType = "daily" | "monthly";

export interface GetStatisticsChartRequest {
  branchId?: string;
  period?: PeriodType;
}

export class GetStatisticsChart extends ApiUseCase<
  GetStatisticsChartRequest | PeriodType | void,
  StatisticsChartModel
> {
  async execute(
    periodOrRequest?: PeriodType | GetStatisticsChartRequest,
  ): Promise<StatisticsChartModel> {
    // Handle both old (period: string) and new (request object) call signatures
    let period: PeriodType = "daily";
    let branchId: string | undefined;

    if (typeof periodOrRequest === "string") {
      period = periodOrRequest as PeriodType;
    } else if (periodOrRequest && typeof periodOrRequest === "object") {
      const request = periodOrRequest as GetStatisticsChartRequest;
      branchId = request.branchId;
      if (request.period) {
        period = request.period;
      }
    }

    // Build query params
    const params = branchId ? { branchId } : undefined;

    const response = await this.request<ApiResponse<StatisticsApiResponse>>(
      `/statistics`,
      HttpMethod.GET,
      params,
    );

    return this.transformResponse(response.data, period);
  }

  private transformResponse(
    data: StatisticsApiResponse,
    period: PeriodType,
  ): StatisticsChartModel {
    const periodData = data[period];

    const categories = periodData.buy.map((item) => item.label);
    const buyData = periodData.buy.map((item) => item.value);
    const sellData = periodData.sell.map((item) => item.value);

    return {
      period,
      categories,
      series: [
        {
          name: "Pembelian",
          data: buyData,
        },
        {
          name: "Penjualan",
          data: sellData,
        },
      ],
    };
  }

  async executeMock(
    periodOrRequest?: PeriodType | GetStatisticsChartRequest,
  ): Promise<StatisticsChartModel> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Handle both old and new signatures
        let period: PeriodType = "daily";
        if (typeof periodOrRequest === "string") {
          period = periodOrRequest as PeriodType;
        } else if (periodOrRequest && typeof periodOrRequest === "object") {
          const request = periodOrRequest as GetStatisticsChartRequest;
          if (request.period) {
            period = request.period;
          }
        }

        const mockData: StatisticsApiResponse = {
          daily: {
            buy: [
              { value: 0, label: "Mon" },
              { value: 0, label: "Tue" },
              { value: 604905, label: "Wed" },
              { value: 0, label: "Thu" },
              { value: 0, label: "Fri" },
              { value: 5950697, label: "Sat" },
            ],
            sell: [
              { value: 424673952, label: "Mon" },
              { value: 356377194, label: "Tue" },
              { value: 47347740, label: "Wed" },
              { value: 0, label: "Thu" },
              { value: 0, label: "Fri" },
              { value: 0, label: "Sat" },
            ],
          },
          monthly: {
            buy: [
              { value: 112917226, label: "Mar 2025" },
              { value: 113518454, label: "Apr 2025" },
              { value: 2099723, label: "May 2025" },
              { value: 7185200, label: "Jun 2025" },
              { value: 553967, label: "Jul 2025" },
              { value: 21643569, label: "Aug 2025" },
              { value: 0, label: "Sep 2025" },
              { value: 19657364, label: "Oct 2025" },
              { value: 37428891, label: "Nov 2025" },
              { value: 23506827, label: "Dec 2025" },
              { value: 17471083, label: "Jan 2026" },
              { value: 31511167, label: "Feb 2026" },
            ],
            sell: [
              { value: 408834374, label: "Mar 2025" },
              { value: 993392607, label: "Apr 2025" },
              { value: 738630494, label: "May 2025" },
              { value: 2061910140, label: "Jun 2025" },
              { value: 1770442697, label: "Jul 2025" },
              { value: 1579543812, label: "Aug 2025" },
              { value: 1117517467, label: "Sep 2025" },
              { value: 1005555407, label: "Oct 2025" },
              { value: 239562812, label: "Nov 2025" },
              { value: 624945159, label: "Dec 2025" },
              { value: 1674491037, label: "Jan 2026" },
              { value: 930174233, label: "Feb 2026" },
            ],
          },
        };

        resolve(this.transformResponse(mockData, period));
      }, 1000);
    });
  }
}
