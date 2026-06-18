"use server";

import { calculatePrice, type PriceConfig } from "@/lib/pricing/engine";
import { PriceCalculationSchema } from "@/lib/validators/schemas";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";
import { sendQuoteCreatedWhatsAppNotification } from "@/lib/notifications/whatsapp";

type CustomerInfoInput = {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  wilaya: string;
  notes?: string;
};

export async function getPriceCalculation(input: PriceConfig) {
  const parsed = PriceCalculationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid pricing request." };
  }

  try {
    const session = await auth();
    const breakdown = await calculatePrice({
      ...parsed.data,
    });

    return { success: true, data: breakdown };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Pricing error.";
    return { success: false, error: message };
  }
}

export async function createQuoteDraft(
  items: Array<{
    productId: string;
    quantity: number;
    selectedOptions: Record<string, string>;
    notes?: string;
  }>,
  customerInfo: CustomerInfoInput
) {
  const session = await auth();

  try {
    const contact = {
      fullName: customerInfo.fullName.trim(),
      phone: customerInfo.phone.trim(),
      email: customerInfo.email?.trim() || "",
      address: customerInfo.address.trim(),
      city: customerInfo.city.trim(),
      wilaya: customerInfo.wilaya.trim(),
      notes: customerInfo.notes?.trim() || "",
    };

    if (
      contact.fullName.length < 2 ||
      contact.phone.length < 8 ||
      contact.address.length < 5 ||
      contact.city.length < 2 ||
      contact.wilaya.length < 2
    ) {
      return { success: false, error: "Please complete your contact information." };
    }

    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      return { success: false, error: "Please enter a valid email address." };
    }

    let subtotal = 0;
    const quoteItems = [];

    for (const item of items) {
      const breakdown = await calculatePrice({
        productId: item.productId,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions,
      });

      subtotal += breakdown.subtotal;
      quoteItems.push({
        productId: item.productId,
        quantity: item.quantity,
        configJson: item.selectedOptions,
        unitPrice: breakdown.unitPrice,
        lineTotal: breakdown.subtotal,
        notes: item.notes,
      });
    }

    const taxAmount = subtotal * 0.19;
    const deliveryCost = subtotal >= 15000 ? 0 : 500;
    const total = subtotal + taxAmount + deliveryCost;

    const quote = await prisma.quote.create({
      data: {
        userId: session?.user?.id ?? null,
        guestName: contact.fullName,
        guestEmail: contact.email || null,
        status: "draft",
        subtotal,
        taxAmount,
        deliveryCost,
        total,
        currency: "DZD",
        notes: [
          "Customer information",
          `Name: ${contact.fullName}`,
          `Phone: ${contact.phone}`,
          contact.email ? `Email: ${contact.email}` : null,
          `Address: ${contact.address}`,
          `City: ${contact.city}`,
          `Wilaya: ${contact.wilaya}`,
          contact.notes ? `Notes: ${contact.notes}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
        items: {
          create: quoteItems,
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

    const whatsappNotification = await sendQuoteCreatedWhatsAppNotification({
      ...quote,
      contactDetails: contact,
    });
    if (!whatsappNotification.ok) {
      console.warn("[WhatsAppQuoteNotification]", whatsappNotification);
    }

    return { success: true, data: quote };
  } catch (err) {
    console.error("[CreateQuote]", err);
    return { success: false, error: "Failed to create quote." };
  }
}
