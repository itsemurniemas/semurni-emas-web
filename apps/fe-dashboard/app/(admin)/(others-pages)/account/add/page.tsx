"use client";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useAddUserViewModel,
  AddUserFormData,
} from "../add/useAddUserViewModel";
import { LoaderCircle } from "lucide-react";

const AddAccountPage: React.FC = () => {
  const router = useRouter();
  const { handleSubmit, isLoading, loadingOptions, roles, branches } =
    useAddUserViewModel();

  const [formData, setFormData] = useState<AddUserFormData>({
    username: "",
    password: "",
    roleId: "",
    branchId: "",
  });

  const isFormValid =
    formData.username.trim() !== "" && formData.password.trim() !== "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    const success = await handleSubmit(formData);
    if (success) {
      toast.success("Akun berhasil ditambahkan");
      router.push("/account");
    } else {
      toast.error("Gagal menambahkan akun");
    }
  };

  if (loadingOptions) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Tambah Akun" />
        <ComponentCard title="Tambah Akun Baru">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Memuat data...</p>
            </div>
          </div>
        </ComponentCard>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Akun" />
      <ComponentCard title="Tambah Akun Baru">
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
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Masukkan password"
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
            <Button type="submit" disabled={!isFormValid || isLoading}>
              {isLoading ? "Menyimpan..." : "Tambah Akun"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default AddAccountPage;
