"use client";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEditUserViewModel } from "./useEditUserViewModel";
import { LoaderCircle, Trash2 } from "lucide-react";
import { DeleteUser } from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";
import { AlertDialogDrawer } from "@/components/dialogDrawer";

export interface AddUserFormData {
  username: string;
  password: string;
  roleId: string;
  branchId: string;
}

const EditAccountPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const userId = params.id as string;
  const { handleSubmit, isLoading, isFetching, error, initialData } =
    useEditUserViewModel(userId);

  const [formData, setFormData] = useState<AddUserFormData>({
    username: "",
    password: "",
    roleId: "",
    branchId: "",
  });

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pre-fill form when initial data loads
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const isFormValid = formData.username.trim() !== "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: AddUserFormData) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    const success = await handleSubmit(formData);
    if (success) {
      toast.success("Akun berhasil diperbarui");
      router.push("/account");
    } else {
      toast.error(error || "Gagal memperbarui akun");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const useCase = new DeleteUser(getApiConfigForRole(user?.role || null));
      await useCase.execute(userId);
      toast.success("Akun berhasil dihapus");
      router.push("/account");
    } catch (err) {
      console.error("Error deleting account:", err);
      toast.error(err instanceof Error ? err.message : "Gagal menghapus akun");
      setOpenDeleteAlert(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isFetching) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Akun" />
        <ComponentCard title="Edit Akun">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4">
              <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Memuat data akun...</p>
            </div>
          </div>
        </ComponentCard>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Akun" />
      <ComponentCard title="Edit Data Akun">
        <form autoComplete="off" className="space-y-6" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Masukkan username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="password">
              Password (Kosongkan jika tidak diubah)
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Masukkan password baru"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              variant="error"
              onClick={() => setOpenDeleteAlert(true)}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Trash2 size={16} />
              Hapus
            </Button>
            <Button type="submit" disabled={!isFormValid || isLoading}>
              {isLoading ? "Menyimpan..." : "Perbarui Akun"}
            </Button>
          </div>
        </form>
      </ComponentCard>

      <AlertDialogDrawer
        open={openDeleteAlert}
        setOpen={setOpenDeleteAlert}
        type="warning"
        title="Hapus Akun"
        description={`Apakah Anda yakin ingin menghapus akun ${initialData?.username || ""}? Tindakan ini tidak dapat dibatalkan.`}
        buttonText="Hapus"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default EditAccountPage;
