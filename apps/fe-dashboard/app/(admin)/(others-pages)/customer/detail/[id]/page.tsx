"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  LoaderCircle,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  Instagram,
  Mail,
  Music2,
  CreditCard,
} from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";
import Link from "next/link";
import { useCustomerDetailViewModel } from "./useCustomerDetailViewModel";
import { useParams, useRouter } from "next/navigation";
import { DeleteCustomer } from "@repo/core";
import { useAuth, isSuperAdminRole } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";
import { getBase64ImageUrl } from "@repo/core/extension/number";
import React, { useState } from "react";
import { AlertDialogDrawer } from "@/components/dialogDrawer";
import { toast } from "react-toastify";
import Button from "@/components/ui/button/Button";

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const isSuperAdmin = isSuperAdminRole(user?.role);
  const customerId = params.id as string;
  const { state } = useCustomerDetailViewModel(customerId);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (state.type !== "success") return;

    setIsDeleting(true);
    try {
      const useCase = new DeleteCustomer(
        getApiConfigForRole(user?.role || null),
      );
      await useCase.execute(state.data.id);
      toast.success("Pelanggan berhasil dihapus");
      router.push("/customer");
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus pelanggan",
      );
      setOpenDeleteAlert(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (state.type === "loading" || state.type === "initiate") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data pelanggan...</p>
        </div>
      </div>
    );
  }

  if (state.type === "error") {
    return (
      <div>
        <PageBreadcrumb pageTitle="Pelanggan Tidak Ditemukan" />
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Gagal memuat data pelanggan
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {state.message}
          </p>
          <Link
            href="/customer"
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
        <PageBreadcrumb pageTitle="Pelanggan Tidak Ditemukan" />
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Data pelanggan tidak tersedia
          </h2>
          <Link
            href="/customer"
            className="mt-4 inline-block text-brand-500 hover:underline"
          >
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  const customer = state.data;

  return (
    <div>
      <PageBreadcrumb pageTitle="Detail Pelanggan" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:grid-rows-1">
        <div className="xl:col-span-1">
          <ComponentCard title="Profil Pelanggan" className="h-full">
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-500 dark:text-gray-400 mb-4">
                {getInitials(customer.name)}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white text-center">
                {customer.name}
                {customer.isMember && <span className="ml-1">💎</span>}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                {customer.isMember ? "Member" : "Pelanggan"}
              </p>
            </div>
          </ComponentCard>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <ComponentCard title="Informasi Kontak & Pribadi">
            <div className="space-y-4 p-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                  <Phone className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nomor Telepon
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {customer.telp}
                  </p>
                </div>
              </div>

              {isSuperAdmin && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                    <CreditCard className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Nomor Kartu Identitas (KTP/SIM/Paspor)
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {customer.idCardNumber || "-"}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tanggal Lahir
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {customer.birthDate
                      ? new Date(customer.birthDate).toLocaleDateString("id-ID")
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Alamat
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {customer.fullAddress}
                  </p>
                </div>
              </div>
            </div>
          </ComponentCard>

          <ComponentCard title="Informasi Lokasi">
            <div className="space-y-4 p-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Provinsi
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {customer.province}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Kota
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {customer.city}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Kecamatan
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {customer.subdistrict}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Kelurahan
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {customer.ward}
                  </p>
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      <ComponentCard title="Media Sosial & Email" className="mt-6">
        <div className="space-y-4 p-2">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
              <Instagram size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Instagram
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {customer.instagram || "-"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
              <Music2 size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">TikTok</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {customer.tiktok || "-"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {customer.email || "-"}
              </p>
            </div>
          </div>
        </div>
      </ComponentCard>

      {isSuperAdmin && customer.image && (
        <ComponentCard title="Foto KTP / Bukti Identitas" className="mt-6">
          <div className="p-4">
            <img
              src={getBase64ImageUrl(customer.image)}
              alt="KTP / Identity Proof"
              className="w-full max-w-md mx-auto rounded-lg border border-gray-200 dark:border-gray-700"
            />
          </div>
        </ComponentCard>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <Link href={`/customer/edit/${customerId}`}>
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
        title="Hapus Pelanggan"
        description={`Apakah Anda yakin ingin menghapus pelanggan ${
          state.type === "success" ? state.data?.name : ""
        }? Tindakan ini tidak dapat dibatalkan.`}
        buttonText="Hapus"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
