"use server";

import { ContactFormSchema, type ContactFormData } from "@/lib/validators/schemas";
import { prisma } from "@/lib/prisma/client";
import { headers } from "next/headers";
import { redis } from "@/lib/redis/client";

export async function submitContact(data: ContactFormData) {
  // Validate
  const parsed = ContactFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data." };
  }

  // Rate limiting: max 3 submissions per IP per hour
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown";
  const rateLimitKey = `contact_rl:${ip}`;

  try {
    const count = await redis.incr(rateLimitKey);
    if (count === 1) await redis.expire(rateLimitKey, 3600);
    if (count > 3) {
      return {
        success: false,
        error: "Too many submissions. Please try again later.",
      };
    }
  } catch {
    // Redis unavailable - allow submission
  }

  // Store in DB (optional, could also send email)
  try {
    // For now we just log. In production, save to a contacts table or send email.
    console.info("[Contact Form]", {
      name: parsed.data.name,
      email: parsed.data.email,
      service: parsed.data.service,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  } catch (err) {
    console.error("[Contact Form Error]", err);
    return { success: false, error: "Failed to send message. Please try again." };
  }
}
