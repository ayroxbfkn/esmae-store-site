import { prisma } from "@/lib/prisma/client";
import { AdminAnalyticsCharts } from "@/components/admin/AdminAnalyticsCharts";

export const metadata = { title: "Analytics | Esmae Admin" };

async function getAnalyticsData() {
  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [
    revenueByMonth,
    ordersByStatus,
    topProducts,
    recentOrders,
  ] = await prisma.$transaction([
    // Revenue grouped by month (raw query for aggregation)
    prisma.$queryRaw<Array<{ month: string; revenue: number; orders: number }>>`
      SELECT
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') as month,
        SUM(total)::float as revenue,
        COUNT(*)::int as orders
      FROM "Order"
      WHERE "createdAt" >= ${sixMonthsAgo}
        AND status = 'COMPLETED'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt") ASC
    `,
    prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
      orderBy: { status: "asc" },
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _count: { id: true },
      _sum: { lineTotal: true },
      orderBy: { _sum: { lineTotal: "desc" } },
      take: 5,
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  // Enrich top products with names
  const productIds = topProducts.map((p) => p.productId);
  const productNames = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, nameEn: true },
  });
  const nameMap = Object.fromEntries(productNames.map((p) => [p.id, p.nameEn]));

  return {
    revenueByMonth,
    ordersByStatus: ordersByStatus.map((o) => ({
      status: o.status,
      _count: { id: (o._count as any)?.id ?? 0 },
    })),
    topProducts: topProducts.map((p) => ({
      name: nameMap[p.productId] ?? "Unknown",
      count: (p._count as any)?.id ?? 0,
      revenue: Number((p._sum as any)?.lineTotal ?? 0),
    })),
    recentOrders,
  };
}

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "2rem",
            fontWeight: 300,
            color: "var(--deep-luxury)",
          }}
        >
          Analytics
        </h1>
        <p style={{ fontSize: "0.8rem", color: "#9a8aaa", marginTop: "0.25rem" }}>
          Last 6 months performance overview
        </p>
      </div>

      <AdminAnalyticsCharts data={data} />
    </div>
  );
}
