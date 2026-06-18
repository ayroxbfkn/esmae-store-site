import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";
import { CreateOrderSchema } from "@/lib/validators/schemas";
import { calculatePrice, generateOrderNumber } from "@/lib/pricing/engine";
import { createCheckoutSession } from "@/lib/stripe/client";
import { sendOrderCreatedWhatsAppNotification } from "@/lib/notifications/whatsapp";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        items: { include: { product: { select: { nameEn: true } } } },
        statusLog: { orderBy: { createdAt: "desc" }, take: 1 },
        invoice: { select: { pdfUrl: true, invoiceNumber: true } },
      },
    }),
    prisma.order.count({ where: { userId: session.user.id } }),
  ]);

  return NextResponse.json({
    success: true,
    data: orders,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { items, deliveryAddress, notes } = parsed.data;

  try {
    // Calculate prices server-side (never trust client prices)
    let subtotal = 0;
    let taxAmount = 0;
    let deliveryCost = 0;
    const orderItems = [];

    for (const item of items) {
      const breakdown = await calculatePrice({
        productId: item.productId,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions,
      });

      subtotal += breakdown.subtotal;
      taxAmount += breakdown.taxAmount;
      deliveryCost = breakdown.deliveryCost; // use last (they should be equal)

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        configJson: item.selectedOptions,
        unitPrice: breakdown.unitPrice,
        lineTotal: breakdown.subtotal,
        notes: item.notes,
      });
    }

    const total = subtotal + taxAmount + deliveryCost;
    const orderNumber = await generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        quoteId: parsed.data.quoteId ?? null,
        status: "PENDING",
        paymentStatus: "UNPAID",
        subtotal,
        taxAmount,
        deliveryCost,
        discountAmount: 0,
        total,
        currency: "DZD",
        deliveryAddress,
        notes: notes ?? null,
        items: { create: orderItems },
        statusLog: {
          create: { status: "PENDING", note: "Order created" },
        },
      },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: {
          include: {
            product: {
              select: {
                nameEn: true,
                nameAr: true,
                nameFr: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    const whatsappNotification = await sendOrderCreatedWhatsAppNotification(order);
    if (!whatsappNotification.ok) {
      console.warn("[WhatsAppOrderNotification]", whatsappNotification);
    }

    // Create Stripe checkout session
    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL!;
    const locale = request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ?? "en";

    const stripeSession = await createCheckoutSession({
      orderId: order.id,
      orderNumber: order.orderNumber,
      lineItems: order.items.map((item) => ({
        name: item.product.nameEn,
        quantity: item.quantity,
        unitAmount: Number(item.unitPrice),
      })),
      locale,
      successUrl: `${origin}/${locale}/dashboard?order=${order.orderNumber}&status=success`,
      cancelUrl: `${origin}/${locale}/dashboard?order=${order.orderNumber}&status=cancelled`,
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        checkoutUrl: stripeSession.url,
      },
    });
  } catch (err) {
    console.error("[CreateOrder]", err);
    const message = err instanceof Error ? err.message : "Order creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const runtime = "nodejs";
