import { ApiUseCase } from "../../base/ApiUseCase";
import { EmployeeWithBranchModel } from "../../entities/employee/EmployeeModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface CreateEmployeeRequest {
  name: string;
  birthDate: number;
  joinDate: number;
  telp: string;
  city: string;
  province: string;
  subdistrict: string;
  ward: string;
  postalCode: string;
  fullAddress: string;
  shortAddress: string;
  branchId: string;
  image?: string;
  positionName: string;
  roleName: string;
  password: string;
}

export class CreateEmployee extends ApiUseCase<
  CreateEmployeeRequest,
  EmployeeWithBranchModel
> {
  async execute(
    request: CreateEmployeeRequest,
  ): Promise<EmployeeWithBranchModel> {
    const response = await this.request<ApiResponse<EmployeeWithBranchModel>>(
      `/employees`,
      HttpMethod.POST,
      request,
    );
    return response.data;
  }

  async executeMock(
    request: CreateEmployeeRequest,
  ): Promise<EmployeeWithBranchModel> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "mock-id",
          name: request.name,
          birthDate: request.birthDate,
          telp: request.telp,
          city: request.city,
          province: request.province,
          subdistrict: request.subdistrict,
          ward: request.ward,
          postalCode: request.postalCode,
          fullAddress: request.fullAddress,
          shortAddress: request.shortAddress,
          branchId: request.branchId,
          branch: {
            id: request.branchId,
            name: "Mock Branch",
            area: "Mock Area",
            city: request.city,
            province: request.province,
            subdistrict: request.subdistrict,
            fullAddress: request.fullAddress,
            shortAddress: request.shortAddress,
            telp: "0000000000",
            latitude: "0",
            longitude: "0",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
          },
          joinDate: request.joinDate,
          image: request.image || "",
          positionName: request.positionName,
          user: {
            username: request.name.toLowerCase().replace(/\s+/g, ""),
            role: {
              id: "mock-role-id",
              name: request.roleName,
            },
          },
          password: request.password,
          ratings: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
        });
      }, 1000);
    });
  }
}
