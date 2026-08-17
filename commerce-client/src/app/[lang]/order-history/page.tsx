import { orderService } from "@/services/order.service";
import { OrderHistoryClient } from "@/components/order/OrderHistoryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order History & Shipment Tracking",
  description: "Track live status and shipment milestones of your purchases at OKZ Commerce.",
};

export default async function OrderHistoryEnPage() {
  const initialOrders = await orderService.getOrders();
  return <OrderHistoryClient initialOrders={initialOrders} />;
}
