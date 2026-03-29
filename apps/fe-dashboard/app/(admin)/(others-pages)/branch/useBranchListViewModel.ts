import { useState, useEffect } from "react";
import {
  GetBranchList,
  DeleteBranch,
  BranchModel,
  DataViewState,
} from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

export const useBranchListViewModel = () => {
  const { user } = useAuth();
  const [state, setState] = useState<DataViewState<BranchModel[]>>(
    DataViewState.initiate(),
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBranchList();
    }
  }, [user]);

  const fetchBranchList = async () => {
    setState(DataViewState.loading());
    try {
      const useCase = new GetBranchList(
        getApiConfigForRole(user?.role || null),
      );
      const data: BranchModel[] = await useCase.execute();
      setState(DataViewState.success(data));
    } catch (error) {
      console.error("Failed to fetch branch list:", error);
      setState(
        DataViewState.error(
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  };

  const deleteBranch = async (branchId: string): Promise<boolean> => {
    setIsDeleting(true);
    try {
      const deleteUseCase = new DeleteBranch(
        getApiConfigForRole(user?.role || null),
      );
      await deleteUseCase.execute(branchId.toString());
      await fetchBranchList();
      return true;
    } catch (error) {
      console.error("Failed to delete branch:", error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    state,
    isDeleting,
    deleteBranch,
    refetch: fetchBranchList,
  };
};
