"use client";

import { useTranslations, useLocale } from "next-intl";

const SERVICES_LINKS = [
  "Business Stationery",
  "Wedding & Events",
  "Luxury Packaging",
  "Large Format",
  "Special Finishes",
];
const PLATFORM_LINKS = [
  { label: "Online Quotation", href: "/quote-builder" },
  { label: "Order Tracking", href: "/dashboard" },
  { label: "My Account", href: "/dashboard" },
];
const COMPANY_LINKS = [
  { label: "About Esmae", href: "/#about" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Careers", href: "/careers" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Contact", href: "/#contact" },
];

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer
      style={{
        background: "var(--deep-luxury)",
        padding: "4rem clamp(1.5rem,5vw,6rem) 2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "3rem",
            paddingBottom: "3rem",
            borderBottom: "1px solid rgba(180,151,214,0.15)",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "1.8rem",
                fontWeight: 400,
                color: "#fff",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Esmae
            </div>
            <div
              style={{
                fontFamily: "var(--font-noto-arabic)",
                fontSize: "1rem",
                color: "var(--primary-soft)",
                marginBottom: "1rem",
                opacity: 0.85,
              }}
            >
              أَسْـٰمَێَ — {t("tagline")}
            </div>
            <p
              style={{
                fontSize: "0.75rem",
                lineHeight: 1.8,
                color: "rgba(180,151,214,0.6)",
                fontWeight: 300,
                maxWidth: "260px",
              }}
            >
              {t("desc")}
            </p>
          </div>

          {/* Services */}
          <div>
            <div
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#fff",
                marginBottom: "1.5rem",
              }}
            >
              {t("services")}
            </div>
            <ul style={{ listStyle: "none" }}>
              {SERVICES_LINKS.map((s) => (
                <li key={s} style={{ marginBottom: "0.6rem" }}>
                  <a
                    href={`/${locale}/#services`}
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(180,151,214,0.6)",
                      textDecoration: "none",
                      fontWeight: 300,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        "var(--primary-soft)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color =
                        "rgba(180,151,214,0.6)")
                    }
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <div
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#fff",
                marginBottom: "1.5rem",
              }}
            >
              {t("platform")}
            </div>
            <ul style={{ listStyle: "none" }}>
              {PLATFORM_LINKS.map(({ label, href }) => (
                <li key={label} style={{ marginBottom: "0.6rem" }}>
                  <a
                    href={`/${locale}${href}`}
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(180,151,214,0.6)",
                      textDecoration: "none",
                      fontWeight: 300,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--primary-soft)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(180,151,214,0.6)")
                    }
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <div
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#fff",
                marginBottom: "1.5rem",
              }}
            >
              {t("company")}
            </div>
            <ul style={{ listStyle: "none" }}>
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={label} style={{ marginBottom: "0.6rem" }}>
                  <a
                    href={`/${locale}${href}`}
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(180,151,214,0.6)",
                      textDecoration: "none",
                      fontWeight: 300,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--primary-soft)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(180,151,214,0.6)")
                    }
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              color: "rgba(180,151,214,0.4)",
            }}
          >
            © {new Date().getFullYear()} Esmae Studio. {t("rights")}.
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {["in", "ig", "fb", "tw"].map((s) => (
              <a
                key={s}
                href="#"
                style={{
                  width: "32px",
                  height: "32px",
                  border: "1px solid rgba(180,151,214,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(180,151,214,0.5)",
                  fontSize: "0.72rem",
                  textDecoration: "none",
                  transition: "all 0.2s",
                  borderRadius: "2px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--primary-soft)";
                  e.currentTarget.style.borderColor = "var(--primary-soft)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(180,151,214,0.5)";
                  e.currentTarget.style.borderColor =
                    "rgba(180,151,214,0.2)";
                }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
