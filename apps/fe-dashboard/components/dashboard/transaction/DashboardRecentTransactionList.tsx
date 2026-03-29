"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { formatPriceIDR } from "@repo/core";
import { DataViewState, Transaction } from "@repo/core";
import { LoaderCircle } from "lucide-react";

interface DashboardRecentTransactionListProps {
  state: DataViewState<Transaction[]>;
}

const formatTransactionType = (type: string) => {
  return type === "SELL" ? "Penjualan" : "Pembelian";
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

const formatDate = (dateString: string | number) => {
  let date: Date;

  if (typeof dateString === "number") {
    const timestamp = dateString < 10000000000 ? dateString * 1000 : dateString;
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

const DashboardRecentTransactionList: React.FC<
  DashboardRecentTransactionListProps
> = ({ state }) => {
  const router = useRouter();
  const renderContent = () => {
    switch (state.type) {
      case "initiate":
      case "loading":
        return (
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-2">
              <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Memuat transaksi...
              </p>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400">
              Error loading transactions: {state.message}
            </p>
          </div>
        );

      case "success":
        if (!state.data || state.data.length === 0) {
          return (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tidak ada riwayat transaksi
              </p>
            </div>
          );
        }

        return (
          <div className="max-w-full overflow-x-auto">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                <TableRow>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    No. Transaksi
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Tipe
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Metode Pembayaran
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Tanggal
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Total
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {state.data.map((transaction) => (
                  <TableRow key={transaction.id} className="">
                    <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90">
                      <button
                        onClick={() =>
                          router.push(`/transaction/detail/${transaction.id}`)
                        }
                        className="cursor-pointer hover:text-primary hover:underline"
                      >
                        {transaction.transactionNumber}
                      </button>
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          transaction.transactionType === "SELL"
                            ? "success"
                            : "warning"
                        }
                      >
                        {formatTransactionType(transaction.transactionType)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {formatPaymentMethods(
                        transaction.payments,
                        transaction.paymentType,
                      )}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {formatDate(
                        transaction.transactionDate || transaction.createdAt,
                      )}
                    </TableCell>
                    <TableCell className="py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {formatPriceIDR(transaction.subtotal || 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/3 sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Transaksi Terbaru
          </h3>
        </div>

        <Link href="/transaction/history">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200">
            Lihat
          </button>
        </Link>
      </div>
      {renderContent()}
    </div>
  );
};

export default DashboardRecentTransactionList;
