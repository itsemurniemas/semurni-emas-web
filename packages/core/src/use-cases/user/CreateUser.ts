import { ApiUseCase } from "../../base/ApiUseCase";
import { UserModel } from "../../entities/user/UserModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface CreateUserRequest {
  username: string;
  password: string;
  roleId?: string;
  branchId?: string | null;
}

export class CreateUser extends ApiUseCase<CreateUserRequest, UserModel> {
  async execute(request: CreateUserRequest): Promise<UserModel> {
    const response = await this.request<ApiResponse<UserModel>>(
      "/auth/users",
      HttpMethod.POST,
      request,
    );
    return response.data;
  }

  async executeMock(request: CreateUserRequest): Promise<UserModel> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "mock-user-id",
          username: request.username,
          password: request.password,
          roleId: request.roleId || "",
          branchId: request.branchId || "default-branch-id",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
        });
      }, 500);
    });
  }
}
