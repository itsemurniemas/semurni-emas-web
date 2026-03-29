import { ApiUseCase } from "../../base/ApiUseCase";
import { BranchWithEmployeesModel } from "../../entities/employee/EmployeeModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export class GetEmployeeList extends ApiUseCase<void, BranchWithEmployeesModel[]> {
    async execute(): Promise<BranchWithEmployeesModel[]> {
        const response = await this.request<ApiResponse<BranchWithEmployeesModel[]>>(
            `/employees`,
            HttpMethod.GET
        );
        return response.data;
    }

    async executeMock(): Promise<BranchWithEmployeesModel[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([]);
            }, 1000);
        });
    }
}
