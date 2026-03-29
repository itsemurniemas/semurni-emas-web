"use client";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import React, { useState, useEffect } from "react";
import { useUpdateCustomerViewModel } from "./useUpdateCustomerViewModel";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";

const EditCustomerPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;
  const { handleSubmit, isLoading, isFetching, error, initialData } =
    useUpdateCustomerViewModel(customerId);

  const [formData, setFormData] = useState<{
    fullname: string;
    phone: string;
    idCardNumber: string;
    birthDate: string;
    streetName: string;
    subDistrict: string;
    ward: string;
    city: string;
    province: string;
    postalCode: string;
    isMember: boolean;
    image: string | null;
    instagram: string | null;
    tiktok: string | null;
    email: string | null;
  }>({
    fullname: "",
    phone: "",
    idCardNumber: "",
    birthDate: "",
    streetName: "",
    subDistrict: "",
    ward: "",
    city: "",
    province: "",
    postalCode: "",
    isMember: false,
    image: null,
    instagram: null,
    tiktok: null,
    email: null,
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [phoneError, setPhoneError] = useState("");

  // Pre-fill form when initial data loads
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        birthDate: initialData.birthDate || "",
        idCardNumber: initialData.idCardNumber || "",
        isMember: initialData.isMember ?? false,
        image: initialData.image ?? null,
        instagram: initialData.instagram ?? null,
        tiktok: initialData.tiktok ?? null,
        email: initialData.email ?? null,
      });
    }
  }, [initialData]);

  // Validation Logic
  const validatePhone = (number: string) => {
    const phoneRegex = /^(^\+62|62|08)[0-9]{7,12}$/;
    if (!number) return "";
    if (!phoneRegex.test(number)) {
      return "Format nomor ponsel tidak valid (min. 10 digit angka)";
    }
    return "";
  };

  const isFormValid =
    formData.fullname.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.streetName.trim() !== "" &&
    formData.subDistrict.trim() !== "" &&
    formData.ward.trim() !== "" &&
    formData.city.trim() !== "" &&
    formData.province.trim() !== "" &&
    formData.postalCode.trim() !== "" &&
    phoneError === "" &&
    formData.phone.length >= 10;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;

    if (name === "phone") {
      const cleanedValue = value.replace(/[^0-9+]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
      setPhoneError(validatePhone(cleanedValue));
    } else if (name === "isMember") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isLoading) {
      const success = await handleSubmit(formData);
      if (success) {
        toast.success("Pelanggan berhasil diperbarui");
        router.push(`/customer/detail/${customerId}`);
      } else {
        toast.error(error || "Gagal memperbarui pelanggan");
      }
    }
  };

  if (isFetching) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Pelanggan" />
        <ComponentCard title="Edit Pelanggan">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Memuat data pelanggan...</p>
          </div>
        </ComponentCard>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Pelanggan" />
      <ComponentCard title="Edit Data Pelanggan">
        <form autoComplete="off" className="space-y-6" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="fullname">Nama Lengkap</Label>
            <Input
              type="text"
              id="fullname"
              name="fullname"
              placeholder="Masukkan nama lengkap"
              value={formData.fullname}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="phone">Nomor Ponsel</Label>
            <Input
              type="text"
              id="phone"
              name="phone"
              placeholder="Contoh: 08123456789"
              value={formData.phone}
              onChange={handleInputChange}
              className={phoneError ? "border-red-500 focus:ring-red-500" : ""}
            />
            {phoneError && (
              <p className="mt-1 text-sm text-red-500">{phoneError}</p>
            )}
          </div>

          <div>
            <Label htmlFor="birthDate">Tanggal Lahir</Label>
            <Input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="streetName">Jalan</Label>
            <Input
              type="text"
              id="streetName"
              name="streetName"
              placeholder="Masukkan alamat jalan"
              value={formData.streetName}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="subDistrict">Kecamatan</Label>
              <Input
                type="text"
                id="subDistrict"
                name="subDistrict"
                placeholder="Masukkan kecamatan"
                value={formData.subDistrict}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="ward">Kelurahan</Label>
              <Input
                type="text"
                id="ward"
                name="ward"
                placeholder="Masukkan kelurahan"
                value={formData.ward}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="city">Kota</Label>
              <Input
                type="text"
                id="city"
                name="city"
                placeholder="Masukkan kota"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="province">Provinsi</Label>
              <Input
                type="text"
                id="province"
                name="province"
                placeholder="Masukkan provinsi"
                value={formData.province}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="postalCode">Kode Pos</Label>
              <Input
                type="text"
                id="postalCode"
                name="postalCode"
                placeholder="12345"
                value={formData.postalCode}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Is Member Checkbox */}
          <div className="flex items-center gap-3">
            <input
              id="isMember"
              name="isMember"
              type="checkbox"
              checked={formData.isMember}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
            />
            <Label htmlFor="isMember" className="mb-0 cursor-pointer">
              Member
            </Label>
          </div>

          {/* Social Media & Email Fields (Optional) */}
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Media Sosial & Email (Opsional)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  type="text"
                  id="instagram"
                  name="instagram"
                  placeholder="@username"
                  value={formData.instagram || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="tiktok">TikTok</Label>
                <Input
                  type="text"
                  id="tiktok"
                  name="tiktok"
                  placeholder="@username"
                  value={formData.tiktok || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="email@example.com"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* KTP/Identity Proof Image Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
              Foto KTP / Bukti Identitas
            </h3>

            <div>
              <Label htmlFor="idCardNumber">Nomor Kartu Identitas</Label>
              <Input
                type="text"
                id="idCardNumber"
                name="idCardNumber"
                placeholder="Masukkan nomor KTM/SIM/Paspor"
                value={formData.idCardNumber}
                onChange={handleInputChange}
              />
            </div>

            <DropzoneComponent
              title="Upload Foto KTP / Bukti Identitas"
              description="PNG, JPG atau SVG (Opsional)"
              maxFiles={1}
              accept={{
                "image/jpeg": [".jpg", ".jpeg"],
                "image/png": [".png"],
                "image/svg+xml": [".svg"],
              }}
              currentImage={formData.image || undefined}
              onClearCurrentImage={() => {
                setFormData((prev) => ({ ...prev, image: null }));
              }}
              onFilesSelected={(files) => {
                handleImageFilesSelected(files);
              }}
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
              {isLoading ? "Menyimpan..." : "Perbarui Pelanggan"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default EditCustomerPage;
