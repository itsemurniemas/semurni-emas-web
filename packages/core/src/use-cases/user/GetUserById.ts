import { ApiUseCase } from "../../base/ApiUseCase";
import { UserModel } from "../../entities/user/UserModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export class GetUserById extends ApiUseCase<string, UserModel> {
  async execute(id: string): Promise<UserModel> {
    const response = await this.request<ApiResponse<UserModel>>(
      `/auth/users/${id}`,
      HttpMethod.GET,
    );
    return response.data;
  }

  async executeMock(id: string): Promise<UserModel> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: id,
          username: "mock_user",
          password: "",
          roleId: "bb0b0c18-1491-49e9-8249-b80b839cfe4f",
          branchId: "baf46035-6171-479f-ab69-e4d9b5f441b9",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
        });
      }, 500);
    });
  }
}
