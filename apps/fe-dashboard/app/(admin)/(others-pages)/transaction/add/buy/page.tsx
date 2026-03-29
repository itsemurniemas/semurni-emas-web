"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import StepIndicator from "@/components/transaction/StepIndicator";
import CustomerSelectionStep from "@/components/transaction/steps/CustomerSelectionStep";
import BuyBranchSelectionStep from "@/components/transaction/steps/BuyBranchSelectionStep";
import BuyAddItemsStep from "@/components/transaction/steps/BuyAddItemsStep";
import BuyPaymentMethodStep from "@/components/transaction/steps/BuyPaymentMethodStep";
import BuySummaryStep from "@/components/transaction/steps/BuySummaryStep";
import AlertDialogDrawer from "@/components/dialogDrawer/AlertDialogDrawer";
import {
  useAddBuyTransactionViewModel,
  TransactionItem,
} from "./useAddBuyTransactionViewModel";
import { useBuyTransactionFlowViewModel } from "./useBuyTransactionFlowViewModel";
import { useAuth } from "@/context/AuthContext";
import { useCatalogViewModel } from "../../../catalog/useCatalogViewModel";
import { useCustomerViewModel } from "../../../customer/useCustomerViewModel";
import { formatPriceIDR, CustomerModel } from "@repo/core";
import {
  GetMetalPriceList,
  DataViewState,
  type MetalPriceListModel,
} from "@repo/core";
import { getApiConfigForRole } from "@/lib/api-config";

const AddBuyTransactionPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { state: catalogState, branchListState } = useCatalogViewModel();
  const { state: customerState, setSearchTerm } = useCustomerViewModel();

  const {
    items,
    branchId,
    setBranchId,
    paymentMethod,
    setPaymentMethod,
    addItem,
    removeItem,
    updateItem,
    submitTransaction,
    isSubmitting,
    isSuperAdmin,
    setCustomerData,
    editingIndex,
    startEditingItem,
    stopEditingItem,
    saveEditedItem,
  } = useAddBuyTransactionViewModel();

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
  } = useBuyTransactionFlowViewModel(isSuperAdmin);

  const [priceListState, setPriceListState] = useState<
    DataViewState<MetalPriceListModel>
  >(DataViewState.initiate());
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Fetch price list
  useEffect(() => {
    const fetchPriceList = async () => {
      if (!user) {
        setPriceListState(DataViewState.initiate());
        return;
      }

      setPriceListState(DataViewState.loading());
      try {
        const useCase = new GetMetalPriceList(
          getApiConfigForRole(user?.role || null),
        );
        const data = await useCase.execute();
        setPriceListState(DataViewState.success(data));
      } catch (error) {
        console.error("Failed to fetch price list:", error);
        setPriceListState(
          DataViewState.error(
            error instanceof Error ? error.message : "Unknown error",
          ),
        );
      }
    };

    fetchPriceList();
  }, [user]);

  // Sync flow state with form state
  useEffect(() => {
    updateFlowState({
      customer: flowState.customer,
      branchId: branchId,
      items: items,
      paymentMethod: paymentMethod || null,
    });
  }, [flowState.customer, branchId, items, paymentMethod]);

  // Sync customer from flow state to customerData
  useEffect(() => {
    if (flowState.customer) {
      const customer = flowState.customer as any;
      setCustomerData({
        id: customer.id || undefined,
        name: customer.name || "",
        telp: customer.telp || "",
        birthDate: customer.birthDate || 0,
        city: customer.city || "",
        province: customer.province || "",
        subdistrict: customer.subdistrict || "",
        ward: customer.ward || "",
        postalCode: customer.postalCode || "",
        fullAddress: customer.fullAddress || "",
        shortAddress: customer.shortAddress || "",
        isMember: customer.isMember,
      });
    }
  }, [flowState.customer, setCustomerData]);

  // Get material options based on product type
  const getMaterialOptions = useCallback(() => {
    if (priceListState.type !== "success") return [];

    const options: {
      value: string;
      label: string;
      id: string;
      category: string;
    }[] = [];

    // Add GOLD_JEWELRY options
    priceListState.data.goldJewelryPriceList.forEach((item) => {
      options.push({
        value: item.id,
        label: item.name,
        id: item.id,
        category: "GOLD_JEWELRY",
      });
    });

    // Add GOLD_BAR options
    priceListState.data.goldBarPriceList.forEach((item) => {
      options.push({
        value: item.id,
        label: item.name,
        id: item.id,
        category: "GOLD_BAR",
      });
    });

    // Add OTHERS options
    priceListState.data.othersPriceList.forEach((item) => {
      options.push({
        value: item.id,
        label: item.name,
        id: item.id,
        category: "NON_GOLD",
      });
    });

    return options;
  }, [priceListState]);

  // Get material price
  const getMaterialPrice = useCallback(
    (materialId: string) => {
      if (priceListState.type !== "success") return 0;

      const allItems = [
        ...priceListState.data.goldJewelryPriceList,
        ...priceListState.data.goldBarPriceList,
        ...priceListState.data.othersPriceList,
      ];

      const item = allItems.find((i) => i.id === materialId);
      if (!item) return 0;

      // For items with quality options (NON_GOLD)
      if (item.category === "NON_GOLD") {
        if (item.sellPrice.highQualityPrice)
          return item.sellPrice.highQualityPrice || 0;
        return item.sellPrice.price || 0;
      }

      // For GOLD items, use sellPrice.price
      return item.sellPrice.price || 0;
    },
    [priceListState],
  );

  // Get category for a material
  const getMaterialCategory = useCallback(
    (materialId: string) => {
      if (priceListState.type !== "success") return "";

      const allItems = [
        ...priceListState.data.goldJewelryPriceList,
        ...priceListState.data.goldBarPriceList,
        ...priceListState.data.othersPriceList,
      ];

      const item = allItems.find((i) => i.id === materialId);
      return item?.category || "";
    },
    [priceListState],
  );

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
      if (isSuperAdmin && !branchId) {
        toast.error("Pilih cabang untuk transaksi");
        return;
      }
      if (items.length === 0) {
        toast.error("Tambahkan minimal satu item ke transaksi");
        return;
      }
      if (!paymentMethod) {
        toast.error("Pilih metode pembayaran");
        return;
      }

      const response = await submitTransaction();
      router.push(`/transaction/detail/${response.id}`);
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Gagal membuat transaksi");
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
        <BuyBranchSelectionStep
          selected={branchId}
          branchListState={branchListState}
          onSelect={(selectedBranch) => setBranchId(selectedBranch || "")}
          isSuperAdmin={isSuperAdmin}
        />
      ),
    },
    items: {
      component: (
        <BuyAddItemsStep
          items={items}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          onUpdateItem={updateItem}
          onStartEditingItem={startEditingItem}
          onStopEditingItem={stopEditingItem}
          onSaveEditedItem={saveEditedItem}
          editingIndex={editingIndex}
          getMaterialOptions={getMaterialOptions}
          getMaterialPrice={getMaterialPrice}
          getMaterialCategory={getMaterialCategory}
        />
      ),
    },
    payment: {
      component: (
        <BuyPaymentMethodStep
          selected={paymentMethod || null}
          onSelect={(method) => {
            setPaymentMethod(method);
            updateFlowState({ paymentMethod: method });
          }}
          total={items.reduce(
            (sum, item) => sum + Math.ceil(item.finalSubtotal),
            0,
          )}
        />
      ),
    },
    summary: {
      component: (
        <BuySummaryStep
          customer={flowState.customer}
          branchId={branchId}
          items={items}
          paymentMethod={paymentMethod || null}
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
      <PageBreadcrumb pageTitle="Tambah Pembelian" />

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
        title="Konfirmasi Transaksi Pembelian"
        description="Apakah Anda yakin dengan semua data transaksi? Tindakan ini tidak dapat dibatalkan."
        buttonText="Konfirmasi"
        onConfirm={handleSubmit}
        type="warning"
      />
    </div>
  );
};

export default AddBuyTransactionPage;
