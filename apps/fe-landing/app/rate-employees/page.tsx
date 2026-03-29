"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import AlertDialogDrawer from "@/components/ui/alert-dialog-drawer";
import PageHeader from "@/components/ui/PageHeader";
import { useRateEmployeesViewModel } from "./useRateEmployeesViewModel";

const RateEmployeesPage = () => {
  const router = useRouter();
  const {
    transactionNumber,
    employee,
    rating,
    comment,
    isSubmitting,
    isLoading,
    step,
    dialog,
    setTransactionNumber,
    setRating,
    setComment,
    setDialog,
    handleTransactionSubmit,
    handleSubmitRatings,
    handleGoBackToTransaction,
  } = useRateEmployeesViewModel();

  const renderStars = () => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              size={24}
              className={
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-border"
              }
            />
          </button>
        ))}
      </div>
    );
  };

  const handleSubmit = async () => {
    try {
      await handleSubmitRatings();
    } catch (error) {
      // Error is already handled in handleSubmitRatings with dialog
    }
  };

  const renderContent = () => {
    if (step === "transaction") {
      return (
        <div className="max-w-md mx-auto">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Masukkan Nomor Transaksi
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Nomor transaksi digunakan untuk mengidentifikasi karyawan yang
              melayani Anda
            </p>
            <input
              type="text"
              placeholder="Contoh: 29012026SBQ5II"
              value={transactionNumber}
              onChange={(e) => {
                setTransactionNumber(e.target.value);
              }}
              className="w-full px-4 py-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mb-4"
              disabled={isLoading}
            />
            <Button
              onClick={handleTransactionSubmit}
              className="w-full"
              disabled={!transactionNumber.trim() || isLoading}
            >
              {isLoading ? "Memproses..." : "Lanjutkan"}
            </Button>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="max-w-md mx-auto">
          <div className="bg-card border border-border rounded-lg p-5 animate-pulse">
            <div className="w-16 h-16 bg-muted rounded-full mb-4 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-32 mb-2 mx-auto"></div>
            <div className="h-3 bg-muted rounded w-24 mx-auto mb-3"></div>
            <div className="h-8 bg-muted rounded w-full"></div>
          </div>
        </div>
      );
    }

    if (!employee) {
      return null;
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-secondary/50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-foreground">
              Nomor Transaksi
            </p>
            <p className="text-lg font-semibold text-foreground">
              {transactionNumber}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoBackToTransaction}
          >
            Ubah
          </Button>
        </div>

        <p className="text-sm font-light text-muted-foreground">
          Berikan rating untuk karyawan yang melayani Anda
        </p>

        <div>
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            {/* Employee Image */}
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center overflow-hidden">
              {employee.image ? (
                <img
                  src={employee.image}
                  alt={employee.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={32} className="text-muted-foreground" />
              )}
            </div>

            {/* Employee Info */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-1">
                {employee.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {employee.positionName}
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center">{renderStars()}</div>

            {/* Comment */}
            <textarea
              placeholder="Tambahkan komentar (opsional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleGoBackToTransaction}
            variant="outline"
            className="flex-1"
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Rating"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] bg-background">
      <main className="py-16 section-container">
        {/* Page Header */}
        <PageHeader
          title="Beri Rating Karyawan"
          description="Bagikan pengalaman Anda dengan karyawan kami"
        />

        {/* Content */}
        <div>{renderContent()}</div>
      </main>

      {/* Alert Dialog */}
      <AlertDialogDrawer
        open={dialog.open}
        setOpen={(open) => {
          if (!open) {
            setDialog({ ...dialog, open: false });
          }
        }}
        type={dialog.type}
        title={dialog.title}
        description={dialog.description}
        buttonText="Tutup"
        onConfirm={() => {
          if (dialog.type === "success") {
            router.push("/employees");
          }
        }}
      />
    </div>
  );
};

export default RateEmployeesPage;
