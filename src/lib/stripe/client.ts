import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export async function createPaymentIntent(
  amountDZD: number,
  metadata: Record<string, string>
) {
  // Stripe requires smallest currency unit. DZD has 2 decimal places.
  const amountCents = Math.round(amountDZD * 100);

  const intent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: "dzd",
    metadata,
    automatic_payment_methods: { enabled: true },
  });

  return intent;
}

export async function createCheckoutSession(params: {
  orderId: string;
  orderNumber: string;
  lineItems: Array<{
    name: string;
    quantity: number;
    unitAmount: number;
  }>;
  locale: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: params.lineItems.map((item) => ({
      price_data: {
        currency: "dzd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.unitAmount * 100),
      },
      quantity: item.quantity,
    })),
    metadata: {
      orderId: params.orderId,
      orderNumber: params.orderNumber,
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    locale: (params.locale === "fr" ? "fr" : params.locale === "en" ? "en" : "auto") as any,
  });

  return session;
}

export async function constructWebhookEvent(
  body: string,
  signature: string
): Promise<Stripe.Event> {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
