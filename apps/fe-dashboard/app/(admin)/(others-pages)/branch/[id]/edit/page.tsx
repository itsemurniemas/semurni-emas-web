"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { useBranchEditViewModel } from "./useBranchEditViewModel";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";
import Card from "@/components/common/Card";

const EditBranchPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const branchId = params.id as string;

  const { state, formData, updateFormData, submitBranchData } =
    useBranchEditViewModel(branchId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    formData &&
    formData.name?.trim() !== "" &&
    formData.telp?.trim() !== "" &&
    formData.city?.trim() !== "" &&
    formData.province?.trim() !== "" &&
    formData.subdistrict?.trim() !== "" &&
    formData.ward?.trim() !== "" &&
    formData.postalCode?.trim() !== "" &&
    formData.shortAddress?.trim() !== "" &&
    formData.area?.trim() !== "" &&
    formData.latitude?.trim() !== "" &&
    formData.longitude?.trim() !== "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value } as any);
  };

  const handleOperatingHoursChange = (
    day: "weekdays" | "saturday" | "sunday" | "holidays",
    value: string,
  ) => {
    updateFormData({ [day]: value || null } as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    const success = await submitBranchData(branchId);
    setIsSubmitting(false);

    if (success) {
      toast.success("Cabang berhasil diperbarui");
      router.push("/branch");
    } else {
      toast.error("Gagal memperbarui cabang");
    }
  };

  if (state.type === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data cabang...</p>
        </div>
      </div>
    );
  }

  if (state.type === "error") {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Cabang" />
        <ComponentCard title="Edit Cabang">
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 p-4 rounded">
            Gagal memuat data cabang: {state.message}
          </div>
        </ComponentCard>
      </div>
    );
  }

  if (!formData) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Cabang" />
        <ComponentCard title="Edit Cabang">
          <p className="text-muted-foreground">Data tidak tersedia</p>
        </ComponentCard>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Cabang" />
      <Card>
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
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Semurni Emas - Pusat"
              />
            </div>

            {/* Short Address */}
            <div>
              <Label htmlFor="shortAddress">Jalan</Label>
              <Input
                type="text"
                id="shortAddress"
                name="shortAddress"
                value={formData.shortAddress}
                onChange={handleInputChange}
                placeholder="e.g. Jl. Sudirman No. 12"
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
                  value={formData.ward}
                  onChange={handleInputChange}
                  placeholder="Masukkan kelurahan"
                />
              </div>

              {/* Sub-district (Kecamatan) */}
              <div>
                <Label htmlFor="subdistrict">Kecamatan</Label>
                <Input
                  type="text"
                  id="subdistrict"
                  name="subdistrict"
                  value={formData.subdistrict}
                  onChange={handleInputChange}
                  placeholder="Enter sub-district"
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
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              </div>

              {/* Province */}
              <div>
                <Label htmlFor="province">Provinsi</Label>
                <Input
                  type="text"
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  placeholder="Enter province"
                />
              </div>

              {/* Postal Code */}
              <div>
                <Label htmlFor="postalCode">Kode Pos</Label>
                <Input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="12750"
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
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="e.g. Kalibata City"
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
                  value={formData.telp}
                  onChange={handleInputChange}
                  placeholder="0812xxxxxx"
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
                  value={formData.latitude}
                  onChange={handleInputChange}
                  placeholder="e.g. -6.175392"
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  type="text"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="e.g. 106.827153"
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
              {isSubmitting ? "Memperbarui..." : "Perbarui Cabang"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditBranchPage;
