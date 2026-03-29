import { ApiUseCase } from "../../base/ApiUseCase";
import { CustomerModel } from "../../entities/customer/CustomerModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface UpdateCustomerRequest {
  [key: string]: string | number | boolean | null | undefined;
}

export class UpdateCustomer extends ApiUseCase<
  { id: string; request: UpdateCustomerRequest },
  CustomerModel
> {
  async execute(params: {
    id: string;
    request: UpdateCustomerRequest;
  }): Promise<CustomerModel> {
    const response = await this.request<ApiResponse<CustomerModel>>(
      `/customers/${params.id}`,
      HttpMethod.PATCH,
      params.request,
    );
    return response.data;
  }

  async executeMock(params: {
    id: string;
    request: UpdateCustomerRequest;
  }): Promise<CustomerModel> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: params.id,
          name: (params.request.name as string) || "Mock Customer",
          telp: (params.request.telp as string) || "081234567890",
          birthDate: (params.request.birthDate as number) || 631929600000,
          city: (params.request.city as string) || "Jakarta",
          province: (params.request.province as string) || "DKI Jakarta",
          subdistrict: (params.request.subdistrict as string) || "Menteng",
          ward: (params.request.ward as string) || "Menteng",
          postalCode: (params.request.postalCode as string) || "10310",
          fullAddress:
            (params.request.fullAddress as string) ||
            "Jl. Sudirman No. 123, Menteng, Jakarta Pusat",
          shortAddress:
            (params.request.shortAddress as string) || "Jl. Sudirman No. 123",
          image: (params.request.image as string) || undefined,
          instagram: (params.request.instagram as string) || null,
          tiktok: (params.request.tiktok as string) || null,
          email: (params.request.email as string) || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
        });
      }, 500);
    });
  }
}
