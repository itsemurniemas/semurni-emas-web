"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useUpdateEmployeeViewModel,
  EditEmployeeFormData,
} from "./useUpdateEmployeeViewModel";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import Link from "next/link";
import { useAuth, isSuperAdminRole } from "@/context/AuthContext";
import { STD_ROLE_OPTIONS } from "@repo/core/entities/role/RoleEnum";

const EditEmployeePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const isSuperAdmin = isSuperAdminRole(user?.role);
  const employeeId = params.id as string;
  const {
    state,
    initialData,
    isSubmitting,
    setIsSubmitting,
    submitEmployeeData,
  } = useUpdateEmployeeViewModel(employeeId);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [formData, setFormData] = useState<EditEmployeeFormData>({
    name: "",
    telp: "",
    joinDate: "",
    image: "",
    positionName: "",
    roleName: "",
    password: "",
    shortAddress: "",
    ward: "",
    subdistrict: "",
    city: "",
    province: "",
    postalCode: "",
  });

  // Update form data when state changes
  useEffect(() => {
    if (state.type === "success" && state.data) {
      console.log("Setting formData with:", state.data);
      setFormData(state.data);
    }
  }, [state]);

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.telp.trim() !== "" &&
    formData.joinDate.trim() !== "" &&
    formData.roleName.trim() !== "" &&
    formData.shortAddress.trim() !== "" &&
    formData.ward.trim() !== "" &&
    formData.subdistrict.trim() !== "" &&
    formData.city.trim() !== "" &&
    formData.province.trim() !== "" &&
    formData.postalCode.trim() !== "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFilesSelected = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setProfileImage(file);

      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    } else {
      setProfileImage(null);
      // Keep the original image if user clears the dropzone
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitEmployeeData(formData);
      toast.success("Karyawan berhasil diperbarui");
      router.push(`/employee/detail/${employeeId}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal memperbarui karyawan",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle loading state
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

  // Handle error state
  if (state.type === "error") {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Karyawan" />
        <ComponentCard title="Edit Data Karyawan">
          <div className="flex items-center justify-center p-10 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-800">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 font-medium mb-4">
                Gagal memuat data karyawan
              </p>
              <p className="text-red-500 dark:text-red-300 text-sm mb-4">
                {state.message}
              </p>
              <Link href="/employee">
                <Button variant="outline">Kembali ke Daftar Karyawan</Button>
              </Link>
            </div>
          </div>
        </ComponentCard>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Karyawan" />
      <ComponentCard title="Edit Data Karyawan">
        <form autoComplete="off" className="space-y-8" onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
              Informasi Pribadi
            </h3>

            {/* Name */}
            <div>
              <Label htmlFor="name">Nama</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="e.g. Ahmad Fauzi"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="telp">Nomor Telepon</Label>
              <Input
                type="tel"
                id="telp"
                name="telp"
                placeholder="e.g. 081234567890"
                value={formData.telp}
                onChange={handleInputChange}
              />
            </div>

            {/* Join Date */}
            <div>
              <Label htmlFor="joinDate">Tanggal Bergabung</Label>
              <Input
                type="date"
                id="joinDate"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleInputChange}
              />
            </div>

            {/* Position Name */}
            <div>
              <Label htmlFor="positionName">Jabatan</Label>
              <Input
                type="text"
                id="positionName"
                name="positionName"
                placeholder="e.g. Sales Advisor"
                value={formData.positionName}
                onChange={handleInputChange}
              />
            </div>

            {/* Role Name and Password - Only for Super Admin */}
            {isSuperAdmin && (
              <>
                <div>
                  <Label htmlFor="roleName">Nama Role</Label>
                  <Select
                    options={STD_ROLE_OPTIONS}
                    value={formData.roleName}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, roleName: value }))
                    }
                    placeholder="Pilih role"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Biarkan kosong jika tidak ingin mengubah"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}
          </div>

          {/* Address Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
              Alamat
            </h3>

            {/* Short Address */}
            <div>
              <Label htmlFor="shortAddress">Alamat Jalan</Label>
              <Input
                type="text"
                id="shortAddress"
                name="shortAddress"
                placeholder="e.g. Jl. Kebon Jeruk No. 123"
                value={formData.shortAddress}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ward */}
              <div>
                <Label htmlFor="ward">Kelurahan</Label>
                <Input
                  type="text"
                  id="ward"
                  name="ward"
                  placeholder="e.g. Kebon Jeruk"
                  value={formData.ward}
                  onChange={handleInputChange}
                />
              </div>

              {/* Sub-district */}
              <div>
                <Label htmlFor="subdistrict">Kecamatan</Label>
                <Input
                  type="text"
                  id="subdistrict"
                  name="subdistrict"
                  placeholder="e.g. Kebon Jeruk"
                  value={formData.subdistrict}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* City */}
              <div>
                <Label htmlFor="city">Kota</Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="e.g. Jakarta Barat"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>

              {/* Province */}
              <div>
                <Label htmlFor="province">Provinsi</Label>
                <Input
                  type="text"
                  id="province"
                  name="province"
                  placeholder="e.g. DKI Jakarta"
                  value={formData.province}
                  onChange={handleInputChange}
                />
              </div>

              {/* Postal Code */}
              <div>
                <Label htmlFor="postalCode">Kode Pos</Label>
                <Input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  placeholder="e.g. 11150"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
              Foto
            </h3>

            <DropzoneComponent
              title="Foto Profil Karyawan"
              maxFiles={1}
              accept={{
                "image/jpeg": [".jpg", ".jpeg"],
                "image/png": [".png"],
                "image/svg+xml": [".svg"],
              }}
              currentImage={formData.image}
              onClearCurrentImage={() => {
                setFormData((prev) => ({ ...prev, image: "" }));
              }}
              onFilesSelected={(files) => {
                handleImageFilesSelected(files);
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default EditEmployeePage;
