"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import SegmentedPicker from "../common/SegmentedPicker";
import dynamic from "next/dynamic";
import { formatRupiah, formatKMT } from "@repo/core";
import type { PeriodType } from "@repo/core/use-cases/dashboard/GetStatisticsChart";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface StatisticsChartProps {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
  period: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  isLoading?: boolean;
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({
  categories,
  series,
  period,
  onPeriodChange,
  isLoading = false,
}) => {
  const periodOptions = [
    { label: "Harian", value: "daily" },
    { label: "Bulanan", value: "monthly" },
  ];

  const getPeriodLabel = () => {
    switch (period) {
      case "daily":
        return "harinya";
      case "monthly":
        return "bulannya";
    }
  };

  const options: ApexOptions = {
    legend: {
      show: false, // Hide legend
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"], // Define line colors
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line", // Set the chart type to 'line'
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      curve: "straight", // Define the line style (straight, smooth, or step)
      width: [2, 2], // Line width for each dataset
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0, // Size of the marker points
      strokeColors: "#fff", // Marker border color
      strokeWidth: 2,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      x: {
        format: "dd MMM yyyy", // Format for x-axis tooltip
      },
      y: {
        formatter: (value: number) => formatRupiah(value, true, 0),
      },
    },
    xaxis: {
      type: "category", // Category-based x-axis
      categories: categories,
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px", // Adjust font size for y-axis labels
          colors: ["#6B7280"], // Color of the labels
        },
        formatter: (value: number) => formatKMT(value, 0),
      },
      title: {
        text: "", // Remove y-axis title
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistik
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Pembelian dan Penjualan setiap {getPeriodLabel()}
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <SegmentedPicker
            options={periodOptions}
            value={period}
            onChange={(value) => onPeriodChange(value as PeriodType)}
            width="fit"
          />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-250 xl:min-w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-80">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
          ) : (
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height={310}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsChart;
