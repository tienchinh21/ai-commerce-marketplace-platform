import { OrderStatus } from "@/types/order";
import { Badge } from "@/components/ui/badge";

export function OrderStatusBadge({
  status,
  lang = "vi",
}: {
  status: OrderStatus;
  lang?: string;
}) {
  const isVi = lang === "vi";

  const config: Record<
    OrderStatus,
    { labelVi: string; labelEn: string; variant: "warning" | "shade" | "mint" | "success" | "danger" }
  > = {
    PENDING: { labelVi: "Chờ xử lý", labelEn: "Pending", variant: "warning" },
    CONFIRMED: { labelVi: "Đã xác nhận", labelEn: "Confirmed", variant: "shade" },
    PROCESSING: { labelVi: "Đang đóng gói", labelEn: "Processing", variant: "mint" },
    SHIPPED: { labelVi: "Đang giao hàng", labelEn: "Shipped", variant: "shade" },
    DELIVERED: { labelVi: "Đã hoàn thành", labelEn: "Delivered", variant: "success" },
    CANCELLED: { labelVi: "Đã hủy", labelEn: "Cancelled", variant: "danger" },
  };

  const item = config[status] || {
    labelVi: status,
    labelEn: status,
    variant: "shade",
  };

  return (
    <Badge variant={item.variant}>
      {isVi ? item.labelVi : item.labelEn}
    </Badge>
  );
}
