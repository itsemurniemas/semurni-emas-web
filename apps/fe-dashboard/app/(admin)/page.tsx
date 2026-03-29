"use client";
import {
  QuickMetrics,
  QuickMetricsShimmer,
} from "@/components/dashboard/quickMetrics/QuickMetrics";
import React, { useState } from "react";
import DashboardMetalPriceList from "@/components/dashboard/metalPrices/DashboardMetalPriceList";
import DashboardBranchList from "@/components/dashboard/branch/DasboardBranchList";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import DashboardRecentTransactionList from "@/components/dashboard/transaction/DashboardRecentTransactionList";
import Select from "@/components/form/Select";
import { useHomeViewModel } from "@/app/(admin)/useHomeViewModel";
import { useAuth } from "@/context/AuthContext";
import { Download, AlertCircle } from "lucide-react";

const Ecommerce: React.FC = () => {
  const { user } = useAuth();
  const {
    state,
    period,
    chartDataState,
    handlePeriodChange,
    metalPriceListState,
    branchListState,
    selectedBranchId,
    setSelectedBranchId,
    branchesForSelector,
    recentTransactionsState,
    downloadExcelRecap,
    downloadState,
  } = useHomeViewModel();

  // State for download filter form
  const [downloadFilters, setDownloadFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const isSuperAdmin = user?.role?.name === "SUPER_ADMIN";
  const isAdmin = user?.role?.name === "ADMIN";
  const isCashier = user?.role?.name === "CASHIER";

  const getBranchOptions = () => {
    return branchesForSelector.map((branch) => ({
      value: branch.id,
      label: branch.name,
    }));
  };

  const renderQuickMetrics = () => {
    switch (state.type) {
      case "initiate":
      case "loading":
        return <QuickMetricsShimmer />;
      case "error":
        return (
          <div className="flex items-center justify-center p-10 bg-white rounded-2xl border border-red-200 dark:border-red-800 dark:bg-red-900/10">
            <p className="text-red-500">Error: {state.message}</p>
          </div>
        );
      case "success":
        return (
          <QuickMetrics
            buy={state.data.buy}
            sell={state.data.sell}
            totalCustomer={state.data.totalCustomer}
            totalEmployee={state.data.totalEmployee}
          />
        );
      default:
        return null;
    }
  };

  // const renderMetalPriceList = () => {
  //   switch (metalPriceListState.type) {
  //     case "initiate":
  //     case "loading":
  //       return (
  //         <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/3 sm:px-6">
  //           <div className="animate-pulse space-y-4">
  //             <div className="h-6 bg-gray-200 rounded dark:bg-gray-800 w-48"></div>
  //             <div className="h-10 bg-gray-200 rounded dark:bg-gray-800"></div>
  //             <div className="h-10 bg-gray-200 rounded dark:bg-gray-800"></div>
  //             <div className="space-y-3">
  //               {[1, 2, 3, 4, 5].map((i) => (
  //                 <div
  //                   key={i}
  //                   className="h-16 bg-gray-200 rounded dark:bg-gray-800"
  //                 ></div>
  //               ))}
  //             </div>
  //           </div>
  //         </div>
  //       );
  //     case "error":
  //       return (
  //         <div className="flex items-center justify-center p-10 bg-white rounded-2xl border border-red-200 dark:border-red-800 dark:bg-red-900/10">
  //           <p className="text-red-500">Error: {metalPriceListState.message}</p>
  //         </div>
  //       );
  //     case "success":
  //       return (
  //         <DashboardMetalPriceList
  //           title="Harga Logam Mulia"
  //           priceList={metalPriceListState.data}
  //           isSuperAdmin={isSuperAdmin}
  //         />
  //       );
  //     default:
  //       return null;
  //   }
  // };

  const renderStatisticsChart = () => {
    const chartState = chartDataState[period];
    switch (chartState.type) {
      case "initiate":
      case "loading":
        return (
          <StatisticsChart
            categories={[]}
            series={[]}
            period={period}
            onPeriodChange={handlePeriodChange}
            isLoading={true}
          />
        );
      case "error":
        return (
          <div className="flex items-center justify-center p-10 bg-white rounded-2xl border border-red-200 dark:border-red-800 dark:bg-red-900/10">
            <p className="text-red-500">Error: {chartState.message}</p>
          </div>
        );
      case "success":
        return (
          <StatisticsChart
            categories={chartState.data.categories}
            series={chartState.data.series}
            period={period}
            onPeriodChange={handlePeriodChange}
            isLoading={false}
          />
        );
      default:
        return null;
    }
  };

  const renderBranchList = () => {
    switch (branchListState.type) {
      case "initiate":
      case "loading":
        return (
          <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/3 sm:px-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded dark:bg-gray-800 w-48"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-gray-200 rounded dark:bg-gray-800"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center justify-center p-10 bg-white rounded-2xl border border-red-200 dark:border-red-800 dark:bg-red-900/10">
            <p className="text-red-500">Error: {branchListState.message}</p>
          </div>
        );
      case "success":
        return <DashboardBranchList items={branchListState.data} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Branch Selector & Download Section - Sticky for Super Admin */}
      {isSuperAdmin && (
        <div className="sticky top-20 z-20 bg-linear-to-b from-gray-50 to-gray-50/95 dark:from-gray-950 dark:to-gray-950/95 backdrop-blur-sm px-4 py-4 md:px-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          {/* Branch Selector */}
          <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Pilih Cabang:
              </label>
              <div className="flex-1 max-w-xs">
                <Select
                  options={[
                    { value: "", label: "Semua Cabang" },
                    ...getBranchOptions(),
                  ]}
                  value={selectedBranchId || ""}
                  onChange={(value) => setSelectedBranchId(value || undefined)}
                  placeholder="Semua Cabang"
                />
              </div>
            </div>
          </div>

          {/* Download Excel Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Download Recap
              </h3>
              {downloadState.error && (
                <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle size={14} />
                  {downloadState.error}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={downloadFilters.startDate}
                  onChange={(e) =>
                    setDownloadFilters({
                      ...downloadFilters,
                      startDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={downloadFilters.endDate}
                  onChange={(e) =>
                    setDownloadFilters({
                      ...downloadFilters,
                      endDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() =>
                    downloadExcelRecap(
                      downloadFilters.startDate || undefined,
                      downloadFilters.endDate || undefined,
                      selectedBranchId || undefined,
                    )
                  }
                  disabled={downloadState.loading}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  {downloadState.loading ? "Downloading..." : "Download"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6">{renderQuickMetrics()}</div>

        {/* <div className="col-span-12">{renderMetalPriceList()}</div> */}

        <div className="col-span-12">{renderStatisticsChart()}</div>

        <div className="col-span-12 xl:col-span-5">{renderBranchList()}</div>

        <div className="col-span-12 xl:col-span-7">
          <DashboardRecentTransactionList state={recentTransactionsState} />
        </div>
      </div>
    </div>
  );
};

export default Ecommerce;
