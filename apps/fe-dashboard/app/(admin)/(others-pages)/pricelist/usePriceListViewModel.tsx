import { useState, useEffect } from "react";
import {
  GetMetalPriceList,
  UpdateMetalPriceItem,
  DeleteMetalPriceItem,
  MetalPriceListModel,
  DataViewState,
} from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

interface UpdatePriceItemPayload {
  category: string;
  itemId: string;
  name: string;
  buyPricePerGram?: number;
  sellPricePerGram?: number;
  lowQualityBuyPricePerGram?: number;
  lowQualitySellPricePerGram?: number;
  highQualityBuyPricePerGram?: number;
  highQualitySellPricePerGram?: number;
}

export const usePriceListViewModel = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [state, setState] = useState<DataViewState<MetalPriceListModel>>(
    DataViewState.initiate(),
  );

  const fetchMetalPriceList = async () => {
    if (isAuthLoading || !user) {
      setState(DataViewState.initiate());
      return;
    }

    setState(DataViewState.loading());
    try {
      const useCase = new GetMetalPriceList(
        getApiConfigForRole(user?.role || null),
      );
      const data: MetalPriceListModel = await useCase.execute();
      setState(DataViewState.success(data));
    } catch (error) {
      console.error("Failed to fetch metal price list:", error);
      setState(
        DataViewState.error(
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  };

  useEffect(() => {
    // Don't fetch if auth is still loading or user doesn't exist
    if (isAuthLoading || !user) {
      setState(DataViewState.initiate());
      return;
    }

    fetchMetalPriceList();
  }, [user, isAuthLoading]);

  const updatePriceItem = async (payload: UpdatePriceItemPayload) => {
    try {
      const useCase = new UpdateMetalPriceItem(
        getApiConfigForRole(user?.role || null),
      );
      const response = await useCase.execute(payload);
      return response;
    } catch (error) {
      console.error("Error updating price item:", error);
      throw error;
    }
  };

  const deletePriceItem = async (category: string, itemId: string) => {
    try {
      const useCase = new DeleteMetalPriceItem(
        getApiConfigForRole(user?.role || null),
      );
      const response = await useCase.execute({ category, itemId });
      return response;
    } catch (error) {
      console.error("Error deleting price item:", error);
      throw error;
    }
  };

  return {
    state,
    updatePriceItem,
    deletePriceItem,
    refetchPriceList: fetchMetalPriceList,
  };
};
