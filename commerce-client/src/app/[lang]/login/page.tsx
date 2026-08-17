import { AuthClient } from "@/components/auth/AuthClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In / Register Account",
  description: "Sign in to access your curated privileges, orders and saved addresses at OKZ Commerce.",
};

export default function LoginEnPage() {
  return <AuthClient />;
}
