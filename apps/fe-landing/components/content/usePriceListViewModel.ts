import { useState, useEffect } from "react";
import {
    GetMetalPriceList,
    MetalPriceListModel,
    DataViewState,
} from "@repo/core";

export const usePriceListViewModel = () => {
    const [state, setState] = useState<DataViewState<MetalPriceListModel>>(
        DataViewState.initiate()
    );

    useEffect(() => {
        const fetchMetalPriceList = async () => {
            setState(DataViewState.loading());
            try {
                const useCase = new GetMetalPriceList();
                const data: MetalPriceListModel = await useCase.execute();
                setState(DataViewState.success(data));
            } catch (error) {
                console.error("Failed to fetch metal price list:", error);
                setState(DataViewState.error(error instanceof Error ? error.message : "Unknown error"));
            }
        };

        fetchMetalPriceList();
    }, []);

    return {
        state,
    };
};
