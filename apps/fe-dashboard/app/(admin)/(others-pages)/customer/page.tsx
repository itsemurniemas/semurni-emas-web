"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React, { useState } from "react";
import CustomerListTable, {
  CustomerListShimmer,
} from "@/components/customer/CustomerListTable";
import { useCustomerViewModel } from "./useCustomerViewModel";
import { useAuth, isSuperAdminRole } from "@/context/AuthContext";
import { Search, Upload, Download } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { DownloadCustomerTemplate, UploadCustomerTemplate } from "@repo/core";
import { getApiConfigForRole } from "@/lib/api-config";
import { toast } from "react-toastify";
import UploadCustomerForm from "@/components/customer/UploadCustomerForm";

// export const metadata: Metadata = {
//   title: "Customer | Semurni Emas Dashboard",
//   description: "This is Customer page for Semurni Emas Dashboard",
// };

const CustomerListPage: React.FC = () => {
  const { state, searchTerm, setSearchTerm, refetch } = useCustomerViewModel();
  const { user } = useAuth();
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const isSuperAdmin = isSuperAdminRole(user?.role);

  const handleUploadClick = () => {
    setOpenUploadDialog(true);
  };

  const handleFileUpload = async (file: File) => {
    try {
      const useCase = new UploadCustomerTemplate(
        getApiConfigForRole(user?.role || null),
      );

      setOpenUploadDialog(false);

      const response = await useCase.execute({ file });

      // Check if there are errors
      if (response.data?.errors && response.data.errors.length > 0) {
        // Show each error as a toast
        response.data.errors.forEach((error: string) => {
          toast.error(error);
        });
        // Still refetch after showing errors
        refetch?.();
        return;
      }

      // Check if no items were updated or created
      const created = response.data?.created ?? 0;

      if (created === 0) {
        toast.warning("Tidak ada pelanggan yang diupdate");
        refetch?.();
        return;
      }

      // Success case
      toast.success(`Berhasil membuat ${created} pelanggan`);
      refetch?.();
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Gagal mengunggah file XLSX";
      toast.error(errorMessage);
    }
  };

  const downloadCustomerTemplate = async () => {
    try {
      const useCase = new DownloadCustomerTemplate(
        getApiConfigForRole(user?.role || null),
      );
      const blob = await useCase.execute();

      // Create a URL for the blob and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "customers.xlsx");
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

  const renderContent = () => {
    switch (state.type) {
      case "initiate":
      case "loading":
        return <CustomerListShimmer />;
      case "error":
        return (
          <div className="flex items-center justify-center p-10 bg-white rounded-2xl border border-red-200 dark:border-red-800 dark:bg-red-900/10">
            <p className="text-red-500">Error: {state.message}</p>
          </div>
        );
      case "success":
        return <CustomerListTable items={state.data} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageBreadcrumb pageTitle="Daftar Pelanggan" />

          <div className="relative w-full sm:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Cari pelanggan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-theme-sm outline-none transition focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
        </div>

        {isSuperAdmin && (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleUploadClick} className="gap-2">
              <Upload size={18} />
              Bulk Upload .xlsx
            </Button>
            <Button
              size="sm"
              onClick={downloadCustomerTemplate}
              variant="outline"
              className="gap-2"
            >
              <Download size={18} />
              Download Template
            </Button>
          </div>
        )}
      </div>

      <div>{renderContent()}</div>

      <UploadCustomerForm
        open={openUploadDialog}
        setOpen={setOpenUploadDialog}
        onUpload={handleFileUpload}
      />
    </div>
  );
};

export default CustomerListPage;
