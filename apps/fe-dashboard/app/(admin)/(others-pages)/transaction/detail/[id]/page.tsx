"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import AlertDialogDrawer from "@/components/dialogDrawer/AlertDialogDrawer";
import {
  LoaderCircle,
  ArrowLeft,
  FileText,
  X,
  Copy,
  Check,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  GetTransactionById,
  UpdateTransactionStatus,
  TransactionDetail,
  formatPriceIDR,
  DataViewState,
} from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { isSuperAdminRole, isAdminRole } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

const TransactionDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const transactionId = params.id as string;

  const [state, setState] = useState<DataViewState<TransactionDetail>>(
    DataViewState.initiate(),
  );
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showStatementLetterModal, setShowStatementLetterModal] =
    useState(false);
  const [selectedStatementLetters, setSelectedStatementLetters] = useState<
    Array<{
      id: string;
      letterImage: string;
      isHTML: boolean;
    }>
  >([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [openApproveAlert, setOpenApproveAlert] = useState(false);
  const [openRejectAlert, setOpenRejectAlert] = useState(false);
  const [socketNotification, setSocketNotification] = useState<{
    transactionId: string;
    userId: string;
  } | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const handleCopyTransactionNumber = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId("transactionNumber");
      toast.success("Nomor transaksi berhasil disalin");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Gagal menyalin nomor transaksi");
    }
  };

  const handleCopyBankAccount = async (accountNumber: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedId("bankAccount");
      toast.success("Nomor rekening berhasil disalin");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Gagal menyalin nomor rekening");
    }
  };

  const handleViewStatementLetter = (
    statementLetters: Array<{
      id: string;
      letterImage: string;
      isHTML: boolean;
    }>,
  ) => {
    setSelectedStatementLetters(statementLetters);
    setShowStatementLetterModal(true);
  };

  const handleApproveTransaction = () => {
    setOpenApproveAlert(true);
  };

  const confirmApproveTransaction = async () => {
    if (!transactionId || !user) return;

    setApprovalLoading(true);
    try {
      const useCase = new UpdateTransactionStatus(
        getApiConfigForRole(user.role || null),
      );
      await useCase.execute({
        id: transactionId,
        request: { status: "DONE" },
      });
      toast.success("Transaksi berhasil disetujui");
      // Refetch transaction
      const getUseCase = new GetTransactionById(
        getApiConfigForRole(user.role || null),
      );
      const data = await getUseCase.execute(transactionId);
      setState(DataViewState.success(data));
      setOpenApproveAlert(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyetujui transaksi",
      );
    } finally {
      setApprovalLoading(false);
    }
  };

  const handleRejectTransaction = () => {
    setOpenRejectAlert(true);
  };

  const confirmRejectTransaction = async () => {
    if (!transactionId || !user) return;

    setApprovalLoading(true);
    try {
      const useCase = new UpdateTransactionStatus(
        getApiConfigForRole(user.role || null),
      );
      await useCase.execute({
        id: transactionId,
        request: { status: "REJECTED" },
      });
      toast.success("Transaksi berhasil ditolak");
      // Refetch transaction
      const getUseCase = new GetTransactionById(
        getApiConfigForRole(user.role || null),
      );
      const data = await getUseCase.execute(transactionId);
      setState(DataViewState.success(data));
      setOpenRejectAlert(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menolak transaksi",
      );
    } finally {
      setApprovalLoading(false);
    }
  };

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
          const isCurrentTransaction = data.transactionId === transactionId;
          const message = isCurrentTransaction
            ? "Ada transaksi yang sudah di-approve"
            : "Ada transaksi yang sudah di-approve";

          toast.success(
            <div className="flex items-center justify-between gap-4">
              <span>{message}</span>
              <button
                onClick={() => {
                  if (isCurrentTransaction) {
                    window.location.reload();
                  } else {
                    router.push(`/transaction/detail/${data.transactionId}`);
                  }
                  toast.dismiss();
                }}
                className="text-sm font-medium text-green-600 dark:text-green-400 hover:opacity-90 px-3 py-1 rounded whitespace-nowrap"
              >
                {isCurrentTransaction ? "Refresh" : "Lihat Detail"}
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

  useEffect(() => {
    if (!transactionId || !user) return;

    const fetchTransaction = async () => {
      setState(DataViewState.loading());
      try {
        const useCase = new GetTransactionById(
          getApiConfigForRole(user.role || null),
        );
        const data = await useCase.execute(transactionId);
        setState(DataViewState.success(data));
      } catch (error) {
        setState(
          DataViewState.error(
            error instanceof Error
              ? error.message
              : "Failed to fetch transaction",
          ),
        );
      }
    };

    fetchTransaction();
  }, [transactionId, user]);

  const renderContent = () => {
    switch (state.type) {
      case "initiate":
      case "loading":
        return (
          <div className="flex items-center justify-center p-10">
            <LoaderCircle className="animate-spin w-8 h-8 text-brand-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Memuat data transaksi...
            </span>
          </div>
        );

      case "error":
        return (
          <div className="flex items-center justify-center p-10 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">
              Error: {state.message}
            </p>
          </div>
        );

      case "success":
        const transaction = state.data;
        const transactionDate = new Date(transaction.transactionDate * 1000);

        return (
          <div className="space-y-6">
            {/* Approve/Reject Buttons - At Top (Only for PENDING status and admin/super-admin roles) */}
            {transaction.status === "PENDING" &&
              user &&
              (isSuperAdminRole(user.role) || isAdminRole(user.role)) && (
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="sm"
                    variant="error"
                    onClick={handleRejectTransaction}
                    disabled={approvalLoading}
                    className="flex items-center gap-2"
                  >
                    {approvalLoading ? (
                      <>
                        <LoaderCircle size={16} className="animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <XCircle size={16} />
                        Tolak Transaksi
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={handleApproveTransaction}
                    disabled={approvalLoading}
                    className="flex items-center gap-2"
                  >
                    {approvalLoading ? (
                      <>
                        <LoaderCircle size={16} className="animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Tandai Sudah Ditransfer
                      </>
                    )}
                  </Button>
                </div>
              )}

            {/* Payment Methods - Moved to top when PENDING */}
            {transaction.status === "PENDING" && (
              <ComponentCard title="Metode Pembayaran">
                <div className="space-y-4">
                  {/* Detailed Payment Breakdown */}
                  <div className="space-y-2">
                    {transaction.payments.map((payment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {(() => {
                              const paymentMethods: Record<string, string> = {
                                CASH: "Tunai",
                                QRIS: "QRIS",
                                NON_CASH: "Non Tunai",
                              };
                              return (
                                paymentMethods[payment.paymentType] ||
                                payment.paymentType
                              );
                            })()}
                          </p>
                          {/* Bank Details for Non-Cash Payments */}
                          {payment.bankName && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Bank: {payment.bankName}
                            </p>
                          )}
                          {payment.bankAccountNumber && (
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Rekening: {payment.bankAccountNumber}
                              </p>
                              <button
                                onClick={() =>
                                  handleCopyBankAccount(
                                    payment.bankAccountNumber!,
                                  )
                                }
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                title="Salin nomor rekening"
                              >
                                {copiedId === "bankAccount" ? (
                                  <Check
                                    size={14}
                                    className="text-green-600 dark:text-green-400"
                                  />
                                ) : (
                                  <Copy
                                    size={14}
                                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                  />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-bold text-brand-600 dark:text-brand-400 ml-4">
                          {formatPriceIDR(payment.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ComponentCard>
            )}

            {/* Header Card */}
            <ComponentCard title="Informasi Transaksi">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nomor Transaksi
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {transaction.transactionNumber}
                      </h1>
                      <button
                        onClick={() =>
                          handleCopyTransactionNumber(
                            transaction.transactionNumber,
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                        title="Copy transaction number"
                      >
                        {copiedId === "transactionNumber" ? (
                          <Check size={20} className="text-green-500" />
                        ) : (
                          <Copy size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        transaction.transactionType === "SELL"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      }`}
                    >
                      {transaction.transactionType === "SELL"
                        ? "Penjualan"
                        : "Pembelian"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Tanggal Transaksi
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {transactionDate.toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total Berat
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.totalWeightGram} g
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total Pembayaran
                    </p>
                    <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
                      {formatPriceIDR(transaction.subtotal)}
                    </p>
                  </div>
                </div>
              </div>
            </ComponentCard>

            {/* Customer & Branch Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ComponentCard title="Informasi Pelanggan">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Nama
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.customer.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Telepon
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.customer.telp}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Alamat
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.customer.fullAddress}
                    </p>
                  </div>
                </div>
              </ComponentCard>

              <ComponentCard title="Informasi Cabang">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Nama Cabang
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.branch.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Telepon
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.branch.telp}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Alamat
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.branch.fullAddress}
                    </p>
                  </div>
                </div>
              </ComponentCard>
            </div>

            {/* Items Details */}
            <ComponentCard title="Detail Item">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 px-3 font-semibold text-gray-900 dark:text-white">
                        Produk
                      </th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-900 dark:text-white">
                        Qty
                      </th>
                      <th className="text-right py-2 px-3 font-semibold text-gray-900 dark:text-white">
                        Harga Satuan
                      </th>
                      <th className="text-right py-2 px-3 font-semibold text-gray-900 dark:text-white">
                        Diskon
                      </th>
                      <th className="text-right py-2 px-3 font-semibold text-gray-900 dark:text-white">
                        Total
                      </th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-900 dark:text-white">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transaction.lineItems.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        <td className="py-3 px-3">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {item.catalog.displayName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Berat total / item: {item.catalog.totalWeightGram}
                              g
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Berat bersih / item: {item.catalog.netWeightGram}g
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center text-gray-900 dark:text-white">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-3 text-right text-gray-900 dark:text-white">
                          {formatPriceIDR(
                            Math.ceil(item.subtotal / item.quantity),
                          )}
                        </td>
                        <td className="py-3 px-3 text-right text-gray-900 dark:text-white">
                          {item.discount > 0
                            ? formatPriceIDR(item.discount)
                            : "-"}
                        </td>
                        <td className="py-3 px-3 text-right font-medium text-gray-900 dark:text-white">
                          {formatPriceIDR(item.finalSubtotal)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {(item?.statementLetters?.length ?? 0) > 0 ? (
                            <button
                              onClick={() => {
                                if (
                                  item.statementLetters &&
                                  item.statementLetters.length > 0
                                ) {
                                  handleViewStatementLetter(
                                    item.statementLetters,
                                  );
                                }
                              }}
                              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded transition-colors"
                            >
                              <FileText size={14} />
                              Lihat Pernyataan
                            </button>
                          ) : (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              -
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ComponentCard>

            {/* Payments - Only show when NOT PENDING */}
            {transaction.status !== "PENDING" && (
              <ComponentCard title="Metode Pembayaran">
                <div className="space-y-4">
                  {/* Detailed Payment Breakdown */}
                  <div className="space-y-2">
                    {transaction.payments.map((payment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {(() => {
                              const paymentMethods: Record<string, string> = {
                                CASH: "Tunai",
                                QRIS: "QRIS",
                                NON_CASH: "Non Tunai",
                              };
                              return (
                                paymentMethods[payment.paymentType] ||
                                payment.paymentType
                              );
                            })()}
                          </p>
                          {/* Bank Details for Non-Cash Payments */}
                          {payment.bankName && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Bank: {payment.bankName}
                            </p>
                          )}
                          {payment.bankAccountNumber && (
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Rekening: {payment.bankAccountNumber}
                              </p>
                              <button
                                onClick={() =>
                                  handleCopyBankAccount(
                                    payment.bankAccountNumber!,
                                  )
                                }
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                title="Salin nomor rekening"
                              >
                                {copiedId === "bankAccount" ? (
                                  <Check
                                    size={14}
                                    className="text-green-600 dark:text-green-400"
                                  />
                                ) : (
                                  <Copy
                                    size={14}
                                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                  />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-bold text-brand-600 dark:text-brand-400 ml-4">
                          {formatPriceIDR(payment.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ComponentCard>
            )}

            {/* Notes */}
            {transaction.note && (
              <ComponentCard title="Catatan">
                <p className="text-sm text-gray-900 dark:text-white">
                  {transaction.note}
                </p>
              </ComponentCard>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/transaction/history")}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Kembali
              </Button>
              {transaction.receiptImage && (
                <Button
                  variant="outline"
                  onClick={() => setShowReceiptModal(true)}
                  className="flex items-center gap-2"
                >
                  <FileText size={16} />
                  Lihat Nota
                </Button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Detail Transaksi" />
      {renderContent()}

      {/* Receipt Modal */}
      {showReceiptModal &&
        state.type === "success" &&
        state.data?.receiptImage && (
          <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Struk Transaksi
                </h2>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-auto">
                <div className="p-4">
                  <iframe
                    srcDoc={state.data.receiptImage}
                    className="w-full h-full border-none"
                    title="Receipt Preview"
                    style={{ minHeight: "600px" }}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowReceiptModal(false)}
                >
                  Tutup
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    const printWindow = window.open(
                      "",
                      "",
                      "width=800,height=600",
                    );
                    if (printWindow && state.data && state.data.receiptImage) {
                      printWindow.document.write(state.data.receiptImage);
                      printWindow.document.close();
                      printWindow.print();
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <FileText size={16} />
                  Cetak
                </Button>
              </div>
            </div>
          </div>
        )}

      {/* Statement Letter Modal */}
      {showStatementLetterModal && selectedStatementLetters.length > 0 && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pernyataan Kepemilikan Barang{" "}
                {selectedStatementLetters.length > 1 &&
                  `(${selectedStatementLetters.length} halaman)`}
              </h2>
              <button
                onClick={() => {
                  setShowStatementLetterModal(false);
                  setSelectedStatementLetters([]);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800 p-4">
              <div>
                {selectedStatementLetters.every((sl) => sl.isHTML) ? (
                  // Display HTML statements
                  <div className="space-y-4">
                    {selectedStatementLetters.map((letter) => (
                      <iframe
                        key={letter.id}
                        srcDoc={letter.letterImage}
                        className="w-full border-none bg-white dark:bg-gray-900"
                        title="Statement Letter Preview"
                        style={{ minHeight: "600px" }}
                      />
                    ))}
                  </div>
                ) : (
                  // Display base64 images with A4 page sizing
                  <div className="flex flex-col gap-4">
                    {selectedStatementLetters.map((letter) => (
                      <img
                        key={letter.id}
                        src={letter.letterImage}
                        alt="Statement Letter"
                        className="w-full max-w-[210mm] mx-auto bg-white dark:bg-gray-900 shadow-lg"
                        style={{
                          aspectRatio: "auto",
                          pageBreakInside: "avoid",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowStatementLetterModal(false);
                  setSelectedStatementLetters([]);
                }}
              >
                Tutup
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const printWindow = window.open(
                    "",
                    "",
                    "width=800,height=600",
                  );
                  if (printWindow) {
                    if (selectedStatementLetters.every((sl) => sl.isHTML)) {
                      // Print all HTML statements
                      selectedStatementLetters.forEach((letter) => {
                        printWindow.document.write(letter.letterImage);
                      });
                      printWindow.document.close();
                      setTimeout(() => {
                        printWindow.print();
                      }, 500);
                    } else {
                      // Print all base64 images with A4 page sizing
                      let htmlContent = `
                        <html>
                          <head>
                            <title>Print Statement Letters</title>
                            <style>
                              * {
                                margin: 0;
                                padding: 0;
                                box-sizing: border-box;
                              }
                              html {
                                margin: 0;
                                padding: 0;
                              }
                              body {
                                font-family: Arial, sans-serif;
                                margin: 0;
                                padding: 0;
                              }
                              @page {
                                size: A4;
                                margin: 0;
                              }
                              @media print {
                                body {
                                  margin: 0;
                                  padding: 0;
                                }
                                .page {
                                  page-break-after: always;
                                  page-break-inside: avoid;
                                  margin: 0;
                                  padding: 10mm;
                                  width: 210mm;
                                  height: 297mm;
                                  display: flex;
                                  align-items: flex-start;
                                  justify-content: center;
                                  overflow: hidden;
                                }
                                .page img {
                                  max-width: 100%;
                                  max-height: 277mm;
                                  width: auto;
                                  height: auto;
                                  object-fit: scale-down;
                                }
                              }
                              @media screen {
                                .page {
                                  width: 210mm;
                                  margin: 10mm auto;
                                  padding: 10mm;
                                  box-shadow: 0 0 10px rgba(0,0,0,0.1);
                                  page-break-inside: avoid;
                                  min-height: 297mm;
                                }
                                .page img {
                                  max-width: 100%;
                                  max-height: 277mm;
                                  width: auto;
                                  height: auto;
                                  display: block;
                                  object-fit: scale-down;
                                }
                              }
                            </style>
                          </head>
                          <body>
                      `;
                      selectedStatementLetters.forEach((letter) => {
                        htmlContent += `<div class="page"><img src="${letter.letterImage}" alt="Statement Letter" /></div>`;
                      });
                      htmlContent += `
                          </body>
                        </html>
                      `;
                      printWindow.document.write(htmlContent);
                      printWindow.document.close();
                      
                      // Wait for images to load before printing
                      const images = printWindow.document.querySelectorAll('img');
                      let loadedCount = 0;
                      
                      if (images.length === 0) {
                        setTimeout(() => {
                          printWindow.print();
                        }, 500);
                      } else {
                        images.forEach((img) => {
                          img.onload = () => {
                            loadedCount++;
                            if (loadedCount === images.length) {
                              setTimeout(() => {
                                printWindow.print();
                              }, 300);
                            }
                          };
                          img.onerror = () => {
                            loadedCount++;
                            if (loadedCount === images.length) {
                              setTimeout(() => {
                                printWindow.print();
                              }, 300);
                            }
                          };
                        });
                      }
                    }
                  }
                }}
                className="flex items-center gap-2"
              >
                <FileText size={16} />
                Cetak
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Dialog */}
      <AlertDialogDrawer
        open={openApproveAlert}
        setOpen={setOpenApproveAlert}
        type="success"
        title="Tandai Sudah Ditransfer"
        description={`Apakah Anda yakin transaksi ini sudah ditransfer? Tindakan ini tidak dapat dibatalkan.`}
        buttonText="Tandai Sudah Ditransfer"
        onConfirm={confirmApproveTransaction}
        isLoading={approvalLoading}
      />

      {/* Reject Confirmation Dialog */}
      <AlertDialogDrawer
        open={openRejectAlert}
        setOpen={setOpenRejectAlert}
        type="error"
        title="Tolak Transaksi"
        description={`Apakah Anda yakin ingin menolak transaksi ini? Tindakan ini tidak dapat dibatalkan.`}
        buttonText="Tolak Transaksi"
        onConfirm={confirmRejectTransaction}
        isLoading={approvalLoading}
      />
    </div>
  );
};

export default TransactionDetailPage;
