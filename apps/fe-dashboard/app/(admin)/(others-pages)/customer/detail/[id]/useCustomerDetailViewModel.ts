import { useState, useEffect } from "react";
import { GetCustomerById, CustomerModel, DataViewState } from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

export const useCustomerDetailViewModel = (customerId: string) => {
    const { user } = useAuth();
    const [state, setState] = useState<DataViewState<CustomerModel>>(
        DataViewState.initiate()
    );

    useEffect(() => {
        const fetchCustomer = async () => {
            if (!user || !customerId) {
                setState(DataViewState.initiate());
                return;
            }

            setState(DataViewState.loading());
            try {
                const useCase = new GetCustomerById(getApiConfigForRole(user.role || null));
                const data = await useCase.execute(customerId);
                setState(DataViewState.success(data));
            } catch (error) {
                console.error("Failed to fetch customer:", error);
                setState(DataViewState.error(error instanceof Error ? error.message : "Unknown error"));
            }
        };

        fetchCustomer();
    }, [customerId, user]);

    return { state };
};
