export interface CustomerModel {
  id: string;
  name: string;
  telp: string;
  idCardNumber?: string;
  birthDate: number;
  city: string;
  province: string;
  subdistrict: string;
  ward: string;
  postalCode: string;
  fullAddress: string;
  shortAddress: string;
  isMember?: boolean;
  image?: string;
  instagram?: string | null;
  tiktok?: string | null;
  email?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export const getCustomerDisplayName = (customer: CustomerModel): string => {
  const diamond = customer.isMember ? " 💎" : "";
  return customer.name + diamond;
};
