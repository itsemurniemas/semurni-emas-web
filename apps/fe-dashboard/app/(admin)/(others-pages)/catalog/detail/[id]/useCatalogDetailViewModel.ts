import { useState, useEffect } from "react";
import { GetCatalogById, CatalogModel, DataViewState } from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

export const useCatalogDetailViewModel = (catalogId: string) => {
  const { user } = useAuth();
  const [state, setState] = useState<DataViewState<CatalogModel>>(
    DataViewState.initiate(),
  );

  useEffect(() => {
    const fetchCatalog = async () => {
      if (!user || !catalogId) {
        setState(DataViewState.initiate());
        return;
      }

      setState(DataViewState.loading());
      try {
        const useCase = new GetCatalogById(
          getApiConfigForRole(user.role || null),
        );
        const data = await useCase.execute(catalogId);
        setState(DataViewState.success(data));
      } catch (error) {
        console.error("Failed to fetch catalog:", error);
        setState(
          DataViewState.error(
            error instanceof Error ? error.message : "Unknown error",
          ),
        );
      }
    };

    fetchCatalog();
  }, [catalogId, user]);

  return { state };
};
