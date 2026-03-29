import { ApiUseCase } from "../../base/ApiUseCase";
import { AuthUser, AuthRole, LoginResponseData } from "../../entities/auth/AuthModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface LoginRequest {
    username: string;
    role?: any; // Role and password for real API
    password?: string;
}

export class Login extends ApiUseCase<LoginRequest, LoginResponseData> {
    async execute(request: LoginRequest): Promise<LoginResponseData> {
        if (!request) {
            throw new Error("Login request is required");
        }

        const response = await this.request<ApiResponse<LoginResponseData>>("/auth/login", HttpMethod.POST, request);
        return response.data;
    }
}
