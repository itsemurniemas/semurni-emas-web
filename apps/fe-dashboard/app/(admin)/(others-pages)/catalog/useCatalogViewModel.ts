"use client";

import { useState, useEffect, useCallback } from "react";
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

export const useCatalogViewModel = () => {
  const { user } = useAuth();
  const [state, setState] = useState<DataViewState<CatalogListResponse>>(
    DataViewState.initiate(),
  );
  const [branchListState, setBranchListState] = useState<
    DataViewState<BranchModel[]>
  >(DataViewState.initiate());
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const fetchCatalogs = useCallback(
    async (request?: GetCatalogListRequest) => {
      if (!user) {
        setState(DataViewState.initiate());
        return;
      }

      try {
        const useCase = new GetCatalogList(
          getApiConfigForRole(user.role || null),
        );
        const data = await useCase.execute(request);
        setState(DataViewState.success(data));
        setIsSearching(false);
      } catch (error) {
        console.error("Failed to fetch catalogs:", error);
        setState(
          DataViewState.error(
            error instanceof Error ? error.message : "Unknown error",
          ),
        );
        setIsSearching(false);
      }
    },
    [user],
  );

  // Fetch branches for super admin
  const fetchBranches = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    // Fetch branches and catalogs on mount
    fetchBranches();
    fetchCatalogs();
  }, [fetchBranches, fetchCatalogs]);

  const refetchCatalogs = useCallback(
    async (request?: GetCatalogListRequest) => {
      await fetchCatalogs(request);
    },
    [fetchCatalogs],
  );

  const apiCurrentPage = state.type === "success" ? state.data.currentPage : 1;

  return {
    state,
    refetchCatalogs,
    branchListState,
    currentPage,
    setCurrentPage,
    apiCurrentPage,
    isSearching,
  };
};
