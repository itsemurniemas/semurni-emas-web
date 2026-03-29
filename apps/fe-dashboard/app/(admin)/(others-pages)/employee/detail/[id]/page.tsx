"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { LoaderCircle, Building2, Edit, Trash2 } from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";
import { Phone, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { useEmployeeDetailViewModel } from "./useEmployeeDetailViewModel";
import { useParams, useRouter } from "next/navigation";
import { getBase64ImageUrl } from "@repo/core/extension/number";
import { DeleteEmployee } from "@repo/core";
import { useAuth, isSuperAdminRole } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";
import React, { useState } from "react";
import { AlertDialogDrawer } from "@/components/dialogDrawer";
import { toast } from "react-toastify";
import Button from "@/components/ui/button/Button";
import { RatingsSection } from "@/components/employee/RatingsSection";

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const isSuperAdmin = isSuperAdminRole(user?.role);
  const employeeId = params.id as string;
  const { state } = useEmployeeDetailViewModel(employeeId);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (state.type !== "success") return;

    setIsDeleting(true);
    try {
      const useCase = new DeleteEmployee(
        getApiConfigForRole(user?.role || null),
      );
      await useCase.execute(state.data.id);
      toast.success("Karyawan berhasil dihapus");
      router.push("/employee");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus karyawan",
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
          <p className="text-muted-foreground">Memuat data karyawan...</p>
        </div>
      </div>
    );
  }

  if (state.type === "error") {
    return (
      <div>
        <PageBreadcrumb pageTitle="Employee Not Found" />
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Gagal memuat data karyawan
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {state.message}
          </p>
          <Link
            href="/employee"
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
        <PageBreadcrumb pageTitle="Employee Not Found" />
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Data karyawan tidak tersedia
          </h2>
          <Link
            href="/employee"
            className="mt-4 inline-block text-brand-500 hover:underline"
          >
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  const employee = state.data;

  return (
    <div>
      <PageBreadcrumb pageTitle="Detail Karyawan" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:grid-rows-1">
        <div className="xl:col-span-1">
          <ComponentCard
            title="Profil Karyawan"
            className="h-full flex flex-col"
          >
            <div className="flex flex-col items-center p-4 justify-center flex-1">
              <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-500 dark:text-gray-400 mb-4 overflow-hidden">
                {employee.image ? (
                  <img
                    src={getBase64ImageUrl(employee.image)}
                    alt={employee.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(employee.name)
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {employee.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {employee.positionName}
              </p>
              {isSuperAdmin && employee.user && (
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {employee.user.username}
                  </p>
                </div>
              )}
            </div>
          </ComponentCard>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <ComponentCard title="Informasi Kontak & Pribadi">
            <div className="space-y-4 p-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Cabang
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {employee.branch?.name || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                  <Phone className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nomor Telepon
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {employee.telp}
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
                    {employee.fullAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tanggal Bergabung
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {new Date(employee.joinDate).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      <RatingsSection
        avgRating={employee.avgRating}
        ratings={employee.ratings}
      />

      {isSuperAdmin && (
        <div className="flex justify-end gap-4 mt-6">
          <Link href={`/employee/edit/${employeeId}`}>
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
      )}

      <AlertDialogDrawer
        open={openDeleteAlert}
        setOpen={setOpenDeleteAlert}
        type="warning"
        title="Hapus Karyawan"
        description={`Apakah Anda yakin ingin menghapus karyawan ${state.type === "success" ? state.data?.name : ""}? Tindakan ini tidak dapat dibatalkan.`}
        buttonText="Hapus"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
