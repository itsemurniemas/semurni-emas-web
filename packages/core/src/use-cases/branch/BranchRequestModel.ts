export interface BranchFormData {
  name: string;
  telp: string;
  city: string;
  province: string;
  subdistrict: string;
  ward: string;
  postalCode: string;
  shortAddress: string;
  fullAddress?: string;
  area: string;
  latitude: string;
  longitude: string;
  weekdays?: string | null;
  saturday?: string | null;
  sunday?: string | null;
  holidays?: string | null;
}

export interface CreateBranchRequest {
  name: string;
  telp: string;
  city: string;
  province: string;
  subdistrict: string;
  ward: string;
  postalCode: string;
  shortAddress: string;
  fullAddress: string;
  area: string;
  latitude: string;
  longitude: string;
  weekdays?: string;
  saturday?: string;
  sunday?: string;
  holidays?: string;
}

export interface UpdateBranchRequest extends CreateBranchRequest {
  // Same as CreateBranchRequest, but can be extended if needed
}

export const convertEmptyToTutup = (
  value: string | null | undefined,
): string => {
  return !value || value.trim() === "" ? "Tutup" : value;
};

export const prepareBranchRequest = (
  formData: BranchFormData,
): CreateBranchRequest => {
  // Construct fullAddress from shortAddress and other address components
  const fullAddress =
    formData.fullAddress ||
    [
      formData.shortAddress,
      formData.subdistrict,
      formData.city,
      formData.province,
      formData.postalCode,
    ]
      .filter(Boolean)
      .join(", ");

  return {
    name: formData.name,
    telp: formData.telp,
    city: formData.city,
    province: formData.province,
    subdistrict: formData.subdistrict,
    ward: formData.ward,
    postalCode: formData.postalCode,
    shortAddress: formData.shortAddress,
    fullAddress: fullAddress,
    area: formData.area,
    latitude: formData.latitude,
    longitude: formData.longitude,
    weekdays: convertEmptyToTutup(formData.weekdays),
    saturday: convertEmptyToTutup(formData.saturday),
    sunday: convertEmptyToTutup(formData.sunday),
    holidays: convertEmptyToTutup(formData.holidays),
  };
};
