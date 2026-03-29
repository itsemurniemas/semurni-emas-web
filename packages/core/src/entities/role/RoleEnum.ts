export enum RoleEnum {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  CASHIER = "CASHIER",
}

export const RoleEnumLabel: Record<RoleEnum, string> = {
  [RoleEnum.SUPER_ADMIN]: "Super Admin",
  [RoleEnum.ADMIN]: "Kepala Cabang",
  [RoleEnum.CASHIER]: "Kasir",
};

export const getRoleLabel = (role: RoleEnum | string): string => {
  if (typeof role === "string") {
    const enumRole = Object.values(RoleEnum).find((r) => r === role);
    if (enumRole) {
      return RoleEnumLabel[enumRole as RoleEnum];
    }
  } else {
    return RoleEnumLabel[role];
  }
  return role;
};

export const ROLE_OPTIONS = [
  { value: RoleEnum.SUPER_ADMIN, label: RoleEnumLabel[RoleEnum.SUPER_ADMIN] },
  { value: RoleEnum.ADMIN, label: RoleEnumLabel[RoleEnum.ADMIN] },
  { value: RoleEnum.CASHIER, label: RoleEnumLabel[RoleEnum.CASHIER] },
];

export const STD_ROLE_OPTIONS = [
  { value: RoleEnum.ADMIN, label: RoleEnumLabel[RoleEnum.ADMIN] },
  { value: RoleEnum.CASHIER, label: RoleEnumLabel[RoleEnum.CASHIER] },
];
