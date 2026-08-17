import { ProductVariant } from "./product";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "COD" | "BANK_TRANSFER" | "CREDIT_CARD" | "MOMO";

export interface ShippingAddress {
  id?: string;
  fullName: string;
  phone: string;
  email?: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  isDefault?: boolean;
  notes?: string;
}

export interface CartItem {
  id: string; // unique item identifier in cart
  productId: string;
  slug: string;
  title: string;
  titleEn: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  variant?: ProductVariant;
}

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productTitleEn: string;
  thumbnail: string;
  price: number;
  quantity: number;
  variantName?: string;
  variantNameEn?: string;
}

export interface OrderTimelineStep {
  status: OrderStatus;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  timestamp: string;
  isCompleted: boolean;
  isCurrent?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: "UNPAID" | "PAID";
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  voucherCode?: string;
  total: number;
  timeline: OrderTimelineStep[];
}
