import { ApiUseCase } from "../../base/ApiUseCase";
import { BranchModel } from "../../entities/branch/BranchModel";
import { UpdateBranchRequest } from "./BranchRequestModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export class UpdateBranch extends ApiUseCase<UpdateBranchRequest, BranchModel> {
    async execute(data: UpdateBranchRequest, branchId?: string | number): Promise<BranchModel> {
        const id = branchId || "unknown";
        const response = await this.request<ApiResponse<BranchModel>>(
            `/branches/${id}`,
            HttpMethod.PATCH,
            data
        );
        return response.data;
    }

    async executeMock(data: BranchModel): Promise<BranchModel> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data);
            }, 1000);
        });
    }
}
