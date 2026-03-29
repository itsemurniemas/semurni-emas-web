import { useState, useEffect } from "react";
import { GetCustomerList, CustomerModel, DataViewState } from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

export const useCustomerViewModel = () => {
  const { user } = useAuth();
  const [state, setState] = useState<DataViewState<CustomerModel[]>>(
    DataViewState.initiate(),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchCustomers = async (search?: string) => {
    if (!user) {
      return;
    }

    setState(DataViewState.loading());
    try {
      const useCase = new GetCustomerList(
        getApiConfigForRole(user?.role || null),
      );
      const data = await useCase.execute(search || debouncedSearchTerm);
      setState(DataViewState.success(data));
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      setState(
        DataViewState.error(
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  };

  useEffect(() => {
    fetchCustomers(debouncedSearchTerm);
  }, [debouncedSearchTerm, user]);

  return {
    state,
    searchTerm,
    setSearchTerm,
    refetch: fetchCustomers,
  };
};
