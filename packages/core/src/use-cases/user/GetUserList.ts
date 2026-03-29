import { ApiUseCase } from "../../base/ApiUseCase";
import { UserModel } from "../../entities/user/UserModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export class GetUserList extends ApiUseCase<void, UserModel[]> {
    async execute(): Promise<UserModel[]> {
        const response = await this.request<ApiResponse<UserModel[]>>(
            "/auth/users",
            HttpMethod.GET
        );
        return response.data;
    }

    async executeMock(): Promise<UserModel[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: "fd743b1d-11af-43f3-88f8-95484d3a109f",
                        username: "cashier_semurni_emas_kalibata",
                        password: "$2b$10$mtxE/pwH0hshTVlnmSjSOOSbOFu/DBGVSCHQX.DEPCs8CrhjSYPYu",
                        roleId: "bb0b0c18-1491-49e9-8249-b80b839cfe4f",
                        branchId: "baf46035-6171-479f-ab69-e4d9b5f441b9",
                        createdAt: "2026-01-17T20:02:44.578Z",
                        updatedAt: "2026-01-17T20:02:44.578Z",
                        deletedAt: null,
                        role: {
                            id: "bb0b0c18-1491-49e9-8249-b80b839cfe4f",
                            name: "CASHIER",
                            createdAt: "2026-01-17T20:02:44.563Z",
                            updatedAt: "2026-01-17T20:02:44.563Z",
                            deletedAt: null,
                        },
                        branch: {
                            id: "baf46035-6171-479f-ab69-e4d9b5f441b9",
                            name: "Semurni Emas Kalibata",
                            telp: "085117728895",
                            city: "Jakarta",
                            province: "DKI Jakarta",
                            ward: "Rawajati",
                            postalCode: "12750",
                            fullAddress: "Jl. Raya Kalibata No.1",
                            area: "Kalibata",
                            address: "Jl. Raya Kalibata No.1, Rawajati, Kec. Pancoran",
                            latitude: -6.2489387,
                            longitude: 106.7909413,
                            operatingHours: {
                                weekdays: "10:00 - 21:00",
                                saturday: "10:00 - 21:00",
                                sunday: "10:00 - 20:00",
                                holidays: "Tutup",
                            },
                            employeeCount: 10,
                            googleMapsUrl: "",
                            streetName: "Jl. Raya Kalibata No.1",
                            subDistrict: "Kec. Pancoran",
                            createdAt: "2026-01-17T20:02:44.569Z",
                            updatedAt: "2026-01-17T20:02:44.569Z",
                            deletedAt: null,
                        },
                    },
                    {
                        id: "40d30846-069e-4ff2-9931-cf22b625a98d",
                        username: "admin_semurni_emas_kalibata",
                        password: "$2b$10$mtxE/pwH0hshTVlnmSjSOOSbOFu/DBGVSCHQX.DEPCs8CrhjSYPYu",
                        roleId: "4931d7f2-a4e4-4ecf-a19f-47dcd7fbbb39",
                        branchId: "baf46035-6171-479f-ab69-e4d9b5f441b9",
                        createdAt: "2026-01-17T20:02:44.575Z",
                        updatedAt: "2026-01-17T20:02:44.575Z",
                        deletedAt: null,
                        role: {
                            id: "4931d7f2-a4e4-4ecf-a19f-47dcd7fbbb39",
                            name: "ADMIN",
                            createdAt: "2026-01-17T20:02:44.560Z",
                            updatedAt: "2026-01-17T20:02:44.560Z",
                            deletedAt: null,
                        },
                        branch: {
                            id: "baf46035-6171-479f-ab69-e4d9b5f441b9",
                            name: "Semurni Emas Kalibata",
                            telp: "085117728895",
                            city: "Jakarta",
                            province: "DKI Jakarta",
                            ward: "Rawajati",
                            postalCode: "12750",
                            fullAddress: "Jl. Raya Kalibata No.1",
                            area: "Kalibata",
                            address: "Jl. Raya Kalibata No.1, Rawajati, Kec. Pancoran",
                            latitude: -6.2489387,
                            longitude: 106.7909413,
                            operatingHours: {
                                weekdays: "10:00 - 21:00",
                                saturday: "10:00 - 21:00",
                                sunday: "10:00 - 20:00",
                                holidays: "Tutup",
                            },
                            employeeCount: 10,
                            googleMapsUrl: "",
                            streetName: "Jl. Raya Kalibata No.1",
                            subDistrict: "Kec. Pancoran",
                            createdAt: "2026-01-17T20:02:44.569Z",
                            updatedAt: "2026-01-17T20:02:44.569Z",
                            deletedAt: null,
                        },
                    },
                ]);
            }, 500);
        });
    }
}
