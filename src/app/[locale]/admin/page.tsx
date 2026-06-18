import { adminGetDashboardStats } from "@/lib/actions/orders";
import { AdminStatsGrid } from "@/components/admin/AdminStatsGrid";
import { AdminRecentOrders } from "@/components/admin/AdminRecentOrders";

export const metadata = { title: "Admin Dashboard | Esmae" };

export default async function AdminDashboardPage({
  params,
}: {
  params: { locale: string };
}) {
  const statsResult = await adminGetDashboardStats();

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
          Dashboard
        </h1>
        <p
          style={{
            fontSize: "0.8rem",
            color: "#9a8aaa",
            marginTop: "0.25rem",
          }}
        >
          Welcome back. Here's what's happening today.
        </p>
      </div>

      {statsResult.success && statsResult.data && (
        <AdminStatsGrid stats={statsResult.data} />
      )}

      <div style={{ marginTop: "2.5rem" }}>
        <AdminRecentOrders />
      </div>
    </div>
  );
}
