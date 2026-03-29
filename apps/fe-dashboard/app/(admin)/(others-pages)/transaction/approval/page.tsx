"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";
import TransactionCard from "@/components/transaction/TransactionCard";
import Select from "@/components/form/Select";
import { useApprovalTransactionViewModel } from "./useApprovalTransactionViewModel";
import { useAuth, isSuperAdminRole } from "@/context/AuthContext";
import { LoaderCircle } from "lucide-react";
import { formatPriceIDR } from "@repo/core";

interface TransactionDisplay {
  id: string;
  transactionNumber: string;
  amount: number;
  date: string;
  branchName: string;
  transactionType: string;
  paymentType: string;
  status: "PENDING" | "REJECTED" | "DONE";
  payments?: Array<{
    paymentType: "CASH" | "QRIS" | "NON_CASH";
    amount: number;
  }>;
}

const ApprovalTransactionPage: React.FC = () => {
  const { state, branchListState, pagination, fetchTransactions } =
    useApprovalTransactionViewModel();
  const { user } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const isSuperAdmin = isSuperAdminRole(user?.role);

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    const branchId = value || undefined;
    fetchTransactions(1, branchId, selectedType || undefined);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    const transactionType = value || undefined;
    fetchTransactions(1, selectedBranch || undefined, transactionType);
  };

  const formatPaymentType = (type: string) => {
    switch (type) {
      case "CASH":
        return "Tunai";
      case "QRIS":
        return "QRIS";
      case "NON_CASH":
        return "Non Tunai";
      default:
        return type;
    }
  };

  const formatPaymentMethods = (
    payments: any[] | undefined,
    fallbackType?: string,
  ) => {
    if (payments && payments.length > 0) {
      return payments.map((p) => formatPaymentType(p.paymentType)).join(", ");
    }
    return fallbackType ? formatPaymentType(fallbackType) : "Tunai";
  };

  const formatTransactionType = (type: string) => {
    return type === "SELL" ? "Penjualan" : "Pembelian";
  };

  const formatDate = (dateString: string | number) => {
    let date: Date;

    if (typeof dateString === "number") {
      // Detect if it's seconds (< 10 billion) or milliseconds (> 10 billion)
      const timestamp =
        dateString < 10000000000 ? dateString * 1000 : dateString;
      date = new Date(timestamp);
    } else {
      date = new Date(dateString);
    }

    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const transactions: TransactionDisplay[] =
    state.type === "success" && state.data
      ? state.data.map((transaction: any) => ({
          id: transaction.id,
          transactionNumber: transaction.transactionNumber,
          amount: transaction.subtotal || 0,
          date: transaction.transactionDate || transaction.createdAt,
          branchName: transaction.branch?.name || "-",
          transactionType: transaction.transactionType || "SELL",
          paymentType: transaction.paymentType || "CASH",
          status: transaction.status || "PENDING",
          payments: transaction.payments,
        }))
      : [];

  if (state.type === "loading" || state.type === "initiate") {
    return (
      <div>
        <PageBreadcrumb pageTitle="Persetujuan Transaksi" />
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Memuat data transaksi...</p>
          </div>
        </div>
      </div>
    );
  }

  if (state.type === "error") {
    return (
      <div>
        <PageBreadcrumb pageTitle="Persetujuan Transaksi" />
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400">
            Error loading transactions: {state.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Persetujuan Transaksi" />

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <div className="w-full flex flex-wrap gap-3 justify-end">
          {isSuperAdmin && (
            <div className="w-48">
              <Select
                value={selectedBranch}
                onChange={handleBranchChange}
                placeholder="Semua Cabang"
                options={[
                  { value: "", label: "Semua Cabang" },
                  ...(branchListState.type === "success" && branchListState.data
                    ? branchListState.data.map((branch: any) => ({
                        value: branch.id,
                        label: branch.name,
                      }))
                    : []),
                ]}
              />
            </div>
          )}

          <div className="w-48">
            <Select
              value={selectedType}
              onChange={handleTypeChange}
              placeholder="Tipe Transaksi"
              options={[
                { value: "", label: "Semua Tipe" },
                { value: "SELL", label: "Penjualan" },
                { value: "BUY", label: "Pembelian" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              id={transaction.id}
              transactionNumber={transaction.transactionNumber}
              badge={
                formatTransactionType(transaction.transactionType) as
                  | "Penjualan"
                  | "Pembelian"
              }
              date={formatDate(transaction.date)}
              total={formatPriceIDR(transaction.amount)}
              paymentMethod={formatPaymentMethods(
                transaction.payments,
                transaction.paymentType,
              )}
              branch={transaction.branchName}
              status={transaction.status}
            />
          ))
        ) : (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tidak ada transaksi menunggu persetujuan
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(page) => {
              fetchTransactions(
                page,
                selectedBranch || undefined,
                selectedType || undefined,
              );
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ApprovalTransactionPage;
