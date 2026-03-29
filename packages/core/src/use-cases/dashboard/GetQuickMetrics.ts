import { ApiUseCase } from "../../base/ApiUseCase";
import { QuickMetricsModel } from "../../entities/dashboard/QuickMetricsModel";

export class GetQuickMetrics extends ApiUseCase<void, QuickMetricsModel> {
  async execute(): Promise<QuickMetricsModel> {
    // Mock implementation for now with 2 seconds delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          buy: {
            daily: {
              total: 3782,
              percentageChange: 0.1101,
              trend: "UP",
            },
            monthly: {
              total: 5359,
              percentageChange: 0.0905,
              trend: "UP",
            },
            alltime: {
              total: 8141,
              percentageChange: 0.1006,
              trend: "UP",
            },
          },
          sell: {
            daily: {
              total: 5359,
              percentageChange: 0.0905,
              trend: "UP",
            },
            monthly: {
              total: 12847,
              percentageChange: 0.1501,
              trend: "UP",
            },
            alltime: {
              total: 18206,
              percentageChange: 0.1203,
              trend: "UP",
            },
          },
          totalCustomer: 2420,
          totalEmployee: 189,
        });
      }, 2000);
    });
  }
}
