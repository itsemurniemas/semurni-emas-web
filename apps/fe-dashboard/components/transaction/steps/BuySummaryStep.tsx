"use client";
import React from "react";
import Button from "@/components/ui/button/Button";
import { formatPriceIDR, DataViewState, BranchModel } from "@repo/core";
import type { TransactionItem, PaymentSelection } from "../types";

interface BuySummaryStepProps {
  customer: any | null;
  branchId: string | undefined;
  items: any[];
  paymentMethod: PaymentSelection | null;
  branchListState: DataViewState<BranchModel[]>;
  isSuperAdmin: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const BuySummaryStep: React.FC<BuySummaryStepProps> = ({
  customer,
  branchId,
  items,
  paymentMethod,
  branchListState,
  isSuperAdmin,
  onSubmit,
  isSubmitting,
}) => {
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

  const subtotal = Math.ceil(
    items.reduce((sum, item) => sum + item.finalSubtotal, 0),
  );
  const tax = 0;
  const total = subtotal + tax;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Ringkasan Transaksi Pembelian
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Periksa kembali detail transaksi Anda sebelum menyelesaikan.
          </p>
        </div>

        {/* Customer Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Informasi Penjual
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
            Item yang Dibeli
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-3 rounded"
              >
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.displayName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.totalWeightGram}g @{" "}
                      {formatPriceIDR(
                        Math.ceil(item.finalSubtotal / item.quantity),
                      )}
                      /g × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatPriceIDR(Math.ceil(item.finalSubtotal))}
                  </p>
                </div>
                {item.statementLetterImage &&
                  item.statementLetterImage.length > 0 && (
                    <div className="mt-1 inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                      ✓ Surat Pernyataan ({item.statementLetterImage.length}{" "}
                      file)
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Metode Pembayaran
          </h4>
          {paymentMethod && paymentMethod.isSplit ? (
            <div className="space-y-2">
              {paymentMethod.payments.map((payment, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm"
                >
                  <span className="text-gray-600 dark:text-gray-400">
                    {paymentMethods[payment.method] || payment.method}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPriceIDR(payment.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Belum dipilih
              </p>
            </div>
          )}
        </div>

        {/* Price Summary Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400">Subtotal:</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatPriceIDR(subtotal)}
            </p>
          </div>
          {tax > 0 && (
            <div className="flex justify-between items-center">
              <p className="text-gray-600 dark:text-gray-400">Pajak:</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatPriceIDR(tax)}
              </p>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-white">
              Total:
            </p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {formatPriceIDR(total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuySummaryStep;
