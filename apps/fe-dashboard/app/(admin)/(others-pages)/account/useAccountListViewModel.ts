import { useEffect, useState } from "react";
import { GetUserList, UserModel, DataViewState } from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

export const useAccountListViewModel = (refreshTrigger: number = 0) => {
    const { user } = useAuth();
    const [state, setState] = useState<DataViewState<UserModel[]>>(
        DataViewState.initiate()
    );

    useEffect(() => {
        if (!user) return;
        fetchUsers();
    }, [user, refreshTrigger]);

    const fetchUsers = async () => {
        setState(DataViewState.loading());
        try {
            const useCase = new GetUserList(getApiConfigForRole(user?.role || null));
            const data = await useCase.execute();
            setState(DataViewState.success(data));
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setState(
                DataViewState.error(
                    error instanceof Error ? error.message : "Failed to fetch users"
                )
            );
        }
    };

    return {
        state,
    };
};
