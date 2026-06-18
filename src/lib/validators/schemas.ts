import { z } from "zod";

export const ContactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  service: z.string().min(1),
  message: z.string().min(10).max(2000),
});

export const PriceCalculationSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().positive().min(1).max(100000),
  selectedOptions: z.record(z.string()),
});

export const QuoteItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().positive(),
  selectedOptions: z.record(z.string()),
  notes: z.string().max(500).optional(),
});

export const CreateOrderSchema = z.object({
  quoteId: z.string().cuid().optional(),
  items: z.array(QuoteItemSchema).min(1),
  deliveryAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(8),
    address: z.string().min(5),
    city: z.string().min(2),
    wilaya: z.string().min(2),
    postalCode: z.string().optional(),
  }),
  notes: z.string().max(1000).optional(),
});

export const ProductSchema = z.object({
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  category: z.enum([
    "BUSINESS_STATIONERY",
    "WEDDING_EVENTS",
    "LUXURY_PACKAGING",
    "LARGE_FORMAT",
    "CORPORATE_PUBLISHING",
    "SPECIAL_FINISHES",
  ]),
  nameAr: z.string().min(2).max(200),
  nameEn: z.string().min(2).max(200),
  nameFr: z.string().min(2).max(200),
  descAr: z.string().max(2000).optional(),
  descEn: z.string().max(2000).optional(),
  descFr: z.string().max(2000).optional(),
  basePrice: z.number().positive(),
  minQuantity: z.number().int().positive().default(50),
  maxQuantity: z.number().int().positive().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const PricingRuleSchema = z.object({
  productId: z.string().cuid().optional(),
  name: z.string().min(2).max(200),
  ruleType: z.enum([
    "quantity_discount",
    "finish_surcharge",
    "seasonal",
  ]),
  conditionJson: z.record(z.unknown()),
  actionJson: z.record(z.unknown()),
  priority: z.number().int().default(0),
  isActive: z.boolean().default(true),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain uppercase, lowercase, and number"
  ),
  phone: z.string().optional(),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;
export type PriceCalculationData = z.infer<typeof PriceCalculationSchema>;
export type CreateOrderData = z.infer<typeof CreateOrderSchema>;
export type ProductData = z.infer<typeof ProductSchema>;
export type PricingRuleData = z.infer<typeof PricingRuleSchema>;
export type SignInData = z.infer<typeof SignInSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
