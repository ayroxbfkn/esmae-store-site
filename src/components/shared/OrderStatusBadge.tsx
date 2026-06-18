import type { OrderStatus } from "@prisma/client";

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; color: string }> = {
  PENDING:       { label: "Pending",       bg: "#fff8e1", color: "#f57f17" },
  CONFIRMED:     { label: "Confirmed",     bg: "#e3f2fd", color: "#1565c0" },
  IN_PRODUCTION: { label: "In Production", bg: "#f3e5f5", color: "#7b1fa2" },
  READY:         { label: "Ready",         bg: "#e8f5e9", color: "#2e7d32" },
  SHIPPED:       { label: "Shipped",       bg: "#e8eaf6", color: "#3949ab" },
  COMPLETED:     { label: "Completed",     bg: "#e0f2f1", color: "#00695c" },
  CANCELLED:     { label: "Cancelled",     bg: "#fce4ec", color: "#c62828" },
  REFUNDED:      { label: "Refunded",      bg: "#fafafa", color: "#616161" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    bg: "#f5f5f5",
    color: "#616161",
  };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.22rem 0.6rem",
        borderRadius: "2px",
        fontSize: "0.62rem",
        fontWeight: 700,
        letterSpacing: "0.06em",
        background: config.bg,
        color: config.color,
        whiteSpace: "nowrap",
      }}
    >
      {config.label}
    </span>
  );
}
