import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Checkout",
  description: "Review your cart items and complete secure payment at OKZ Commerce.",
};

export default function CheckoutEnPage() {
  return <CheckoutClient />;
}
