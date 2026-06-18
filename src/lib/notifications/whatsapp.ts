type OrderNotificationItem = {
  quantity: number;
  unitPrice: unknown;
  lineTotal: unknown;
  configJson: unknown;
  notes?: string | null;
  product?: {
    nameEn?: string | null;
    nameAr?: string | null;
    nameFr?: string | null;
    slug?: string | null;
  } | null;
};

type OrderNotificationPayload = {
  id: string;
  orderNumber: string;
  quoteId?: string | null;
  status: string;
  paymentStatus: string;
  subtotal: unknown;
  taxAmount: unknown;
  deliveryCost: unknown;
  discountAmount: unknown;
  total: unknown;
  currency: string;
  deliveryAddress?: unknown;
  notes?: string | null;
  createdAt: Date;
  user?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
  items: OrderNotificationItem[];
};

type QuoteNotificationPayload = {
  id: string;
  guestName?: string | null;
  guestEmail?: string | null;
  status: string;
  subtotal: unknown;
  taxAmount: unknown;
  deliveryCost: unknown;
  total: unknown;
  currency: string;
  notes?: string | null;
  contactDetails?: unknown;
  createdAt: Date;
  user?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
  items: OrderNotificationItem[];
};

type WhatsAppNotificationResult =
  | { ok: true; skipped?: false }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped?: false; error: string };

const DEFAULT_OWNER_WHATSAPP_NUMBER = "213672744323";

function asNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value ?? 0);
}

function formatMoney(value: unknown, currency: string): string {
  return `${asNumber(value).toLocaleString("en-GB", {
    maximumFractionDigits: 2,
  })} ${currency}`;
}

function normalizeWhatsAppNumber(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `213${digits.slice(1)}`;
  return digits;
}

