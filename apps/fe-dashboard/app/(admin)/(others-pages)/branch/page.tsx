"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BranchCard from "@/components/branch/BranchCard";
import React, { useState } from "react";
import { useBranchListViewModel } from "./useBranchListViewModel";
import { AlertDialogDrawer } from "@/components/dialogDrawer";
import { toast } from "react-toastify";
import { BranchModel } from "@repo/core";

const BranchListPage: React.FC = () => {
  const { state, isDeleting, deleteBranch } = useBranchListViewModel();
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchModel | null>(null);

  const handleDeleteConfirm = async () => {
    if (!selectedBranch) return;

    const success = await deleteBranch(selectedBranch.id);
    setOpenDeleteAlert(false);

    if (success) {
      toast.success("Cabang berhasil dihapus");
    } else {
      toast.error("Gagal menghapus cabang");
    }
  };

  const renderContent = () => {
    switch (state.type) {
      case "initiate":
      case "loading":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-125 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse"
              />
            ))}
          </div>
        );
      case "error":
        return (
          <div className="p-4 text-red-500 bg-red-50 rounded-xl dark:bg-red-500/10 dark:text-red-400">
            Error loading branches: {state.message}
          </div>
        );
      case "success":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.data.map((branch) => (
              <BranchCard
                key={branch.id}
                branch={branch}
                onDelete={(branch) => {
                  setSelectedBranch(branch);
                  setOpenDeleteAlert(true);
                }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Daftar Cabang" />
      <div>{renderContent()}</div>

      <AlertDialogDrawer
        open={openDeleteAlert}
        setOpen={setOpenDeleteAlert}
        type="warning"
        title="Hapus Cabang"
        description={`Apakah Anda yakin ingin menghapus cabang ${selectedBranch?.name}? Tindakan ini tidak dapat dibatalkan.`}
        buttonText="Hapus"
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default BranchListPage;
