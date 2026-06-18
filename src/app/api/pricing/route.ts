import { NextRequest, NextResponse } from "next/server";
import { calculatePrice } from "@/lib/pricing/engine";
import { PriceCalculationSchema } from "@/lib/validators/schemas";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = PriceCalculationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const breakdown = await calculatePrice({
      ...parsed.data,
    });

    return NextResponse.json({ success: true, data: breakdown });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Pricing error";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}

export const runtime = "nodejs";
