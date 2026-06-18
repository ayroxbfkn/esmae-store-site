"use client";

interface AnalyticsData {
  revenueByMonth: Array<{ month: string; revenue: number; orders: number }>;
  ordersByStatus: Array<{ status: string; _count: { id: number } }>;
  topProducts: Array<{ name: string; count: number; revenue: number }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: any;
    status: string;
    createdAt: Date;
    user: { name: string | null; email: string } | null;
  }>;
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div
      style={{
        height: "8px",
        background: "var(--primary-10)",
        borderRadius: "4px",
        overflow: "hidden",
        marginTop: "0.4rem",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: color,
          borderRadius: "4px",
          transition: "width 0.6s ease",
        }}
      />
    </div>
  );
}

export function AdminAnalyticsCharts({ data }: { data: AnalyticsData }) {
  const maxRevenue = Math.max(...data.revenueByMonth.map((m) => m.revenue), 1);
  const maxProduct = Math.max(...data.topProducts.map((p) => p.revenue), 1);

  const totalRevenue = data.revenueByMonth.reduce((sum, m) => sum + m.revenue, 0);
  const totalOrders = data.revenueByMonth.reduce((sum, m) => sum + m.orders, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Summary row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {[
          { label: "6-Month Revenue", value: `${totalRevenue.toLocaleString()} DZD`, color: "var(--primary)" },
          { label: "6-Month Orders", value: totalOrders.toLocaleString(), color: "var(--accent)" },
          { label: "Avg Order Value", value: totalOrders > 0 ? `${Math.round(totalRevenue / totalOrders).toLocaleString()} DZD` : "—", color: "var(--deep-luxury)" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              border: "1px solid var(--primary-20)",
              borderRadius: "6px",
              padding: "1.25rem 1.5rem",
              borderTop: `3px solid ${s.color}`,
            }}
          >
            <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a8aaa", marginBottom: "0.5rem" }}>
              {s.label}
            </div>
            <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", fontWeight: 300, color: "var(--deep-luxury)" }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Revenue by month */}
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--primary-20)",
            borderRadius: "6px",
            padding: "1.5rem",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.2rem",
              fontWeight: 400,
              color: "var(--deep-luxury)",
              marginBottom: "1.5rem",
            }}
          >
            Revenue by Month
          </h3>
          {data.revenueByMonth.length === 0 ? (
            <div style={{ fontSize: "0.8rem", color: "#9a8aaa", textAlign: "center", padding: "2rem" }}>
              No data yet
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {data.revenueByMonth.map((m) => (
                <div key={m.month}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 500, color: "var(--text-dark)" }}>
                      {m.month}
                    </span>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--primary)" }}>
                        {m.revenue.toLocaleString()} DZD
                      </span>
                      <span style={{ fontSize: "0.65rem", color: "#9a8aaa", marginLeft: "0.5rem" }}>
                        ({m.orders} orders)
                      </span>
                    </div>
                  </div>
                  <Bar value={m.revenue} max={maxRevenue} color="var(--primary)" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders by status */}
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--primary-20)",
            borderRadius: "6px",
            padding: "1.5rem",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.2rem",
              fontWeight: 400,
              color: "var(--deep-luxury)",
              marginBottom: "1.5rem",
            }}
          >
            Orders by Status
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {data.ordersByStatus.map((s) => (
              <div key={s.status} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.72rem", color: "#7a6b8a" }}>
                  {s.status.replace(/_/g, " ")}
                </span>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--deep-luxury)" }}>
                  {s._count.id}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top products */}
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--primary-20)",
          borderRadius: "6px",
          padding: "1.5rem",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "1.2rem",
            fontWeight: 400,
            color: "var(--deep-luxury)",
            marginBottom: "1.5rem",
          }}
        >
          Top Products by Revenue
        </h3>
        {data.topProducts.length === 0 ? (
          <div style={{ fontSize: "0.8rem", color: "#9a8aaa", textAlign: "center", padding: "1rem" }}>
            No order data yet
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {data.topProducts.map((p) => (
              <div key={p.name}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--text-dark)" }}>
                    {p.name}
                  </span>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--primary)" }}>
                    {p.revenue.toLocaleString()} DZD
                    <span style={{ fontSize: "0.65rem", color: "#9a8aaa", fontWeight: 400, marginLeft: "0.4rem" }}>
                      ({p.count} orders)
                    </span>
                  </span>
                </div>
                <Bar value={p.revenue} max={maxProduct} color="var(--accent)" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
