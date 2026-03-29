import { ApiUseCase } from "../../base/ApiUseCase";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";
import { CustomerModel } from "../../entities/customer/CustomerModel";

export interface CatalogImage {
  id: string;
  image: string;
  position: number;
  catalogId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Product {
  id: string;
  name: string;
}

export interface CatalogData {
  id: string;
  displayName: string;
  totalWeightGram: number;
  taraWeightGram: number;
  netWeightGram: number;
  taraPrice: number;
  quality: "LOW_QUALITY" | "HIGH_QUALITY";
  category: string;
  approvedPurpose: string;
  isDisplayed: boolean;
  quantity: number;
  percentage: number;
  approvedByUserId: string;
  productId: string;
  branchId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  images: CatalogImage[];
}

export interface TransactionLineItem {
  id: string;
  quantity: number;
  subtotal: number;
  discount: number;
  finalSubtotal: number;
  catalogId: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  catalog: CatalogData;
  statementLetters?: StatementLetter[];
}

export interface PaymentRecord {
  id: string;
  paymentType: "CASH" | "QRIS" | "NON_CASH";
  amount: number;
  bankAccountNumber: string | null;
  bankName: string | null;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface BranchData {
  id: string;
  name: string;
  telp: string;
  city: string;
  province: string;
  subdistrict: string;
  ward: string;
  postalCode: string;
  fullAddress: string;
  shortAddress: string;
  area: string;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface StatementLetter {
  id: string;
  letterImage: string;
  isHTML: boolean;
  transactionLineItemId: string;
}

export interface TransactionDetail {
  id: string;
  transactionNumber: string;
  transactionDate: number;
  transactionType: "SELL" | "BUY";
  status: "PENDING" | "REJECTED" | "DONE";
  totalWeightGram: number;
  taraWeightGram: number;
  netWeightGram: number;
  subtotal: number;
  isRatingGiven: boolean;
  note: string | null;
  receiptImage: string | null;
  customerId: string;
  branchId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  branch: BranchData;
  customer: CustomerModel;
  payments: PaymentRecord[];
  lineItems: TransactionLineItem[];
  employeeMapping: any[];
  lineItemCount: number;
}

export class GetTransactionById extends ApiUseCase<string, TransactionDetail> {
  async execute(id: string): Promise<TransactionDetail> {
    const response = await this.request<ApiResponse<TransactionDetail>>(
      `/transactions/${id}`,
      HttpMethod.GET,
    );
    return response.data;
  }

  async executeMock(id: string): Promise<TransactionDetail> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: id,
          transactionNumber: "11022026SZPLMJ",
          transactionDate: 1770760173,
          transactionType: "SELL",
          status: "DONE",
          totalWeightGram: 136.5,
          taraWeightGram: 0.5,
          netWeightGram: 136,
          subtotal: 257938912,
          isRatingGiven: false,
          note: null,
          receiptImage: null,
          customerId: "24250eb2-1e7c-4491-847d-c488f8ad7794",
          branchId: "b2939633-8280-422b-81db-352f64b2f657",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          branch: {
            id: "b2939633-8280-422b-81db-352f64b2f657",
            name: "Semurnimurninya",
            telp: "0212929292",
            city: "City",
            province: "POrf",
            subdistrict: "Camat",
            ward: "Lurah",
            postalCode: "12345",
            fullAddress: "Jalan jalan, Camat, City, POrf, 12345",
            shortAddress: "Jalan jalan",
            area: "Kal",
            latitude: "-6.209716912421476",
            longitude: "106.79723739691525",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
          },
          customer: {
            id: "24250eb2-1e7c-4491-847d-c488f8ad7794",
            name: "asdas",
            telp: "0899089089",
            birthDate: 7981286400,
            city: "werewsad",
            province: "dsfdffs",
            subdistrict: "werwer",
            ward: "ewqewq",
            postalCode: "123324",
            fullAddress: "qweqe, ewqewq, werwer, werewsad, dsfdffs, 123324",
            shortAddress: "qweqe",
            isMember: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
          },
          payments: [
            {
              id: "3d8924fb-4893-4d1e-83df-7fa9002f431f",
              paymentType: "CASH",
              amount: 257938912,
              bankAccountNumber: null,
              bankName: null,
              transactionId: id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              deletedAt: null,
            },
          ],
          lineItems: [
            {
              id: "li123",
              quantity: 1,
              subtotal: 257938912,
              discount: 0,
              finalSubtotal: 257938912,
              catalogId: "cat123",
              transactionId: id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              deletedAt: null,
              catalog: {
                id: "cat123",
                displayName: "Gold Bar 100g",
                totalWeightGram: 100,
                taraWeightGram: 0,
                netWeightGram: 100,
                taraPrice: 0,
                quality: "HIGH_QUALITY",
                category: "GOLD_BAR",
                approvedPurpose: "SALE",
                isDisplayed: true,
                quantity: 1,
                percentage: 100,
                approvedByUserId: "user123",
                productId: "prod123",
                branchId: "branch123",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                deletedAt: null,
                images: [],
              },
              statementLetters: [
                {
                  id: "sl123",
                  letterImage:
                    '<!doctype html><html lang="id"><head><title>Surat Pernyataan Kepemilikan Barang - Semurni Emas</title></head><body>...Complete HTML statement letter template with customer data...</body></html>',
                  isHTML: true,
                  transactionLineItemId: "li123",
                },
              ],
            },
          ],
          employeeMapping: [],
          lineItemCount: 1,
        });
      }, 500);
    });
  }
}
