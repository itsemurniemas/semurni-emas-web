"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import StepIndicator from "@/components/transaction/StepIndicator";
import CustomerSelectionStep from "@/components/transaction/steps/CustomerSelectionStep";
import BranchSelectionStep from "@/components/transaction/steps/BranchSelectionStep";
import AddItemsStep from "@/components/transaction/steps/AddItemsStep";
import PaymentMethodStep from "@/components/transaction/steps/PaymentMethodStep";
import SummaryStep from "@/components/transaction/steps/SummaryStep";
import AlertDialogDrawer from "@/components/dialogDrawer/AlertDialogDrawer";
import { useSellTransactionFlowViewModel } from "./useSellTransactionFlowViewModel";
import {
  useAddSellTransactionViewModel,
  TransactionItem,
  PaymentSelection,
} from "./useAddSellTransactionViewModel";
import { useCatalogViewModel } from "../../../catalog/useCatalogViewModel";
import { useCustomerViewModel } from "../../../customer/useCustomerViewModel";
import { useAuth } from "@/context/AuthContext";
import { calculateCatalogPrice, CatalogModel, CustomerModel } from "@repo/core";

const AddSellTransactionPageFlow: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const {
    items,
    branchId,
    setBranchId,
    payment,
    setPayment,
    addItem,
    removeItem,
    updateItem,
    submitTransaction,
    searchCatalogs,
    isSubmitting,
    submitError,
    isSuperAdmin,
  } = useAddSellTransactionViewModel();

  const {
    currentStep,
    flowState,
    steps,
    currentStepIndex,
    totalSteps,
    canGoNext,
    goNext,
    goPrev,
    goToStep,
    getStepLabel,
    updateFlowState,
  } = useSellTransactionFlowViewModel(isSuperAdmin);

  const { state: catalogState, branchListState } = useCatalogViewModel();
  const { state: customerState, setSearchTerm } = useCustomerViewModel();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Sync flow state with form state
  useEffect(() => {
    updateFlowState({
      customer: flowState.customer,
      branchId: branchId,
      items: items,
      paymentMethod: payment || undefined,
    });
  }, [flowState.customer, branchId, items, payment]);

  const handleCustomerSelect = (customer: any) => {
    updateFlowState({ customer });
    setPayment(null);
    addItem({ catalogId: "", quantity: 1, finalPrice: 0, realPrice: 0 });
  };

  const handleAddItem = (catalog: CatalogModel) => {
    const fixedPrice = calculateCatalogPrice(catalog);
    const newItem: TransactionItem = {
      catalogId: catalog.id,
      quantity: 1,
      finalPrice: fixedPrice,
      realPrice: fixedPrice,
      catalogName: catalog.product?.name || catalog.displayName,
      weight: catalog.totalWeightGram,
    };
    addItem(newItem);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity <= 0) return;
    const item = items[index];
    updateItem(index, {
      quantity,
      finalPrice: quantity * item.realPrice,
    });
  };

  const handlePriceChange = (index: number, finalPrice: number) => {
    if (finalPrice < 0) return;
    updateItem(index, { finalPrice });
  };

  const handleNext = () => {
    if (!canGoNext) {
      const stepLabel = getStepLabel(currentStep);
      toast.error(`Selesaikan langkah "${stepLabel}" terlebih dahulu`);
      return;
    }
    goNext();
  };

  const handleSubmit = async () => {
    setIsConfirmDialogOpen(false);
    try {
      // Validate before submission
      if (!flowState.customer) {
        toast.error("Pilih pelanggan terlebih dahulu");
        return;
      }
      if (isSuperAdmin && !branchId) {
        toast.error("Pilih cabang untuk transaksi");
        return;
      }
      if (items.length === 0) {
        toast.error("Tambahkan minimal satu item ke transaksi");
        return;
      }
      if (!payment) {
        toast.error("Pilih metode pembayaran");
        return;
      }

      // Pass customer and branchId directly to submitTransaction
      const response = await submitTransaction(flowState.customer, branchId);
      toast.success("Transaksi penjualan berhasil dibuat");
      router.push(`/transaction/detail/${response.id}`);
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error(submitError || "Gagal membuat transaksi");
    }
  };

  const stepConfigs = {
    customer: {
      component: (
        <CustomerSelectionStep
          selected={flowState.customer}
          customerState={customerState}
          onSelect={(customer: CustomerModel | null) =>
            updateFlowState({ customer })
          }
          onSearchChange={setSearchTerm}
        />
      ),
    },
    branch: {
      component: (
        <BranchSelectionStep
          selected={branchId}
          branchListState={branchListState}
          onSelect={(selectedBranch) => setBranchId(selectedBranch || "")}
          isSuperAdmin={isSuperAdmin}
        />
      ),
    },
    items: {
      component: (
        <AddItemsStep
          items={items}
          catalogState={catalogState}
          onAddItem={handleAddItem}
          onRemoveItem={removeItem}
          onUpdateItem={updateItem}
          onCatalogSelect={handleAddItem}
          onSearchCatalog={searchCatalogs}
        />
      ),
    },
    payment: {
      component: (
        <PaymentMethodStep
          selected={payment || null}
          onSelect={(method: PaymentSelection) => {
            setPayment(method);
            updateFlowState({ paymentMethod: method });
          }}
          total={items.reduce(
            (sum, item) => sum + Math.ceil(item.finalPrice),
            0,
          )}
        />
      ),
    },
    summary: {
      component: (
        <SummaryStep
          customer={flowState.customer}
          branchId={branchId}
          items={items}
          paymentMethod={payment || null}
          catalogState={catalogState}
          branchListState={branchListState}
          isSuperAdmin={isSuperAdmin}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      ),
    },
  };

  const stepLabels = steps.map((step) => getStepLabel(step));

  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Transaksi Penjualan" />

      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <StepIndicator
            steps={stepLabels}
            currentIndex={currentStepIndex}
            onStepClick={(index) => {
              if (index < currentStepIndex) {
                goToStep(steps[index]);
              } else {
                toast.info("Selesaikan langkah sebelumnya terlebih dahulu");
              }
            }}
          />
        </div>

        {/* Current Step Content */}
        <div>{stepConfigs[currentStep].component}</div>

        {/* Navigation Buttons */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={currentStepIndex === 0}
          >
            ← Sebelumnya
          </Button>

          {currentStep === "summary" ? (
            <Button
              variant="primary"
              onClick={() => setIsConfirmDialogOpen(true)}
              loading={isSubmitting}
            >
              Selesaikan Transaksi
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!canGoNext}
            >
              Selanjutnya →
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialogDrawer
        open={isConfirmDialogOpen}
        setOpen={setIsConfirmDialogOpen}
        title="Konfirmasi Transaksi Penjualan"
        description="Apakah Anda yakin dengan semua data transaksi? Tindakan ini tidak dapat dibatalkan."
        buttonText="Konfirmasi"
        onConfirm={handleSubmit}
        type="warning"
      />
    </div>
  );
};

export default AddSellTransactionPageFlow;
