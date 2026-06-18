import { prisma } from "@/lib/prisma/client";
import { AdminPricingTable } from "@/components/admin/AdminPricingTable";

export const metadata = { title: "Pricing Rules | Esmae Admin" };

export default async function AdminPricingPage() {
  const [rules, tiers, products] = await prisma.$transaction([
    prisma.pricingRule.findMany({
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      include: { product: { select: { nameEn: true, slug: true } } },
    }),
    prisma.quantityTier.findMany({ orderBy: { minQty: "asc" } }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, nameEn: true, slug: true },
      orderBy: { nameEn: "asc" },
    }),
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
          Pricing Rules
        </h1>
        <p style={{ fontSize: "0.8rem", color: "#9a8aaa", marginTop: "0.25rem" }}>
          {rules.length} active rules · {tiers.length} quantity tiers
        </p>
      </div>

      <AdminPricingTable rules={rules} tiers={tiers} products={products} />
    </div>
  );
}
