import { ApiUseCase } from "../../base/ApiUseCase";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export class DeleteCustomer extends ApiUseCase<string, void> {
    async execute(id: string): Promise<void> {
        const response = await this.request<ApiResponse<void>>(
            `/customers/${id}`,
            HttpMethod.DELETE
        );
        return response.data;
    }

    async executeMock(id: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    }
}
