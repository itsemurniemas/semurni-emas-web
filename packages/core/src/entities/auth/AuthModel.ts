export type AuthRoleName = "SUPER_ADMIN" | "ADMIN" | "CASHIER";

export interface AuthRole {
    id: string;
    name: AuthRoleName;
}

export interface AuthUser {
    id: string;
    username: string;
    role: AuthRole;
    branch: any | null; // Placeholder for branch if needed
}

export interface LoginResponseData {
    accessToken: string;
    user: AuthUser;
}
