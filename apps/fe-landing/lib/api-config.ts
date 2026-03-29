import { ApiConfiguration, ApiVersion, AuthRole } from "@repo/core";

export const getApiConfigForRole = (
  role: AuthRole | null,
): ApiConfiguration => {
  // fe-landing is public-facing, so we use 'public' prefix
  return new ApiConfiguration({
    version: ApiVersion.V1,
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    prefix: "public",
  });
};
