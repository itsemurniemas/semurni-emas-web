import { useState } from "react";
import { useAuth, isSuperAdminRole } from "@/context/AuthContext";
import { toast } from "react-toastify";
import {
  CreateBuyTransaction,
  CreateBuyTransactionRequest,
  CreateBuyTransactionResponse,
  BuyTransactionLineItem,
  ApiConfiguration,
  ApiVersion,
} from "@repo/core";
import { getApiConfigForRole } from "@/lib/api-config";
import type { PaymentSelection } from "@/components/transaction/types";

export interface TransactionItem {
  displayName: string;
  totalWeightGram: number;
  netWeightGram: number;
  taraPrice: number;
  quality: "LOW_QUALITY" | "HIGH_QUALITY" | undefined;
  category: string;
  quantity: number;
  productId: string;
  subtotal: number;
  finalSubtotal: number;
  images: Array<{ image: string; position: number }>;
  statementLetterImage?: string[] | null;
}

export interface BuyCustomerData {
  id?: string;
  name: string;
  telp: string;
  birthDate: number;
  city: string;
  province: string;
  subdistrict: string;
  ward: string;
  postalCode: string;
  fullAddress: string;
  shortAddress: string;
  isMember?: boolean;
}

export interface AddBuyTransactionFormData {
  branchId: string;
  items: TransactionItem[];
  finalPrice: number;
  paymentMethod?: PaymentSelection;
  note?: string;
  customer?: BuyCustomerData;
}

export const useAddBuyTransactionViewModel = () => {
  const { user } = useAuth();
  const isSuperAdmin = isSuperAdminRole(user?.role);

  const [items, setItems] = useState<TransactionItem[]>([]);
  const [branchId, setBranchId] = useState<string>("");
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentSelection | null>(
    null,
  );
  const [notes, setNotes] = useState<string>("");
  const [customerData, setCustomerData] = useState<BuyCustomerData | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addItem = (item: TransactionItem) => {
    setItems([...items, { ...item }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, updates: Partial<TransactionItem>) => {
    const updated = [...items];
    updated[index] = { ...updated[index], ...updates };
    setItems(updated);
  };

  const startEditingItem = (index: number) => {
    if (index >= 0 && index < items.length) {
      setEditingIndex(index);
    }
  };

  const stopEditingItem = () => {
    setEditingIndex(null);
  };

  const saveEditedItem = (updates: Partial<TransactionItem>) => {
    if (editingIndex !== null) {
      updateItem(editingIndex, updates);
      setEditingIndex(null);
    }
  };

  const isItemBeingEdited = (index: number): boolean => {
    return editingIndex === index;
  };

  const getEditingItem = (): TransactionItem | null => {
    return editingIndex !== null ? items[editingIndex] : null;
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.finalSubtotal, 0);
  };

  const getFormData = (): AddBuyTransactionFormData => ({
    branchId,
    items,
    finalPrice: calculateSubtotal(),
    paymentMethod: paymentMethod || undefined,
    note: notes || undefined,
    customer: customerData || undefined,
  });

  const resetForm = () => {
    setItems([]);
    setBranchId("");
    setFinalPrice(0);
    setPaymentMethod(null);
    setNotes("");
    setCustomerData(null);
    setSubmitError(null);
  };

  const submitTransaction = async (): Promise<CreateBuyTransactionResponse> => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Build payments array
      const payments =
        paymentMethod?.payments.map((p) => ({
          paymentType: p.method,
          amount: p.amount,
          bankAccountNumber: p.bankAccountNumber || null,
          bankName: p.bankName || null,
        })) || [];

      // Build base of request
      const baseRequest = {
        payments,
        note: notes || "",
        branch: branchId || user?.branch?.id || "",
        lineItems: items.map((item) => ({
          displayName: item.displayName,
          totalWeightGram: item.totalWeightGram,
          netWeightGram: item.netWeightGram,
          taraPrice: item.taraPrice,
          quality: item.quality,
          category: item.category,
          quantity: item.quantity,
          productId: item.productId,
          subtotal: item.subtotal * item.quantity,
          finalSubtotal: item.finalSubtotal,
          images: item.images,
          statementLetterImage: item.statementLetterImage || null,
        })),
      };

      // Place customer ID at the request root
      let request: CreateBuyTransactionRequest = baseRequest as any;
      if (customerData?.id) {
        // Send only the customer ID
        request = {
          ...baseRequest,
          customer: customerData.id,
        };
      }

      const apiConfig = getApiConfigForRole(user?.role || null);

      const useCase = new CreateBuyTransaction(apiConfig);
      const response = await useCase.execute(request);

      toast.success("Transaksi pembelian berhasil disimpan!");
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan tidak terduga";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
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
    finalPrice,
    setFinalPrice,
    paymentMethod,
    setPaymentMethod,
    notes,
    setNotes,
    customerData,
    setCustomerData,
    addItem,
    removeItem,
    updateItem,
    calculateSubtotal,
    getFormData,
    resetForm,
    submitTransaction,
    isSubmitting,
    submitError,
    isSuperAdmin,
    // Edit functionality
    editingIndex,
    startEditingItem,
    stopEditingItem,
    saveEditedItem,
    isItemBeingEdited,
    getEditingItem,
  };
};
