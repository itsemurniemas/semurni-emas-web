export interface BranchProps {
  id: number;
  branchName: string;
  city: string;
  employeeCount: number;
}

export const MOCK_BRANCH_DATA: BranchProps[] = [
  {
    id: 1,
    branchName: "Semurni Emas Kalibata",
    city: "Jakarta",
    employeeCount: 2,
  },
  {
    id: 2,
    branchName: "Semurni Emas Radio Dalam",
    city: "Jakarta",
    employeeCount: 4,
  },
  {
    id: 3,
    branchName: "Kemang",
    city: "Jakarta",
    employeeCount: 8,
  },
  {
    id: 4,
    branchName: "Pasar Senen",
    city: "Jakarta",
    employeeCount: 6,
  },
  {
    id: 5,
    branchName: "Blok A",
    city: "Jakarta",
    employeeCount: 5,
  },
];
