import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (
    !session?.user ||
    !["SUPER_ADMIN", "STAFF"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "json";

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: { include: { product: { select: { nameEn: true } } } },
    },
  });

  if (format === "csv") {
    const headers = [
      "Order Number",
      "Customer Name",
      "Customer Email",
      "Status",
      "Payment Status",
      "Subtotal (DZD)",
      "Tax (DZD)",
      "Delivery (DZD)",
      "Total (DZD)",
      "Items",
      "Created At",
    ];

    const rows = orders.map((o) => [
      o.orderNumber,
      o.user?.name ?? "Guest",
      o.user?.email ?? "—",
      o.status,
      o.paymentStatus,
      Number(o.subtotal).toFixed(2),
      Number(o.taxAmount).toFixed(2),
      Number(o.deliveryCost).toFixed(2),
      Number(o.total).toFixed(2),
      o.items.map((i) => `${i.product?.nameEn ?? "?"} x${i.quantity}`).join("; "),
      new Date(o.createdAt).toISOString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="esmae-orders-${Date.now()}.csv"`,
      },
    });
  }

  return NextResponse.json({ success: true, data: orders });
}

export const runtime = "nodejs";
