import { useState, useEffect } from "react";
import {
  GetEmployeeById,
  EmployeeWithBranchModel,
  DataViewState,
} from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

export const useEmployeeDetailViewModel = (employeeId: string) => {
  const { user } = useAuth();
  const [state, setState] = useState<DataViewState<EmployeeWithBranchModel>>(
    DataViewState.initiate(),
  );

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!user || !employeeId) {
        setState(DataViewState.initiate());
        return;
      }

      setState(DataViewState.loading());
      try {
        const useCase = new GetEmployeeById(
          getApiConfigForRole(user.role || null),
        );
        const data = await useCase.execute(employeeId);
        setState(DataViewState.success(data));
      } catch (error) {
        console.error("Failed to fetch employee:", error);
        setState(
          DataViewState.error(
            error instanceof Error ? error.message : "Unknown error",
          ),
        );
      }
    };

    fetchEmployee();
  }, [employeeId, user?.role]);

  return { state };
};
