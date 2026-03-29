"use client";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import Button from "@/components/ui/button/Button";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateEmployeeViewModel,
  CreateEmployeeFormData,
} from "./useCreateEmployeeViewModel";
import { GetBranchList, STD_ROLE_OPTIONS } from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";

const AddEmployeePage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { isSubmitting, setIsSubmitting, submitEmployeeData } =
    useCreateEmployeeViewModel();
  const [branches, setBranches] = useState<
    Array<{ id: string; name: string; area: string }>
  >([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [formData, setFormData] = useState<CreateEmployeeFormData>({
    name: "",
    dateOfBirth: "",
    joinDate: "",
    telp: "",
    shortAddress: "",
    ward: "",
    subdistrict: "",
    city: "",
    province: "",
    postalCode: "",
    positionName: "",
    roleName: "",
    password: "",
    branchId: "",
    image: "",
  });

  // Fetch branches on mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const useCase = new GetBranchList(
          getApiConfigForRole(user?.role || null),
        );
        const data = await useCase.execute();
        // Convert branch IDs from number to string
        const convertedBranches = data.map((branch) => ({
          id: branch.id.toString(),
          name: branch.name,
          area: branch.area,
        }));
        setBranches(convertedBranches);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
        toast.error("Gagal memuat data cabang");
      } finally {
        setLoadingBranches(false);
      }
    };

    if (user) {
      fetchBranches();
    }
  }, [user]);

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.dateOfBirth.trim() !== "" &&
    formData.joinDate.trim() !== "" &&
    formData.telp.trim() !== "" &&
    formData.shortAddress.trim() !== "" &&
    formData.ward.trim() !== "" &&
    formData.subdistrict.trim() !== "" &&
    formData.city.trim() !== "" &&
    formData.province.trim() !== "" &&
    formData.postalCode.trim() !== "" &&
    formData.positionName.trim() !== "" &&
    formData.roleName.trim() !== "" &&
    formData.password.trim() !== "" &&
    formData.branchId.trim() !== "";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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
      setFormData((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitEmployeeData(formData);
      toast.success("Karyawan berhasil ditambahkan");
      router.push("/employee");
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menambahkan karyawan",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingBranches) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data cabang...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Karyawan" />
      <ComponentCard title="Tambah Karyawan Baru">
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

            {/* Date of Birth */}
            <div>
              <Label htmlFor="dateOfBirth">Tanggal Lahir</Label>
              <Input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
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

            {/* Role */}
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

            {/* Password */}
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

          {/* Branch Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
              Penempatan
            </h3>

            <div>
              <Label htmlFor="branchId">Pilih Cabang</Label>
              <Select
                options={branches.map((branch) => ({
                  value: branch.id,
                  label: branch.area,
                }))}
                placeholder="-- Pilih Cabang --"
                defaultValue={formData.branchId}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, branchId: value }))
                }
              />
            </div>
          </div>

          {/* Photo Section */}
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
              {isSubmitting ? "Menyimpan..." : "Simpan Karyawan"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default AddEmployeePage;
