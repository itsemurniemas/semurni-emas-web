import { useState, useEffect } from "react";
import {
  UpdateEmployee,
  UpdateEmployeeRequest,
  GetEmployeeById,
  DataViewState,
} from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

export interface EditEmployeeFormData {
  name: string;
  telp: string;
  joinDate: string;
  image: string;
  positionName: string;
  roleName: string;
  password: string;
  shortAddress: string;
  ward: string;
  subdistrict: string;
  city: string;
  province: string;
  postalCode: string;
}

export const useUpdateEmployeeViewModel = (employeeId: string) => {
  const { user } = useAuth();
  const [state, setState] = useState<DataViewState<EditEmployeeFormData>>(
    DataViewState.initiate(),
  );
  const [initialData, setInitialData] = useState<EditEmployeeFormData | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch employee data on mount
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!user || !employeeId) {
        setState(DataViewState.initiate());
        return;
      }

      setState(DataViewState.loading());
      try {
        const useCase = new GetEmployeeById(
          getApiConfigForRole(user.role || null),
        );
        const employee = await useCase.execute(employeeId);

        const data: EditEmployeeFormData = {
          name: employee.name,
          telp: employee.telp,
          joinDate: new Date(employee.joinDate).toISOString().split("T")[0],
          image: employee.image,
          positionName: employee.positionName || "",
          roleName: employee.user?.role?.name || "",
          password: "",
          shortAddress: employee.shortAddress || "",
          ward: employee.ward || "",
          subdistrict: employee.subdistrict || "",
          city: employee.city || "",
          province: employee.province || "",
          postalCode: employee.postalCode || "",
        };

        console.log("Loaded employee data:", data);
        setState(DataViewState.success(data));
        setInitialData(data);
      } catch (error) {
        console.error("Failed to fetch employee:", error);
        setState(
          DataViewState.error(
            error instanceof Error ? error.message : "Unknown error",
          ),
        );
      }
    };

    fetchEmployeeData();
  }, [employeeId, user]);

  const calculateDiff = (
    current: EditEmployeeFormData,
  ): UpdateEmployeeRequest => {
    if (!initialData) return {};

    const diff: UpdateEmployeeRequest = {};

    if (current.name !== initialData.name) {
      diff.name = current.name;
    }
    if (current.telp !== initialData.telp) {
      diff.telp = current.telp;
    }
    if (current.joinDate !== initialData.joinDate) {
      diff.joinDate = new Date(current.joinDate).getTime();
    }
    if (current.image !== initialData.image) {
      diff.image = current.image;
    }
    if (current.positionName !== initialData.positionName) {
      diff.positionName = current.positionName;
    }
    if (current.roleName !== initialData.roleName) {
      diff.roleName = current.roleName;
    }
    if (current.password && current.password !== initialData.password) {
      diff.password = current.password;
    }

    // Check individual address fields
    if (current.shortAddress !== initialData.shortAddress) {
      diff.shortAddress = current.shortAddress;
    }
    if (current.ward !== initialData.ward) {
      diff.ward = current.ward;
    }
    if (current.subdistrict !== initialData.subdistrict) {
      diff.subdistrict = current.subdistrict;
    }
    if (current.city !== initialData.city) {
      diff.city = current.city;
    }
    if (current.province !== initialData.province) {
      diff.province = current.province;
    }
    if (current.postalCode !== initialData.postalCode) {
      diff.postalCode = current.postalCode;
    }

    return diff;
  };

  const submitEmployeeData = async (
    formData: EditEmployeeFormData,
  ): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const diff = calculateDiff(formData);

      // If no changes, just return success
      if (Object.keys(diff).length === 0) {
        return true;
      }

      const useCase = new UpdateEmployee(
        getApiConfigForRole(user.role || null),
      );
      await useCase.execute({ id: employeeId, request: diff });

      return true;
    } catch (error) {
      throw error;
    }
  };

  return {
    state,
    isSubmitting,
    setIsSubmitting,
    submitEmployeeData,
    initialData,
  };
};
