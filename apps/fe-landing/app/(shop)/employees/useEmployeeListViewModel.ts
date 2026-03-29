import { useState, useEffect } from "react";
import { GetEmployeeList, BranchWithEmployeesModel, DataViewState } from "@repo/core";
import { ApiConfiguration, ApiVersion } from "@repo/core";

export const useEmployeeListViewModel = () => {
    const [state, setState] = useState<DataViewState<BranchWithEmployeesModel[]>>(
        DataViewState.initiate()
    );

    useEffect(() => {
        const fetchEmployees = async () => {
            setState(DataViewState.loading());
            try {
                // Use explicit public API configuration for landing page
                const publicApiConfig = new ApiConfiguration({
                    version: ApiVersion.V1,
                    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
                    prefix: "public",
                });
                
                const useCase = new GetEmployeeList(publicApiConfig);
                const data = await useCase.execute();
                setState(DataViewState.success(data));
            } catch (error) {
                console.error("Failed to fetch employees:", error);
                setState(DataViewState.error(error instanceof Error ? error.message : "Unknown error"));
            }
        };

        fetchEmployees();
    }, []);

    return { state };
};
