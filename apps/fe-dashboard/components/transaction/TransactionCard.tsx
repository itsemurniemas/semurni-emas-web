import React from "react";
import Link from "next/link";

interface TransactionCardProps {
  id: string;
  transactionNumber: string;
  badge: "Penjualan" | "Pembelian";
  date: string;
  total: string;
  paymentMethod: string;
  branch: string;
  status: "PENDING" | "REJECTED" | "DONE";
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  id,
  transactionNumber,
  badge,
  date,
  total,
  paymentMethod,
  branch,
  status,
}) => {
  const getBadgeColor = () => {
    return badge === "Penjualan"
      ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
      : "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400";
  };

  const getStatusColor = () => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
      case "DONE":
        return "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400";
      case "REJECTED":
        return "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "PENDING":
        return "Menunggu";
      case "DONE":
        return "Selesai";
      case "REJECTED":
        return "Ditolak";
      default:
        return status;
    }
  };

  const DataField = ({
    label,
    value,
    align = "left",
  }: {
    label: string;
    value: string | number;
    align?: "left" | "right";
  }) => (
    <div className={align === "right" ? "text-right" : ""}>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
        {value}
      </p>
    </div>
  );

  return (
    <Link href={`/transaction/detail/${id}`}>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer hover:border-gray-300 dark:hover:border-gray-600">
        {/* Header with Badge and Transaction Number with Status */}
        <div className="flex items-center justify-between p-3 sm:p-4">
          <span
            className={`text-xs sm:text-sm font-semibold px-3 py-1 rounded-full ${getBadgeColor()}`}
          >
            {badge}
          </span>
          <div className="flex gap-2 items-center">
            <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
              {transactionNumber}
            </span>
            <span
              className={`text-xs sm:text-sm font-semibold px-3 py-1 rounded-full ${getStatusColor()}`}
            >
              {getStatusLabel()}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700" />

        {/* Data Rows */}
        <div className="p-3 sm:p-4 space-y-4">
          {/* Row 1: Date - Branch */}
          <div className="flex items-start justify-between gap-4">
            <DataField label="Tanggal" value={date} />
            <DataField label="Cabang" value={branch} align="right" />
          </div>

          {/* Row 2: Payment Method - Total */}
          <div className="flex items-start justify-between gap-4">
            <DataField label="Metode Pembayaran" value={paymentMethod} />
            <DataField label="Total" value={total} align="right" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TransactionCard;
