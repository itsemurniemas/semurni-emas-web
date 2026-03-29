// src/constants/quickMetrics.ts

export enum MetricType {
  TOTAL_SELL = "TOTAL_SELL",
  TOTAL_BUY = "TOTAL_BUY",
  TOTAL_CUSTOMER = "TOTAL_CUSTOMER",
  TOTAL_EMPLOYEE = "TOTAL_EMPLOYEE",
}

export type PeriodType = "daily" | "monthly" | "alltime";

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

export interface MetricData {
  type: MetricType;
  value: number;
  change: number | null;
}

export interface QuickMetricsProps {
  buy: TransactionMetrics;
  sell: TransactionMetrics;
  totalCustomer: number;
  totalEmployee: number;
}

export const MOCK_QUICK_METRICS: QuickMetricsProps = {
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
  totalCustomer: 10,
  totalEmployee: 5,
};
