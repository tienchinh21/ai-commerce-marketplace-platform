import { AuthClient } from "@/components/auth/AuthClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng Nhập / Đăng Ký Thành Viên",
  description: "Đăng nhập tài khoản để nhận đặc quyền mua sắm và quản lý đơn hàng tại OKZ Commerce.",
};

export default function LoginPage() {
  return <AuthClient />;
}
