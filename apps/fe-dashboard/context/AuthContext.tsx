"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthUser, AuthRole, Login, Logout } from "@repo/core";
import { getApiConfigForRole } from "@/lib/api-config";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (username: string, password?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility function to check if user role is SUPER_ADMIN
export const isSuperAdminRole = (role?: AuthRole): boolean => {
  return role?.name === "SUPER_ADMIN";
};

// Utility function to check if user role is ADMIN
export const isAdminRole = (role?: AuthRole): boolean => {
  return role?.name === "ADMIN";
};

// Utility function to check if user role is CASHIER
export const isCashierRole = (role?: AuthRole): boolean => {
  return role?.name === "CASHIER";
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem("user_session");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to restore session", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password?: string) => {
    setIsLoading(true);
    try {
      const loginUseCase = new Login(getApiConfigForRole(null));
      const loginData = await loginUseCase.execute({
        username: username.toLowerCase(),
        password,
      });

      const { user, accessToken } = loginData;

      setUser(user);
      // Only store essential user data to avoid quota exceeded error
      const essentialUserData = {
        id: user.id,
        username: user.username,
        role: user.role,
      };
      localStorage.setItem("user_session", JSON.stringify(essentialUserData));
      localStorage.setItem("access_token", accessToken);
      document.cookie = `user_session=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const logoutUseCase = new Logout();
      await logoutUseCase.execute();

      setUser(null);
      localStorage.removeItem("user_session");
      document.cookie = "user_session=; path=/; max-age=0";

      // Redirect to signin page
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, redirect to signin
      router.push("/signin");
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
