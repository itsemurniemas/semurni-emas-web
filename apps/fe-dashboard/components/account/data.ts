import { getRoleLabel } from "@repo/core/entities/role/RoleEnum";

export interface AccountProps {
  id: string;
  username: string;
  branchName: string;
  role: string;
}

export function getRoleTitle(role: string): string {
  try {
    return getRoleLabel(role);
  } catch {
    return "-";
  }
}

export const MOCK_ACCOUNT_DATA_1: AccountProps[] = [
  {
    id: "1",
    username: "Lindsey Curtis",
    branchName: "Kalibata",
    role: "Branch Admin",
  },
  {
    id: "2",
    username: "Kaiya George",
    branchName: "Kalibata",
    role: "Kasir",
  },
  {
    id: "3",
    username: "Zain Geidt",
    branchName: "Kalibata",
    role: "Kasir",
  },
  {
    id: "4",
    username: "Abram Schleifer",
    branchName: "Kalibata",
    role: "Kasir",
  },
  {
    id: "5",
    username: "Carla George",
    branchName: "Kalibata",
    role: "Kasir",
  },
];

export const MOCK_ACCOUNT_DATA_2: AccountProps[] = [
  {
    id: "1",
    username: "Lindsey Curtis",
    branchName: "Blok M",
    role: "Branch Admin",
  },
  {
    id: "2",
    username: "Kaiya George",
    branchName: "Blok M",
    role: "Kasir",
  },
  {
    id: "3",
    username: "Zain Geidt",
    branchName: "Blok M",
    role: "Kasir",
  },
  {
    id: "4",
    username: "Abram Schleifer",
    branchName: "Blok M",
    role: "Kasir",
  },
  {
    id: "5",
    username: "Carla George",
    branchName: "Blok M",
    role: "Kasir",
  },
];
