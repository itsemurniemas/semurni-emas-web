import { useState, useCallback } from "react";
import { CreateEmployee, CreateEmployeeRequest } from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

export interface CreateEmployeeFormData {
  name: string;
  dateOfBirth: string;
  joinDate: string;
  telp: string;
  shortAddress: string;
  ward: string;
  subdistrict: string;
  city: string;
  province: string;
  postalCode: string;
  positionName: string;
  roleName: string;
  password: string;
  branchId: string;
  image: string;
}

export const useCreateEmployeeViewModel = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitEmployeeData = useCallback(
    async (formData: CreateEmployeeFormData): Promise<boolean> => {
      try {
        if (!user) {
          throw new Error("User not authenticated");
        }

        // Join address fields
        const fullAddress = [
          formData.shortAddress,
          formData.ward,
          formData.subdistrict,
          formData.city,
          formData.province,
          formData.postalCode,
        ]
          .filter((part) => part && part.trim())
          .join(", ");

        const request: CreateEmployeeRequest = {
          name: formData.name,
          birthDate: new Date(formData.dateOfBirth).getTime(),
          joinDate: new Date(formData.joinDate).getTime(),
          telp: formData.telp,
          fullAddress: fullAddress,
          branchId: formData.branchId,
          image: formData.image,
          city: formData.city,
          province: formData.province,
          subdistrict: formData.subdistrict,
          ward: formData.ward,
          postalCode: formData.postalCode,
          shortAddress: formData.shortAddress,
          positionName: formData.positionName,
          roleName: formData.roleName,
          password: formData.password,
        };

        const useCase = new CreateEmployee(
          getApiConfigForRole(user.role || null),
        );
        const result = await useCase.execute(request);

        return !!result;
      } catch (error) {
        console.error("Error creating employee:", error);
        throw error;
      }
    },
    [user],
  );

  return {
    isSubmitting,
    setIsSubmitting,
    submitEmployeeData,
  };
};
