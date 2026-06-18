import { prisma } from "@/lib/prisma/client";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import type { OrderStatus } from "@prisma/client";

export async function AdminRecentOrders() {
  const orders = await prisma.order.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { select: { id: true } },
    },
  });

  return (
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
          alignItems: "center",
          justifyContent: "space-between",
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
          href="admin/orders"
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

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#faf9fc" }}>
              {["Order #", "Customer", "Items", "Total", "Status", "Date"].map(
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
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
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
                <td style={{ padding: "0.9rem 1.5rem" }}>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 500,
                      color: "var(--text-dark)",
                    }}
                  >
                    {order.user?.name ?? "Guest"}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#9a8aaa" }}>
                    {order.user?.email ?? "—"}
                  </div>
                </td>
                <td
                  style={{
                    padding: "0.9rem 1.5rem",
                    fontSize: "0.78rem",
                    color: "#7a6b8a",
                  }}
                >
                  {order.items.length}
                </td>
                <td
                  style={{
                    padding: "0.9rem 1.5rem",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "var(--deep-luxury)",
                  }}
                >
                  {Number(order.total).toLocaleString("ar-DZ")} DZD
                </td>
                <td style={{ padding: "0.9rem 1.5rem" }}>
                  <OrderStatusBadge status={order.status as OrderStatus} />
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
