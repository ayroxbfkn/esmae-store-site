import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import type { OrderStatus } from "@prisma/client";

export const metadata = { title: "B2B Portal | Esmae" };

export default async function B2BDashboardPage({
  params,
}: {
  params: { locale: string };
}) {
  const session = await auth();
  const userId = session!.user.id;

  const [b2bAccount, recentOrders, orderStats] = await prisma.$transaction([
    prisma.b2BAccount.findUnique({
      where: { userId },
    }),
    prisma.order.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: { select: { nameEn: true } } } },
        invoice: true,
      },
    }),
    prisma.order.aggregate({
      where: { userId },
      _count: { id: true },
      _sum: { total: true },
    }),
  ]);

  const discountPct = b2bAccount
    ? [0, 5, 10, 15, 20][Math.min(b2bAccount.discountTier, 4)]
    : 0;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "2rem",
            fontWeight: 300,
            color: "var(--deep-luxury)",
          }}
        >
          B2B Portal
        </h1>
        <p style={{ fontSize: "0.8rem", color: "#9a8aaa", marginTop: "0.25rem" }}>
          Welcome back, {session!.user.name ?? session!.user.email}
        </p>
      </div>

      {/* Account summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          {
            label: "Your Discount",
            value: `${discountPct}%`,
            sub: `Tier ${b2bAccount?.discountTier ?? 0}`,
            color: "var(--primary)",
          },
          {
            label: "Total Orders",
            value: orderStats._count.id.toLocaleString(),
            sub: "All time",
            color: "var(--accent)",
          },
          {
            label: "Total Spent",
            value: `${Number(orderStats._sum.total ?? 0).toLocaleString()} DZD`,
            sub: "All time",
            color: "var(--deep-luxury)",
          },
          {
            label: "Payment Terms",
            value: `${b2bAccount?.paymentTermsDays ?? 0} Days`,
            sub: "Invoice basis",
            color: "var(--gold)",
          },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: "#fff",
              border: "1px solid var(--primary-20)",
              borderRadius: "6px",
              padding: "1.25rem 1.5rem",
              borderTop: `3px solid ${card.color}`,
            }}
          >
            <div
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#9a8aaa",
                marginBottom: "0.5rem",
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "1.8rem",
                fontWeight: 300,
                color: "var(--deep-luxury)",
                lineHeight: 1,
              }}
            >
              {card.value}
            </div>
            <div style={{ fontSize: "0.7rem", color: "#9a8aaa", marginTop: "0.3rem" }}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Account manager note */}
      {b2bAccount?.accountManagerNote && (
        <div
          style={{
            background: "var(--light-section)",
            border: "1px solid var(--primary-20)",
            borderLeft: "3px solid var(--primary)",
            borderRadius: "4px",
            padding: "1rem 1.25rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              fontSize: "0.62rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--primary)",
              marginBottom: "0.4rem",
            }}
          >
            Note from your Account Manager
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-dark)", fontWeight: 300 }}>
            {b2bAccount.accountManagerNote}
          </p>
        </div>
      )}

      {/* Recent orders */}
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--primary-20)",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--primary-20)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.25rem",
              fontWeight: 400,
              color: "var(--deep-luxury)",
            }}
          >
            Recent Orders
          </h2>
          <a
            href={`/${params.locale}/b2b/orders`}
            style={{
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--primary)",
              textDecoration: "none",
            }}
          >
            View All →
          </a>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#faf9fc" }}>
              {["Order #", "Items", "Total", "Status", "Invoice", "Date"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "0.75rem 1.5rem",
                    textAlign: "left",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#9a8aaa",
                    borderBottom: "1px solid var(--primary-20)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                style={{ borderBottom: "1px solid rgba(101,76,142,0.06)" }}
              >
                <td
                  style={{
                    padding: "0.9rem 1.5rem",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "var(--primary)",
                  }}
                >
                  {order.orderNumber}
                </td>
                <td
                  style={{
                    padding: "0.9rem 1.5rem",
                    fontSize: "0.75rem",
                    color: "#7a6b8a",
                  }}
                >
                  {order.items
                    .slice(0, 2)
                    .map((i) => i.product?.nameEn ?? "—")
                    .join(", ")}
                  {order.items.length > 2 && ` +${order.items.length - 2}`}
                </td>
                <td
                  style={{
                    padding: "0.9rem 1.5rem",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "var(--deep-luxury)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {Number(order.total).toLocaleString()} DZD
                </td>
                <td style={{ padding: "0.9rem 1.5rem" }}>
                  <OrderStatusBadge status={order.status as OrderStatus} />
                </td>
                <td style={{ padding: "0.9rem 1.5rem" }}>
                  {order.invoice?.pdfUrl ? (
                    <a
                      href={order.invoice.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        color: "var(--primary)",
                        textDecoration: "none",
                        border: "1px solid var(--primary-40)",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "2px",
                      }}
                    >
                      PDF
                    </a>
                  ) : (
                    <span style={{ fontSize: "0.72rem", color: "#ccc" }}>—</span>
                  )}
                </td>
                <td
                  style={{
                    padding: "0.9rem 1.5rem",
                    fontSize: "0.72rem",
                    color: "#9a8aaa",
                  }}
                >
                  {new Date(order.createdAt).toLocaleDateString("en-GB")}
                </td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    fontSize: "0.82rem",
                    color: "#9a8aaa",
                  }}
                >
                  No orders yet.{" "}
                  <a
                    href={`/${params.locale}/quote-builder`}
                    style={{ color: "var(--primary)" }}
                  >
                    Start a quote →
                  </a>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
