import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { GetLogs, DataViewState, type ActivityLog } from "@repo/core";
import { getApiConfigForRole } from "@/lib/api-config";

export type { ActivityLog } from "@repo/core";

interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  total: number;
  hasMore: boolean;
}

export const useLogsViewModel = () => {
  const { user } = useAuth();
  const [state, setState] = useState<DataViewState<ActivityLog[]>>(
    DataViewState.initiate(),
  );
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    total: 0,
    hasMore: false,
  });

  const fetchLogs = async (page: number = 1) => {
    if (!user) {
      setState(DataViewState.initiate());
      return;
    }

    setState(DataViewState.loading());
    try {
      const apiConfig = getApiConfigForRole(user?.role || null);
      const useCase = new GetLogs(apiConfig);
      const response = await useCase.execute({
        page,
        limit: pagination.pageSize,
      });

      setState(DataViewState.success(response.data));
      setPagination({
        currentPage: response.currentPage,
        pageSize: pagination.pageSize,
        totalPages: response.totalPages,
        total: response.total,
        hasMore: response.hasMore,
      });
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      setState(
        DataViewState.error(
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  };

  useEffect(() => {
    fetchLogs(pagination.currentPage);
  }, [user]);

  const goToPage = (page: number) => {
    if (page > 0 && page <= pagination.totalPages) {
      fetchLogs(page);
    }
  };

  return {
    state,
    pagination,
    fetchLogs,
    goToPage,
  };
};
