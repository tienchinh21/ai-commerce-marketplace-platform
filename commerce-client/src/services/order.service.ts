import { Order, OrderStatus, ShippingAddress, PaymentMethod } from "@/types/order";
import { CartItem } from "@/types/order";
import { MOCK_ORDERS } from "./mock-data";

export interface CreateOrderPayload {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  voucherCode?: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
}

// In-memory store for newly created mock orders during session
let ordersStore = [...MOCK_ORDERS];

export const orderService = {
  async getOrders(statusFilter?: OrderStatus | "ALL"): Promise<Order[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!statusFilter || statusFilter === "ALL") {
          resolve(ordersStore);
        } else {
          resolve(ordersStore.filter((o) => o.status === statusFilter));
        }
      }, 150);
    });
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = ordersStore.find((o) => o.id === orderId || o.orderNumber === orderId);
        resolve(found || null);
      }, 100);
    });
  },

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const orderNumber = `OKZ-2026-${randomNum}`;
        const newOrder: Order = {
          id: `ord-${randomNum}`,
          orderNumber,
          createdAt: new Date().toISOString(),
          status: "PENDING",
          paymentMethod: payload.paymentMethod,
          paymentStatus: payload.paymentMethod === "COD" ? "UNPAID" : "PAID",
          shippingAddress: payload.shippingAddress,
          items: payload.items.map((it) => ({
            id: `oi-${Math.random()}`,
            productId: it.productId,
            productTitle: it.title,
            productTitleEn: it.titleEn,
            thumbnail: it.thumbnail,
            price: it.price,
            quantity: it.quantity,
            variantName: it.variant?.name,
            variantNameEn: it.variant?.nameEn,
          })),
          subtotal: payload.subtotal,
          shippingFee: payload.shippingFee,
          discountAmount: payload.discountAmount,
          voucherCode: payload.voucherCode,
          total: payload.total,
          timeline: [
            {
              status: "PENDING",
              title: "Đơn hàng đã được tạo",
              titleEn: "Order placed successfully",
              description: "Hệ thống đã ghi nhận đơn hàng và chuẩn bị xử lý.",
              descriptionEn: "Order successfully placed into queue.",
              timestamp: new Date().toLocaleString("vi-VN"),
              isCompleted: true,
              isCurrent: true,
            },
            {
              status: "PROCESSING",
              title: "Đang đóng gói và kiểm định",
              titleEn: "Inspection and Packing",
              description: "Bộ phận kho đang kiểm tra số serial và đóng gói chống sốc.",
              descriptionEn: "Warehouse is inspecting quality and packing.",
              timestamp: "Dự kiến 2 giờ tới",
              isCompleted: false,
            },
            {
              status: "SHIPPED",
              title: "Bàn giao đơn vị vận chuyển",
              titleEn: "Handed over to Courier",
              description: "Shipper Hỏa Tốc sẽ liên hệ giao hàng trong ngày.",
              descriptionEn: "Express courier will deliver soon.",
              timestamp: "Dự kiến ngày mai",
              isCompleted: false,
            },
            {
              status: "DELIVERED",
              title: "Giao hàng thành công",
              titleEn: "Delivered",
              description: "Người nhận đã ký xác nhận nhận hàng.",
              descriptionEn: "Delivered and signed by recipient.",
              timestamp: "Dự kiến trong 2 ngày",
              isCompleted: false,
            },
          ],
        };

        ordersStore = [newOrder, ...ordersStore];
        resolve(newOrder);
      }, 300);
    });
  },
};
