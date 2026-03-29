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
  getProductCategoryLabel,
} from "@repo/core";

const ITEMS_PER_PAGE = 12;

export const useCategoryViewModel = (categoryParam: string) => {
  const [state, setState] = useState<DataViewState<CatalogListResponse>>(
    DataViewState.initiate(),
  );
  const [branchListState, setBranchListState] = useState<
    DataViewState<BranchModel[]>
  >(DataViewState.initiate());
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryLabel, setCategoryLabel] = useState<string>("");

  // Get category label from the category value
  useEffect(() => {
    const label = getProductCategoryLabel(categoryParam);
    setCategoryLabel(label);
  }, [categoryParam]);

  const fetchCatalogs = useCallback(
    async (request?: GetCatalogListRequest) => {
      // Only set full loading state on initial load, not on search
      const isInitialLoad = state.type === "initiate";
      if (isInitialLoad) {
        setState(DataViewState.loading());
      } else {
        setIsSearching(true);
      }

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
    },
    [state.type],
  );

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

  // Initial fetch with category filter
  useEffect(() => {
    fetchCatalogs({
      category: categoryParam,
      approvedPurpose: "SELLING",
      limit: ITEMS_PER_PAGE,
    });
    fetchBranches();
  }, [categoryParam, fetchCatalogs, fetchBranches]);

  const refetchCatalogs = useCallback(
    async (request?: GetCatalogListRequest) => {
      await fetchCatalogs({
        ...request,
        category: categoryParam,
        approvedPurpose: "SELLING",
        limit: ITEMS_PER_PAGE,
      });
    },
    [fetchCatalogs, categoryParam],
  );

  return {
    state,
    refetchCatalogs,
    branchListState,
    isSearching,
    currentPage,
    setCurrentPage,
    categoryLabel,
  };
};
