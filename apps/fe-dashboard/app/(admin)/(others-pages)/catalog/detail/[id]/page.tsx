"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  LoaderCircle,
  Edit,
  Trash2,
  Image as ImageIcon,
  Package,
  Weight,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";
import Link from "next/link";
import { useCatalogDetailViewModel } from "./useCatalogDetailViewModel";
import { useParams, useRouter } from "next/navigation";
import { DeleteCatalog, getApprovedPurposeLabel } from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";
import React, { useState } from "react";
import { AlertDialogDrawer } from "@/components/dialogDrawer";
import { toast } from "react-toastify";
import Button from "@/components/ui/button/Button";

const getCategoryLabel = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    EARRINGS: "Anting",
    RING: "Cincin",
    GOLD_BAR: "Gold Bar",
    BRACELET: "Gelang",
    NECKLACE: "Kalung",
    OTHER: "Lainnya",
  };
  return categoryMap[category] || category;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function CatalogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const catalogId = params.id as string;
  const { state } = useCatalogDetailViewModel(catalogId);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleDelete = async () => {
    if (state.type !== "success") return;

    setIsDeleting(true);
    try {
      const useCase = new DeleteCatalog(
        getApiConfigForRole(user?.role || null),
      );
      await useCase.execute({ id: state.data.id });
      toast.success("Katalog berhasil dihapus");
      router.push("/catalog");
    } catch (error) {
      console.error("Error deleting catalog:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus katalog",
      );
      setOpenDeleteAlert(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrevImage = () => {
    if (state.type === "success" && state.data.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? state.data.images.length - 1 : prev - 1,
      );
    }
  };

  const handleNextImage = () => {
    if (state.type === "success" && state.data.images) {
      setCurrentImageIndex((prev) =>
        prev === state.data.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  if (state.type === "loading" || state.type === "initiate") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data katalog...</p>
        </div>
      </div>
    );
  }

  if (state.type === "error") {
    return (
      <div>
        <PageBreadcrumb pageTitle="Katalog Tidak Ditemukan" />
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Gagal memuat data katalog
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {state.message}
          </p>
          <Link
            href="/catalog"
            className="mt-4 inline-block text-brand-500 hover:underline"
          >
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  if (state.type !== "success") {
    return (
      <div>
        <PageBreadcrumb pageTitle="Katalog Tidak Ditemukan" />
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Data katalog tidak tersedia
          </h2>
          <Link
            href="/catalog"
            className="mt-4 inline-block text-brand-500 hover:underline"
          >
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  const catalog = state.data;

  return (
    <div>
      <PageBreadcrumb pageTitle="Detail Katalog" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Image Section */}
        <div className="xl:col-span-1">
          <ComponentCard title="Foto Produk" className="h-full">
            {catalog.images && catalog.images.length > 0 ? (
              <div className="flex flex-col gap-4">
                {/* Main Image with Carousel Controls */}
                <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-700/50 rounded-lg overflow-hidden group">
                  <img
                    src={catalog.images[currentImageIndex].image || ""}
                    alt={`${catalog.displayName} ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Carousel Navigation Buttons */}
                  {catalog.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        aria-label="Next image"
                      >
                        <ChevronRight size={20} />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        {currentImageIndex + 1} / {catalog.images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Grid with Click to Select */}
                {catalog.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {catalog.images.map((image, index) => (
                      <button
                        key={image.id || index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative w-full h-24 bg-gray-100 dark:bg-gray-700/50 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? "border-brand-500 shadow-lg"
                            : "border-gray-200 dark:border-gray-600 hover:border-brand-300 dark:hover:border-brand-600"
                        }`}
                      >
                        <img
                          src={image.image || ""}
                          alt={`${catalog.displayName} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Tidak ada foto
                  </p>
                </div>
              </div>
            )}
          </ComponentCard>
        </div>

        {/* Main Info */}
        <div className="xl:col-span-2 space-y-6">
          {/* Product Name & Category */}
          <ComponentCard title="Informasi Produk">
            <div className="space-y-6 p-2">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Nama Katalog
                </p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {catalog.displayName}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Kategori
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {getCategoryLabel(catalog.category)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Status Tampilan
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        catalog.isDisplayed ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {catalog.isDisplayed ? "Ditampilkan" : "Disembunyikan"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Produk
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {catalog.product?.name || "-"}
                </p>
              </div>
            </div>
          </ComponentCard>

          {/* Weight & Specifications */}
          <ComponentCard title="Spesifikasi Berat">
            <div className="space-y-4 p-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
                    <Weight className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Berat Total
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {catalog.totalWeightGram} gram
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                    <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Kuantitas
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {catalog.quantity}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Berat Bersih
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {catalog.netWeightGram} gram
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Kualitas
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {catalog.quality || "-"}
                  </p>
                </div>
              </div>
            </div>
          </ComponentCard>

          {/* Branch & Status */}
          <ComponentCard title="Informasi Cabang & Status">
            <div className="space-y-4 p-2">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Cabang
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {catalog.branch?.name || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Tujuan
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {getApprovedPurposeLabel(catalog.approvedPurpose)}
                </p>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <Link href={`/catalog/edit/${catalogId}`}>
          <Button className="flex items-center gap-2">
            <Edit size={16} />
            Edit
          </Button>
        </Link>
        <Button
          variant="error"
          onClick={() => setOpenDeleteAlert(true)}
          className="flex items-center gap-2"
        >
          <Trash2 size={16} />
          Hapus
        </Button>
      </div>

      <AlertDialogDrawer
        open={openDeleteAlert}
        setOpen={setOpenDeleteAlert}
        type="warning"
        title="Hapus Katalog"
        description={`Apakah Anda yakin ingin menghapus katalog "${
          state.type === "success" ? state.data?.displayName : ""
        }"? Tindakan ini tidak dapat dibatalkan.`}
        buttonText="Hapus"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
