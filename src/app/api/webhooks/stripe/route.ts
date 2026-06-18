import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe/client";
import { prisma } from "@/lib/prisma/client";
import { cacheDel } from "@/lib/redis/client";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await constructWebhookEvent(body, signature);
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (!orderId) break;

        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "PAID",
            status: "CONFIRMED",
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id,
            statusLog: {
              create: {
                status: "CONFIRMED",
                note: "Payment confirmed via Stripe",
              },
            },
          },
        });

        await cacheDel(`order:${orderId}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const orderId = pi.metadata?.orderId;

        if (!orderId) break;

        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "UNPAID",
            statusLog: {
              create: {
                status: "PENDING",
                note: "Payment failed via Stripe",
              },
            },
          },
        });
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const orderId = charge.metadata?.orderId;

        if (!orderId) break;

        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "REFUNDED",
            status: "REFUNDED",
          },
        });
        break;
      }

      default:
        // Unhandled event type - not an error
        break;
    }
  } catch (err) {
    console.error("[Stripe Webhook] Handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

export const runtime = "nodejs";
