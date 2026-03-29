import { ApiUseCase } from "../../base/ApiUseCase";
import { EmployeeWithBranchModel } from "../../entities/employee/EmployeeModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export class GetEmployeeById extends ApiUseCase<
  string,
  EmployeeWithBranchModel
> {
  async execute(employeeId: string): Promise<EmployeeWithBranchModel> {
    const response = await this.request<ApiResponse<EmployeeWithBranchModel>>(
      `/employees/${employeeId}`,
      HttpMethod.GET,
    );
    return response.data;
  }

  async executeMock(): Promise<EmployeeWithBranchModel> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "e8859a7e-3d07-4d66-829c-8638bd13114e",
          name: "Siti Nurhaliza",
          birthDate: 901065600000,
          telp: "081234567892",
          city: "Jakarta",
          province: "DKI Jakarta",
          subdistrict: "Kec. Pancoran",
          ward: "Rawajati",
          postalCode: "12750",
          fullAddress: "Jl. Pancoran No. 5, Jakarta Selatan",
          shortAddress: "Jl. Pancoran No. 5",
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
          joinDate: 826416000000,
          image:
            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaWmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKAPY//Z",
          positionName: "Sales Advisor",
          password: "hashedPassword123",
          user: {
            username: "snurhaliza",
            role: {
              id: "bcfd06ef-0448-4b1b-ac74-12d4d0df423a",
              name: "CASHIER",
            },
          },
          ratings: [],
          createdAt: "2026-01-15T20:59:19.671Z",
          updatedAt: "2026-01-15T20:59:19.671Z",
          deletedAt: null,
        });
      }, 1000);
    });
  }
}
