"use client";
import React, { useState, useMemo } from "react";
import { Check, Trash2, AlertCircle, AlertTriangle } from "lucide-react";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import PriceInput from "@/components/form/input/PriceInput";
import { formatPriceIDR } from "@repo/core";
import type { PaymentMethod, PaymentSelection } from "../types";

interface PaymentMethodStepProps {
  selected: PaymentSelection | null;
  onSelect: (method: PaymentSelection) => void;
  total?: number;
}

const PaymentMethodStep: React.FC<PaymentMethodStepProps> = ({
  selected,
  onSelect,
  total = 0,
}) => {
  // Helper function to round up (ceiling) to integer
  const roundToInteger = (num: number) => Math.ceil(num);

  const [selectedMethods, setSelectedMethods] = useState<
    Array<{ method: PaymentMethod; amount: string }>
  >([]);

  const paymentMethods: Array<{
    value: PaymentMethod;
    label: string;
    description: string;
  }> = [
    {
      value: "CASH",
      label: "Tunai",
      description: "Pembayaran langsung dengan uang tunai",
    },
    // {
    //   value: "QRIS",
    //   label: "QRIS",
    //   description: "Pembayaran menggunakan kode QR",
    // },
    {
      value: "NON_CASH",
      label: "Non Tunai",
      description: "Pembayaran melalui transfer atau kartu kredit",
    },
  ];

  const totalSplitAmount = useMemo(() => {
    return selectedMethods.reduce((sum, item) => {
      const amount = parseFloat(item.amount) || 0;
      return sum + amount;
    }, 0);
  }, [selectedMethods]);

  const remainingAmount = total - totalSplitAmount;
  const isValidSplit =
    selectedMethods.length > 0 &&
    remainingAmount === 0 &&
    selectedMethods.every((m) => (parseFloat(m.amount) || 0) > 0);

  const handleTogglePaymentMethod = (method: PaymentMethod) => {
    const isSelected = selectedMethods.find((m) => m.method === method);
    if (isSelected) {
      // Remove if already selected
      setSelectedMethods(selectedMethods.filter((m) => m.method !== method));
    } else {
      // Add if not selected
      setSelectedMethods([...selectedMethods, { method, amount: "" }]);
    }
  };

  const handleRemovePaymentMethod = (index: number) => {
    setSelectedMethods(selectedMethods.filter((_, i) => i !== index));
  };

  const handleAmountChange = (index: number, amount: string) => {
    const updated = [...selectedMethods];
    updated[index].amount = amount;
    setSelectedMethods(updated);

    // Auto-update split payment if valid
    if (updated.length > 0) {
      const totalAmount = updated.reduce((sum, item) => {
        return sum + (parseFloat(item.amount) || 0);
      }, 0);
      const allMethodsHaveAmount = updated.every(
        (item) => (parseFloat(item.amount) || 0) > 0,
      );
      if (allMethodsHaveAmount && totalAmount === total) {
        onSelect({
          isSplit: true,
          payments: updated.map((item) => ({
            method: item.method,
            amount: roundToInteger(parseFloat(item.amount) || 0),
            bankAccountNumber: null,
            bankName: null,
          })),
        });
      }
    }
  };

  const handleFillRest = () => {
    if (selectedMethods.length === 0 || remainingAmount <= 0) return;

    // Fill the remaining amount into the last payment method
    const updated = [...selectedMethods];
    const lastIndex = updated.length - 1;
    const currentAmount = parseFloat(updated[lastIndex].amount) || 0;
    updated[lastIndex].amount = (currentAmount + remainingAmount).toString();

    setSelectedMethods(updated);

    // Auto-update split payment
    const totalAmount = updated.reduce((sum, item) => {
      return sum + (parseFloat(item.amount) || 0);
    }, 0);
    const allMethodsHaveAmount = updated.every(
      (item) => (parseFloat(item.amount) || 0) > 0,
    );
    if (allMethodsHaveAmount && totalAmount === total) {
      onSelect({
        isSplit: true,
        payments: updated.map((item) => ({
          method: item.method,
          amount: roundToInteger(parseFloat(item.amount) || 0),
          bankAccountNumber: null,
          bankName: null,
        })),
      });
    }
  };

  const handleFillRestForMethod = (index: number) => {
    if (remainingAmount <= 0) return;

    const updated = [...selectedMethods];
    const currentAmount = parseFloat(updated[index].amount) || 0;
    updated[index].amount = (currentAmount + remainingAmount).toString();

    setSelectedMethods(updated);

    // Auto-update split payment if valid
    const totalAmount = updated.reduce((sum, item) => {
      return sum + (parseFloat(item.amount) || 0);
    }, 0);
    const allMethodsHaveAmount = updated.every(
      (item) => (parseFloat(item.amount) || 0) > 0,
    );
    if (allMethodsHaveAmount && totalAmount === total) {
      onSelect({
        isSplit: true,
        payments: updated.map((item) => ({
          method: item.method,
          amount: roundToInteger(parseFloat(item.amount) || 0),
          bankAccountNumber: null,
          bankName: null,
        })),
      });
    }
  };

  const handleSaveSplit = () => {
    if (isValidSplit) {
      onSelect({
        isSplit: true,
        payments: selectedMethods.map((item) => ({
          method: item.method,
          amount: roundToInteger(parseFloat(item.amount) || 0),
          bankAccountNumber: null,
          bankName: null,
        })),
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pilih Metode Pembayaran
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Tentukan metode pembayaran yang digunakan untuk transaksi ini. Anda
            dapat menggunakan satu metode atau menggabungkan beberapa metode
            pembayaran.
          </p>

          {total > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-900 dark:text-blue-300">
                <span className="font-semibold">Total yang harus dibayar:</span>{" "}
                {formatPriceIDR(total)}
              </p>
            </div>
          )}
        </div>

        {/* Split Payment UI */}
        <div className="space-y-6">
          {/* Payment Methods Selection */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <Label className="text-base font-semibold text-gray-900 dark:text-white">
                Pilih Metode Pembayaran
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Pilih satu atau lebih metode untuk split payment
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const isSelected = selectedMethods.some(
                  (m) => m.method === method.value,
                );
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => handleTogglePaymentMethod(method.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-brand-400 bg-brand-50 dark:bg-brand-900/30 shadow-sm ring-2 ring-brand-200 dark:ring-brand-800 cursor-pointer"
                        : "border-gray-300 dark:border-gray-600 hover:border-brand-300 dark:hover:border-brand-600 bg-white dark:bg-gray-800 hover:shadow-md cursor-pointer"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {method.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {method.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-400 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Payment Methods - Card Based Layout */}
          {selectedMethods.length > 0 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-gray-900 dark:text-white">
                  Rincian Pembayaran
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Masukkan jumlah untuk setiap metode pembayaran
                </p>
              </div>

              {/* Payment Method Cards */}
              <div className="grid grid-cols-1 gap-3">
                {selectedMethods.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {
                            paymentMethods.find((m) => m.value === item.method)
                              ?.label
                          }
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Masukkan jumlah pembayaran
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePaymentMethod(index)}
                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-md transition-colors"
                        title="Hapus metode pembayaran"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-3">
                      <PriceInput
                        value={item.amount}
                        onChange={(value) => handleAmountChange(index, value)}
                        placeholder="0"
                      />
                    </div>
                    {/* Fill Rest Button */}
                    {remainingAmount > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleFillRestForMethod(index)}
                        className="w-full mt-2 text-xs"
                      >
                        Isi Sisa Otomatis ({formatPriceIDR(remainingAmount)})
                      </Button>
                    )}
                    {/* Visual representation of amount */}
                    {parseFloat(item.amount) > 0 && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="h-1 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-400 transition-all duration-300"
                            style={{
                              width: `${Math.min((parseFloat(item.amount) / total) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <span>
                          {Math.min(
                            Math.floor((parseFloat(item.amount) / total) * 100),
                            100,
                          )}
                          %
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Validation and Selected Method Info */}
        {selectedMethods.length === 0 ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-400 flex-shrink-0 flex items-center justify-center mt-0.5">
                <AlertCircle className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-900 dark:text-red-300">
                  Metode pembayaran belum dipilih
                </p>
                <p className="text-xs text-red-800 dark:text-red-400 mt-1">
                  Pilih minimal satu metode pembayaran untuk melanjutkan
                </p>
              </div>
            </div>
          </div>
        ) : isValidSplit ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-400 flex-shrink-0 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-900 dark:text-green-300">
                  Metode Pembayaran Terpilih:
                </p>
                <div className="mt-2 space-y-1">
                  {selectedMethods.map((payment, index) => (
                    <p
                      key={index}
                      className="text-sm text-green-800 dark:text-green-400"
                    >
                      {
                        paymentMethods.find((m) => m.value === payment.method)
                          ?.label
                      }{" "}
                      - {formatPriceIDR(parseFloat(payment.amount) || 0)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-yellow-400 flex-shrink-0 flex items-center justify-center mt-0.5">
                <AlertTriangle className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-300">
                  Pembayaran belum lengkap
                </p>
                <p className="text-xs text-yellow-800 dark:text-yellow-400 mt-1">
                  {selectedMethods.some(
                    (m) => (parseFloat(m.amount) || 0) === 0,
                  )
                    ? "Masukkan jumlah untuk semua metode pembayaran"
                    : `Pastikan total pembayaran sama dengan Rp ${total.toLocaleString("id-ID")}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodStep;
