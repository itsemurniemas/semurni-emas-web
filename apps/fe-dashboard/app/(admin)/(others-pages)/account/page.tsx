"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AccountListTable from "@/components/account/AccountListTable";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { useAccountListViewModel } from "./useAccountListViewModel";
import { AccountProps, getRoleTitle } from "@/components/account/data";

const AccountListPage: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { state } = useAccountListViewModel(refreshTrigger);

  const handleDeleteSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (state.type === "loading" || state.type === "initiate") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat daftar akun...</p>
        </div>
      </div>
    );
  }

  if (state.type === "error") {
    return (
      <div>
        <PageBreadcrumb pageTitle="Daftar Akun" />
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Gagal memuat daftar akun
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {state.message}
          </p>
        </div>
      </div>
    );
  }

  if (state.type !== "success" || !state.data) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Daftar Akun" />
        <div className="p-6 text-center">
          <p className="text-gray-500">Tidak ada akun tersedia</p>
        </div>
      </div>
    );
  }

  const usersByBranch = state.data.reduce(
    (acc, user) => {
      const branchName = user.branch?.name || "Super Admin";
      if (!acc[branchName]) {
        acc[branchName] = [];
      }
      acc[branchName].push({
        id: user.id,
        username: user.username,
        branchName: branchName,
        role: getRoleTitle(user.role?.name || "Unknown Role"),
      } as AccountProps);
      return acc;
    },
    {} as Record<string, AccountProps[]>,
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Daftar Akun" />
      <div className="space-y-6">
        {Object.entries(usersByBranch).map(([branchName, accounts]) => (
          <ComponentCard title={branchName} key={branchName}>
            <AccountListTable
              items={accounts}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </ComponentCard>
        ))}
      </div>
    </div>
  );
};

export default AccountListPage;
