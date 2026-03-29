import { EmployeeModel } from "./EmployeeModel";

export interface BranchEmployeeModel {
    branchName: string;
    employees: EmployeeModel[];
}