function formatJson(value: unknown): string {
  if (!value) return "None";

  if (typeof value === "string") return value;

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function formatDeliveryAddress(value: unknown): string {
  if (!value || typeof value !== "object") return "Not provided";

  const address = value as Record<string, unknown>;
  const parts = [
    address.fullName && `Name: ${address.fullName}`,
    address.phone && `Phone: ${address.phone}`,
    address.email && `Email: ${address.email}`,
    address.address && `Address: ${address.address}`,
    address.city && `City: ${address.city}`,
    address.wilaya && `Wilaya: ${address.wilaya}`,
    address.postalCode && `Postal code: ${address.postalCode}`,
    address.notes && `Notes: ${address.notes}`,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join("\n") : formatJson(value);
}

function buildOrderCreatedMessage(order: OrderNotificationPayload): string {
  const customerLines = [
    order.user?.name && `Name: ${order.user.name}`,
    order.user?.email && `Email: ${order.user.email}`,
    order.user?.phone && `Account phone: ${order.user.phone}`,
  ].filter(Boolean);

  const itemLines = order.items.map((item, index) => {
    const productName =
      item.product?.nameEn ??
      item.product?.nameFr ??
      item.product?.nameAr ??
      item.product?.slug ??
      "Unknown product";

    return [
      `${index + 1}. ${productName}`,
      `Qty: ${item.quantity}`,
      `Unit: ${formatMoney(item.unitPrice, order.currency)}`,
      `Line total: ${formatMoney(item.lineTotal, order.currency)}`,
      `Options: ${formatJson(item.configJson)}`,
      item.notes ? `Item notes: ${item.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  });

  return [
    "New order created",
    "",
    `Order: ${order.orderNumber}`,
    `Order ID: ${order.id}`,
    order.quoteId ? `Quote ID: ${order.quoteId}` : null,
    `Status: ${order.status}`,
    `Payment: ${order.paymentStatus}`,
    `Created: ${order.createdAt.toLocaleString("en-GB")}`,
    "",
    "Customer",
    customerLines.length > 0 ? customerLines.join("\n") : "No account details found",
    "",
    "Delivery",
    formatDeliveryAddress(order.deliveryAddress),
    "",
    "Order items",
    itemLines.join("\n\n"),
    "",
    "Totals",
    `Subtotal: ${formatMoney(order.subtotal, order.currency)}`,
    `Tax: ${formatMoney(order.taxAmount, order.currency)}`,
    `Delivery: ${formatMoney(order.deliveryCost, order.currency)}`,
    `Discount: ${formatMoney(order.discountAmount, order.currency)}`,
    `Total: ${formatMoney(order.total, order.currency)}`,
    "",
    "Order notes",
    order.notes?.trim() || "None",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

function splitMessage(message: string, maxLength = 3500): string[] {
  if (message.length <= maxLength) return [message];

  const chunks: string[] = [];
  let remaining = message;

  while (remaining.length > maxLength) {
    const splitAt = remaining.lastIndexOf("\n\n", maxLength);
    const end = splitAt > 0 ? splitAt : maxLength;
    chunks.push(remaining.slice(0, end).trim());
    remaining = remaining.slice(end).trim();
  }

  if (remaining) chunks.push(remaining);

  return chunks.map((chunk, index) =>
    chunks.length > 1 ? `Part ${index + 1}/${chunks.length}\n\n${chunk}` : chunk
  );
}

function buildQuoteCreatedMessage(quote: QuoteNotificationPayload): string {
  const customerLines = [
    quote.user?.name && `Name: ${quote.user.name}`,
    quote.user?.email && `Email: ${quote.user.email}`,
    quote.user?.phone && `Account phone: ${quote.user.phone}`,
    quote.guestName && `Submitted name: ${quote.guestName}`,
    quote.guestEmail && `Submitted email: ${quote.guestEmail}`,
  ].filter(Boolean);

  const itemLines = quote.items.map((item, index) => {
    const productName =
      item.product?.nameEn ??
      item.product?.nameFr ??
      item.product?.nameAr ??
      item.product?.slug ??
      "Unknown product";

    return [
      `${index + 1}. ${productName}`,
      `Qty: ${item.quantity}`,
      `Unit: ${formatMoney(item.unitPrice, quote.currency)}`,
      `Line total: ${formatMoney(item.lineTotal, quote.currency)}`,
      `Options: ${formatJson(item.configJson)}`,
      item.notes ? `Item notes: ${item.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  });

  return [
    "New quote/order request submitted",
    "",
    `Quote ID: ${quote.id}`,
    `Status: ${quote.status}`,
    `Created: ${quote.createdAt.toLocaleString("en-GB")}`,
    "",
    "Customer",
    customerLines.length > 0 ? customerLines.join("\n") : "Guest or no account details found",
    "",
    "Submitted contact details",
    formatDeliveryAddress(quote.contactDetails),
    "",
    "Requested items",
    itemLines.join("\n\n"),
    "",
    "Totals",
    `Subtotal: ${formatMoney(quote.subtotal, quote.currency)}`,
    `Tax: ${formatMoney(quote.taxAmount, quote.currency)}`,
    `Delivery: ${formatMoney(quote.deliveryCost, quote.currency)}`,
    `Total: ${formatMoney(quote.total, quote.currency)}`,
    "",
    "Quote notes",
    quote.notes?.trim() || "None",
  ].join("\n");
}

async function sendWhatsAppMessages(messages: string[]): Promise<WhatsAppNotificationResult> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = normalizeWhatsAppNumber(
    process.env.WHATSAPP_TO_NUMBER ?? DEFAULT_OWNER_WHATSAPP_NUMBER
  );

  if (!accessToken || !phoneNumberId) {
    return {
      ok: false,
      skipped: true,
      reason: "WhatsApp is not configured. Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID.",
    };
  }

  const apiVersion = process.env.WHATSAPP_GRAPH_API_VERSION ?? "v20.0";
  const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  try {
    for (const message of messages) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to,
          type: "text",
          text: {
            preview_url: false,
            body: message,
          },
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        return {
          ok: false,
          error: `WhatsApp API returned ${response.status}: ${body}`,
        };
      }
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown WhatsApp notification error",
    };
  }
}

export async function sendOrderCreatedWhatsAppNotification(
  order: OrderNotificationPayload
): Promise<WhatsAppNotificationResult> {
  return sendWhatsAppMessages(splitMessage(buildOrderCreatedMessage(order)));
}

export async function sendQuoteCreatedWhatsAppNotification(
  quote: QuoteNotificationPayload
): Promise<WhatsAppNotificationResult> {
  return sendWhatsAppMessages(splitMessage(buildQuoteCreatedMessage(quote)));
}
