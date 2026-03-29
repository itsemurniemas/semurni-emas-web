import { ApiUseCase } from "../../base/ApiUseCase";
import { BranchModel } from "../../entities/branch/BranchModel";
import { CreateBranchRequest } from "./BranchRequestModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export class CreateBranch extends ApiUseCase<CreateBranchRequest, BranchModel> {
  async execute(data: CreateBranchRequest): Promise<BranchModel> {
    const response = await this.request<ApiResponse<BranchModel>>(
      "/branches",
      HttpMethod.POST,
      data,
    );
    return response.data;
  }

  async executeMock(data: BranchModel): Promise<BranchModel> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...data,
          id: Math.floor(Math.random() * 1000).toString(),
        });
      }, 1000);
    });
  }
}
