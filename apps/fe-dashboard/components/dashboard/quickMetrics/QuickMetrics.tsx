"use client";
import { useState } from "react";
import Badge from "../../ui/badge/Badge";
import { useAuth, isSuperAdminRole } from "@/context/AuthContext";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Briefcase,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  MetricType,
  QuickMetricsProps,
  PeriodType,
  PeriodMetric,
} from "./data";
import { toPercentageSafe } from "@repo/core/extension/number";
import SegmentedPicker from "../../common/SegmentedPicker";

export const MetricIcons: Record<string, React.ReactNode> = {
  [MetricType.TOTAL_SELL]: <TrendingUp className="size-6" />,
  [MetricType.TOTAL_BUY]: <ShoppingCart className="size-6" />,
  [MetricType.TOTAL_CUSTOMER]: <Users className="size-6" />,
  [MetricType.TOTAL_EMPLOYEE]: <Briefcase className="size-6" />,
};

export const MetricTitles: Record<string, string> = {
  [MetricType.TOTAL_SELL]: "Total Penjualan",
  [MetricType.TOTAL_BUY]: "Total Pembelian",
  [MetricType.TOTAL_CUSTOMER]: "Jumlah Pelanggan",
  [MetricType.TOTAL_EMPLOYEE]: "Jumlah Karyawan",
};

interface TransactionMetricCardProps {
  title: string;
  icon: React.ReactNode;
  data: PeriodMetric;
}

const TransactionMetricCard: React.FC<TransactionMetricCardProps> = ({
  title,
  icon,
  data,
}) => {
  const changePercent = data.percentageChange;
  const trend = data.trend;

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/3 xl:p-5">
      <div className="flex flex-col gap-1 lg:gap-2">
        {/* Desktop layout: Icon on top */}
        <div className="hidden lg:flex lg:items-center lg:justify-center lg:w-10 lg:h-10 lg:sm:w-12 lg:sm:h-12 bg-gray-100 rounded-xl dark:bg-gray-800 shrink-0">
          <div className="text-gray-800 dark:text-white/90">{icon}</div>
        </div>

        {/* Tablet/Mobile layout: Icon and Title/Total in row */}
        <div className="flex lg:hidden items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl dark:bg-gray-800 shrink-0">
            <div className="text-gray-800 dark:text-white/90">{icon}</div>
          </div>

          {/* Title and Total column */}
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {title}
            </span>
            <h4 className="mt-0 font-bold text-gray-800 text-sm dark:text-white/90">
              {data.total}
            </h4>
          </div>
        </div>

        {/* Desktop layout: Title */}
        <div className="hidden lg:block">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {title}
          </span>
        </div>

        {/* Desktop layout: Total */}
        <div className="hidden lg:flex lg:items-end">
          <h4 className="mt-0 font-bold text-gray-800 text-sm xl:text-title-sm dark:text-white/90">
            {data.total}
          </h4>
        </div>
      </div>

      {/* Badge - outside flex container, absolute position */}
      {trend && changePercent !== null && (
        <div className="absolute bottom-0 right-0 p-3 sm:p-5">
          <Badge color={trend === "UP" ? "success" : "error"}>
            {trend === "UP" ? (
              <ArrowUp className="text-success-500" size={14} />
            ) : (
              <ArrowDown className="text-error-500" size={14} />
            )}
            {toPercentageSafe(changePercent / 100)}
          </Badge>
        </div>
      )}
    </div>
  );
};

interface MetricCardProps {
  type: MetricType;
  value: number;
  change: number | null;
}

const MetricCard: React.FC<MetricCardProps> = ({ type, value, change }) => {
  if (!type) return null;

  const icon = MetricIcons[type];
  const title = MetricTitles[type];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3 md:p-5">
      <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        <div className="text-gray-800 dark:text-white/90">{icon}</div>
      </div>

      <div className="flex items-end justify-between mt-2 xl:mt-5">
        <div>
          <span className="text-xs xl:text-sm text-gray-500 dark:text-gray-400">
            {title}
          </span>
          <h4 className="mt-0 xl:mt-2 font-bold text-gray-800 text-sm xl:text-title-sm dark:text-white/90">
            {value}
          </h4>
        </div>

        {change !== null && change !== 0 && (
          <Badge color={change > 0 ? "success" : "error"}>
            {change > 0 ? (
              <ArrowUp className="text-success-500" />
            ) : (
              <ArrowDown className="text-error-500" />
            )}
            {toPercentageSafe(change)}
          </Badge>
        )}
      </div>
    </div>
  );
};

export const MetricCardShimmer: React.FC = () => {
  return (
    <div className="animate-fast-pulse rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
      <div className="w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-800" />

      <div className="flex items-end justify-between mt-5">
        <div>
          <div className="h-4.5 bg-gray-200 rounded dark:bg-gray-800 w-24" />
          <div className="h-9.5 bg-gray-200 rounded dark:bg-gray-800 w-20 mt-3" />
        </div>

        <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-800 w-16" />
      </div>
    </div>
  );
};

export const QuickMetricsShimmer: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Buy Metrics Skeleton */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded dark:bg-gray-800 w-48" />
        <div className="h-10 bg-gray-200 rounded dark:bg-gray-800 w-96" />
        <MetricCardShimmer />
      </div>

      {/* Sell Metrics Skeleton */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded dark:bg-gray-800 w-48" />
        <div className="h-10 bg-gray-200 rounded dark:bg-gray-800 w-96" />
        <MetricCardShimmer />
      </div>

      {/* Customer and Employee Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        <MetricCardShimmer />
        <MetricCardShimmer />
      </div>
    </div>
  );
};

export const QuickMetrics: React.FC<QuickMetricsProps> = (props) => {
  const [period, setPeriod] = useState<PeriodType>("daily");
  const { user } = useAuth();
  const isSuperAdmin = isSuperAdminRole(user?.role);

  const periodOptions = [
    { label: "Harian", value: "daily" },
    { label: "Bulanan", value: "monthly" },
    { label: "Sepanjang Waktu", value: "alltime" },
  ];

  const buyMetric = props.buy[period];
  const sellMetric = props.sell[period];

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Ringkasan Transaksi
        </h3>
        <SegmentedPicker
          options={periodOptions}
          value={period}
          onChange={(value) => setPeriod(value as PeriodType)}
        />
      </div>

      {/* Buy and Sell Transactions Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
            Total Pembelian
          </h4>
          <TransactionMetricCard
            title="Pembelian"
            icon={MetricIcons[MetricType.TOTAL_BUY]}
            data={buyMetric}
          />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
            Total Penjualan
          </h4>
          <TransactionMetricCard
            title="Penjualan"
            icon={MetricIcons[MetricType.TOTAL_SELL]}
            data={sellMetric}
          />
        </div>
      </div>

      {/* Customer and Employee Count */}
      {isSuperAdmin && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          <TransactionMetricCard
            title={MetricTitles[MetricType.TOTAL_CUSTOMER]}
            icon={MetricIcons[MetricType.TOTAL_CUSTOMER]}
            data={{
              total: props.totalCustomer,
              percentageChange: null,
              trend: null,
            }}
          />
          <TransactionMetricCard
            title={MetricTitles[MetricType.TOTAL_EMPLOYEE]}
            icon={MetricIcons[MetricType.TOTAL_EMPLOYEE]}
            data={{
              total: props.totalEmployee,
              percentageChange: null,
              trend: null,
            }}
          />
        </div>
      )}
    </div>
  );
};
