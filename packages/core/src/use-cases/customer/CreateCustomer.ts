import { ApiUseCase } from "../../base/ApiUseCase";
import { CustomerModel } from "../../entities/customer/CustomerModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface CreateCustomerRequest {
  name: string;
  telp: string;
  idCardNumber?: string;
  birthDate: number;
  city: string;
  province: string;
  subdistrict: string;
  ward: string;
  shortAddress: string;
  fullAddress: string;
  postalCode: string;
  isMember?: boolean;
  image?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  email?: string | null;
}

export class CreateCustomer extends ApiUseCase<
  CreateCustomerRequest,
  CustomerModel
> {
  async execute(request: CreateCustomerRequest): Promise<CustomerModel> {
    const response = await this.request<ApiResponse<CustomerModel>>(
      `/customers`,
      HttpMethod.POST,
      request,
    );
    return response.data;
  }

  async executeMock(request: CreateCustomerRequest): Promise<CustomerModel> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "mock-id",
          name: request.name,
          telp: request.telp,
          idCardNumber: request.idCardNumber || "",
          birthDate: request.birthDate,
          city: request.city,
          province: request.province,
          subdistrict: request.subdistrict,
          ward: request.ward,
          postalCode: "",
          fullAddress: request.fullAddress,
          shortAddress: request.shortAddress,
          image: "request.image || null",
          instagram: request.instagram || null,
          tiktok: request.tiktok || null,
          email: request.email || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
        });
      }, 500);
    });
  }
}
