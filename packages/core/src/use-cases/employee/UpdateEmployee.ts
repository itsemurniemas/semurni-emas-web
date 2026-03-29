import { ApiUseCase } from "../../base/ApiUseCase";
import { EmployeeWithBranchModel } from "../../entities/employee/EmployeeModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export interface UpdateEmployeeRequest {
  name?: string;
  telp?: string;
  joinDate?: number;
  image?: string;
  positionName?: string;
  roleName?: string;
  password?: string;
  shortAddress?: string;
  ward?: string;
  subdistrict?: string;
  city?: string;
  province?: string;
  postalCode?: string;
}

export class UpdateEmployee extends ApiUseCase<
  { id: string; request: UpdateEmployeeRequest },
  EmployeeWithBranchModel
> {
  async execute(params: {
    id: string;
    request: UpdateEmployeeRequest;
  }): Promise<EmployeeWithBranchModel> {
    const response = await this.request<ApiResponse<EmployeeWithBranchModel>>(
      `/employees/${params.id}`,
      HttpMethod.PATCH,
      params.request,
    );
    return response.data;
  }

  async executeMock(params: {
    id: string;
    request: UpdateEmployeeRequest;
  }): Promise<EmployeeWithBranchModel> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: params.id,
          name: params.request.name || "Updated Employee",
          birthDate: 901065600000,
          telp: params.request.telp || "081234567892",
          city: params.request.city || "Jakarta",
          province: params.request.province || "DKI Jakarta",
          subdistrict: params.request.subdistrict || "Kec. Pancoran",
          ward: params.request.ward || "Rawajati",
          postalCode: params.request.postalCode || "12750",
          fullAddress:
            "Jl. Raya Kalibata No.1, Rawajati, Kec. Pancoran, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12750",
          shortAddress: params.request.shortAddress || "Jl. Raya Kalibata No.1",
          branchId: "c2c9f802-5e83-4daf-b71b-5125a15f0ec2",
          branch: {
            id: "c2c9f802-5e83-4daf-b71b-5125a15f0ec2",
            name: "Semurni Emas Kalibata",
            area: "Kalibata",
            city: "Jakarta",
            province: "DKI Jakarta",
            subdistrict: "Kec. Pancoran",
            fullAddress:
              "Jl. Raya Kalibata No.1, Rawajati, Kec. Pancoran, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12750",
            shortAddress: "Jl. Raya Kalibata No.1",
            telp: "085117728895",
            latitude: "-6.2489387",
            longitude: "106.7909413",
            createdAt: "2026-01-15T20:59:19.648Z",
            updatedAt: "2026-01-15T20:59:19.648Z",
            deletedAt: null,
          },
          joinDate: params.request.joinDate || 826416000000,
          image: params.request.image || "",
          positionName: params.request.positionName || "Sales Advisor",
          password: params.request.password,
          ratings: [],
          createdAt: "2026-01-15T20:59:19.671Z",
          updatedAt: "2026-01-15T20:59:19.671Z",
          deletedAt: null,
        });
      }, 1000);
    });
  }
}
