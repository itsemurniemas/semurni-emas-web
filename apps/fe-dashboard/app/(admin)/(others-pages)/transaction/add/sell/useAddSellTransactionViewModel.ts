import { useState, useRef } from "react";
import { useAuth, isSuperAdminRole } from "@/context/AuthContext";
import {
  CreateSellTransaction,
  CreateSellTransactionRequest,
  CreateSellTransactionResponse,
  ApiConfiguration,
  ApiVersion,
  CustomerModel,
  GetCatalogList,
  CatalogListResponse,
  type GetCatalogListRequest,
} from "@repo/core";
import { getApiConfigForRole } from "@/lib/api-config";
import type {
  PaymentMethod,
  TransactionItem,
  PaymentSelection,
} from "@/components/transaction/types";

export type { PaymentMethod, TransactionItem, PaymentSelection };

export interface AddTransactionFormData {
  branchId: string;
  items: TransactionItem[];
  finalPrice: number;
  notes?: string;
  payment?: PaymentSelection;
  customer?: CustomerModel | null;
}

export const useAddSellTransactionViewModel = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<TransactionItem[]>([]);
  const [branchId, setBranchId] = useState<string>("");
  const [customer, setCustomer] = useState<CustomerModel | null>(null);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [payment, setPayment] = useState<PaymentSelection | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculateSubtotal = (): number => {
    return items.reduce((sum, item) => sum + item.finalPrice, 0);
  };

  const addItem = (item: TransactionItem) => {
    setItems([...items, item]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const searchCatalogs = async (
    query: string,
    page: number = 1,
    callback?: (response: CatalogListResponse) => void,
  ) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (!user) return;

      try {
        const request: GetCatalogListRequest = {
          search: query || undefined,
          approvedPurpose: "SELLING",
          page,
        };
        const useCase = new GetCatalogList(
          getApiConfigForRole(user.role || null),
        );
        const data = await useCase.execute(request);
        if (callback) {
          callback(data);
        }
      } catch (error) {
        console.error("Failed to search catalogs:", error);
      }
    }, 300); // 300ms debounce
  };

  const updateItem = (index: number, updatedItem: Partial<TransactionItem>) => {
    setItems(
      items.map((item, i) =>
        i === index
          ? {
              ...item,
              ...updatedItem,
            }
          : item,
      ),
    );
  };

  const getFormData = (): AddTransactionFormData => ({
    branchId,
    items,
    finalPrice,
    notes,
    payment: payment || undefined,
    customer,
  });

  const resetForm = () => {
    setItems([]);
    setBranchId("");
    setCustomer(null);
    setFinalPrice(0);
    setNotes("");
    setPayment(null);
    setSubmitError(null);
  };

  const submitTransaction = async (
    customerOverride?: CustomerModel | null,
    branchIdOverride?: string,
  ): Promise<CreateSellTransactionResponse> => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const isSuperAdmin = isSuperAdminRole(user?.role);
      const customerToUse =
        customerOverride !== undefined ? customerOverride : customer;
      const branchToUse =
        branchIdOverride !== undefined ? branchIdOverride : branchId;

      // Calculate the exact subtotal first with ceiled values
      const transactionSubtotal = items.reduce(
        (sum, item) => sum + Math.ceil(item.finalPrice),
        0,
      );

      // Build lineItems for calculation
      const lineItems = items.map((item) => {
        const realPrice = Math.ceil(item.quantity * item.realPrice);
        const ceiledFinalPrice = Math.ceil(item.finalPrice);
        const discount = realPrice - ceiledFinalPrice;
        return {
          catalogId: item.catalogId,
          quantity: item.quantity,
          subtotal: realPrice,
          discount: discount > 0 ? discount : 0,
          finalSubtotal: ceiledFinalPrice,
        };
      });

      // Prepare payments - ensure total matches transaction subtotal exactly
      let payments: Array<{ paymentType: string; amount: number }> = [];
      if (payment && "isSplit" in payment && payment.isSplit) {
        payments = payment.payments.map((p) => ({
          paymentType: p.method,
          amount: p.amount,
        }));

        // Adjust the last payment to ensure total matches exactly
        if (payments.length > 0) {
          const totalPaid = payments.reduce((sum, p, idx) => {
            if (idx < payments.length - 1) return sum + p.amount;
            return sum;
          }, 0);
          payments[payments.length - 1].amount =
            transactionSubtotal - totalPaid;
        }
      }

      let customerData: any = null;
      if (customerToUse?.id) {
        // Send only the customer ID
        customerData = customerToUse.id;
      }

      const requestBody: any = {
        payments,
        note: notes || "",
        customer: customerData,
        ...(isSuperAdmin && { branch: branchToUse || user?.branch?.id }),
        lineItems: lineItems,
      };

      const apiConfig = new ApiConfiguration({
        version: ApiVersion.V1,
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
        prefix: isSuperAdminRole(user?.role) ? "super-admin" : "client",
      });

      // For now, we'll use the CreateSellTransaction useCase but pass the new format
      // This assumes the API has been updated to accept the new format
      const useCase = new CreateSellTransaction(apiConfig);
      const response = await useCase.execute(
        requestBody as CreateSellTransactionRequest,
      );
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan tidak terduga";
      setSubmitError(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    items,
    setItems,
    branchId,
    setBranchId,
    customer,
    setCustomer,
    finalPrice,
    setFinalPrice,
    notes,
    setNotes,
    payment,
    setPayment,
    addItem,
    removeItem,
    updateItem,
    calculateSubtotal,
    getFormData,
    resetForm,
    submitTransaction,
    searchCatalogs,
    isSubmitting,
    submitError,
    isSuperAdmin: isSuperAdminRole(user?.role),
  };
};
