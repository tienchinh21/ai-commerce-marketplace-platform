import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanh Toán Đơn Hàng",
  description: "Xác nhận địa chỉ và hoàn tất thanh toán đơn hàng an toàn, bảo mật.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
