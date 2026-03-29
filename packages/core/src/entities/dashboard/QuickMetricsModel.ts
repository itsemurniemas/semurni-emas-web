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

export interface MetricDataModel {
  type: string;
  value: number;
  change: number;
}

export interface QuickMetricsModel {
  buy: TransactionMetrics;
  sell: TransactionMetrics;
  totalCustomer: number;
  totalEmployee: number;
}
