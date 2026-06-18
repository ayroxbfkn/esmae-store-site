import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { cacheGet, cacheSet } from "@/lib/redis/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";
  const category = searchParams.get("category");

  const cacheKey = `api:products:${locale}:${category ?? "all"}`;
  const cached = await cacheGet(cacheKey);
  if (cached) {
    return NextResponse.json(
      { success: true, data: cached },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category: category as any } : {}),
    },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    include: {
      options: {
        orderBy: [{ key: "asc" }, { sortOrder: "asc" }],
      },
    },
  });

  await cacheSet(cacheKey, products, 300);

  return NextResponse.json(
    { success: true, data: products },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}

export const runtime = "nodejs";
