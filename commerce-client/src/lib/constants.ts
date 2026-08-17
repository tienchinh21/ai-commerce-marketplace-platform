export const SITE_CONFIG = {
  name: "OKZ Commerce",
  description: "Nền tảng mua sắm thông minh cao cấp kết hợp AI và công nghệ hiện đại.",
  url: "https://okzcommerce.vn",
  ogImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
  contactEmail: "support@okzcommerce.vn",
  hotline: "1900 6868",
};

export const ROUTES = {
  vi: {
    home: "/vi",
    products: "/vi/san-pham",
    productDetail: (slug: string) => `/vi/san-pham/${slug}`,
    checkout: "/vi/thanh-toan",
    orderHistory: "/vi/lich-su-don-hang",
    profile: "/vi/tai-khoan",
    login: "/vi/dang-nhap",
  },
  en: {
    home: "/en",
    products: "/en/products",
    productDetail: (slug: string) => `/en/products/${slug}`,
    checkout: "/en/checkout",
    orderHistory: "/en/order-history",
    profile: "/en/profile",
    login: "/en/login",
  },
};

export const STORAGE_KEYS = {
  CART: "okz_cart_storage",
  AUTH: "okz_auth_storage",
  LOCALE: "okz_preferred_locale",
};
