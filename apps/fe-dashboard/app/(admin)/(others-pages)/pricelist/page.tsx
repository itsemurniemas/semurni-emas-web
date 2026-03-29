"use client";

import React, { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DashboardMetalPriceList from "@/components/dashboard/metalPrices/DashboardMetalPriceList";
import { MetalPriceItem } from "@/components/dashboard/metalPrices/data";
import EditGoldPriceListForm from "./EditGoldPriceListForm";
import { AlertDialogDrawer } from "@/components/dialogDrawer";
import EditNonGoldPriceListForm from "./EditNonGoldPriceListForm";
import UploadPriceListForm from "./UploadPriceListForm";
import PriceDetailDialog from "./PriceDetailDialog";
import { usePriceListViewModel } from "./usePriceListViewModel";
import Button from "@/components/ui/button/Button";
import { Upload, Download } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth, isSuperAdminRole } from "@/context/AuthContext";
import { DownloadPricelistTemplate, UploadPricelistTemplate } from "@repo/core";
import { getApiConfigForRole } from "@/lib/api-config";

const PriceListPage: React.FC = () => {
  const { state, updatePriceItem, deletePriceItem, refetchPriceList } =
    usePriceListViewModel();
  const { user } = useAuth();
  const isSuperAdmin = user ? isSuperAdminRole(user.role) : false;

  const [isEditGoldDrawerOpen, setIsEditGoldDrawerOpen] = useState(false);
  const [isEditNonGoldDrawerOpen, setIsEditNonGoldDrawerOpen] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openPriceDetailDialog, setOpenPriceDetailDialog] = useState(false);
  const [priceDetailType, setPriceDetailType] = useState<"buy" | "sell">("buy");
  const [selectedItem, setSelectedItem] = useState<MetalPriceItem | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      console.warn("NEXT_PUBLIC_API_BASE_URL is not set");
      return;
    }

    socketRef.current = io(baseUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on("pricelist-update", () => {
      refetchPriceList();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [refetchPriceList]);

  const handleUploadClick = () => {
    setOpenUploadDialog(true);
  };

  const handleFileUpload = async (file: File) => {
    try {
      const useCase = new UploadPricelistTemplate(
        getApiConfigForRole(user?.role || null),
      );
      const response = await useCase.execute({ file });

      setOpenUploadDialog(false);

      // Check if there are errors
      if (response.data?.errors && response.data.errors.length > 0) {
        // Show each error as a toast
        response.data.errors.forEach((error: string) => {
          toast.error(error);
        });
        // Still refetch after showing errors
        await refetchPriceList();
        return;
      }

      // Check if no items were updated or created
      const created = response.data?.created ?? 0;
      const updated = response.data?.updated ?? 0;

      if (created === 0 && updated === 0) {
        toast.warning("Tidak ada pricelist yang di update");
        await refetchPriceList();
        return;
      }

      // Success case
      toast.success("Update pricelist sukses");
      await refetchPriceList();
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Gagal mengunggah file XLSX";
      toast.error(errorMessage);
    }
  };

  const downloadCSVTemplate = async () => {
    try {
      const useCase = new DownloadPricelistTemplate(
        getApiConfigForRole(user?.role || null),
      );
      const blob = await useCase.execute();

      // Create a URL for the blob and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "pricelist.xlsx");
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Template XLSX telah diunduh");
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Gagal mengunduh template XLSX. Silakan coba lagi.");
    }
  };

  const handleSave = async (updatedItem: MetalPriceItem) => {
    try {
      const itemId = (updatedItem as any).id;

      if (!itemId) {
        toast.error("Item ID not found");
        return;
      }

      await updatePriceItem({
        category: updatedItem.category || "",
        itemId,
        name: updatedItem.name,
        buyPricePerGram: updatedItem.buyPrice?.price ?? undefined,
        sellPricePerGram: updatedItem.sellPrice?.price ?? undefined,
        lowQualityBuyPricePerGram:
          updatedItem.buyPrice?.lowQualityPrice ?? undefined,
        lowQualitySellPricePerGram:
          updatedItem.sellPrice?.lowQualityPrice ?? undefined,
        highQualityBuyPricePerGram:
          updatedItem.buyPrice?.highQualityPrice ?? undefined,
        highQualitySellPricePerGram:
          updatedItem.sellPrice?.highQualityPrice ?? undefined,
      });

      toast.success(`${updatedItem.name} has been updated successfully`);

      setIsEditGoldDrawerOpen(false);
      setIsEditNonGoldDrawerOpen(false);

      await refetchPriceList();
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save item. Please try again.",
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) {
      toast.error("No item selected");
      return;
    }

    try {
      const itemId = (selectedItem as any).id;

      if (!itemId) {
        toast.error("Item ID not found");
        return;
      }

      await deletePriceItem(selectedItem.category || "", itemId);

      toast.success(`${selectedItem.name} has been deleted successfully`);
      setOpenDeleteAlert(false);
      setSelectedItem(null);

      await refetchPriceList();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete item. Please try again.",
      );
    }
  };

  const handlePriceDetailClick = (
    item: MetalPriceItem,
    type: "buy" | "sell",
  ) => {
    console.log("Price detail clicked:", item, type);
    setSelectedItem(item);
    setPriceDetailType(type);
    setOpenPriceDetailDialog(true);
  };

  const renderContent = () => {
    switch (state.type) {
      case "initiate":
      case "loading":
        return (
          <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/3 sm:px-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded dark:bg-gray-800 w-48"></div>
              <div className="h-10 bg-gray-200 rounded dark:bg-gray-800"></div>
              <div className="h-10 bg-gray-200 rounded dark:bg-gray-800"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-200 rounded dark:bg-gray-800"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center justify-center p-10 bg-white rounded-2xl border border-red-200 dark:border-red-800 dark:bg-red-900/10">
            <p className="text-red-500">Error: {state.message}</p>
          </div>
        );
      case "success":
        return (
          <DashboardMetalPriceList
            title="Harga Logam Mulia"
            priceList={state.data}
            isSuperAdmin={isSuperAdmin}
            onTapEdit={
              isSuperAdmin
                ? (item) => {
                    setSelectedItem(item);
                    if (item.category.toLowerCase() !== "non_gold") {
                      setIsEditGoldDrawerOpen(true);
                    } else {
                      setIsEditNonGoldDrawerOpen(true);
                    }
                  }
                : undefined
            }
            onTapPrice={(item, type) => {
              handlePriceDetailClick(item, type);
            }}
            onTapDelete={
              isSuperAdmin
                ? (item) => {
                    setSelectedItem(item);
                    setOpenDeleteAlert(true);
                  }
                : undefined
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Pricelist Logam Mulia" />
      {isSuperAdmin && (
        <div className="mb-6 flex gap-3">
          <Button
            size="sm"
            startIcon={<Upload size={18} />}
            onClick={handleUploadClick}
          >
            Bulk Upload .xlsx
          </Button>
          <Button
            size="sm"
            variant="outline"
            startIcon={<Download size={18} />}
            onClick={downloadCSVTemplate}
          >
            Download Template
          </Button>
        </div>
      )}

      <div className="space-y-6">{renderContent()}</div>

      {selectedItem && (
        <>
          <EditGoldPriceListForm
            open={isEditGoldDrawerOpen}
            setOpen={setIsEditGoldDrawerOpen}
            selectedItem={selectedItem}
            onSave={handleSave}
          />
          <EditNonGoldPriceListForm
            open={isEditNonGoldDrawerOpen}
            setOpen={setIsEditNonGoldDrawerOpen}
            selectedItem={selectedItem}
            onSave={handleSave}
          />
        </>
      )}

      {selectedItem && (
        <PriceDetailDialog
          open={openPriceDetailDialog}
          setOpen={setOpenPriceDetailDialog}
          selectedItem={selectedItem}
          priceType={priceDetailType}
        />
      )}

      <AlertDialogDrawer
        open={openDeleteAlert}
        setOpen={setOpenDeleteAlert}
        type="warning"
        title="Delete"
        description="Are you sure you want to delete this item?"
        buttonText="Delete"
        onConfirm={handleDelete}
      />

      <UploadPriceListForm
        open={openUploadDialog}
        setOpen={setOpenUploadDialog}
        onUpload={handleFileUpload}
      />

      {selectedItem && (
        <PriceDetailDialog
          open={openPriceDetailDialog}
          setOpen={setOpenPriceDetailDialog}
          selectedItem={selectedItem}
          priceType={priceDetailType}
        />
      )}
    </div>
  );
};

export default PriceListPage;
