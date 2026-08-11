export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  status: string;
  paymentStatus: string;
  totalAmount: string;
  currency: string;
  orderedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  createdAt: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}

export interface OrderListParams {
  buyerId?: string;
  sellerId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface OrderItemPayload {
  productId: string;
  variantId?: string | null;
  quantity: number;
  unitPrice: number;
}

export interface OrderPayload {
  buyerId: string;
  sellerId: string;
  status?: string;
  paymentStatus?: string;
  currency?: string;
  items: OrderItemPayload[];
}

export interface CreatedResourceResponse {
  success: true;
  id: string;
  message: string;
}
