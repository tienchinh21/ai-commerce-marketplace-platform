import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem } from "@/types/order";
import { Product, ProductVariant } from "@/types/product";
import { STORAGE_KEYS } from "@/lib/constants";

interface CartState {
  items: CartItem[];
  voucherCode?: string;
  discountRate: number; // percentage discount e.g. 0.1 for 10%
  fixedDiscount: number; // e.g. 500000 VND
  isCartOpen: boolean;

  // Actions
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  applyVoucher: (code: string) => { success: boolean; message: string };
  removeVoucher: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed getters
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  getTotalItemsCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      voucherCode: undefined,
      discountRate: 0,
      fixedDiscount: 0,
      isCartOpen: false,

      addItem: (product, variant, quantity = 1) => {
        const currentItems = get().items;
        const variantId = variant?.id || "default";
        const uniqueCartId = `${product.id}-${variantId}`;

        const existingIndex = currentItems.findIndex((it) => it.id === uniqueCartId);

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingIndex].quantity += quantity;
          set({ items: updatedItems, isCartOpen: true });
        } else {
          const newItem: CartItem = {
            id: uniqueCartId,
            productId: product.id,
            slug: product.slug,
            title: product.title,
            titleEn: product.titleEn,
            thumbnail: variant?.imageUrl || product.thumbnail,
            price: variant?.price || product.price,
            originalPrice: variant?.originalPrice || product.originalPrice,
            quantity,
            variant,
          };
          set({ items: [newItem, ...currentItems], isCartOpen: true });
        }
      },

      removeItem: (cartItemId) => {
        set({ items: get().items.filter((it) => it.id !== cartItemId) });
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set({
          items: get().items.map((it) =>
            it.id === cartItemId ? { ...it, quantity } : it
          ),
        });
      },

      clearCart: () => {
        set({ items: [], voucherCode: undefined, discountRate: 0, fixedDiscount: 0 });
      },

      applyVoucher: (code) => {
        const cleanCode = code.trim().toUpperCase();
        if (cleanCode === "OKZ10" || cleanCode === "WELCOME10") {
          set({ voucherCode: cleanCode, discountRate: 0.1, fixedDiscount: 0 });
          return { success: true, message: "Áp dụng giảm giá 10% thành công!" };
        } else if (cleanCode === "LUXURY20" || cleanCode === "OKZVIP") {
          set({ voucherCode: cleanCode, discountRate: 0.2, fixedDiscount: 0 });
          return { success: true, message: "Áp dụng giảm giá 20% đặc quyền thành công!" };
        } else if (cleanCode === "FREESHIP") {
          set({ voucherCode: cleanCode, discountRate: 0, fixedDiscount: 50000 });
          return { success: true, message: "Áp dụng miễn phí vận chuyển thành công!" };
        }
        return { success: false, message: "Mã ưu đãi không hợp lệ hoặc đã hết hạn" };
      },

      removeVoucher: () => {
        set({ voucherCode: undefined, discountRate: 0, fixedDiscount: 0 });
      },

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set({ isCartOpen: !get().isCartOpen }),

      getSubtotal: () => {
        return get().items.reduce((sum, it) => sum + it.price * it.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const rateDiscount = subtotal * get().discountRate;
        return rateDiscount + get().fixedDiscount;
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= 2000000 || get().voucherCode === "FREESHIP") {
          return 0;
        }
        return 35000;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        return Math.max(0, subtotal - discount + shipping);
      },

      getTotalItemsCount: () => {
        return get().items.reduce((sum, it) => sum + it.quantity, 0);
      },
    }),
    {
      name: STORAGE_KEYS.CART,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        voucherCode: state.voucherCode,
        discountRate: state.discountRate,
        fixedDiscount: state.fixedDiscount,
      }),
    }
  )
);
