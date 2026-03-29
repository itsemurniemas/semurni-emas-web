"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import type { NewCustomer } from "./types";

interface CustomerCreateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCustomer: (customer: NewCustomer) => Promise<void> | void;
  isLoading?: boolean;
}

const CustomerCreateDrawer: React.FC<CustomerCreateDrawerProps> = ({
  isOpen,
  onClose,
  onCreateCustomer,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<NewCustomer>({
    name: "",
    telp: "",
    idCardNumber: "",
    birthDate: undefined,
    city: "",
    province: "",
    subdistrict: "",
    ward: "",
    postalCode: "",
    shortAddress: "",
    isMember: false,
    instagram: null,
    tiktok: null,
    email: null,
    image: null,
  });

  const handleFormChange = (
    field: keyof NewCustomer,
    value: string | boolean | number | undefined,
  ) => {
    // Guard phone number input
    if (field === "telp" && typeof value === "string") {
      // Only allow digits, +, -, and space
      value = value.replace(/[^\d+\-\s]/g, "");
      // Limit to 15 characters max
      if (value.length > 15) {
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageFilesSelected = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];

      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, image: null }));
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.telp?.trim() !== "" &&
      formData.idCardNumber?.trim() !== "" &&
      formData.shortAddress?.trim() !== "" &&
      formData.ward?.trim() !== "" &&
      formData.subdistrict?.trim() !== "" &&
      formData.city?.trim() !== "" &&
      formData.province?.trim() !== "" &&
      formData.postalCode?.trim() !== "" &&
      formData.image !== null
    );
  };

  const handleCreateCustomer = async () => {
    if (!formData.name.trim()) {
      toast.error("Nama pelanggan harus diisi");
      return;
    }

    // Validate phone number if provided
    if (formData.telp?.trim()) {
      const phoneDigits = formData.telp.replace(/\D/g, "");
      if (phoneDigits.length < 7) {
        toast.error("Nomor telepon harus minimal 7 digit");
        return;
      }
    }

    // Join address fields with commas
    const addressParts = [
      formData.shortAddress,
      formData.ward,
      formData.subdistrict,
      formData.city,
      formData.province,
      formData.postalCode,
    ].filter(Boolean);

    const customerData = {
      ...formData,
      fullAddress: addressParts.join(", "),
    };

    await onCreateCustomer(customerData);
    setFormData({
      name: "",
      telp: "",
      idCardNumber: "",
      birthDate: undefined,
      city: "",
      province: "",
      subdistrict: "",
      ward: "",
      postalCode: "",
      shortAddress: "",
      isMember: false,
      instagram: null,
      tiktok: null,
      email: null,
      image: null,
    });
  };

  const handleClose = () => {
    setFormData({
      name: "",
      telp: "",
      idCardNumber: "",
      birthDate: undefined,
      city: "",
      province: "",
      subdistrict: "",
      ward: "",
      postalCode: "",
      shortAddress: "",
      isMember: false,
      instagram: null,
      tiktok: null,
      email: null,
      image: null,
    });
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="flex flex-col h-[90vh] max-h-[90vh]">
        {/* Header */}
        <DrawerHeader className="border-b border-gray-200 dark:border-gray-700 flex items-center justify-between p-4">
          <div className="flex-1">
            <DrawerTitle>Buat Pelanggan Baru</DrawerTitle>
          </div>
          <DrawerClose asChild>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <X size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Name - Required */}
          <div>
            <Label htmlFor="name">Nama Pelanggan</Label>
            <Input
              id="name"
              type="text"
              placeholder="Masukkan nama pelanggan"
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              //   required
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="telp">Telepon</Label>
            <Input
              id="telp"
              type="tel"
              placeholder="Masukkan nomor telepon"
              value={formData.telp}
              onChange={(e) => handleFormChange("telp", e.target.value)}
            />
          </div>

          {/* ID Card Number */}
          <div>
            <Label htmlFor="idCardNumber">Nomor Kartu Identitas</Label>
            <Input
              id="idCardNumber"
              type="text"
              placeholder="Masukkan nomor KTM/SIM/Paspor"
              value={formData.idCardNumber}
              onChange={(e) => handleFormChange("idCardNumber", e.target.value)}
            />
          </div>

          {/* Birth Date */}
          <div>
            <Label htmlFor="birthDate">Tanggal Lahir</Label>
            <Input
              id="birthDate"
              type="date"
              value={
                formData.birthDate
                  ? new Date(formData.birthDate * 1000)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) => {
                if (e.target.value) {
                  const timestamp = Math.floor(
                    new Date(e.target.value).getTime() / 1000,
                  );
                  handleFormChange("birthDate", timestamp);
                } else {
                  handleFormChange("birthDate", undefined);
                }
              }}
            />
          </div>

          {/* Short Address (Nama Jalan) */}
          <div>
            <Label htmlFor="shortAddress">Nama Jalan</Label>
            <Input
              id="shortAddress"
              type="text"
              placeholder="Masukkan nama jalan"
              value={formData.shortAddress}
              onChange={(e) => handleFormChange("shortAddress", e.target.value)}
            />
          </div>

          {/* Ward + Subdistrict Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ward">Kelurahan</Label>
              <Input
                id="ward"
                type="text"
                placeholder="Masukkan kelurahan"
                value={formData.ward}
                onChange={(e) => handleFormChange("ward", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="subdistrict">Kecamatan</Label>
              <Input
                id="subdistrict"
                type="text"
                placeholder="Masukkan kecamatan"
                value={formData.subdistrict}
                onChange={(e) =>
                  handleFormChange("subdistrict", e.target.value)
                }
              />
            </div>
          </div>

          {/* City + Province + Postal Code Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">Kota/Kabupaten</Label>
              <Input
                id="city"
                type="text"
                placeholder="Masukkan kota"
                value={formData.city}
                onChange={(e) => handleFormChange("city", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="province">Provinsi</Label>
              <Input
                id="province"
                type="text"
                placeholder="Masukkan provinsi"
                value={formData.province}
                onChange={(e) => handleFormChange("province", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="postalCode">Kode Pos</Label>
              <Input
                id="postalCode"
                type="text"
                placeholder="Masukkan kode pos"
                value={formData.postalCode}
                onChange={(e) => handleFormChange("postalCode", e.target.value)}
              />
            </div>
          </div>

          {/* Is Member */}
          <div className="flex items-center gap-3">
            <input
              id="isMember"
              type="checkbox"
              checked={formData.isMember}
              onChange={(e) => handleFormChange("isMember", e.target.checked)}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  type="text"
                  id="instagram"
                  placeholder="@username"
                  value={formData.instagram || ""}
                  onChange={(e) =>
                    handleFormChange("instagram", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="tiktok">TikTok</Label>
                <Input
                  type="text"
                  id="tiktok"
                  placeholder="@username"
                  value={formData.tiktok || ""}
                  onChange={(e) => handleFormChange("tiktok", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="email@example.com"
                  value={formData.email || ""}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* KTP/Identity Proof Image Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Foto KTP / Bukti Identitas (Opsional)
            </h3>

            <DropzoneComponent
              title="Upload Foto KTP / Bukti Identitas"
              description="PNG, JPG atau SVG"
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
        </div>

        {/* Footer - Action Buttons */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3 justify-end bg-gray-50 dark:bg-gray-800">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 sm:flex-none"
          >
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateCustomer}
            disabled={isLoading || !isFormValid()}
            className="flex-1 sm:flex-none"
          >
            {isLoading ? "Membuat..." : "Buat Pelanggan"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CustomerCreateDrawer;
