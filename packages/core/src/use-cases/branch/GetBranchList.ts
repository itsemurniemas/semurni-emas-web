import { ApiUseCase } from "../../base/ApiUseCase";
import { BranchModel } from "../../entities/branch/BranchModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export class GetBranchList extends ApiUseCase<void, BranchModel[]> {
    async execute(): Promise<BranchModel[]> {
        const response = await this.request<ApiResponse<BranchModel[]>>(
            "/branches",
            HttpMethod.GET
        );
        return response.data;
    }
}
