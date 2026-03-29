export type PaymentMethod = "CASH" | "QRIS" | "NON_CASH";

export interface SplitPaymentItem {
  method: PaymentMethod;
  amount: number;
  bankAccountNumber?: string | null;
  bankName?: string | null;
}

export type PaymentSelection = {
  isSplit: true;
  payments: SplitPaymentItem[];
};

export interface TransactionItem {
  catalogId: string;
  quantity: number;
  finalPrice: number;
  realPrice: number;
  catalogName?: string;
  weight?: number;
}

export interface NewCustomer {
  name: string;
  telp?: string;
  idCardNumber?: string;
  birthDate?: number;
  city?: string;
  province?: string;
  subdistrict?: string;
  ward?: string;
  postalCode?: string;
  fullAddress?: string;
  shortAddress?: string;
  isMember?: boolean;
  instagram?: string | null;
  tiktok?: string | null;
  email?: string | null;
  image?: string | null;
}
