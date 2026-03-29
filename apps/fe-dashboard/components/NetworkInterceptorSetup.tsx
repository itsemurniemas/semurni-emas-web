"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { setupNetworkInterceptor } from "@/lib/setup-network-interceptor";

/**
 * Component that initializes the network interceptor
 * Must be a client component and rendered within AuthProvider
 */
export const NetworkInterceptorSetup: React.FC = () => {
  const { logout } = useAuth();

  useEffect(() => {
    // Setup network interceptor with logout callback
    setupNetworkInterceptor(() => {
      logout();
    });
  }, [logout]);

  return null;
};
