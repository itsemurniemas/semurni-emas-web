"use client";

import { useState, useEffect, useCallback } from "react";
import {
  GetCatalogList,
  GetBranchList,
  CatalogListResponse,
  BranchModel,
  DataViewState,
  ApiConfiguration,
  ApiVersion,
  type GetCatalogListRequest,
} from "@repo/core";

export const useCatalogViewModel = () => {
  const [state, setState] = useState<DataViewState<CatalogListResponse>>(
    DataViewState.initiate(),
  );
  const [branchListState, setBranchListState] = useState<
    DataViewState<BranchModel[]>
  >(DataViewState.initiate());
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCatalogs = useCallback(async (request?: GetCatalogListRequest) => {
    setState(DataViewState.loading());
    try {
      // Use public API configuration for the landing page
      const publicApiConfig = new ApiConfiguration({
        version: ApiVersion.V1,
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
        prefix: "public",
      });

      const useCase = new GetCatalogList(publicApiConfig);
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
  }, []);

  const fetchBranches = useCallback(async () => {
    setBranchListState(DataViewState.loading());
    try {
      const publicApiConfig = new ApiConfiguration({
        version: ApiVersion.V1,
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
        prefix: "public",
      });

      const useCase = new GetBranchList(publicApiConfig);
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
  }, []);

  useEffect(() => {
    fetchCatalogs();
    fetchBranches();
  }, []);

  const refetchCatalogs = useCallback(
    async (request?: GetCatalogListRequest) => {
      await fetchCatalogs(request);
    },
    [fetchCatalogs],
  );

  return {
    state,
    refetchCatalogs,
    branchListState,
    isSearching,
    currentPage,
    setCurrentPage,
  };
};
