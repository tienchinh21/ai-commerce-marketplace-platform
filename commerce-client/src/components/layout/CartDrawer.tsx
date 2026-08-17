"use client";

import * as React from "react";
import Link from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, Plus, Minus, Trash2, Tag, ArrowRight, Sparkles } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/useCartStore";
import { useTranslation } from "@/i18n/useTranslation";
import { formatPrice } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useToast } from "@/components/ui/toast";

export function CartDrawer() {
  const { t, lang, isVi } = useTranslation();
  const router = useRouter();
  const { showToast } = useToast();

  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    voucherCode,
    applyVoucher,
    removeVoucher,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getTotal,
    getTotalItemsCount,
  } = useCartStore();

  const [inputCode, setInputCode] = React.useState("");

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyVoucher(inputCode);
    if (res.success) {
      showToast({ title: isVi ? "Ưu đãi" : "Promotion", description: res.message, type: "success" });
      setInputCode("");
    } else {
      showToast({ title: isVi ? "Lỗi" : "Error", description: res.message, type: "error" });
    }
  };

  const handleProceedCheckout = () => {
    closeCart();
    const targetRoute = isVi ? ROUTES.vi.checkout : ROUTES.en.checkout;
    router.push(targetRoute);
  };

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const total = getTotal();
  const itemCount = getTotalItemsCount();

  return (
    <Sheet
      isOpen={isCartOpen}
      onClose={closeCart}
      title={
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-ink" />
          <span>{t.cart.title}</span>
          <span className="rounded-full bg-shade-30 px-2 py-0.5 text-xs font-semibold">
            {itemCount}
          </span>
        </div>
      }
    >
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center py-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-shade-30/40 text-shade-40 mb-4">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h4 className="text-base font-semibold text-ink mb-1">
            {t.cart.emptyCartTitle}
          </h4>
          <p className="text-xs text-shade-50 max-w-xs mb-6">
            {t.cart.emptyCartSubtitle}
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              closeCart();
              router.push(isVi ? ROUTES.vi.products : ROUTES.en.products);
            }}
          >
            {t.cart.continueShopping}
          </Button>
        </div>
      ) : (
        <div className="flex h-full flex-col justify-between">
          {/* Items list */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {/* Free shipping banner */}
            <div className="flex items-center gap-2 rounded-md bg-aloe-10/70 p-2.5 text-xs font-medium text-ink">
              <Sparkles className="h-3.5 w-3.5 text-emerald-800 shrink-0" />
              <span>{t.cart.freeShippingNotice}</span>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3.5 border-b border-hairline-light pb-4"
              >
                <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-md bg-shade-30/30 border border-hairline-light">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between min-h-[5rem]">
                  <div>
                    <h5 className="text-[13px] font-semibold text-ink line-clamp-2 leading-snug">
                      {isVi ? item.title : item.titleEn}
                    </h5>
                    {item.variant && (
                      <p className="mt-0.5 text-xs text-shade-50">
                        {isVi ? item.variant.name : item.variant.nameEn}
                      </p>
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-[14px] font-bold text-ink">
                      {formatPrice(item.price, lang)}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 rounded-full border border-hairline-light bg-shade-30/20 px-2 py-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-shade-60 hover:text-black cursor-pointer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-semibold text-ink min-w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-shade-60 hover:text-black cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-shade-40 hover:text-red-600 p-1 cursor-pointer transition-colors"
                      title={t.common.delete}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer calculation */}
          <div className="border-t border-hairline-light pt-4 mt-4 space-y-3">
            {/* Voucher input */}
            <form onSubmit={handleApplyVoucher} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-shade-40" />
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder={t.cart.voucherPlaceholder}
                  className="w-full rounded-full border border-hairline-light bg-shade-30/20 py-2 pl-9 pr-3 text-xs uppercase text-ink placeholder:normal-case placeholder:text-shade-40 focus:border-black focus:outline-none"
                />
              </div>
              <Button type="submit" variant="outline-light" size="sm">
                {t.common.apply}
              </Button>
            </form>

            {voucherCode && (
              <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800">
                <span>{t.cart.appliedVoucher}: <strong>{voucherCode}</strong></span>
                <button
                  type="button"
                  onClick={removeVoucher}
                  className="text-rose-600 hover:underline cursor-pointer"
                >
                  {t.common.delete}
                </button>
              </div>
            )}

            {/* Price breakdown */}
            <div className="space-y-1.5 text-xs">
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
              <div className="flex justify-between text-sm font-bold text-ink pt-2 border-t border-hairline-light">
                <span>{t.common.total}</span>
                <span className="text-base">{formatPrice(total, lang)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-between"
              onClick={handleProceedCheckout}
            >
              <span>{t.cart.checkoutBtn}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Sheet>
  );
}
