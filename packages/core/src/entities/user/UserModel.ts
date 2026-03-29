import { RoleModel } from "../role/RoleModel";
import { BranchModel } from "../branch/BranchModel";

export interface UserModel {
    id: string;
    username: string;
    password: string;
    roleId: string;
    branchId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    role?: RoleModel;
    branch?: BranchModel;
}
