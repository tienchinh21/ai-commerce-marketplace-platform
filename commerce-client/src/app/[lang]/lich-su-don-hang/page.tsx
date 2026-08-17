import { orderService } from "@/services/order.service";
import { OrderHistoryClient } from "@/components/order/OrderHistoryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lịch Sử Đơn Hàng & Hành Trình Vận Chuyển",
  description: "Theo dõi trạng thái đơn hàng, lộ trình giao hàng và quản lý mua sắm tại OKZ Commerce.",
};

export default async function OrderHistoryPage() {
  const initialOrders = await orderService.getOrders();
  return <OrderHistoryClient initialOrders={initialOrders} />;
}
