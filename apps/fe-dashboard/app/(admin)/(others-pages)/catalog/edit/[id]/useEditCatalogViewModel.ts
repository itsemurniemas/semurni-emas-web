import { useState, useCallback, useEffect } from "react";
import {
  UpdateCatalog,
  UpdateCatalogRequest,
  UpdateCatalogResponse,
  GetCatalogById,
  GetMetalPriceList,
  GetBranchList,
  DeleteCatalog,
  DeleteCatalogRequest,
  DeleteCatalogResponse,
  DataViewState,
  BranchModel,
  CatalogModel,
  type MetalPriceListModel,
} from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

interface UpdateCatalogState {
  type: "idle" | "loading" | "success" | "error";
  data?: UpdateCatalogResponse;
  message?: string;
}

interface DeleteCatalogState {
  type: "idle" | "loading" | "success" | "error";
  data?: DeleteCatalogResponse;
  message?: string;
}

interface FetchCatalogState {
  type: "idle" | "loading" | "success" | "error";
  data?: CatalogModel;
  message?: string;
}

export const useEditCatalogViewModel = (catalogId: string) => {
  const { user } = useAuth();
  const [state, setState] = useState<UpdateCatalogState>({ type: "idle" });
  const [deleteState, setDeleteState] = useState<DeleteCatalogState>({
    type: "idle",
  });
  const [catalogState, setCatalogState] = useState<FetchCatalogState>({
    type: "idle",
  });
  const [priceListState, setPriceListState] = useState<
    DataViewState<MetalPriceListModel>
  >(DataViewState.initiate());
  const [branchListState, setBranchListState] = useState<
    DataViewState<BranchModel[]>
  >(DataViewState.initiate());

  // Fetch catalog by id
  useEffect(() => {
    const fetchCatalog = async () => {
      if (!user || !catalogId) {
        setCatalogState({ type: "idle" });
        return;
      }

      setCatalogState({ type: "loading" });
      try {
        const useCase = new GetCatalogById(
          getApiConfigForRole(user?.role || null),
        );
        const data = await useCase.execute(catalogId);
        setCatalogState({ type: "success", data });
      } catch (error) {
        console.error("Failed to fetch catalog:", error);
        setCatalogState({
          type: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    fetchCatalog();
  }, [user, catalogId]);

  // Fetch price list
  useEffect(() => {
    const fetchPriceList = async () => {
      if (!user) {
        setPriceListState(DataViewState.initiate());
        return;
      }

      setPriceListState(DataViewState.loading());
      try {
        const useCase = new GetMetalPriceList(
          getApiConfigForRole(user?.role || null),
        );
        const data = await useCase.execute();
        setPriceListState(DataViewState.success(data));
      } catch (error) {
        console.error("Failed to fetch price list:", error);
        setPriceListState(
          DataViewState.error(
            error instanceof Error ? error.message : "Unknown error",
          ),
        );
      }
    };

    fetchPriceList();
  }, [user]);

  // Fetch branch list
  useEffect(() => {
    const fetchBranchList = async () => {
      if (!user) {
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
        console.error("Failed to fetch branch list:", error);
        setBranchListState(
          DataViewState.error(
            error instanceof Error ? error.message : "Unknown error",
          ),
        );
      }
    };

    fetchBranchList();
  }, [user]);

  // Get material options based on product type
  const getMaterialOptions = useCallback(() => {
    if (priceListState.type !== "success") return [];

    const options: {
      value: string;
      label: string;
      id: string;
      category: string;
    }[] = [];

    // Add GOLD_JEWELRY options
    priceListState.data.goldJewelryPriceList.forEach((item) => {
      options.push({
        value: item.id,
        label: item.name,
        id: item.id,
        category: "GOLD_JEWELRY",
      });
    });

    // Add GOLD_BAR options
    priceListState.data.goldBarPriceList.forEach((item) => {
      options.push({
        value: item.id,
        label: item.name,
        id: item.id,
        category: "GOLD_BAR",
      });
    });

    // Add NON_GOLD options
    priceListState.data.othersPriceList.forEach((item) => {
      options.push({
        value: item.id,
        label: item.name,
        id: item.id,
        category: "NON_GOLD",
      });
    });

    return options;
  }, [priceListState]);

  // Get branch options
  const getBranchOptions = useCallback(() => {
    if (branchListState.type !== "success") return [];

    return branchListState.data.map((branch) => ({
      value: branch.id,
      label: branch.name,
    }));
  }, [branchListState]);

  // Get price for a material based on id and quality
  const getMaterialPrice = useCallback(
    (materialId: string, quality?: "LOW_QUALITY" | "HIGH_QUALITY") => {
      if (priceListState.type !== "success") return 0;

      const allItems = [
        ...priceListState.data.goldJewelryPriceList,
        ...priceListState.data.goldBarPriceList,
        ...priceListState.data.othersPriceList,
      ];

      const item = allItems.find((i) => i.id === materialId);
      if (!item) return 0;

      // For NON_GOLD, check quality
      if (item.category === "NON_GOLD") {
        if (quality === "LOW_QUALITY")
          return item.sellPrice.lowQualityPrice || 0;
        if (quality === "HIGH_QUALITY")
          return item.sellPrice.highQualityPrice || 0;
        return 0;
      }

      // For GOLD items, use sellPrice.price
      return item.sellPrice.price || 0;
    },
    [priceListState],
  );

  // Get category for a material
  const getMaterialCategory = useCallback(
    (materialId: string) => {
      if (priceListState.type !== "success") return "";

      const allItems = [
        ...priceListState.data.goldJewelryPriceList,
        ...priceListState.data.goldBarPriceList,
        ...priceListState.data.othersPriceList,
      ];

      const item = allItems.find((i) => i.id === materialId);
      return item?.category || "";
    },
    [priceListState],
  );

  const updateCatalog = useCallback(
    async (request: UpdateCatalogRequest) => {
      setState({ type: "loading" });
      try {
        const apiConfig = getApiConfigForRole(user?.role || null);
        const usecase = new UpdateCatalog(apiConfig);
        const response = await usecase.execute({ id: catalogId, request });
        setState({ type: "success", data: response });
        return response;
      } catch (error: any) {
        const errorMessage =
          error?.message || "Failed to update catalog. Please try again.";
        setState({ type: "error", message: errorMessage });
        throw error;
      }
    },
    [user?.role, catalogId],
  );

  const deleteCatalog = useCallback(
    async (request: DeleteCatalogRequest) => {
      setDeleteState({ type: "loading" });
      try {
        const apiConfig = getApiConfigForRole(user?.role || null);
        const usecase = new DeleteCatalog(apiConfig);
        const response = await usecase.execute(request);
        setDeleteState({ type: "success", data: response });
        return response;
      } catch (error: any) {
        const errorMessage =
          error?.message || "Failed to delete catalog. Please try again.";
        setDeleteState({ type: "error", message: errorMessage });
        throw error;
      }
    },
    [user?.role],
  );

  const resetState = useCallback(() => {
    setState({ type: "idle" });
  }, []);

  const resetDeleteState = useCallback(() => {
    setDeleteState({ type: "idle" });
  }, []);

  return {
    state,
    updateCatalog,
    resetState,
    deleteState,
    deleteCatalog,
    resetDeleteState,
    catalogState,
    priceListState,
    getMaterialOptions,
    getMaterialPrice,
    getMaterialCategory,
    branchListState,
    getBranchOptions,
  };
};
