export interface CustomerProps {
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
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export const MOCK_CUSTOMER_DATA: CustomerProps[] = [
  {
    id: "21647f8e-916b-46ad-a373-8e7e96b2448b",
    name: "Julia Rahmawati",
    telp: "081298765010",
    birthDate: 809049600000,
    city: "Jakarta",
    province: "DKI Jakarta",
    subdistrict: "Pasar Minggu",
    ward: "Ragunan",
    postalCode: "12550",
    fullAddress: "Jl. Ragunan No. 25, Pasar Minggu, Jakarta Selatan",
    shortAddress: "Jl. Ragunan No. 25",
    createdAt: "2026-01-17T20:02:44.607Z",
    updatedAt: "2026-01-17T20:02:44.607Z",
    deletedAt: null,
  },
];
