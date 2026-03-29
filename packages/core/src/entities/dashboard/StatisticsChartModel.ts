export interface ChartDataPoint {
  value: number;
  label: string;
}

export interface TransactionChartData {
  buy: ChartDataPoint[];
  sell: ChartDataPoint[];
}

export interface StatisticsApiResponse {
  daily: TransactionChartData;
  monthly: TransactionChartData;
}

export interface StatisticsDataPoint {
  name: string;
  data: number[];
}

export interface StatisticsChartModel {
  period: "daily" | "monthly";
  categories: string[];
  series: StatisticsDataPoint[];
}
