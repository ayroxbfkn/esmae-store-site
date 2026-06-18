import { prisma } from "@/lib/prisma/client";
import { cacheGet, cacheSet } from "@/lib/redis/client";
import type { PricingRule, ProductOption, QuantityTier } from "@prisma/client";

export interface PriceConfig {
  productId: string;
  quantity: number;
  selectedOptions: Record<string, string>; // key -> value
  locale?: string;
}

export interface PriceBreakdown {
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

const TAX_RATE = 0.19; // 19% TVA Algeria
const BASE_DELIVERY = 500; // DZD
const FREE_DELIVERY_THRESHOLD = 15000; // DZD

export async function calculatePrice(
  config: PriceConfig
): Promise<PriceBreakdown> {
  const cacheKey = `price:${JSON.stringify(config)}`;
  const cached = await cacheGet<PriceBreakdown>(cacheKey);
  if (cached) return cached;

  const product = await prisma.product.findUnique({
    where: { id: config.productId, isActive: true },
    include: { options: true, pricingRules: { where: { isActive: true } } },
  });

  if (!product) throw new Error("Product not found or inactive");
  if (config.quantity < product.minQuantity) {
    throw new Error(`Minimum quantity is ${product.minQuantity}`);
  }

  let basePrice = Number(product.basePrice);

  // ─── 1. Apply selected option multipliers / added costs ─────────────────
  let optionsSubtotal = 0;
  for (const [key, value] of Object.entries(config.selectedOptions)) {
    const option = product.options.find(
      (o) => o.key === key && o.value === value
    );
    if (option) {
      basePrice = basePrice * Number(option.multiplier);
      optionsSubtotal += Number(option.addedCost);
    }
  }

  const pricePerUnit = basePrice + optionsSubtotal;
  let lineTotal = pricePerUnit * config.quantity;

  // ─── 2. Quantity-based discount tiers ───────────────────────────────────
  const quantityTiers = await getQuantityTiers(config.productId);
  let quantityDiscount = 0;
  const applicableTier = quantityTiers
    .filter((t) => config.quantity >= t.minQty)
    .sort((a, b) => b.minQty - a.minQty)[0];

  if (applicableTier) {
    quantityDiscount = lineTotal * (Number(applicableTier.discountPct) / 100);
  }

  // ─── 3. Active pricing rules ────────────────────────────────────────────
  const allRules = await getActiveRules(config.productId);
  let ruleDiscounts = 0;
  const appliedRules: string[] = [];

  for (const rule of allRules.sort((a, b) => b.priority - a.priority)) {
    const match = evaluateRule(rule, config, lineTotal);
    if (match.matches) {
      ruleDiscounts += match.discount;
      appliedRules.push(rule.name);
      if (match.stopProcessing) break;
    }
  }

  // ─── 5. Final calculations ───────────────────────────────────────────────
  const subtotal = Math.max(0, lineTotal - quantityDiscount - ruleDiscounts);
  const taxAmount = subtotal * TAX_RATE;
  const deliveryCost =
    subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : BASE_DELIVERY;
  const total = subtotal + taxAmount + deliveryCost;

  const result: PriceBreakdown = {
    basePrice: Number(product.basePrice),
    optionsSubtotal,
    quantityDiscount,
    ruleDiscounts,
    subtotal,
    taxRate: TAX_RATE,
    taxAmount,
    deliveryCost,
    total,
    currency: "DZD",
    appliedRules,
    unitPrice: subtotal / config.quantity,
  };

  // Cache for 5 minutes
  await cacheSet(cacheKey, result, 300);
  return result;
}

// ─── Rule Evaluator ──────────────────────────────────────────────────────────

interface RuleResult {
  matches: boolean;
  discount: number;
  stopProcessing: boolean;
}

function evaluateRule(
  rule: PricingRule,
  config: PriceConfig,
  lineTotal: number
): RuleResult {
  const condition = rule.conditionJson as Record<string, unknown>;
  const action = rule.actionJson as Record<string, unknown>;

  // Check date validity
  const now = new Date();
  if (rule.startsAt && now < rule.startsAt)
    return { matches: false, discount: 0, stopProcessing: false };
  if (rule.endsAt && now > rule.endsAt)
    return { matches: false, discount: 0, stopProcessing: false };

  let matches = false;

  switch (rule.ruleType) {
    case "quantity_discount": {
      const minQty = condition.minQuantity as number;
      const maxQty = condition.maxQuantity as number | undefined;
      matches =
        config.quantity >= minQty &&
        (maxQty === undefined || config.quantity <= maxQty);
      break;
    }
    case "finish_surcharge": {
      const finish = condition.finish as string;
      matches = config.selectedOptions["finish"] === finish;
      break;
    }
    case "seasonal": {
      matches = true; // date range already checked above
      break;
    }
    default:
      matches = false;
  }

  if (!matches) return { matches: false, discount: 0, stopProcessing: false };

  let discount = 0;
  const actionType = action.type as string;

  if (actionType === "percent_off") {
    discount = lineTotal * ((action.value as number) / 100);
  } else if (actionType === "fixed_off") {
    discount = action.value as number;
  } else if (actionType === "multiply") {
    discount = lineTotal - lineTotal * (action.value as number);
  }

  return {
    matches: true,
    discount: Math.max(0, discount),
    stopProcessing: (action.stopProcessing as boolean) ?? false,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getQuantityTiers(productId: string) {
  const cacheKey = `qty_tiers:${productId}`;
  const cached = await cacheGet<QuantityTier[]>(cacheKey);
  if (cached) return cached;

  const tiers = await prisma.quantityTier.findMany({
    where: {
      OR: [{ productId }, { productId: null }],
    },
    orderBy: { minQty: "asc" },
  });

  await cacheSet(cacheKey, tiers, 600);
  return tiers;
}

async function getActiveRules(productId: string) {
  const cacheKey = `pricing_rules:${productId}`;
  const cached = await cacheGet<PricingRule[]>(cacheKey);
  if (cached) return cached;

  const rules = await prisma.pricingRule.findMany({
    where: {
      isActive: true,
      OR: [{ productId }, { productId: null }],
    },
    orderBy: { priority: "desc" },
  });

  await cacheSet(cacheKey, rules, 300);
  return rules;
}

// ─── Order number generator ──────────────────────────────────────────────────

export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.order.count({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
      },
    },
  });
  const seq = String(count + 1).padStart(6, "0");
  return `ESM-${year}-${seq}`;
}
