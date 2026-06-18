import { prisma } from "@/lib/prisma/client";
import { AdminProductsTable } from "@/components/admin/AdminProductsTable";

export const metadata = { title: "Products | Esmae Admin" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    include: {
      options: true,
      _count: { select: { orderItems: true } },
    },
  });

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
            Products
          </h1>
          <p style={{ fontSize: "0.8rem", color: "#9a8aaa", marginTop: "0.25rem" }}>
            {products.length} products
          </p>
        </div>
        <a
          href="products/new"
          className="btn-primary"
          style={{ fontSize: "0.65rem", padding: "0.6rem 1.5rem" }}
        >
          + Add Product
        </a>
      </div>

      <AdminProductsTable products={products} />
    </div>
  );
}
