import { useState, useEffect } from "react";
import {
  DataViewState,
  GetTransactionHistory,
  GetTransactionHistoryResponse,
  Transaction,
  GetBranchList,
  BranchModel,
  ApiConfiguration,
  ApiVersion,
} from "@repo/core";
import { useAuth, isSuperAdminRole } from "@/context/AuthContext";

interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  total: number;
  hasMore: boolean;
}

export const useApprovalTransactionViewModel = () => {
  const { user } = useAuth();
  const [state, setState] = useState<DataViewState<Transaction[]>>(
    DataViewState.initiate<Transaction[]>(),
  );
  const [branchListState, setBranchListState] = useState<
    DataViewState<BranchModel[]>
  >(DataViewState.initiate<BranchModel[]>());
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    total: 0,
    hasMore: false,
  });

  const fetchTransactions = async (
    page: number = 1,
    branchId?: string | null,
    transactionType?: string | null,
  ) => {
    if (!user) {
      setState(DataViewState.initiate<Transaction[]>());
      return;
    }

    setState(DataViewState.loading());
    try {
      const apiConfig = new ApiConfiguration({
        version: ApiVersion.V1,
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
        prefix: isSuperAdminRole(user?.role) ? "super-admin" : "client",
      });

      const useCase = new GetTransactionHistory(apiConfig);
      const response = await useCase.execute({
        page,
        limit: pagination.pageSize,
        transactionType:
          transactionType && transactionType !== ""
            ? (transactionType as "SELL" | "BUY")
            : undefined,
        status: "PENDING",
        branchId: branchId && branchId !== "" ? branchId : undefined,
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
      console.error("Failed to fetch approval transactions:", error);
      setState(
        DataViewState.error(
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  };

  // Fetch branches for super admin
  const fetchBranches = async () => {
    if (!user || !isSuperAdminRole(user?.role)) {
      setBranchListState(DataViewState.initiate<BranchModel[]>());
      return;
    }

    setBranchListState(DataViewState.loading());
    try {
      const apiConfig = new ApiConfiguration({
        version: ApiVersion.V1,
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
        prefix: "super-admin",
      });

      const useCase = new GetBranchList(apiConfig);
      const data = await useCase.execute();

      setBranchListState(DataViewState.success(data));
    } catch (error) {
      console.error("Failed to fetch branches:", error);
      setBranchListState(
        DataViewState.error(
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  };

  useEffect(() => {
    fetchTransactions(pagination.currentPage);
    fetchBranches();
  }, [user]);

  const goToPage = (
    page: number,
    branchId?: string | null,
    transactionType?: string | null,
  ) => {
    if (page > 0 && page <= pagination.totalPages) {
      fetchTransactions(page, branchId, transactionType);
    }
  };

  return {
    state,
    branchListState,
    pagination,
    goToPage,
    fetchTransactions,
  };
};
