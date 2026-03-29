"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { DataViewState, parseApiError } from "@repo/core";
import { toast } from "react-toastify";

export const useSignInViewModel = () => {
  const [state, setState] = useState<DataViewState<void>>(
    DataViewState.initiate(),
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Username and password are required");
      return;
    }

    setState(DataViewState.loading());

    try {
      await login(username.toLowerCase(), password);
      setState(DataViewState.success(undefined));

      toast.success("Berhasil masuk!");

      // Redirect to callback URL or dashboard
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      router.push(callbackUrl);
    } catch (error) {
      const errorMessage = parseApiError(error);
      setState(DataViewState.error(errorMessage));
      toast.error(errorMessage);
    }
  };

  return {
    state,
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    handleSignIn,
  };
};
