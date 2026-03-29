import { ApiConfiguration, ApiVersion, AuthRole } from "@repo/core";

export const getApiConfigForRole = (role: AuthRole | null): ApiConfiguration => {
  let prefix = "public";

  // Handle both object and string role formats
  const roleName = typeof role === "string" ? role : role?.name;

  if (roleName === "SUPER_ADMIN") {
    prefix = "super-admin";
  } else if (roleName === "CASHIER" || roleName === "ADMIN") {
    prefix = "client";
  }

  return new ApiConfiguration({
    version: ApiVersion.V1,
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    prefix,
  });
};
