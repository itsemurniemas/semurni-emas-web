import { ApiUseCase } from "../../base/ApiUseCase";
import { BranchModel } from "../../entities/branch/BranchModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export class GetBranchById extends ApiUseCase<string, BranchModel> {
    async execute(id: string): Promise<BranchModel> {
        const response = await this.request<ApiResponse<BranchModel>>(`/branches/${id}`, HttpMethod.GET);
        return response.data;
    }
}
