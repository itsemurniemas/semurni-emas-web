import { useEffect, useState } from "react";
import {
  GetCustomerById,
  UpdateCustomer,
  UpdateCustomerRequest,
} from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";
import { AddCustomerFormData } from "../../add/useCreateCustomerViewModel";

export const useUpdateCustomerViewModel = (customerId: string) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<AddCustomerFormData | null>(
    null,
  );

  useEffect(() => {
    if (!user || !customerId) return;

    const fetchCustomer = async () => {
      setIsFetching(true);
      try {
        const useCase = new GetCustomerById(
          getApiConfigForRole(user?.role || null),
        );
        const customer = await useCase.execute(customerId);

        const formattedDate = customer.birthDate
          ? new Date(customer.birthDate).toISOString().split("T")[0]
          : "";

        const customerData: AddCustomerFormData = {
          fullname: customer.name,
          phone: customer.telp,
          idCardNumber: customer.idCardNumber || "",
          birthDate: formattedDate,
          streetName: customer.shortAddress,
          subDistrict: customer.subdistrict,
          ward: customer.ward,
          city: customer.city,
          province: customer.province,
          postalCode: customer.postalCode,
          isMember: customer.isMember ?? false,
          image: customer.image || "",
          instagram: customer.instagram || null,
          tiktok: customer.tiktok || null,
          email: customer.email || null,
        };

        setInitialData(customerData);
        setIsFetching(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch customer";
        setError(errorMessage);
        setIsFetching(false);
      }
    };

    fetchCustomer();
  }, [user, customerId]);

  const calculateDiff = (
    formData: AddCustomerFormData,
    initial: AddCustomerFormData,
  ): UpdateCustomerRequest => {
    const diff: UpdateCustomerRequest = {};

    // Check for changes in each field
    if (formData.fullname !== initial.fullname) {
      diff.name = formData.fullname;
    }
    if (formData.phone !== initial.phone) {
      diff.telp = formData.phone;
    }
    if (formData.idCardNumber !== initial.idCardNumber) {
      diff.idCardNumber = formData.idCardNumber;
    }
    if (formData.birthDate !== initial.birthDate) {
      diff.birthDate = formData.birthDate
        ? new Date(formData.birthDate).getTime()
        : Date.now();
    }
    if (formData.streetName !== initial.streetName) {
      diff.shortAddress = formData.streetName;
    }
    if (formData.subDistrict !== initial.subDistrict) {
      diff.subdistrict = formData.subDistrict;
    }
    if (formData.ward !== initial.ward) {
      diff.ward = formData.ward;
    }
    if (formData.city !== initial.city) {
      diff.city = formData.city;
    }
    if (formData.province !== initial.province) {
      diff.province = formData.province;
    }
    if (formData.postalCode !== initial.postalCode) {
      diff.postalCode = formData.postalCode;
    }
    if (formData.isMember !== initial.isMember) {
      diff.isMember = formData.isMember;
    }
    if (formData.instagram !== initial.instagram) {
      diff.instagram = formData.instagram;
    }
    if (formData.tiktok !== initial.tiktok) {
      diff.tiktok = formData.tiktok;
    }
    if (formData.email !== initial.email) {
      diff.email = formData.email;
    }
    if (formData.image !== initial.image) {
      diff.image = formData.image;
    }

    // Recalculate fullAddress if any address field changed
    if (
      formData.streetName !== initial.streetName ||
      formData.subDistrict !== initial.subDistrict ||
      formData.ward !== initial.ward ||
      formData.city !== initial.city ||
      formData.province !== initial.province ||
      formData.postalCode !== initial.postalCode
    ) {
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
      diff.fullAddress = fullAddress;
    }

    return diff;
  };

  const handleSubmit = async (
    formData: AddCustomerFormData,
  ): Promise<boolean> => {
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

      const useCase = new UpdateCustomer(
        getApiConfigForRole(user?.role || null),
      );
      await useCase.execute({ id: customerId, request: diff });

      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update customer";
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
  };
};
