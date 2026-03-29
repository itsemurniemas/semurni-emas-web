import { ApiUseCase } from "../../base/ApiUseCase";
import { UserModel } from "../../entities/user/UserModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface UpdateUserRequest {
    username?: string;
    password?: string;
    roleId?: string;
    branchId?: string | null;
}

export class UpdateUser extends ApiUseCase<
    { id: string; request: UpdateUserRequest },
    UserModel
> {
    async execute(params: { id: string; request: UpdateUserRequest }): Promise<UserModel> {
        const response = await this.request<ApiResponse<UserModel>>(
            `/auth/users/${params.id}`,
            HttpMethod.PATCH,
            params.request
        );
        return response.data;
    }

    async executeMock(params: { id: string; request: UpdateUserRequest }): Promise<UserModel> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: params.id,
                    username: params.request.username || "mock-user",
                    password: params.request.password || "",
                    roleId: params.request.roleId || "",
                    branchId: params.request.branchId || "",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    deletedAt: null,
                });
            }, 500);
        });
    }
}
