"use client";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddBranchViewModel } from "../useAddBranchViewModel";
import { prepareBranchRequest } from "@repo/core";
import type { BranchFormData } from "@repo/core/use-cases/branch/BranchRequestModel";
import { toast } from "react-toastify";

const AddBranchPage: React.FC = () => {
  const router = useRouter();
  const { isSubmitting, setIsSubmitting, submitBranchData } =
    useAddBranchViewModel();

  const [formData, setFormData] = useState<BranchFormData>({
    name: "",
    telp: "",
    city: "",
    province: "",
    subdistrict: "",
    ward: "",
    postalCode: "",
    shortAddress: "",
    area: "",
    latitude: "",
    longitude: "",
    weekdays: null,
    saturday: null,
    sunday: null,
    holidays: null,
  });

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.telp.trim() !== "" &&
    formData.city.trim() !== "" &&
    formData.province.trim() !== "" &&
    formData.subdistrict.trim() !== "" &&
    formData.ward.trim() !== "" &&
    formData.postalCode.trim() !== "" &&
    formData.shortAddress.trim() !== "" &&
    formData.area.trim() !== "" &&
    formData.latitude.trim() !== "" &&
    formData.longitude.trim() !== "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: BranchFormData) => ({ ...prev, [name]: value }));
  };

  const handleOperatingHoursChange = (
    day: "weekdays" | "saturday" | "sunday" | "holidays",
    value: string,
  ) => {
    setFormData((prev: BranchFormData) => ({ ...prev, [day]: value || null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    const success = await submitBranchData(formData);
    setIsSubmitting(false);

    if (success) {
      toast.success("Cabang berhasil ditambahkan");
      router.push("/branch");
    } else {
      toast.error("Gagal menambahkan cabang");
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Cabang" />
      <ComponentCard title="Tambah Cabang Baru">
        <form autoComplete="off" className="space-y-8" onSubmit={handleSubmit}>
          {/* Address Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
              Alamat Cabang
            </h3>

            {/* Branch Name */}
            <div>
              <Label htmlFor="name">Nama Cabang</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="e.g. Semurni Emas - Pusat"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Short Address */}
            <div>
              <Label htmlFor="shortAddress">Alamat Singkat</Label>
              <Input
                type="text"
                id="shortAddress"
                name="shortAddress"
                placeholder="e.g. Jl. Sudirman No. 12"
                value={formData.shortAddress}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ward (Kelurahan) */}
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

              {/* Sub-district (Kecamatan) */}
              <div>
                <Label htmlFor="subdistrict">Kecamatan</Label>
                <Input
                  type="text"
                  id="subdistrict"
                  name="subdistrict"
                  placeholder="Enter sub-district"
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
                  placeholder="Enter city"
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
                  placeholder="Enter province"
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
                  placeholder="12750"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Area */}
              <div>
                <Label htmlFor="area">Area</Label>
                <Input
                  type="text"
                  id="area"
                  name="area"
                  placeholder="e.g. Kalibata City"
                  value={formData.area}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
              Kontak
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="telp">Telepon</Label>
                <Input
                  type="text"
                  id="telp"
                  name="telp"
                  placeholder="0812xxxxxx"
                  value={formData.telp}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Operational Hours Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
              Jam Operasional
            </h3>
            <p className="text-sm text-muted-foreground">
              Format: HH:MM - HH:MM (e.g. 11:00 - 20:30) atau "Tutup" jika tutup
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Weekdays */}
              <div>
                <Label htmlFor="weekdays">Senin - Jumat</Label>
                <Input
                  type="text"
                  id="weekdays"
                  placeholder="11:00 - 20:30"
                  value={formData.weekdays || ""}
                  onChange={(e) =>
                    handleOperatingHoursChange("weekdays", e.target.value)
                  }
                />
              </div>

              {/* Saturday */}
              <div>
                <Label htmlFor="saturday">Sabtu</Label>
                <Input
                  type="text"
                  id="saturday"
                  placeholder="10:00 - 18:00"
                  value={formData.saturday || ""}
                  onChange={(e) =>
                    handleOperatingHoursChange("saturday", e.target.value)
                  }
                />
              </div>

              {/* Sunday */}
              <div>
                <Label htmlFor="sunday">Minggu</Label>
                <Input
                  type="text"
                  id="sunday"
                  placeholder="Tutup"
                  value={formData.sunday || ""}
                  onChange={(e) =>
                    handleOperatingHoursChange("sunday", e.target.value)
                  }
                />
              </div>

              {/* National Holiday */}
              <div>
                <Label htmlFor="holidays">Hari Libur Nasional</Label>
                <Input
                  type="text"
                  id="holidays"
                  placeholder="Tutup"
                  value={formData.holidays || ""}
                  onChange={(e) =>
                    handleOperatingHoursChange("holidays", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Geolocation Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
              Koordinat Lokasi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  type="text"
                  id="latitude"
                  name="latitude"
                  placeholder="e.g. -6.175392"
                  value={formData.latitude}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  type="text"
                  id="longitude"
                  name="longitude"
                  placeholder="e.g. 106.827153"
                  value={formData.longitude}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={() => router.back()}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? "Menambahkan..." : "Tambah Cabang"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default AddBranchPage;
