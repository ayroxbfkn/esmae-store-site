import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import type { OrderStatus } from "@prisma/client";

export const metadata = { title: "My Dashboard | Esmae" };

export default async function DashboardPage({
  params,
}: {
  params: { locale: string };
}) {
  const session = await auth();
  const userId = session!.user.id;

  const [orders, stats] = await prisma.$transaction([
    prisma.order.findMany({
      where: { userId },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: { select: { nameEn: true } } } },
        statusLog: { orderBy: { createdAt: "desc" }, take: 1 },
        invoice: { select: { pdfUrl: true } },
      },
    }),
    prisma.order.aggregate({
      where: { userId },
      _count: { id: true },
      _sum: { total: true },
    }),
  ]);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "2.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "2.2rem",
              fontWeight: 300,
              color: "var(--deep-luxury)",
            }}
          >
            Hello, {session!.user.name?.split(" ")[0] ?? "there"}
          </h1>
          <p style={{ fontSize: "0.82rem", color: "#9a8aaa", marginTop: "0.25rem" }}>
            Here's an overview of your orders and activity.
          </p>
        </div>
        <a
          href={`/${params.locale}/quote-builder`}
          className="btn-primary"
          style={{ fontSize: "0.68rem", padding: "0.7rem 1.5rem" }}
        >
          + New Quote
        </a>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        {[
          {
            label: "Total Orders",
            value: stats._count.id,
            icon: "📦",
            color: "var(--primary)",
          },
          {
            label: "Total Spent",
            value: `${Number(stats._sum.total ?? 0).toLocaleString()} DZD`,
            icon: "◈",
            color: "var(--accent)",
          },
          {
            label: "Active Orders",
            value: orders.filter((o) =>
              ["PENDING", "CONFIRMED", "IN_PRODUCTION", "READY", "SHIPPED"].includes(
                o.status
              )
            ).length,
            icon: "⏳",
            color: "#e8a020",
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#9a8aaa",
                }}
              >
                {card.label}
              </span>
              <span style={{ fontSize: "1.1rem", opacity: 0.6 }}>{card.icon}</span>
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
          </div>
        ))}
      </div>

      {/* Orders table */}
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
            My Orders
          </h2>
        </div>

        {orders.length === 0 ? (
          <div
            style={{
              padding: "4rem",
              textAlign: "center",
              color: "#9a8aaa",
              fontSize: "0.85rem",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem", opacity: 0.3 }}>
              📦
            </div>
            <div style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
              No orders yet
            </div>
            <div style={{ fontWeight: 300, marginBottom: "1.5rem" }}>
              Start by building your first quote.
            </div>
            <a
              href={`/${params.locale}/quote-builder`}
              className="btn-primary"
              style={{ fontSize: "0.68rem" }}
            >
              Build a Quote
            </a>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#faf9fc" }}>
                  {["Order #", "Items", "Total", "Status", "Progress", "Invoice", "Date"].map(
                    (h) => (
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
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const STEPS = [
                    "PENDING",
                    "CONFIRMED",
                    "IN_PRODUCTION",
                    "READY",
                    "SHIPPED",
                    "COMPLETED",
                  ];
                  const stepIdx = STEPS.indexOf(order.status);
                  const pct =
                    stepIdx >= 0 ? ((stepIdx + 1) / STEPS.length) * 100 : 0;

                  return (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: "1px solid rgba(101,76,142,0.06)",
                      }}
                    >
                      <td
                        style={{
                          padding: "0.9rem 1.5rem",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          color: "var(--primary)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order.orderNumber}
                      </td>
                      <td
                        style={{
                          padding: "0.9rem 1.5rem",
                          fontSize: "0.75rem",
                          color: "#7a6b8a",
                          maxWidth: "160px",
                        }}
                      >
                        {order.items
                          .slice(0, 2)
                          .map((i) => i.product?.nameEn ?? "—")
                          .join(", ")}
                        {order.items.length > 2 &&
                          ` +${order.items.length - 2}`}
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
                        <OrderStatusBadge
                          status={order.status as OrderStatus}
                        />
                      </td>
                      <td
                        style={{
                          padding: "0.9rem 1.5rem",
                          minWidth: "120px",
                        }}
                      >
                        <div
                          style={{
                            height: "6px",
                            background: "var(--primary-10)",
                            borderRadius: "3px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${pct}%`,
                              background:
                                order.status === "COMPLETED"
                                  ? "#2e7d32"
                                  : order.status === "CANCELLED"
                                  ? "#c62828"
                                  : "var(--primary)",
                              borderRadius: "3px",
                              transition: "width 0.5s ease",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: "0.6rem",
                            color: "#9a8aaa",
                            marginTop: "0.2rem",
                          }}
                        >
                          {Math.round(pct)}%
                        </div>
                      </td>
                      <td style={{ padding: "0.9rem 1.5rem" }}>
                        {order.invoice?.pdfUrl ? (
                          <a
                            href={order.invoice.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: "0.65rem",
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
                          <span style={{ fontSize: "0.72rem", color: "#ccc" }}>
                            —
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "0.9rem 1.5rem",
                          fontSize: "0.72rem",
                          color: "#9a8aaa",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(order.createdAt).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
