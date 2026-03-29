import SignInForm from "@/components/auth/SignInForm";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignIn Page | Semurni Emas Dashboard",
  description: "This is Signin Page Semurni Emas",
};

function SignInLoading() {
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full animate-pulse">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="space-y-4 mt-8">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInForm />
    </Suspense>
  );
}
