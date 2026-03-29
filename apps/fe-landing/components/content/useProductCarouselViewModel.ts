import { useEffect, useState, useCallback } from "react";
import {
  GetCatalogList,
  CatalogListResponse,
  DataViewState,
  ApiConfiguration,
  ApiVersion,
  type GetCatalogListRequest,
} from "@repo/core";

interface ProductCarouselViewState {
  catalogs: CatalogListResponse;
  isLoading: boolean;
  error: string | null;
}

export const useProductCarouselViewModel = (category?: string) => {
  const [state, setState] = useState<DataViewState<CatalogListResponse>>(
    DataViewState.initiate(),
  );

  const fetchCatalogs = useCallback(
    async (request?: GetCatalogListRequest) => {
      const isInitialLoad = state.type === "initiate";
      if (isInitialLoad) {
        setState(DataViewState.loading());
      }

      try {
        const publicApiConfig = new ApiConfiguration({
          version: ApiVersion.V1,
          baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
          prefix: "public",
        });

        const useCase = new GetCatalogList(publicApiConfig);
        const requestData = {
          ...(request || { limit: 4 }),
          ...(category && { category: category.toUpperCase() }),
        };
        const data = await useCase.execute(requestData);
        setState(DataViewState.success(data));
      } catch (error) {
        console.error("Failed to fetch catalogs:", error);
        setState(
          DataViewState.error(
            error instanceof Error ? error.message : "Unknown error occurred",
          ),
        );
      }
    },
    [state.type, category],
  );

  useEffect(() => {
    fetchCatalogs();
  }, [fetchCatalogs]);

  return { state };
};
