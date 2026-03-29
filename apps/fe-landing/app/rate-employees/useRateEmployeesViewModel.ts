import { useState, useCallback } from "react";
import {
  EmployeeModel,
  GetRatingEmployees,
  SubmitEmployeeRatings,
} from "@repo/core";
import { AlertType } from "@/components/ui/alert-dialog-drawer";

export interface EmployeeRating {
  rating: number;
  comment: string;
}

export interface DialogState {
  open: boolean;
  type: AlertType;
  title: string;
  description: string;
}

export const useRateEmployeesViewModel = () => {
  const [transactionNumber, setTransactionNumber] = useState("");
  const [employee, setEmployee] = useState<EmployeeModel | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"transaction" | "rating">("transaction");
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    type: "error",
    title: "",
    description: "",
  });

  const handleTransactionSubmit = useCallback(async () => {
    if (!transactionNumber.trim()) {
      setDialog({
        open: true,
        type: "error",
        title: "Nomor Transaksi Kosong",
        description: "Masukkan nomor transaksi terlebih dahulu",
      });
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const useCase = new GetRatingEmployees();
      const result = await useCase.execute({
        transactionNumber: transactionNumber.trim(),
      });

      if (!result.employee) {
        setDialog({
          open: true,
          type: "error",
          title: "Karyawan Tidak Ditemukan",
          description: "Tidak ada karyawan yang terkait dengan transaksi ini",
        });
        return;
      }

      setEmployee(result.employee);
      setRating(0);
      setComment("");
      setStep("rating");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setDialog({
        open: true,
        type: "error",
        title: "Gagal Memuat Data",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [transactionNumber]);

  const handleSubmitRatings = useCallback(async () => {
    if (rating === 0) {
      setDialog({
        open: true,
        type: "error",
        title: "Rating Kosong",
        description: "Berikan rating untuk karyawan ini",
      });
      throw new Error("Berikan rating untuk karyawan");
    }

    if (!employee) {
      setDialog({
        open: true,
        type: "error",
        title: "Data Karyawan Tidak Tersedia",
        description: "Silakan ulangi proses dari awal",
      });
      throw new Error("Data karyawan tidak tersedia");
    }

    setIsSubmitting(true);

    try {
      const useCase = new SubmitEmployeeRatings();
      const response = await useCase.execute({
        transactionNumber,
        score: rating,
        comment: comment || undefined,
      });

      setDialog({
        open: true,
        type: "success",
        title: "Terima Kasih!",
        description:
          "Feedback Anda sangat berarti bagi kami dan membantu kami memberikan layanan yang lebih baik. Kami menghargai waktu Anda.",
      });

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setDialog({
        open: true,
        type: "error",
        title: "Gagal Menyimpan Rating",
        description: errorMessage,
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [transactionNumber, employee, rating, comment]);

  const handleReset = useCallback(() => {
    setStep("transaction");
    setTransactionNumber("");
    setEmployee(null);
    setRating(0);
    setComment("");
    setError(null);
  }, []);

  const handleGoBackToTransaction = useCallback(() => {
    setStep("transaction");
    setEmployee(null);
    setRating(0);
    setComment("");
  }, []);

  return {
    // State
    transactionNumber,
    employee,
    rating,
    comment,
    isSubmitting,
    isLoading,
    step,
    error,
    dialog,
    // Setters
    setTransactionNumber,
    setRating,
    setComment,
    setDialog,
    // Handlers
    handleTransactionSubmit,
    handleSubmitRatings,
    handleReset,
    handleGoBackToTransaction,
  };
};
