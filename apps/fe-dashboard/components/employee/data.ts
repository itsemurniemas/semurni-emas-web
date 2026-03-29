export interface EmployeeProps {
  id: string | number;
  fullName: string;
  phone: string;
  avgRating: number | null;
  email: string;
  role: string;
  status: "Active" | "On Leave" | "Inactive";
  address: string;
  joinDate: string;
}

export interface EmployeeListProps {
  branchName: string;
  employees: EmployeeProps[];
}
