import { ApiUseCase } from "../../base/ApiUseCase";
import { CustomerModel } from "../../entities/customer/CustomerModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export class GetCustomerById extends ApiUseCase<string, CustomerModel> {
    async execute(id: string): Promise<CustomerModel> {
        const response = await this.request<ApiResponse<CustomerModel>>(
            `/customers/${id}`,
            HttpMethod.GET
        );
        return response.data;
    }

    async executeMock(id: string): Promise<CustomerModel> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: id,
                    name: "Mock Customer",
                    telp: "081234567890",
                    birthDate: 631929600000,
                    city: "Jakarta",
                    province: "DKI Jakarta",
                    subdistrict: "Menteng",
                    ward: "Menteng",
                    postalCode: "10310",
                    fullAddress: "Jl. Sudirman No. 123, Menteng, Jakarta Pusat",
                    shortAddress: "Jl. Sudirman No. 123",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    deletedAt: null,
                });
            }, 500);
        });
    }
}
