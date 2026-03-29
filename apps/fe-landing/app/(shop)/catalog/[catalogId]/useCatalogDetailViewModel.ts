import { useEffect, useState } from "react";
import {
  GetCatalogById,
  CatalogModel,
  DataViewState,
  getProductCategoryLabel,
} from "@repo/core";
import { getApiConfigForRole } from "@/lib/api-config";

interface CatalogDetailViewModel {
  state: DataViewState<CatalogModel>;
  catalog: CatalogModel | null;
  categoryLabel: string;
}

export const useCatalogDetailViewModel = (
  catalogId: string,
): CatalogDetailViewModel => {
  const [state, setState] = useState<DataViewState<CatalogModel>>(
    DataViewState.initiate(),
  );

  // Get category label
  const getCategoryLabel = (): string => {
    if (state.type !== "success") return "Produk";
    return getProductCategoryLabel(state.data.category);
  };

  // Fetch catalog on mount or when catalogId changes
  useEffect(() => {
    const fetchCatalog = async () => {
      if (!catalogId) return;

      setState(DataViewState.loading());
      try {
        const useCase = new GetCatalogById(getApiConfigForRole(null));
        const data = await useCase.execute(catalogId);
        setState(DataViewState.success(data));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load catalog";
        setState(DataViewState.error(errorMessage));
      }
    };

    fetchCatalog();
  }, [catalogId]);

  return {
    state,
    catalog: state.type === "success" ? state.data : null,
    categoryLabel: getCategoryLabel(),
  };
};
