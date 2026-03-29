"use client";

import { useState, useEffect } from "react";
import {
  GetCatalogList,
  GetBranchList,
  CatalogListResponse,
  BranchModel,
  DataViewState,
  type GetCatalogListRequest,
} from "@repo/core";
import { useAuth, isSuperAdminRole } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

export const useApprovalViewModel = () => {
  const { user } = useAuth();
  const [state, setState] = useState<DataViewState<CatalogListResponse>>(
    DataViewState.initiate(),
  );
  const [branchListState, setBranchListState] = useState<
    DataViewState<BranchModel[]>
  >(DataViewState.initiate());
  const [currentPage, setCurrentPage] = useState(1);

  const fetchApprovals = async (request?: GetCatalogListRequest) => {
    if (!user) {
      setState(DataViewState.initiate());
      return;
    }

    setState(DataViewState.loading());
    try {
      const useCase = new GetCatalogList(
        getApiConfigForRole(user.role || null),
      );
      const approvalRequest: GetCatalogListRequest = {
        ...(request || {}),
        approvedPurpose: "null",
      };
      const data = await useCase.execute(approvalRequest);
      setState(DataViewState.success(data));
    } catch (error) {
      console.error("Failed to fetch approvals:", error);
      setState(
        DataViewState.error(
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  };

  // Fetch branches for super admin
  const fetchBranches = async () => {
    if (!user || !isSuperAdminRole(user.role)) {
      setBranchListState(DataViewState.initiate());
      return;
    }

    setBranchListState(DataViewState.loading());
    try {
      const useCase = new GetBranchList(
        getApiConfigForRole(user?.role || null),
      );
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
    fetchApprovals();
    fetchBranches();
  }, [user]);

  const refetchApprovals = async (request?: GetCatalogListRequest) => {
    await fetchApprovals(request);
  };

  const apiCurrentPage = state.type === "success" ? state.data.currentPage : 1;

  return {
    state,
    refetchApprovals,
    branchListState,
    currentPage,
    setCurrentPage,
    apiCurrentPage,
  };
};
