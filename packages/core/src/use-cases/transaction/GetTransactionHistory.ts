import { ApiUseCase } from "../../base/ApiUseCase";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface TransactionLineItem {
  id: string;
  catalogId: string;
  quantity: number;
  subtotal: number;
  discount: number;
  finalSubtotal: number;
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

export interface TransactionBranch {
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

export interface Transaction {
  id: string;
  transactionNumber: string;
  transactionDate: number;
  transactionType: "SELL" | "BUY";
  status: "PENDING" | "REJECTED" | "DONE";
  paymentType: "CASH" | "QRIS" | "NON_CASH";
  totalWeightGram: number;
  taraWeightGram: number;
  netWeightGram: number;
  subtotal: number;
  isRatingGiven: boolean;
  note: string | null;
  receiptImage: string | null;
  customerId: string | null;
  branchId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  branch: TransactionBranch;
  lineItems?: TransactionLineItem[];
  payments?: PaymentRecord[];
}

export interface GetTransactionHistoryRequest {
  page?: number;
  limit?: number;
  transactionType?: "SELL" | "BUY";
  status?: "PENDING" | "REJECTED" | "DONE";
  branchId?: string;
}

export interface GetTransactionHistoryResponse {
  data: Transaction[];
  hasMore: boolean;
  nextPageUrl: string | null;
  total: number;
  totalPages: number;
  currentPage: number;
}

export class GetTransactionHistory extends ApiUseCase<
  GetTransactionHistoryRequest,
  GetTransactionHistoryResponse
> {
  async execute(
    request: GetTransactionHistoryRequest = {},
  ): Promise<GetTransactionHistoryResponse> {
    const params = {
      page: request?.page || 1,
      limit: request?.limit || 10,
      ...(request?.transactionType && {
        transactionType: request.transactionType,
      }),
      ...(request?.status && { status: request.status }),
      ...(request?.branchId && { branchId: request.branchId }),
    };

    const response = await this.request<
      ApiResponse<GetTransactionHistoryResponse>
    >(`/transactions`, HttpMethod.GET, params);
    return response.data;
  }

  async executeMock(
    request: GetTransactionHistoryRequest = {},
  ): Promise<GetTransactionHistoryResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: "mock-1",
              transactionNumber: "28012026SLYP5I",
              transactionDate: 1769615292,
              transactionType: "SELL",
              status: "DONE",
              paymentType: "QRIS",
              totalWeightGram: 402.5,
              taraWeightGram: 1.5,
              netWeightGram: 401,
              subtotal: 50298475,
              isRatingGiven: false,
              note: null,
              receiptImage: null,
              customerId: "c124601d-e26c-46c4-b39d-9cccbcc14a8b",
              branchId: "d49e5937-faed-4a62-97a4-ea3939183dfe",
              createdAt: "2026-01-28T08:48:12.074Z",
              updatedAt: "2026-01-28T08:48:12.074Z",
              deletedAt: null,
              branch: {
                id: "d49e5937-faed-4a62-97a4-ea3939183dfe",
                name: "Semurni Emas Radio Dalam",
                telp: "081917965041",
                city: "Jakarta",
                province: "DKI Jakarta",
                subdistrict: "Kec. Kby. Baru",
                ward: "Kramat Pela",
                postalCode: "12140",
                fullAddress:
                  "Jl. Gandaria 1 No.2, RT.2/RW.3, Kramat Pela, Kec. Kby. Baru, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12140",
                shortAddress: "Jl. Gandaria 1 No.2",
                area: "Radio Dalam",
                latitude: "-6.2562715",
                longitude: "106.8521776",
                createdAt: "2026-01-28T08:09:47.101Z",
                updatedAt: "2026-01-28T08:09:47.101Z",
                deletedAt: null,
              },
            },
          ],
          hasMore: false,
          nextPageUrl: null,
          total: 1,
          totalPages: 1,
          currentPage: 1,
        });
      }, 500);
    });
  }
}
