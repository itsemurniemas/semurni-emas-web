export interface BranchSummary {
  id: string;
  name: string;
  area: string;
  city: string;
  province: string;
  subdistrict: string;
  fullAddress: string;
  shortAddress: string;
  telp: string;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface RoleSummary {
  id: string;
  name: string;
}

export interface UserSummary {
  username: string;
  role: RoleSummary;
}

export interface RatingModel {
  id: string;
  score: number;
  comment: string;
  transactionId: string;
  employeeId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface EmployeeModel {
  id: string;
  name: string;
  birthDate: number;
  telp: string;
  city: string;
  province: string;
  subdistrict: string;
  ward: string;
  postalCode: string;
  fullAddress: string;
  shortAddress: string;
  branchId: string;
  joinDate: number;
  image: string;
  positionName: string;
  user?: UserSummary;
  password?: string;
  avgRating?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface EmployeeWithBranchModel {
  id: string;
  name: string;
  birthDate: number;
  telp: string;
  city: string;
  province: string;
  subdistrict: string;
  ward: string;
  postalCode: string;
  fullAddress: string;
  shortAddress: string;
  branchId: string;
  branch: BranchSummary;
  joinDate: number;
  image: string;
  positionName: string;
  password?: string;
  avgRating?: number;
  ratings?: RatingModel[];
  user?: UserSummary;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface BranchWithEmployeesModel {
  id: string;
  name: string;
  area: string;
  employees: EmployeeModel[];
}
