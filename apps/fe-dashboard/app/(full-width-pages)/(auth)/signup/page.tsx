import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignUp Page | Semurni Emas Dashboard",
  description: "This is SignUp Page Semurni Emas",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
