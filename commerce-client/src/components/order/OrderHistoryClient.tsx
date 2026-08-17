"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, Package, RotateCcw, Eye } from "lucide-react";
import { Order, OrderStatus } from "@/types/order";
import { useTranslation } from "@/i18n/useTranslation";
import { orderService } from "@/services/order.service";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { formatPrice, formatDate } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useCartStore } from "@/stores/useCartStore";
import { useToast } from "@/components/ui/toast";
import { productService } from "@/services/product.service";

export function OrderHistoryClient({ initialOrders }: { initialOrders: Order[] }) {
  const { t, lang, isVi } = useTranslation();
  const { addItem, openCart } = useCartStore();
  const { showToast } = useToast();

  const [orders, setOrders] = React.useState<Order[]>(initialOrders);
  const [selectedStatus, setSelectedStatus] = React.useState<OrderStatus | "ALL">("ALL");
  const [activeOrder, setActiveOrder] = React.useState<Order | null>(null);

  const filterTabs: { key: OrderStatus | "ALL"; label: string }[] = [
    { key: "ALL", label: t.orders.tabAll },
    { key: "PENDING", label: t.orders.tabPending },
    { key: "PROCESSING", label: t.orders.tabProcessing },
    { key: "SHIPPED", label: t.orders.tabShipped },
    { key: "DELIVERED", label: t.orders.tabDelivered },
    { key: "CANCELLED", label: t.orders.tabCancelled },
  ];

  const handleTabChange = async (status: OrderStatus | "ALL") => {
    setSelectedStatus(status);
    const data = await orderService.getOrders(status);
    setOrders(data);
  };

  const handleReorder = async (order: Order) => {
    for (const it of order.items) {
      const prod = await productService.getProductBySlug(
        it.productTitle.toLowerCase().replace(/ /g, "-")
      );
      if (prod) {
        addItem(prod, prod.variants[0], it.quantity);
      }
    }
    showToast({
      title: isVi ? "Đã thêm lại vào giỏ hàng" : "Items added to cart",
      description: `Đơn hàng #${order.orderNumber}`,
      type: "success",
    });
    openCart();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 border-b border-hairline-light pb-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-shade-50">
          ORDERS
        </span>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {t.orders.title}
        </h1>
        <p className="mt-0.5 text-xs text-shade-50">{t.orders.subtitle}</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-8 flex overflow-x-auto pb-2 scrollbar-none">
        <div className="inline-flex gap-1 rounded-full bg-shade-30/30 p-1 text-xs">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedStatus === tab.key
                  ? "bg-black text-white font-semibold shadow-xs"
                  : "text-shade-60 hover:text-black hover:bg-black/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-hairline-light py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-shade-30/40 text-shade-40 mb-3">
              <Package className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-ink mb-1">
              {t.orders.emptyOrdersTitle}
            </h4>
            <p className="text-xs text-shade-50 mb-4">
              Bạn chưa phát sinh giao dịch nào ở trạng thái này.
            </p>
            <Link
              href={isVi ? ROUTES.vi.products : ROUTES.en.products}
              className="btn-primary-pill text-xs py-2 px-4"
            >
              <span>{t.cart.continueShopping}</span>
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-hairline-light bg-white p-5 shadow-elevation-3 transition-all"
            >
              {/* Order Card Header */}
              <div className="flex flex-col justify-between gap-2 border-b border-hairline-light pb-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-ink">
                    #{order.orderNumber}
                  </span>
                  <OrderStatusBadge status={order.status} lang={lang} />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-shade-50">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(order.createdAt, lang)}</span>
                </div>
              </div>

              {/* Items in order */}
              <div className="py-3.5 space-y-3">
                {order.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3">
                    <img
                      src={it.thumbnail}
                      alt={it.productTitle}
                      className="h-14 w-14 rounded-md object-cover bg-shade-30/30 shrink-0 border border-hairline-light"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-semibold text-ink line-clamp-1">
                        {isVi ? it.productTitle : it.productTitleEn}
                      </h5>
                      {it.variantName && (
                        <p className="text-[11px] text-shade-50 mt-0.5">
                          {isVi ? it.variantName : it.variantNameEn}
                        </p>
                      )}
                      <span className="text-[11px] text-shade-40">
                        Số lượng: {it.quantity}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-ink">
                      {formatPrice(it.price * it.quantity, lang)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Total & Action Buttons */}
              <div className="flex flex-col justify-between gap-3 border-t border-hairline-light pt-3 sm:flex-row sm:items-center">
                <div className="text-xs">
                  <span className="text-shade-50">{t.common.total}: </span>
                  <span className="text-sm font-bold text-ink ml-1">
                    {formatPrice(order.total, lang)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={() => setActiveOrder(order)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    <span>{t.orders.viewDetails}</span>
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleReorder(order)}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    <span>{t.orders.reorder}</span>
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Detail & Timeline Modal */}
      {activeOrder && (
        <Modal
          isOpen={Boolean(activeOrder)}
          onClose={() => setActiveOrder(null)}
          title={`Chi Tiết Đơn Hàng #${activeOrder.orderNumber}`}
          description={`Ngày đặt: ${formatDate(activeOrder.createdAt, lang)}`}
          maxWidth="lg"
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {/* Timeline */}
            <div className="rounded-md border border-hairline-light bg-shade-30/10 p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-ink mb-3">
                {t.orders.trackingTimeline}
              </h5>
              <OrderTimeline timeline={activeOrder.timeline} lang={lang} />
            </div>

            {/* Recipient Address */}
            <div className="rounded-md border border-hairline-light p-3.5 space-y-1 text-xs">
              <h5 className="font-bold uppercase tracking-wider text-shade-50 text-[10px]">
                {t.orders.recipientInfo}
              </h5>
              <p className="font-semibold text-ink">
                {activeOrder.shippingAddress.fullName} - {activeOrder.shippingAddress.phone}
              </p>
              <p className="text-shade-50">
                {activeOrder.shippingAddress.streetAddress}, {activeOrder.shippingAddress.ward}, {activeOrder.shippingAddress.district}, {activeOrder.shippingAddress.province}
              </p>
            </div>

            {/* Payment info */}
            <div className="rounded-md border border-hairline-light p-3.5 text-xs space-y-1">
              <h5 className="font-bold uppercase tracking-wider text-shade-50 text-[10px]">
                {t.orders.paymentInfo}
              </h5>
              <div className="flex justify-between text-shade-60">
                <span>Phương thức:</span>
                <span className="font-semibold text-ink">{activeOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-shade-60">
                <span>Trạng thái:</span>
                <span className="font-semibold text-emerald-700">{activeOrder.paymentStatus}</span>
              </div>
            </div>

            {/* Price calculation */}
            <div className="space-y-1.5 border-t border-hairline-light pt-3 text-xs">
              <div className="flex justify-between text-shade-60">
                <span>{t.common.subtotal}</span>
                <span>{formatPrice(activeOrder.subtotal, lang)}</span>
              </div>
              {activeOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>{t.common.discountVoucher}</span>
                  <span>-{formatPrice(activeOrder.discountAmount, lang)}</span>
                </div>
              )}
              <div className="flex justify-between text-shade-60">
                <span>{t.common.shippingFee}</span>
                <span>{formatPrice(activeOrder.shippingFee, lang)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-ink pt-2 border-t border-hairline-light">
                <span>{t.common.total}</span>
                <span>{formatPrice(activeOrder.total, lang)}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
