import { useState } from "react";
import { CreateCustomer, CreateCustomerRequest } from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

export interface AddCustomerFormData {
  fullname: string;
  phone: string;
  idCardNumber: string;
  birthDate?: string;
  streetName: string;
  subDistrict: string;
  ward: string;
  city: string;
  province: string;
  postalCode: string;
  isMember: boolean;
  image: string | null;
  instagram: string | null;
  tiktok: string | null;
  email: string | null;
}

export const useCreateCustomerViewModel = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    formData: AddCustomerFormData,
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Construct fullAddress by joining all address-related fields
      const fullAddress = [
        formData.streetName,
        formData.subDistrict,
        formData.ward,
        formData.city,
        formData.province,
        formData.postalCode,
      ]
        .filter(Boolean)
        .join(", ");

      const request: CreateCustomerRequest = {
        name: formData.fullname,
        telp: formData.phone,
        idCardNumber: formData.idCardNumber,
        birthDate: formData.birthDate
          ? new Date(formData.birthDate).getTime()
          : Date.now(),
        city: formData.city,
        province: formData.province,
        subdistrict: formData.subDistrict,
        ward: formData.ward,
        shortAddress: formData.streetName,
        fullAddress: fullAddress,
        postalCode: formData.postalCode,
        isMember: formData.isMember,
        image: formData.image,
        instagram: formData.instagram || null,
        tiktok: formData.tiktok || null,
        email: formData.email || null,
      };

      const useCase = new CreateCustomer(
        getApiConfigForRole(user?.role || null),
      );
      await useCase.execute(request);

      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create customer";
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  return {
    handleSubmit,
    isLoading,
    error,
  };
};
