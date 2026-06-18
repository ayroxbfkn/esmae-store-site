"use client";

import { useState } from "react";
import { adminUpdateOrderStatus } from "@/lib/actions/orders";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import type { OrderStatus } from "@prisma/client";

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "IN_PRODUCTION",
  "READY",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
];

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: any;
  createdAt: Date;
  user: { name: string | null; email: string } | null;
  items: Array<{ product: { nameEn: string } | null }>;
  invoice: { id: string } | null;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export function AdminOrdersTable({
  orders,
  pagination,
  currentPage,
}: {
  orders: Order[];
  pagination: Pagination;
  currentPage: number;
}) {
  const [updating, setUpdating] = useState<string | null>(null);

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    setUpdating(orderId);
    await adminUpdateOrderStatus(orderId, status);
    setUpdating(null);
  }

  return (
    <div>
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--primary-20)",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#faf9fc" }}>
                {[
                  "Order #",
                  "Customer",
                  "Products",
                  "Total",
                  "Status",
                  "Date",
                  "Actions",
                ].map((h) => (
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
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  style={{
                    borderBottom: "1px solid rgba(101,76,142,0.06)",
                    opacity: updating === order.id ? 0.5 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  <td
                    style={{
                      padding: "0.9rem 1.25rem",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "var(--primary)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {order.orderNumber}
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem" }}>
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
                      padding: "0.9rem 1.25rem",
                      fontSize: "0.75rem",
                      color: "#7a6b8a",
                      maxWidth: "200px",
                    }}
                  >
                    {order.items
                      .slice(0, 2)
                      .map((i) => i.product?.nameEn ?? "—")
                      .join(", ")}
                    {order.items.length > 2 && (
                      <span style={{ color: "#9a8aaa" }}>
                        {" "}+{order.items.length - 2} more
                      </span>
                    )}
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
                  <td style={{ padding: "0.9rem 1.25rem" }}>
                    <select
                      defaultValue={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value as OrderStatus
                        )
                      }
                      disabled={updating === order.id}
                      style={{
                        fontSize: "0.68rem",
                        padding: "0.3rem 0.6rem",
                        border: "1px solid var(--primary-20)",
                        borderRadius: "2px",
                        color: "var(--text-dark)",
                        background: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "1.5rem",
        }}
      >
        <div style={{ fontSize: "0.75rem", color: "#9a8aaa" }}>
          Showing {(currentPage - 1) * pagination.limit + 1}–
          {Math.min(currentPage * pagination.limit, pagination.total)} of{" "}
          {pagination.total}
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {currentPage > 1 && (
            <a
              href={`?page=${currentPage - 1}`}
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
          {currentPage < pagination.pages && (
            <a
              href={`?page=${currentPage + 1}`}
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
      </div>
    </div>
  );
}
