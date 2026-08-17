"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  Wallet,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { orderService } from "@/services/order.service";
import { ShippingAddress, PaymentMethod, Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

export function CheckoutClient() {
  const { t, lang, isVi } = useTranslation();
  const router = useRouter();
  const { showToast } = useToast();

  const {
    items,
    clearCart,
    voucherCode,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getTotal,
    applyVoucher,
  } = useCartStore();

  const { user } = useAuthStore();

  const defaultAddr = user?.addresses[0] || {
    fullName: "Bùi Hoàng Nam",
    phone: "0912 345 678",
    email: "hoangnam.bui@example.com",
    province: "Thành phố Hồ Chí Minh",
    district: "Quận 1",
    ward: "Phường Bến Nghé",
    streetAddress: "Tầng 18, Tòa nhà Landmark 81, 720A Điện Biên Phủ",
  };

  const [address, setAddress] = React.useState<ShippingAddress>(defaultAddr);
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("BANK_TRANSFER");
  const [voucherInput, setVoucherInput] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [placedOrder, setPlacedOrder] = React.useState<Order | null>(null);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const total = getTotal();

  const routes = isVi ? ROUTES.vi : ROUTES.en;

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput) return;
    const res = applyVoucher(voucherInput);
    if (res.success) {
      showToast({ title: isVi ? "Ưu đãi" : "Voucher", description: res.message, type: "success" });
      setVoucherInput("");
    } else {
      showToast({ title: isVi ? "Lỗi" : "Error", description: res.message, type: "error" });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.fullName || !address.phone || !address.streetAddress) {
      showToast({
        title: isVi ? "Thiếu thông tin" : "Missing fields",
        description: isVi ? "Vui lòng nhập đầy đủ thông tin giao hàng" : "Please fill in recipient information",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await orderService.createOrder({
        items,
        shippingAddress: address,
        paymentMethod,
        voucherCode,
        subtotal,
        shippingFee: shipping,
        discountAmount: discount,
        total,
      });

      setPlacedOrder(order);
      clearCart();
      showToast({
        title: isVi ? "Đặt hàng thành công!" : "Order placed successfully!",
        description: `Mã đơn hàng: ${order.orderNumber}`,
        type: "success",
      });
    } catch (err) {
      showToast({
        title: isVi ? "Có lỗi xảy ra" : "Order failed",
        description: "Vui lòng thử lại sau giây lát",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. If order just placed, show confirmation screen
  if (placedOrder) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <span className="pill-tag-mint mb-2">
          {t.checkout.orderSuccessTitle}
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">
          {isVi ? "Cảm Ơn Bạn Đã Mua Sắm!" : "Thank You For Your Order!"}
        </h1>
        <p className="mt-2 text-xs text-shade-50">
          {t.checkout.orderSuccessSubtitle.replace("{orderNumber}", placedOrder.orderNumber)}
        </p>

        {/* Order Card Summary */}
        <div className="my-8 rounded-lg border border-hairline-light bg-white p-6 text-left shadow-elevation-3">
          <div className="flex justify-between border-b border-hairline-light pb-3 text-xs font-semibold text-ink">
            <span>{isVi ? "Mã đơn hàng" : "Order Number"}</span>
            <span className="font-mono">{placedOrder.orderNumber}</span>
          </div>

          <div className="py-4 space-y-2 border-b border-hairline-light">
            <h6 className="text-xs font-bold text-shade-50 uppercase">
              {t.checkout.step1}
            </h6>
            <p className="text-xs font-semibold text-ink">{placedOrder.shippingAddress.fullName} - {placedOrder.shippingAddress.phone}</p>
            <p className="text-xs text-shade-50">
              {placedOrder.shippingAddress.streetAddress}, {placedOrder.shippingAddress.ward}, {placedOrder.shippingAddress.district}, {placedOrder.shippingAddress.province}
            </p>
          </div>

          <div className="pt-4 flex justify-between text-sm font-bold text-ink">
            <span>{t.common.total}</span>
            <span>{formatPrice(placedOrder.total, lang)}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push(routes.orderHistory)}
          >
            <span>{t.checkout.viewOrderBtn}</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            variant="outline-light"
            size="lg"
            onClick={() => router.push(routes.products)}
          >
            <span>{t.cart.continueShopping}</span>
          </Button>
        </div>
      </div>
    );
  }

  // 2. If cart is empty and no placed order
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-shade-30/40 text-shade-40 mx-auto mb-3">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold text-ink mb-1">{t.cart.emptyCartTitle}</h2>
        <p className="text-xs text-shade-50 mb-6">{t.cart.emptyCartSubtitle}</p>
        <Button variant="primary" size="md" onClick={() => router.push(routes.products)}>
          {t.cart.continueShopping}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-8 border-b border-hairline-light pb-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-shade-50">
          CHECKOUT
        </span>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {t.checkout.title}
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left: Information Forms (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Recipient Address */}
          <div className="rounded-lg border border-hairline-light bg-white p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-hairline-light pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
                {t.checkout.step1}
              </h3>
              {user && (
                <span className="text-xs text-emerald-700 font-medium">
                  ✓ Đã tự động điền theo hồ sơ
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label={t.checkout.fullName}
                required
                value={address.fullName}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
              />
              <Input
                label={t.checkout.phone}
                required
                type="tel"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              />
            </div>

            <Input
              label={t.checkout.email}
              type="email"
              value={address.email || ""}
              onChange={(e) => setAddress({ ...address, email: e.target.value })}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Input
                label={t.checkout.province}
                required
                value={address.province}
                onChange={(e) => setAddress({ ...address, province: e.target.value })}
              />
              <Input
                label={t.checkout.district}
                required
                value={address.district}
                onChange={(e) => setAddress({ ...address, district: e.target.value })}
              />
              <Input
                label={t.checkout.ward}
                required
                value={address.ward}
                onChange={(e) => setAddress({ ...address, ward: e.target.value })}
              />
            </div>

            <Input
              label={t.checkout.streetAddress}
              required
              value={address.streetAddress}
              onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
            />

            <Input
              label={t.checkout.notes}
              value={address.notes || ""}
              onChange={(e) => setAddress({ ...address, notes: e.target.value })}
            />
          </div>

          {/* Step 2: Shipping Method */}
          <div className="rounded-lg border border-hairline-light bg-white p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink border-b border-hairline-light pb-3">
              {t.checkout.step2}
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between rounded-md border border-black bg-white p-3.5 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border border-black">
                    <div className="h-2 w-2 rounded-full bg-black" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-ink">Giao Hỏa Tốc Siêu Nhanh 2H</span>
                      <span className="rounded-full bg-aloe-10 px-2 py-0.5 text-[9px] font-bold text-black">
                        EXPRESS
                      </span>
                    </div>
                    <p className="text-[11px] text-shade-50">Nhận hàng trong vòng 2-4 giờ tại nội thành</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-ink">
                  {shipping === 0 ? t.common.freeShipping : formatPrice(shipping, lang)}
                </span>
              </label>
            </div>
          </div>

          {/* Step 3: Payment Method Selector */}
          <div className="rounded-lg border border-hairline-light bg-white p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink border-b border-hairline-light pb-3">
              {t.checkout.step3}
            </h3>

            <div className="space-y-2">
              {[
                {
                  id: "BANK_TRANSFER" as PaymentMethod,
                  title: t.checkout.paymentBank,
                  desc: t.checkout.paymentBankDesc,
                  icon: QrCode,
                  badge: "Khuyên dùng",
                },
                {
                  id: "COD" as PaymentMethod,
                  title: t.checkout.paymentCod,
                  desc: t.checkout.paymentCodDesc,
                  icon: Banknote,
                },
                {
                  id: "CREDIT_CARD" as PaymentMethod,
                  title: t.checkout.paymentCard,
                  desc: t.checkout.paymentCardDesc,
                  icon: CreditCard,
                },
                {
                  id: "MOMO" as PaymentMethod,
                  title: t.checkout.paymentMomo,
                  desc: t.checkout.paymentMomoDesc,
                  icon: Wallet,
                },
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = paymentMethod === p.id;

                return (
                  <label
                    key={p.id}
                    onClick={() => setPaymentMethod(p.id)}
                    className={`flex items-start justify-between rounded-md border p-3 transition-all cursor-pointer ${
                      isSelected
                        ? "border-black bg-shade-30/10 shadow-xs"
                        : "border-hairline-light hover:bg-shade-30/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full border border-shade-40 mt-0.5">
                        {isSelected && (
                          <div className="h-2 w-2 rounded-full bg-black" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-ink">{p.title}</span>
                          {p.badge && (
                            <span className="rounded-full bg-aloe-10 px-1.5 py-0.5 text-[9px] font-bold text-black">
                              {p.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-shade-50 mt-0.5">{p.desc}</p>
                      </div>
                    </div>
                    <Icon className="h-4 w-4 text-shade-40 shrink-0" />
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Order Summary Sticky Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-lg border border-hairline-light bg-white p-5 space-y-4 shadow-elevation-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink border-b border-hairline-light pb-3">
                {t.checkout.orderSummary} ({items.length})
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3">
                    <img
                      src={it.thumbnail}
                      alt={it.title}
                      className="h-12 w-12 rounded-md object-cover bg-shade-30/30 shrink-0 border border-hairline-light"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-semibold text-ink truncate">
                        {isVi ? it.title : it.titleEn}
                      </h5>
                      <span className="text-[11px] text-shade-50">
                        {it.variant ? (isVi ? it.variant.name : it.variant.nameEn) : ""} x {it.quantity}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-ink">
                      {formatPrice(it.price * it.quantity, lang)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Voucher Apply Form */}
              <div className="border-t border-hairline-light pt-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-2.5 h-3.5 w-3.5 text-shade-40" />
                    <input
                      type="text"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value)}
                      placeholder={t.cart.voucherPlaceholder}
                      className="h-9 w-full rounded-full border border-hairline-light bg-shade-30/20 py-1 pl-8 pr-3 text-xs uppercase text-ink placeholder:normal-case placeholder:text-shade-40 focus:border-black focus:outline-none"
                    />
                  </div>
                  <Button type="button" variant="outline-light" size="sm" onClick={handleApplyVoucher}>
                    {t.common.apply}
                  </Button>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 border-t border-hairline-light pt-4 text-xs">
                <div className="flex justify-between text-shade-60">
                  <span>{t.common.subtotal}</span>
                  <span className="font-medium text-ink">{formatPrice(subtotal, lang)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>{t.common.discountVoucher}</span>
                    <span>-{formatPrice(discount, lang)}</span>
                  </div>
                )}

                <div className="flex justify-between text-shade-60">
                  <span>{t.common.shippingFee}</span>
                  <span>{shipping === 0 ? t.common.freeShipping : formatPrice(shipping, lang)}</span>
                </div>

                <div className="flex justify-between border-t border-hairline-light pt-3 text-sm font-bold text-ink">
                  <span>{t.common.total}</span>
                  <span className="text-lg">{formatPrice(total, lang)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center"
                isLoading={isSubmitting}
              >
                <span>{t.checkout.placeOrderBtn}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-shade-40 pt-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Bảo mật thanh toán chuẩn SSL 256-bit</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
