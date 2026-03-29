import { getRoleLabel } from "@repo/core/entities/role/RoleEnum";

/**
 * Convert enum name to presentable label
 * @example "SUPER_ADMIN" -> "Super Admin"
 * @example "NON_GOLD" -> "Non Gold"
 */
export const convertEnumToLabel = (enumName: string): string => {
  return enumName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Convert Role enum name to presentable label
 * Uses centralized RoleEnum labels for consistency
 * @example "SUPER_ADMIN" -> "Super Admin"
 * @example "ADMIN" -> "Kepala Cabang"
 * @example "CASHIER" -> "Kasir"
 */
export const convertRoleNameToLabel = (roleName: string): string => {
  return getRoleLabel(roleName);
};
