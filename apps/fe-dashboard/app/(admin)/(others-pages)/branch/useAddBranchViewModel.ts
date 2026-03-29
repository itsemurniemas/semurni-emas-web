import { useState } from "react";
import {
  CreateBranch,
  BranchFormData,
  CreateBranchRequest,
  prepareBranchRequest,
} from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

export const useAddBranchViewModel = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitBranchData = async (formData: BranchFormData): Promise<boolean> => {
    try {
      const createUseCase = new CreateBranch(getApiConfigForRole(user?.role || null));
      const submitData: CreateBranchRequest = prepareBranchRequest(formData);

      await createUseCase.execute(submitData);
      return true;
    } catch (error) {
      console.error("Failed to create branch:", error);
      return false;
    }
  };

  return {
    isSubmitting,
    setIsSubmitting,
    submitBranchData,
  };
};
