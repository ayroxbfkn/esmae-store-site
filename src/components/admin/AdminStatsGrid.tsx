"use client";

interface Stats {
  totalOrders: number;
  monthOrders: number;
  totalRevenue: number;
  monthRevenue: number;
  pendingOrders: number;
  totalUsers: number;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("ar-DZ", {
    style: "currency",
    currency: "DZD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function AdminStatsGrid({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      sub: `${formatCurrency(stats.monthRevenue)} this month`,
      icon: "◈",
      color: "var(--primary)",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      sub: `${stats.monthOrders} this month`,
      icon: "📦",
      color: "var(--accent)",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders.toLocaleString(),
      sub: "Require attention",
      icon: "⏳",
      color: "#e8a020",
    },
    {
      label: "Registered Users",
      value: stats.totalUsers.toLocaleString(),
      sub: "Total accounts",
      icon: "◉",
      color: "var(--deep-luxury)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1.25rem",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            background: "#fff",
            border: "1px solid var(--primary-20)",
            borderRadius: "6px",
            padding: "1.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: card.color,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "1rem",
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
            <span
              style={{
                fontSize: "1.2rem",
                color: card.color,
                opacity: 0.7,
              }}
            >
              {card.icon}
            </span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "2rem",
              fontWeight: 400,
              color: "var(--deep-luxury)",
              lineHeight: 1,
              marginBottom: "0.4rem",
            }}
          >
            {card.value}
          </div>
          <div style={{ fontSize: "0.72rem", color: "#9a8aaa", fontWeight: 300 }}>
            {card.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
