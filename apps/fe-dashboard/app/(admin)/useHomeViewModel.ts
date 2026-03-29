import { useState, useEffect } from "react";
import {
  GetDashboardMetrics,
  GetStatisticsChart,
  GetMetalPriceList,
  GetBranchList,
  GetTransactionHistory,
  DownloadExcelRecap,
  DataViewState,
  StatisticsChartModel,
  MetalPriceListModel,
  BranchModel,
  Transaction,
} from "@repo/core";
import type { PeriodType } from "@repo/core/use-cases/dashboard/GetStatisticsChart";
import { QuickMetricsProps } from "@/components/dashboard/quickMetrics/data";
import { DasboardListItemProps } from "@/components/dashboard/branch/data";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

export interface StatisticsChartData {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

export const useHomeViewModel = () => {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [state, setState] = useState<DataViewState<QuickMetricsProps>>(
    DataViewState.initiate(),
  );
  const [period, setPeriod] = useState<PeriodType>("monthly");
  const [chartDataState, setChartDataState] = useState<
    Record<PeriodType, DataViewState<StatisticsChartData>>
  >({
    daily: DataViewState.initiate(),
    monthly: DataViewState.initiate(),
  });

  const [metalPriceListState, setMetalPriceListState] = useState<
    DataViewState<MetalPriceListModel>
  >(DataViewState.initiate());

  const [branchListState, setBranchListState] = useState<
    DataViewState<DasboardListItemProps[]>
  >(DataViewState.initiate());

  const [branchesForSelector, setBranchesForSelector] = useState<BranchModel[]>(
    [],
  );

  const [selectedBranchId, setSelectedBranchId] = useState<string | undefined>(
    undefined,
  );

  const [recentTransactionsState, setRecentTransactionsState] = useState<
    DataViewState<Transaction[]>
  >(DataViewState.initiate());

  // Fetch chart data when period or branch changes
  useEffect(() => {
    if (isLoadingAuth || !user) {
      return;
    }

    const fetchChartData = async () => {
      setChartDataState((prev) => ({
        ...prev,
        [period]: DataViewState.loading(),
      }));

      try {
        const useCase = new GetStatisticsChart(
          getApiConfigForRole(user?.role || null),
        );
        const data: StatisticsChartModel = await useCase.execute({
          branchId: selectedBranchId,
          period: period as "daily" | "monthly",
        });

        setChartDataState((prev) => ({
          ...prev,
          [period]: DataViewState.success({
            categories: data.categories,
            series: data.series,
          }),
        }));
      } catch (error) {
        console.error("Failed to fetch statistics chart data:", error);
        setChartDataState((prev) => ({
          ...prev,
          [period]: DataViewState.error(
            error instanceof Error ? error.message : "Unknown error",
          ),
        }));
      }
    };

    fetchChartData();
  }, [period, selectedBranchId, user, isLoadingAuth]);

  // // Fetch metal price list on mount
  // useEffect(() => {
  //   if (isLoadingAuth || !user) {
  //     setMetalPriceListState(DataViewState.initiate());
  //     return;
  //   }

  //   const fetchMetalPriceList = async () => {
  //     setMetalPriceListState(DataViewState.loading());
  //     try {
  //       const useCase = new GetMetalPriceList(
  //         getApiConfigForRole(user?.role || null),
  //       );
  //       const data: MetalPriceListModel = await useCase.execute();
  //       setMetalPriceListState(DataViewState.success(data));
  //     } catch (error) {
  //       console.error("Failed to fetch metal price list:", error);
  //       setMetalPriceListState(
  //         DataViewState.error(
  //           error instanceof Error ? error.message : "Unknown error",
  //         ),
  //       );
  //     }
  //   };

  //   fetchMetalPriceList();
  // }, [user, isLoadingAuth]);

  // Fetch branch list on mount
  useEffect(() => {
    if (isLoadingAuth || !user) {
      setBranchListState(DataViewState.initiate());
      return;
    }

    const fetchBranchList = async () => {
      setBranchListState(DataViewState.loading());
      try {
        const useCase = new GetBranchList(
          getApiConfigForRole(user?.role || null),
        );
        const data: BranchModel[] = await useCase.execute();

        // Store raw branch data for selector
        setBranchesForSelector(data);

        // Transform BranchModel to DasboardListItemProps
        const transformedData: DasboardListItemProps[] = data.map((branch) => ({
          name: branch.area,
          employees: branch.employeeCount,
        }));

        setBranchListState(DataViewState.success(transformedData));
      } catch (error) {
        console.error("Failed to fetch branch list:", error);
        setBranchListState(
          DataViewState.error(
            error instanceof Error ? error.message : "Unknown error",
          ),
        );
      }
    };

    fetchBranchList();
  }, [user, isLoadingAuth]);

  // Fetch dashboard metrics on mount
  useEffect(() => {
    if (isLoadingAuth || !user) {
      setState(DataViewState.initiate());
      return;
    }

    const fetchDashboardMetrics = async () => {
      setState(DataViewState.loading());
      try {
        const useCase = new GetDashboardMetrics(
          getApiConfigForRole(user?.role || null),
        );
        const data = await useCase.execute(
          selectedBranchId ? { branchId: selectedBranchId } : undefined,
        );

        const mappedData: QuickMetricsProps = {
          buy: data.buy,
          sell: data.sell,
          totalCustomer: data.totalCustomerCount,
          totalEmployee: data.totalEmployeeCount,
        };

        setState(DataViewState.success(mappedData));
      } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error);
        setState(
          DataViewState.error(
            error instanceof Error ? error.message : "Unknown error",
          ),
        );
      }
    };

    fetchDashboardMetrics();
  }, [user, isLoadingAuth, selectedBranchId]);

  // Fetch recent transactions
  useEffect(() => {
    if (isLoadingAuth || !user) {
      setRecentTransactionsState(DataViewState.initiate());
      return;
    }

    const fetchRecentTransactions = async () => {
      setRecentTransactionsState(DataViewState.loading());
      try {
        const useCase = new GetTransactionHistory(
          getApiConfigForRole(user?.role || null),
        );
        const response = await useCase.execute({
          page: 1,
          limit: 5,
          status: "DONE",
          branchId: selectedBranchId,
        });

        setRecentTransactionsState(DataViewState.success(response.data));
      } catch (error) {
        console.error("Failed to fetch recent transactions:", error);
        setRecentTransactionsState(
          DataViewState.error(
            error instanceof Error ? error.message : "Unknown error",
          ),
        );
      }
    };

    fetchRecentTransactions();
  }, [user, isLoadingAuth, selectedBranchId]);

  const [downloadState, setDownloadState] = useState<{
    loading: boolean;
    error: string | null;
  }>({ loading: false, error: null });

  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod);
    console.log("Period changed to:", newPeriod);
  };

  const downloadExcelRecap = async (
    startDate?: string,
    endDate?: string,
    branchId?: string,
  ) => {
    setDownloadState({ loading: true, error: null });

    try {
      // Convert YYYY-MM-DD to ISO format
      const request = {
        startDate: startDate
          ? new Date(startDate + "T00:00:00.000Z").toISOString()
          : undefined,
        endDate: endDate
          ? new Date(endDate + "T23:59:59.999Z").toISOString()
          : undefined,
        branchId,
      };

      const useCase = new DownloadExcelRecap(
        getApiConfigForRole(user?.role || null),
      );
      const blob = await useCase.execute(request);

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      // Generate filename with date
      const timestamp = new Date().toISOString().split("T")[0];
      link.download = `recap_${timestamp}.xlsx`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setDownloadState({ loading: false, error: null });
    } catch (error) {
      console.error("Failed to download Excel recap:", error);
      setDownloadState({
        loading: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  return {
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
  };
};
