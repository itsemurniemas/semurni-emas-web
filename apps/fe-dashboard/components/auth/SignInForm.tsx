"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeOff, Eye } from "lucide-react";
import React from "react";

import { useSignInViewModel } from "@/app/(full-width-pages)/(auth)/signin/useSignInViewModel";

const SignInForm: React.FC = () => {
  const {
    state,
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    handleSignIn,
  } = useSignInViewModel();

  const isLoading = state.type === "loading";

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Masukkan username dan password untuk masuk
            </p>
          </div>
          <form onSubmit={handleSignIn}>
            <div className="space-y-6">
              <div>
                <Label htmlFor="username">
                  Username <span className="text-error-500">*</span>{" "}
                </Label>
                <Input
                  id="username"
                  placeholder="Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                />
              </div>
              <div>
                <Label htmlFor="password">
                  Password <span className="text-error-500">*</span>{" "}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </span>
                </div>
              </div>
              <div>
                <Button
                  className="w-full"
                  size="sm"
                  type="submit"
                  loading={isLoading}
                  disabled={isLoading || !username || !password}
                >
                  Sign in
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
