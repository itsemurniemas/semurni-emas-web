"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Pagination from "@/components/tables/Pagination";
import TransactionCard from "@/components/transaction/TransactionCard";
import Select from "@/components/form/Select";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { useHistoryTransactionViewModel } from "./useHistoryTransactionViewModel";
import { useAuth, isSuperAdminRole } from "@/context/AuthContext";
import {
  LoaderCircle,
  Plus,
  Upload,
  Download,
  ChevronDown,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  formatPriceIDR,
  DownloadTransactionTemplate,
  UploadTransactionTemplate,
  TRANSACTION_STATUS,
} from "@repo/core";
import { getApiConfigForRole } from "@/lib/api-config";
import { toast } from "react-toastify";
import UploadTransactionForm from "@/components/transaction/UploadTransactionForm";

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

const HistoryTransactionPage: React.FC = () => {
  const router = useRouter();
  const { state, branchListState, pagination, goToPage, fetchTransactions } =
    useHistoryTransactionViewModel();
  const { user } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const [actionsDropdownOpen, setActionsDropdownOpen] = useState(false);
  const [socketNotification, setSocketNotification] = useState<{
    transactionId: string;
    userId: string;
  } | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const isSuperAdmin = isSuperAdminRole(user?.role);

  // Socket setup for transaction updates
  useEffect(() => {
    if (!user?.id) return;

    const socketInstance = io(process.env.NEXT_PUBLIC_API_BASE_URL || "", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketInstance.on(
      "transaction-update",
      (data: { transactionId: string; userId: string }) => {
        // Show toast if current user matches
        if (data.userId === user.id) {
          toast.success(
            <div className="flex items-center justify-between gap-4">
              <span>Ada transaksi yang sudah di-approve</span>
              <button
                onClick={() => {
                  router.push(`/transaction/detail/${data.transactionId}`);
                  toast.dismiss();
                }}
                className="text-sm font-medium text-green-600 dark:text-green-400 hover:opacity-90 px-3 py-1 rounded whitespace-nowrap"
              >
                Lihat Detail
              </button>
            </div>,
            {
              autoClose: false,
              closeButton: false,
            },
          );
          setSocketNotification(data);
        }
      },
    );

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.id]);

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    const branchId = value || undefined;
    fetchTransactions(
      1,
      branchId,
      selectedType || undefined,
      selectedStatus || undefined,
    );
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    const transactionType = value || undefined;
    fetchTransactions(
      1,
      selectedBranch || undefined,
      transactionType,
      selectedStatus || undefined,
    );
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    const status = value || undefined;
    fetchTransactions(
      1,
      selectedBranch || undefined,
      selectedType || undefined,
      status,
    );
  };

  const handleUploadClick = () => {
    setOpenUploadDialog(true);
  };

  const handleFileUpload = async (file: File) => {
    try {
      const useCase = new UploadTransactionTemplate(
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
        await fetchTransactions(
          1,
          selectedBranch || undefined,
          selectedType || undefined,
        );
        return;
      }

      // Check if no items were updated or created
      const created = response.data?.created ?? 0;

      if (created === 0) {
        toast.warning("Tidak ada transaksi yang diupdate");
        await fetchTransactions(
          1,
          selectedBranch || undefined,
          selectedType || undefined,
          selectedStatus || undefined,
        );
        return;
      }

      // Success case
      toast.success(`Berhasil membuat ${created} transaksi`);
      await fetchTransactions(
        1,
        selectedBranch || undefined,
        selectedType || undefined,
        selectedStatus || undefined,
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Gagal mengunggah file XLSX";
      toast.error(errorMessage);
    }
  };

  const downloadTransactionTemplate = async () => {
    try {
      const useCase = new DownloadTransactionTemplate(
        getApiConfigForRole(user?.role || null),
      );
      const blob = await useCase.execute();

      // Create a URL for the blob and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "transactions.xlsx");
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
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
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
        <PageBreadcrumb pageTitle="Riwayat Transaksi" />
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
        <PageBreadcrumb pageTitle="Riwayat Transaksi" />
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
      <PageBreadcrumb pageTitle="Riwayat Transaksi" />

      {/* Create Transaction CTA */}
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        {/* Action Buttons */}
        <div className="w-full flex flex-wrap gap-3 justify-end">
          {/* Add Transaction Dropdown */}
          <div className="relative">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setAddDropdownOpen(!addDropdownOpen)}
              endIcon={<ChevronDown size={18} />}
              className="flex items-center gap-2"
            >
              Tambah Transaksi
            </Button>
            <Dropdown
              isOpen={addDropdownOpen}
              onClose={() => setAddDropdownOpen(false)}
              className="mt-2 w-56"
            >
              <DropdownItem
                tag="a"
                href="/transaction/add/sell"
                onItemClick={() => setAddDropdownOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp
                    size={16}
                    className="text-green-600 dark:text-green-400"
                  />
                  <span className="text-green-700 dark:text-green-400">
                    Tambah Penjualan
                  </span>
                </div>
              </DropdownItem>
              <DropdownItem
                tag="a"
                href="/transaction/add/buy"
                onItemClick={() => setAddDropdownOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <TrendingDown
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                  <span className="text-blue-700 dark:text-blue-400">
                    Tambah Pembelian
                  </span>
                </div>
              </DropdownItem>
            </Dropdown>
          </div>

          {/* Template Actions Dropdown (Super Admin Only) */}
          {isSuperAdmin && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActionsDropdownOpen(!actionsDropdownOpen)}
                endIcon={<ChevronDown size={18} />}
              >
                Bulk Upload
              </Button>
              <Dropdown
                isOpen={actionsDropdownOpen}
                onClose={() => setActionsDropdownOpen(false)}
                className="mt-2 w-48"
              >
                <DropdownItem
                  onClick={() => {
                    handleUploadClick();
                    setActionsDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Upload size={16} />
                    <span>Upload .xlsx</span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    downloadTransactionTemplate();
                    setActionsDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Download size={16} />
                    <span>Download Template</span>
                  </div>
                </DropdownItem>
              </Dropdown>
            </div>
          )}
        </div>

        {/* Filters */}
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
                    ? branchListState.data.map((branch) => ({
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

          <div className="w-48">
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              placeholder="Status"
              options={[
                { value: "", label: "Semua Status" },
                ...TRANSACTION_STATUS.map((status) => ({
                  value: status.value,
                  label: status.label,
                })),
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
              Tidak ada riwayat transaksi
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
                selectedStatus || undefined,
              );
            }}
          />
        </div>
      )}

      <UploadTransactionForm
        open={openUploadDialog}
        setOpen={setOpenUploadDialog}
        onUpload={handleFileUpload}
      />
    </div>
  );
};

export default HistoryTransactionPage;
