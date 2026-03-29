import { useState, useMemo } from "react";
import type { PaymentSelection } from "@/components/transaction/types";

export type BuyTransactionStep =
  | "customer"
  | "branch"
  | "items"
  | "payment"
  | "summary";

export interface BuyTransactionFlowState {
  customer: any | null;
  branchId: string | undefined;
  items: any[];
  paymentMethod: PaymentSelection | null;
}

export const useBuyTransactionFlowViewModel = (
  isSuperAdmin: boolean = false,
) => {
  const [currentStep, setCurrentStep] =
    useState<BuyTransactionStep>("customer");
  const [flowState, setFlowState] = useState<BuyTransactionFlowState>({
    customer: null,
    branchId: undefined,
    items: [],
    paymentMethod: null,
  });

  const steps: BuyTransactionStep[] = isSuperAdmin
    ? ["customer", "branch", "items", "payment", "summary"]
    : ["customer", "items", "payment", "summary"];

  const currentStepIndex = steps.indexOf(currentStep);
  const totalSteps = steps.length;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  const isPaymentValid = (payment: PaymentSelection | null): boolean => {
    if (!payment) return false;
    if (!payment.isSplit) return false;
    if (!Array.isArray(payment.payments) || payment.payments.length === 0)
      return false;
    // Check that all payments have amounts > 0
    if (!payment.payments.every((p) => p.amount > 0)) return false;
    // Check that NON_CASH payments have bank details
    return payment.payments.every(
      (p) =>
        p.method !== "NON_CASH" ||
        (p.bankName &&
          p.bankName.trim() !== "" &&
          p.bankAccountNumber &&
          p.bankAccountNumber.trim() !== ""),
    );
  };

  const canGoNext = () => {
    switch (currentStep) {
      case "customer":
        return flowState.customer !== null;
      case "branch":
        return flowState.branchId !== undefined && flowState.branchId !== "";
      case "items":
        return flowState.items.length > 0;
      case "payment":
        return isPaymentValid(flowState.paymentMethod);
      case "summary":
        return true;
      default:
        return false;
    }
  };

  const goToStep = (step: BuyTransactionStep) => {
    const targetIndex = steps.indexOf(step);
    const currentIndex = steps.indexOf(currentStep);

    // Allow going to previous steps freely
    if (targetIndex < currentIndex) {
      setCurrentStep(step);
      return true;
    }

    // For forward navigation, verify all intermediate steps are valid
    for (let i = currentIndex; i < targetIndex; i++) {
      const stepToCheck = steps[i];
      if (stepToCheck === "customer" && !flowState.customer) return false;
      if (
        stepToCheck === "branch" &&
        (!flowState.branchId || flowState.branchId === "")
      )
        return false;
      if (stepToCheck === "items" && flowState.items.length === 0) return false;
      if (stepToCheck === "payment" && !isPaymentValid(flowState.paymentMethod))
        return false;
    }

    setCurrentStep(step);
    return true;
  };

  const goNext = () => {
    const canGo = canGoNext();
    if (!canGo) return false;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
      return true;
    }
    return false;
  };

  const goPrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
      return true;
    }
    return false;
  };

  const getStepLabel = (step: BuyTransactionStep) => {
    const labels: Record<BuyTransactionStep, string> = {
      customer: "Pelanggan",
      branch: "Cabang",
      items: "Item",
      payment: "Pembayaran",
      summary: "Ringkasan",
    };
    return labels[step];
  };

  const updateFlowState = (updates: Partial<BuyTransactionFlowState>) => {
    setFlowState((prev) => ({ ...prev, ...updates }));
  };

  const memoizedCanGoNext = useMemo(
    () => canGoNext(),
    [currentStep, flowState],
  );

  return {
    currentStep,
    flowState,
    steps,
    currentStepIndex,
    totalSteps,
    progress,
    canGoNext: memoizedCanGoNext,
    goNext,
    goPrev,
    goToStep,
    getStepLabel,
    updateFlowState,
  };
};
