import type { User, Product, Order, Quote, OrderStatus, Role, ProductCategory } from "@prisma/client";

// ─── Re-exports from Prisma ──────────────────────────────────────────────────
export type { OrderStatus, Role, ProductCategory };

// ─── Enriched types ──────────────────────────────────────────────────────────

export type ProductWithOptions = Product & {
  options: import("@prisma/client").ProductOption[];
};

export type OrderWithDetails = Order & {
  items: Array<
    import("@prisma/client").OrderItem & {
      product: Pick<Product, "nameEn" | "nameAr" | "nameFr"> | null;
    }
  >;
  statusLog: import("@prisma/client").OrderStatusLog[];
  invoice: import("@prisma/client").Invoice | null;
  user: Pick<User, "name" | "email" | "phone"> | null;
};

export type QuoteWithItems = Quote & {
  items: Array<
    import("@prisma/client").QuoteItem & {
      product: ProductWithOptions;
    }
  >;
};

// ─── API Response types ──────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginatedResponse<T> extends ApiSuccess<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// ─── i18n types ──────────────────────────────────────────────────────────────

export type Locale = "ar" | "en" | "fr";
export type Direction = "rtl" | "ltr";

export function getDirection(locale: Locale): Direction {
  return locale === "ar" ? "rtl" : "ltr";
}

export function getProductName(
  product: Pick<Product, "nameAr" | "nameEn" | "nameFr">,
  locale: Locale
): string {
  if (locale === "ar") return product.nameAr;
  if (locale === "fr") return product.nameFr;
  return product.nameEn;
}

export function getProductDesc(
  product: Pick<Product, "descAr" | "descEn" | "descFr">,
  locale: Locale
): string | null {
  if (locale === "ar") return product.descAr ?? null;
  if (locale === "fr") return product.descFr ?? null;
  return product.descEn ?? null;
}

// ─── Pricing types ───────────────────────────────────────────────────────────

export interface PriceBreakdownDisplay {
  basePrice: number;
  optionsSubtotal: number;
  quantityDiscount: number;
  ruleDiscounts: number;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  deliveryCost: number;
  total: number;
  currency: string;
  appliedRules: string[];
  unitPrice: number;
}

// ─── Form types ──────────────────────────────────────────────────────────────

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  wilaya: string;
  postalCode?: string;
}

export interface QuoteItemInput {
  productId: string;
  quantity: number;
  selectedOptions: Record<string, string>;
  notes?: string;
}
