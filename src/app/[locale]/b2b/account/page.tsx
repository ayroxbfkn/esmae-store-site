import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";

export const metadata = { title: "Account | Esmae B2B" };

export default async function B2BAccountPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [user, b2bAccount] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, locale: true, createdAt: true },
    }),
    prisma.b2BAccount.findUnique({ where: { userId } }),
  ]);

  const discountPct = b2bAccount
    ? [0, 5, 10, 15, 20][Math.min(b2bAccount.discountTier, 4)]
    : 0;

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
          My Account
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Personal Info */}
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--primary-20)",
            borderRadius: "6px",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.25rem",
              fontWeight: 400,
              color: "var(--deep-luxury)",
              marginBottom: "1.5rem",
            }}
          >
            Personal Information
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { label: "Full Name", value: user?.name ?? "—" },
              { label: "Email", value: user?.email ?? "—" },
              { label: "Phone", value: user?.phone ?? "—" },
              { label: "Preferred Language", value: (user?.locale ?? "ar").toUpperCase() },
              {
                label: "Member Since",
                value: user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "—",
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid var(--primary-10)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#9a8aaa",
                  }}
                >
                  {label}
                </span>
                <span style={{ fontSize: "0.82rem", color: "var(--text-dark)", fontWeight: 400 }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* B2B Account Details */}
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--primary-20)",
            borderRadius: "6px",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.25rem",
              fontWeight: 400,
              color: "var(--deep-luxury)",
              marginBottom: "1.5rem",
            }}
          >
            B2B Account Details
          </h2>
          {b2bAccount ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { label: "Company Name", value: b2bAccount.companyName },
                { label: "Tax ID", value: b2bAccount.taxId ?? "—" },
                {
                  label: "Discount Tier",
                  value: `Tier ${b2bAccount.discountTier} — ${discountPct}% off`,
                },
                {
                  label: "Credit Limit",
                  value: `${Number(b2bAccount.creditLimit).toLocaleString()} DZD`,
                },
                {
                  label: "Payment Terms",
                  value: `Net ${b2bAccount.paymentTermsDays} Days`,
                },
                {
                  label: "Account Status",
                  value: b2bAccount.isActive ? "Active" : "Suspended",
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid var(--primary-10)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#9a8aaa",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      color:
                        label === "Account Status"
                          ? b2bAccount.isActive
                            ? "#2e7d32"
                            : "#c62828"
                          : "var(--text-dark)",
                      fontWeight: label === "Account Status" ? 700 : 400,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#9a8aaa",
                fontSize: "0.82rem",
              }}
            >
              No B2B account linked.
              <br />
              Contact us to set up your wholesale account.
            </div>
          )}
        </div>
      </div>

      {/* Contact CTA */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "1.5rem",
          background: "var(--light-section)",
          border: "1px solid var(--primary-20)",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.1rem",
              fontWeight: 400,
              color: "var(--deep-luxury)",
            }}
          >
            Need to update your account details or upgrade your tier?
          </div>
          <div style={{ fontSize: "0.78rem", color: "#7a6b8a", marginTop: "0.25rem" }}>
            Contact your dedicated account manager or reach out to our team.
          </div>
        </div>
        <a
          href="mailto:b2b@esmae.dz"
          className="btn-primary"
          style={{ whiteSpace: "nowrap", fontSize: "0.65rem", padding: "0.6rem 1.5rem" }}
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}
