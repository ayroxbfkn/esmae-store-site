import { prisma } from "@/lib/prisma/client";
import { AdminPortfolioGrid } from "@/components/admin/AdminPortfolioGrid";

export const metadata = { title: "Portfolio | Esmae Admin" };

export default async function AdminPortfolioPage() {
  const items = await prisma.portfolioItem.findMany({
    orderBy: [{ isPublished: "desc" }, { sortOrder: "asc" }],
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
            Portfolio
          </h1>
          <p style={{ fontSize: "0.8rem", color: "#9a8aaa", marginTop: "0.25rem" }}>
            {items.filter((i) => i.isPublished).length} published ·{" "}
            {items.filter((i) => !i.isPublished).length} drafts
          </p>
        </div>
        <button
          className="btn-primary"
          style={{ fontSize: "0.65rem", padding: "0.6rem 1.5rem" }}
        >
          + Add Item
        </button>
      </div>

      <AdminPortfolioGrid items={items} />
    </div>
  );
}
