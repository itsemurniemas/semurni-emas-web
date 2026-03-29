import { useEffect, useState } from "react";
import {
  GetRoleList,
  GetBranchList,
  CreateUser,
  CreateUserRequest,
  RoleModel,
  BranchModel,
} from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

export interface AddUserFormData {
  username: string;
  password: string;
  roleId: string;
  branchId: string;
}

export const useAddUserViewModel = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<RoleModel[]>([]);
  const [branches, setBranches] = useState<BranchModel[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchOptions();
  }, [user]);

  const fetchOptions = async () => {
    setLoadingOptions(true);
    try {
      const apiConfig = getApiConfigForRole(user?.role || null);
      const roleUseCase = new GetRoleList(apiConfig);
      const branchUseCase = new GetBranchList(apiConfig);

      const [rolesData, branchesData] = await Promise.all([
        roleUseCase.execute(),
        branchUseCase.execute(),
      ]);

      setRoles(rolesData);
      setBranches(branchesData);
    } catch (err) {
      console.error("Failed to fetch options:", err);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleSubmit = async (formData: AddUserFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const selectedRole = roles.find((r) => r.id === formData.roleId);
      const isSuperAdmin = selectedRole?.name === "SUPER_ADMIN";

      const request: CreateUserRequest = {
        username: formData.username,
        password: formData.password,
      };

      const useCase = new CreateUser(getApiConfigForRole(user?.role || null));
      await useCase.execute(request);

      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create user";
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  return {
    handleSubmit,
    isLoading,
    loadingOptions,
    error,
    roles,
    branches,
  };
};
