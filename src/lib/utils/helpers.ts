import { type ClassValue, clsx } from "clsx";

// ─── Class merging ───────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

// ─── Currency formatting ─────────────────────────────────────────────────────
export function formatCurrency(
  amount: number,
  currency = "DZD",
  locale = "fr-DZ"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Date formatting ─────────────────────────────────────────────────────────
export function formatDate(
  date: Date | string,
  locale = "en-GB",
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

// ─── Slug generation ─────────────────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// ─── Order number display ────────────────────────────────────────────────────
export function formatOrderNumber(orderNumber: string): string {
  return orderNumber.toUpperCase();
}

// ─── Truncate text ───────────────────────────────────────────────────────────
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

// ─── Sleep (for dev/testing) ─────────────────────────────────────────────────
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Safe JSON parse ─────────────────────────────────────────────────────────
export function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

// ─── Percentage ──────────────────────────────────────────────────────────────
export function pct(value: number, total: number, decimals = 1): string {
  if (total === 0) return "0%";
  return `${((value / total) * 100).toFixed(decimals)}%`;
}

// ─── Initials ────────────────────────────────────────────────────────────────
export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}
