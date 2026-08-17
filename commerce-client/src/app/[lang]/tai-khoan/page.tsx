import { ProfileClient } from "@/components/profile/ProfileClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tài Khoản & Sổ Địa Chỉ",
  description: "Quản lý thông tin cá nhân, sổ địa chỉ nhận hàng và phương thức thanh toán.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
