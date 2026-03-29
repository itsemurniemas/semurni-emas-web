import { ApiUseCase } from "../../base/ApiUseCase";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export class DeleteUser extends ApiUseCase<string, void> {
    async execute(id: string): Promise<void> {
        await this.request<ApiResponse<void>>(`/auth/users/${id}`, HttpMethod.DELETE);
    }

    async executeMock(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    }
}
