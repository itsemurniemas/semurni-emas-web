import { useState, useEffect } from "react";
import {
    GetBranchList,
    BranchModel,
    DataViewState,
    ApiConfiguration,
    ApiVersion,
} from "@repo/core";

export const useBranchViewModel = () => {
    const [state, setState] = useState<DataViewState<BranchModel[]>>(
        DataViewState.initiate()
    );

    useEffect(() => {
        const fetchBranchList = async () => {
            setState(DataViewState.loading());
            try {
                // Use public API configuration for the landing page
                const publicApiConfig = new ApiConfiguration({
                    version: ApiVersion.V1,
                    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
                    prefix: "public",
                });
                const useCase = new GetBranchList(publicApiConfig);
                const data: BranchModel[] = await useCase.execute();
                setState(DataViewState.success(data));
            } catch (error) {
                console.error("Failed to fetch branch list:", error);
                setState(DataViewState.error(error instanceof Error ? error.message : "Unknown error"));
            }
        };

        fetchBranchList();
    }, []);

    return {
        state,
    };
};
