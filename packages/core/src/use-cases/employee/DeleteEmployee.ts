import { ApiUseCase } from "../../base/ApiUseCase";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export class DeleteEmployee extends ApiUseCase<string, void> {
    async execute(id: string): Promise<void> {
        await this.request<ApiResponse<null>>(
            `/employees/${id}`,
            HttpMethod.DELETE
        );
    }

    async executeMock(id: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }
}
