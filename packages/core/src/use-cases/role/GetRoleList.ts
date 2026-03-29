import { ApiUseCase } from "../../base/ApiUseCase";
import { RoleModel } from "../../entities/role/RoleModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export class GetRoleList extends ApiUseCase<void, RoleModel[]> {
    async execute(): Promise<RoleModel[]> {
        const response = await this.request<ApiResponse<RoleModel[]>>(
            "/roles",
            HttpMethod.GET
        );
        return response.data;
    }

    async executeMock(): Promise<RoleModel[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: "84011e14-e374-4fb0-8e81-19c4bda13e8e",
                        name: "SUPER_ADMIN",
                        createdAt: "2026-01-17T20:02:44.527Z",
                        updatedAt: "2026-01-17T20:02:44.527Z",
                        deletedAt: null,
                    },
                    {
                        id: "4931d7f2-a4e4-4ecf-a19f-47dcd7fbbb39",
                        name: "ADMIN",
                        createdAt: "2026-01-17T20:02:44.560Z",
                        updatedAt: "2026-01-17T20:02:44.560Z",
                        deletedAt: null,
                    },
                    {
                        id: "bb0b0c18-1491-49e9-8249-b80b839cfe4f",
                        name: "CASHIER",
                        createdAt: "2026-01-17T20:02:44.563Z",
                        updatedAt: "2026-01-17T20:02:44.563Z",
                        deletedAt: null,
                    },
                ]);
            }, 500);
        });
    }
}
