import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";

export const metadata = { title: "Quotes | Esmae B2B" };

export default async function B2BQuotesPage({
  params,
}: {
  params: { locale: string };
}) {
  const session = await auth();
  const userId = session!.user.id;

  const quotes = await prisma.quote.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: { select: { nameEn: true } } } },
      order: { select: { orderNumber: true, status: true } },
    },
  });

  const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    draft:     { bg: "#f5f5f5", color: "#616161" },
    submitted: { bg: "#e3f2fd", color: "#1565c0" },
    approved:  { bg: "#e8f5e9", color: "#2e7d32" },
    converted: { bg: "#f3e5f5", color: "#7b1fa2" },
  };

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
            My Quotes
          </h1>
          <p style={{ fontSize: "0.8rem", color: "#9a8aaa", marginTop: "0.25rem" }}>
            {quotes.length} quotes total
          </p>
        </div>
        <a
          href={`/${params.locale}/quote-builder`}
          className="btn-primary"
          style={{ fontSize: "0.65rem", padding: "0.6rem 1.5rem" }}
        >
          + New Quote
        </a>
      </div>

      {quotes.length === 0 ? (
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--primary-20)",
            borderRadius: "6px",
            padding: "4rem",
            textAlign: "center",
            color: "#9a8aaa",
            fontSize: "0.85rem",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem", opacity: 0.3 }}>◈</div>
          <div style={{ fontWeight: 500, marginBottom: "0.5rem" }}>No quotes yet</div>
          <div style={{ fontWeight: 300, marginBottom: "1.5rem" }}>
            Build your first quote and we'll have it ready within 24 hours.
          </div>
          <a
            href={`/${params.locale}/quote-builder`}
            className="btn-primary"
            style={{ fontSize: "0.68rem" }}
          >
            Build a Quote
          </a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {quotes.map((quote) => {
            const sc = STATUS_COLORS[quote.status] ?? STATUS_COLORS.draft;
            return (
              <div
                key={quote.id}
                style={{
                  background: "#fff",
                  border: "1px solid var(--primary-20)",
                  borderRadius: "6px",
                  padding: "1.5rem",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "1rem",
                  alignItems: "start",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: "var(--deep-luxury)",
                        fontFamily: "monospace",
                      }}
                    >
                      #{quote.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        padding: "0.18rem 0.6rem",
                        borderRadius: "2px",
                        background: sc.bg,
                        color: sc.color,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {quote.status}
                    </span>
                    {quote.order && (
                      <span
                        style={{
                          fontSize: "0.65rem",
                          color: "var(--primary)",
                          fontWeight: 500,
                        }}
                      >
                        → Order {quote.order.orderNumber}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#7a6b8a",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {quote.items
                      .map((i) => `${i.product?.nameEn ?? "?"} × ${i.quantity}`)
                      .join(" · ")}
                  </div>

                  <div style={{ fontSize: "0.72rem", color: "#9a8aaa" }}>
                    Created {new Date(quote.createdAt).toLocaleDateString("en-GB")}
                    {quote.expiresAt && (
                      <> · Expires {new Date(quote.expiresAt).toLocaleDateString("en-GB")}</>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "1.5rem",
                      fontWeight: 400,
                      color: "var(--primary)",
                      lineHeight: 1,
                    }}
                  >
                    {Number(quote.total).toLocaleString()} DZD
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#9a8aaa", marginTop: "0.2rem" }}>
                    incl. VAT & delivery
                  </div>
                  {quote.status === "approved" && !quote.order && (
                    <a
                      href={`/${params.locale}/checkout?quoteId=${quote.id}`}
                      className="btn-primary"
                      style={{
                        display: "inline-block",
                        marginTop: "0.75rem",
                        fontSize: "0.62rem",
                        padding: "0.5rem 1rem",
                      }}
                    >
                      Proceed to Order →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
