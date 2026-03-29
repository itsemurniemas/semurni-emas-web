import { useState, useEffect } from "react";
import { GetEmployeeList, BranchWithEmployeesModel, DataViewState } from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

export const useEmployeeListViewModel = () => {
    const { user } = useAuth();
    const [state, setState] = useState<DataViewState<BranchWithEmployeesModel[]>>(
        DataViewState.initiate()
    );

    useEffect(() => {
        const fetchEmployees = async () => {
            if (!user) {
                setState(DataViewState.initiate());
                return;
            }

            setState(DataViewState.loading());
            try {
                const useCase = new GetEmployeeList(getApiConfigForRole(user.role || null));
                const data = await useCase.execute();
                setState(DataViewState.success(data));
            } catch (error) {
                console.error("Failed to fetch employees:", error);
                setState(DataViewState.error(error instanceof Error ? error.message : "Unknown error"));
            }
        };

        fetchEmployees();
    }, [user]);

    return { state };
};
