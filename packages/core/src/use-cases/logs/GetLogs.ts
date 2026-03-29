import { ApiUseCase } from "../../base/ApiUseCase";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface LogLineItem {
  images: Array<{ image: string; position: number }>;
  category: string;
  quantity: number;
  subtotal: number;
  productId: string;
  taraPrice: number;
  displayName: string;
  finalSubtotal: number;
  netWeightGram: number;
  totalWeightGram: number;
  quality?: string;
}

export interface LogMetadata {
  note: string;
  branch: string;
  customer: {
    city: string;
    name: string;
    telp: string;
    ward: string;
    province: string;
    birthDate: number;
    postalCode: string;
    fullAddress: string;
    subdistrict: string;
    shortAddress: string;
  };
  employees: string[];
  lineItems: LogLineItem[];
  paymentType: string;
}

export interface LogUser {
  id: string;
  username: string;
  roleId: string;
  branchId: string | null;
  role: {
    id: string;
    name: string;
  };
  branch: null | any;
}

export interface ActivityLog {
  id: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "READ";
  entity: string;
  entityId: string;
  message: string;
  userId: string;
  metadata: LogMetadata;
  createdAt: string;
  user: LogUser;
}

export interface GetLogsRequest {
  page?: number;
  limit?: number;
}

export interface GetLogsResponse {
  data: ActivityLog[];
  hasMore: boolean;
  nextPageUrl: string | null;
  total: number;
  totalPages: number;
  currentPage: number;
}

export class GetLogs extends ApiUseCase<GetLogsRequest, GetLogsResponse> {
  async execute(request: GetLogsRequest = {}): Promise<GetLogsResponse> {
    const params = {
      page: request?.page || 1,
      limit: request?.limit || 10,
    };

    const response = await this.request<ApiResponse<GetLogsResponse>>(
      `/logs`,
      HttpMethod.GET,
      params,
    );
    return response.data;
  }

  async executeMock(request: GetLogsRequest = {}): Promise<GetLogsResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: "cml3u2paz0000ytuiq4ufmbqh",
              action: "CREATE",
              entity: "Transaction",
              entityId: "c2f79670-19b0-407a-a46c-0a36a99c5993",
              message: 'Created BUY transaction "01022026BQM8Z3"',
              userId: "74bd9d95-7d3e-494b-8330-09e5e8806ffa",
              metadata: {
                note: "",
                branch: "d5c904ed-2e8c-46d5-bd35-864b7c8858a4",
                customer: {
                  city: "",
                  name: "",
                  telp: "",
                  ward: "",
                  province: "",
                  birthDate: 0,
                  postalCode: "",
                  fullAddress: "",
                  subdistrict: "",
                  shortAddress: "",
                },
                employees: ["36c6fd03-bcea-4956-988b-f3f54d47a7cc"],
                lineItems: [
                  {
                    images: [
                      {
                        image:
                          "blob:http://localhost:3001/74ed649e-4311-4c75-867d-3d1926267d02",
                        position: 0,
                      },
                    ],
                    category: "RING",
                    quantity: 1,
                    subtotal: 3861338,
                    productId: "a0493443-fc40-4b4e-a26d-2e45e23e74b5",
                    taraPrice: 1930669,
                    displayName: "Cincin",
                    finalSubtotal: 6000000,
                    netWeightGram: 2,
                    totalWeightGram: 2,
                  },
                ],
                paymentType: "QRIS",
              },
              createdAt: "2026-02-01T14:25:52.283Z",
              user: {
                id: "74bd9d95-7d3e-494b-8330-09e5e8806ffa",
                username: "super_admin",
                roleId: "857ce9ff-6d9e-4f2e-83d3-ab0a24ad9b2f",
                branchId: null,
                role: {
                  id: "857ce9ff-6d9e-4f2e-83d3-ab0a24ad9b2f",
                  name: "SUPER_ADMIN",
                },
                branch: null,
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
