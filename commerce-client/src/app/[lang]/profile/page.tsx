import { ProfileClient } from "@/components/profile/ProfileClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account & Settings",
  description: "Manage your personal profile, addresses, and saved payment cards at OKZ Commerce.",
};

export default function ProfileEnPage() {
  return <ProfileClient />;
}
