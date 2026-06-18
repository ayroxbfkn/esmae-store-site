import { adminGetAllOrders } from "@/lib/actions/orders";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";

export const metadata = { title: "Orders | Esmae Admin" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  const page = Number(searchParams.page ?? 1);
  const status = searchParams.status as any;

  const result = await adminGetAllOrders({ page, status });

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "2rem",
              fontWeight: 300,
              color: "var(--deep-luxury)",
            }}
          >
            Orders
          </h1>
          {result.success && (
            <p style={{ fontSize: "0.8rem", color: "#9a8aaa", marginTop: "0.25rem" }}>
              {result.pagination?.total} total orders
            </p>
          )}
        </div>
        <a
          href="?export=csv"
          style={{
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--primary)",
            border: "1px solid var(--primary-40)",
            padding: "0.5rem 1.2rem",
            borderRadius: "2px",
            textDecoration: "none",
          }}
        >
          Export CSV
        </a>
      </div>

      {result.success && result.data && (
        <AdminOrdersTable
          orders={result.data}
          pagination={result.pagination!}
          currentPage={page}
        />
      )}
    </div>
  );
}
