import { useEffect, useState } from "react";
import {
  GetUserById,
  GetRoleList,
  GetBranchList,
  UpdateUser,
  UpdateUserRequest,
  UserModel,
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

export const useEditUserViewModel = (userId: string) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<AddUserFormData | null>(null);
  const [roles, setRoles] = useState<RoleModel[]>([]);
  const [branches, setBranches] = useState<BranchModel[]>([]);
  const [selectedRoleName, setSelectedRoleName] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !userId) return;
    fetchData();
  }, [user, userId]);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const apiConfig = getApiConfigForRole(user?.role || null);
      const userUseCase = new GetUserById(apiConfig);
      const roleUseCase = new GetRoleList(apiConfig);
      const branchUseCase = new GetBranchList(apiConfig);

      const [userData, rolesData, branchesData] = await Promise.all([
        userUseCase.execute(userId),
        roleUseCase.execute(),
        branchUseCase.execute(),
      ]);

      const selectedRole = rolesData.find((r) => r.id === userData.roleId);
      setSelectedRoleName(selectedRole?.name || null);
      setRoles(rolesData);
      setBranches(branchesData);

      const formattedData: AddUserFormData = {
        username: userData.username,
        password: "",
        roleId: userData.roleId,
        branchId: userData.branchId || "",
      };

      setInitialData(formattedData);
      setIsFetching(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch data";
      setError(errorMessage);
      setIsFetching(false);
    }
  };

  const calculateDiff = (
    formData: AddUserFormData,
    initial: AddUserFormData,
  ): UpdateUserRequest => {
    const diff: UpdateUserRequest = {};

    if (formData.username !== initial.username) {
      diff.username = formData.username;
    }
    if (formData.password && formData.password !== initial.password) {
      diff.password = formData.password;
    }

    return diff;
  };

  const handleSubmit = async (formData: AddUserFormData): Promise<boolean> => {
    if (!initialData) {
      setError("Initial data not loaded");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const diff = calculateDiff(formData, initialData);

      // If no changes, return success without making request
      if (Object.keys(diff).length === 0) {
        setIsLoading(false);
        return true;
      }

      const useCase = new UpdateUser(getApiConfigForRole(user?.role || null));
      await useCase.execute({ id: userId, request: diff });

      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update user";
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  return {
    handleSubmit,
    isLoading,
    isFetching,
    error,
    initialData,
    roles,
    branches,
    selectedRoleName,
  };
};
