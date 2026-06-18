import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import type { OrderStatus } from "@prisma/client";

export const metadata = { title: "My Orders | Esmae B2B" };

export default async function B2BOrdersPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { page?: string };
}) {
  const session = await auth();
  const userId = session!.user.id;
  const page = Number(searchParams.page ?? 1);
  const limit = 15;

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        items: {
          include: { product: { select: { nameEn: true } } },
        },
        statusLog: { orderBy: { createdAt: "asc" } },
        invoice: true,
      },
    }),
    prisma.order.count({ where: { userId } }),
  ]);

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
          My Orders
        </h1>
        <p style={{ fontSize: "0.8rem", color: "#9a8aaa", marginTop: "0.25rem" }}>
          {total} total orders
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid var(--primary-20)",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#faf9fc" }}>
              {["Order #", "Products", "Total", "Status", "Progress", "Invoice", "Date"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0.8rem 1.25rem",
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
            {orders.map((order) => {
              const statusSteps = [
                "PENDING",
                "CONFIRMED",
                "IN_PRODUCTION",
                "READY",
                "SHIPPED",
                "COMPLETED",
              ];
              const currentStep = statusSteps.indexOf(order.status);
              const progressPct =
                currentStep >= 0
                  ? ((currentStep + 1) / statusSteps.length) * 100
                  : 0;

              return (
                <tr
                  key={order.id}
                  style={{ borderBottom: "1px solid rgba(101,76,142,0.06)" }}
                >
                  <td
                    style={{
                      padding: "0.9rem 1.25rem",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "var(--primary)",
                    }}
                  >
                    {order.orderNumber}
                  </td>
                  <td
                    style={{
                      padding: "0.9rem 1.25rem",
                      fontSize: "0.75rem",
                      color: "#7a6b8a",
                      maxWidth: "180px",
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
                      padding: "0.9rem 1.25rem",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "var(--deep-luxury)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {Number(order.total).toLocaleString()} DZD
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem" }}>
                    <OrderStatusBadge status={order.status as OrderStatus} />
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem", minWidth: "120px" }}>
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
                          width: `${progressPct}%`,
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
                        fontSize: "0.62rem",
                        color: "#9a8aaa",
                        marginTop: "0.25rem",
                      }}
                    >
                      {Math.round(progressPct)}% complete
                    </div>
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem" }}>
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
                        Download
                      </a>
                    ) : (
                      <span style={{ fontSize: "0.72rem", color: "#ccc" }}>—</span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "0.9rem 1.25rem",
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
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    fontSize: "0.82rem",
                    color: "#9a8aaa",
                  }}
                >
                  No orders found.{" "}
                  <a
                    href={`/${params.locale}/quote-builder`}
                    style={{ color: "var(--primary)" }}
                  >
                    Create your first quote →
                  </a>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > limit && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
            marginTop: "1.5rem",
          }}
        >
          {page > 1 && (
            <a
              href={`?page=${page - 1}`}
              style={{
                padding: "0.4rem 0.8rem",
                border: "1px solid var(--primary-20)",
                borderRadius: "2px",
                fontSize: "0.72rem",
                color: "var(--primary)",
                textDecoration: "none",
              }}
            >
              ← Prev
            </a>
          )}
          {page < Math.ceil(total / limit) && (
            <a
              href={`?page=${page + 1}`}
              style={{
                padding: "0.4rem 0.8rem",
                border: "1px solid var(--primary-20)",
                borderRadius: "2px",
                fontSize: "0.72rem",
                color: "var(--primary)",
                textDecoration: "none",
              }}
            >
              Next →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
