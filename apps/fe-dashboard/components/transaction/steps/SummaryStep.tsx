"use client";
import React from "react";
import {
  formatPriceIDR,
  CatalogModel,
  CustomerModel,
  DataViewState,
} from "@repo/core";
import type { TransactionItem, PaymentSelection } from "../types";

interface SummaryStepProps {
  customer: CustomerModel | null;
  branchId: string | undefined;
  items: TransactionItem[];
  paymentMethod: PaymentSelection | null;
  catalogState: DataViewState<{ data: CatalogModel[] }>;
  branchListState: DataViewState<any>;
  isSuperAdmin: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const SummaryStep: React.FC<SummaryStepProps> = ({
  customer,
  branchId,
  items,
  paymentMethod,
  catalogState,
  branchListState,
  isSuperAdmin,
  onSubmit,
  isSubmitting,
}) => {
  const getCatalogName = (catalogId: string) => {
    if (catalogState.type === "success" && catalogState.data?.data) {
      const catalog = catalogState.data.data.find((c) => c.id === catalogId);
      return catalog?.product?.name || catalog?.displayName || "Produk";
    }
    return "Produk";
  };

  const getBranchName = (id: string) => {
    if (branchListState.type === "success" && branchListState.data) {
      return (
        branchListState.data.find((b: any) => b.id === id)?.name || "Cabang"
      );
    }
    return "Cabang";
  };

  const paymentMethods: Record<string, string> = {
    CASH: "Tunai",
    QRIS: "QRIS",
    NON_CASH: "Non Tunai",
  };

  const getPaymentMethodLabel = () => {
    if (!paymentMethod) return "Not Selected";
    if (typeof paymentMethod === "string") {
      return paymentMethods[paymentMethod] || "Unknown";
    }
    if (paymentMethod.isSplit) {
      const methods = paymentMethod.payments
        .map((p) => `${paymentMethods[p.method]} - ${formatPriceIDR(p.amount)}`)
        .join(", ");
      return `Pembayaran Terbagi: ${methods}`;
    }
    return "Not Selected";
  };

  const subtotal = Math.ceil(
    items.reduce((sum, item) => sum + item.finalPrice, 0),
  );
  const tax = 0;
  const total = subtotal + tax;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Ringkasan Transaksi
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Periksa kembali detail transaksi Anda sebelum menyelesaikan.
          </p>
        </div>

        {/* Customer Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Informasi Pelanggan
          </h4>
          <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 space-y-1">
            <p className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">Nama:</span>
              <span className="font-medium text-gray-900 dark:text-white ml-2">
                {customer?.name}
              </span>
            </p>
            {customer?.telp && (
              <p className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Telepon:
                </span>
                <span className="text-gray-700 dark:text-gray-300 ml-2">
                  {customer.telp}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Branch Section */}
        {isSuperAdmin && branchId && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Cabang
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {getBranchName(branchId)}
              </p>
            </div>
          </div>
        )}

        {/* Items Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Item Yang Dijual
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {getCatalogName(item.catalogId)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.quantity} x{" "}
                    {formatPriceIDR(Math.ceil(item.realPrice))}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatPriceIDR(Math.ceil(item.finalPrice))}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Metode Pembayaran
          </h4>
          <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {getPaymentMethodLabel()}
            </p>
          </div>
        </div>

        {/* Total Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span className="text-gray-900 dark:text-white">
              {formatPriceIDR(subtotal)}
            </span>
          </div>
          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Pajak:</span>
              <span className="text-gray-900 dark:text-white">
                {formatPriceIDR(tax)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
            <span className="text-gray-900 dark:text-white">Total:</span>
            <span className="text-blue-600 dark:text-blue-400">
              {formatPriceIDR(total)}
            </span>
          </div>
        </div>

        {/* Submit Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Klik tombol "Selesaikan Transaksi" di bawah untuk menyelesaikan
            proses penjualan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryStep;
