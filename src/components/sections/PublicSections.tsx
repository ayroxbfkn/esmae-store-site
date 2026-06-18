"use client";

import { Fragment } from "react";
import { useTranslations, useLocale } from "next-intl";

// ─── QuoteBuilderTeaser ──────────────────────────────────────────────────────

export function QuoteBuilderTeaser() {
  const t = useTranslations("quoteBuilder");
  const locale = useLocale();

  const steps = ["1", "2", "3", "4", "5"] as const;

  return (
    <section
      style={{
        background: "var(--primary)",
        padding: "5rem clamp(1.5rem,5vw,6rem)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% -20%, rgba(255,255,255,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(1.8rem,3vw,3rem)",
            fontWeight: 300,
            color: "#fff",
            marginBottom: "1rem",
          }}
        >
          {t("title")}
        </h2>
        <p
          style={{
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.7)",
            marginBottom: "2.5rem",
            fontWeight: 300,
          }}
        >
          {t("subtitle")}
        </p>

        {/* Steps */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
            gap: "0",
          }}
        >
          {steps.map((step, i) => (
            <Fragment key={step}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: "100px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.4)",
                    background: "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.1rem",
                    color: "#fff",
                    marginBottom: "0.6rem",
                  }}
                >
                  {step}
                </div>
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.65)",
                    textAlign: "center",
                  }}
                >
                  {t(`steps.${step}`)}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  key={`c-${i}`}
                  style={{
                    flex: 1,
                    maxWidth: "60px",
                    height: "1px",
                    background: "rgba(255,255,255,0.2)",
                    marginBottom: "1.5rem",
                  }}
                />
              )}
            </Fragment>
          ))}
        </div>

        <a
          href={`/${locale}/quote-builder`}
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--primary)",
            background: "#fff",
            border: "none",
            padding: "1rem 3rem",
            borderRadius: "2px",
            cursor: "pointer",
            transition: "all 0.3s",
            textDecoration: "none",
            display: "inline-block",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--gold-soft)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
        >
          {t("cta")} →
        </a>
      </div>
    </section>
  );
}

// ─── PricingSection ──────────────────────────────────────────────────────────

const PRICING_PLANS = [
  {
    id: "essential",
    featured: false,
    plan: "Essential",
    price: "4,500",
    period: "per 100 units / business cards",
    currency: "DZD",
    features: [
      "Standard paper 350gsm",
      "4-color CMYK print",
      "5-day turnaround",
      "Digital proof included",
      "Standard packaging",
    ],
    cta: "Get Started",
  },
  {
    id: "premium",
    featured: true,
    badge: "Most Popular",
    plan: "Premium",
    price: "9,800",
    period: "per 100 units / business cards",
    currency: "DZD",
    features: [
      "Soft-touch lamination",
      "Spot UV coating",
      "3-day turnaround",
      "Physical proof option",
      "Luxury box packaging",
      "Design consultation",
    ],
    cta: "Get Started",
  },
  {
    id: "b2b",
    featured: false,
    plan: "B2B Wholesale",
    price: "Custom",
    period: "Volume-based pricing",
    currency: "",
    features: [
      "Dedicated account manager",
      "Custom discount tiers",
      "Invoice-based payments",
      "Priority production",
      "White-label options",
      "API access ready",
    ],
    cta: "Contact Sales",
  },
];

export function PricingSection() {
  const locale = useLocale();

  return (
    <section
      id="pricing"
      className="section-wrapper"
      style={{ background: "var(--light-section)" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            <span className="eyebrow-line" />
            <span className="eyebrow-text">Transparent Pricing</span>
            <span className="eyebrow-line" />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2rem,3.5vw,3rem)",
              fontWeight: 300,
              color: "var(--deep-luxury)",
            }}
          >
            Clear value,{" "}
            <em style={{ fontStyle: "italic", color: "var(--primary)" }}>
              no surprises
            </em>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {PRICING_PLANS.map((p) => (
            <div
              key={p.id}
              style={{
                border: `1px solid ${p.featured ? "var(--primary)" : "var(--primary-20)"}`,
                borderRadius: "4px",
                padding: "2.5rem 2rem",
                position: "relative",
                background: p.featured ? "var(--deep-luxury)" : "var(--white)",
                boxShadow: p.featured
                  ? "0 20px 60px rgba(101,76,142,0.15)"
                  : "none",
              }}
            >
              {p.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: "-1px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--primary)",
                    color: "#fff",
                    fontSize: "0.58rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "0.3rem 1.2rem",
                    borderRadius: "0 0 4px 4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.badge}
                </div>
              )}

              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: p.featured ? "var(--primary-soft)" : "var(--primary)",
                  marginBottom: "1.5rem",
                  marginTop: p.badge ? "0.5rem" : 0,
                }}
              >
                {p.plan}
              </div>

              <div
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "2.8rem",
                  fontWeight: 300,
                  color: p.featured ? "#fff" : "var(--deep-luxury)",
                  lineHeight: 1,
                }}
              >
                {p.currency && (
                  <span style={{ fontSize: "1rem", verticalAlign: "top", marginTop: "0.5rem", display: "inline-block" }}>
                    {p.currency}{" "}
                  </span>
                )}
                {p.price}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: p.featured ? "var(--primary-soft)" : "#9a8aaa",
                  marginBottom: "1.5rem",
                  marginTop: "0.3rem",
                }}
              >
                {p.period}
              </div>

              <div
                style={{
                  height: "1px",
                  background: p.featured
                    ? "rgba(180,151,214,0.2)"
                    : "var(--primary-20)",
                  marginBottom: "1.5rem",
                }}
              />

              <ul style={{ listStyle: "none" }}>
                {p.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.35rem 0",
                      color: p.featured ? "var(--primary-soft)" : "#6a5a7a",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      fontWeight: 300,
                    }}
                  >
                    <span
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: p.featured
                          ? "rgba(180,151,214,0.15)"
                          : "var(--primary-10)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.55rem",
                        color: p.featured ? "var(--primary-soft)" : "var(--primary)",
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={`/${locale}/quote-builder`}
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: "2rem",
                  padding: "0.9rem",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  borderRadius: "2px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  textDecoration: "none",
                  textAlign: "center",
                  border: p.featured ? "1px solid var(--primary)" : "1px solid var(--primary)",
                  color: p.featured ? "#fff" : "var(--primary)",
                  background: p.featured ? "var(--primary)" : "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = p.featured
                    ? "var(--accent)"
                    : "var(--primary)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = p.featured
                    ? "var(--primary)"
                    : "none";
                  e.currentTarget.style.color = p.featured
                    ? "#fff"
                    : "var(--primary)";
                }}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WhyUsSection ────────────────────────────────────────────────────────────

const WHY_FEATURES = [
  {
    icon: "⬡",
    title: "Trilingual Service",
    text: "Full support in Arabic, English and French. Your instructions understood precisely in your preferred language.",
  },
  {
    icon: "⬡",
    title: "Real-Time Pricing",
    text: "Our dynamic pricing engine calculates your exact cost instantly. No hidden fees. No surprises.",
  },
  {
    icon: "⬡",
    title: "Live Order Tracking",
    text: "Monitor your order from confirmation to delivery with our milestone-based tracking dashboard.",
  },
  {
    icon: "⬡",
    title: "Premium Materials",
    text: "Curated paper stocks, specialty inks, and finishing options sourced from leading European suppliers.",
  },
];

export function WhyUsSection() {
  return (
    <section id="why" className="section-wrapper">
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "5rem",
          alignItems: "start",
        }}
      >
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            <span className="eyebrow-text">Why Esmae</span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2rem,3vw,2.8rem)",
              fontWeight: 300,
              color: "var(--deep-luxury)",
            }}
          >
            Print is our{" "}
            <em style={{ fontStyle: "italic", color: "var(--primary)" }}>
              obsession
            </em>
          </h2>
          <p
            style={{
              fontSize: "0.82rem",
              color: "#7a6b8a",
              lineHeight: 1.8,
              fontWeight: 300,
              marginTop: "1rem",
            }}
          >
            Not a commodity we sell, but a craft we practise with care and
            conviction every single day.
          </p>

          <div
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              background: "var(--light-section)",
              borderLeft: "3px solid var(--primary)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-noto-arabic)",
                fontSize: "1.1rem",
                color: "var(--primary)",
                direction: "rtl",
                marginBottom: "0.5rem",
              }}
            >
              الجودة ليست مصادفة
            </div>
            <div
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "0.9rem",
                fontStyle: "italic",
                color: "#7a6b8a",
              }}
            >
              Quality is never an accident
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
          }}
        >
          {WHY_FEATURES.map((f) => (
            <div key={f.title}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  border: "1px solid var(--primary-40)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.2rem",
                  fontSize: "1.2rem",
                  color: "var(--primary)",
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  color: "var(--deep-luxury)",
                  marginBottom: "0.6rem",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: "0.75rem",
                  lineHeight: 1.8,
                  color: "#7a6b8a",
                  fontWeight: 300,
                }}
              >
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TestimonialsSection ─────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    stars: 5,
    text: "The wedding invitations exceeded every expectation. The foil work is extraordinary — our guests kept asking where they came from.",
    initials: "LB",
    name: "Leila Benmoussa",
    role: "Bride, Algiers",
  },
  {
    stars: 5,
    text: "As a B2B client ordering monthly, the dedicated account system and consistent quality make Esmae irreplaceable for our agency.",
    initials: "KM",
    name: "Karim Mellouki",
    role: "Creative Director, Studio Nord",
  },
  {
    stars: 5,
    text: "Impeccable service en trois langues. La qualité des impressions pour notre catalogue annuel était digne des meilleures maisons parisiennes.",
    initials: "SH",
    name: "Sophie Hamraoui",
    role: "Marketing Manager, Oran",
  },
];

export function TestimonialsSection() {
  return (
    <section
      className="section-wrapper"
      style={{ background: "var(--light-section)", position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          top: "3rem",
          left: "4rem",
          fontFamily: "var(--font-cormorant)",
          fontSize: "8rem",
          color: "rgba(101,76,142,0.06)",
          lineHeight: 0.7,
          fontWeight: 300,
          userSelect: "none",
        }}
      >
        "
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            maxWidth: "500px",
            margin: "0 auto 3rem",
          }}
        >
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            <span className="eyebrow-line" />
            <span className="eyebrow-text">Client Words</span>
            <span className="eyebrow-line" />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2rem,3vw,2.8rem)",
              fontWeight: 300,
              color: "var(--deep-luxury)",
            }}
          >
            <em style={{ fontStyle: "italic", color: "var(--primary)" }}>
              Stories
            </em>{" "}
            told in print
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              style={{
                padding: "2rem",
                border: "1px solid var(--primary-20)",
                borderRadius: "4px",
                background: "var(--white)",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "var(--primary-soft)";
                (e.currentTarget as HTMLDivElement).style.background =
                  "var(--white)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 8px 32px rgba(101,76,142,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "var(--primary-20)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  color: "var(--gold)",
                  fontSize: "0.85rem",
                  letterSpacing: "2px",
                  marginBottom: "1rem",
                }}
              >
                {"★".repeat(t.stars)}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1rem",
                  lineHeight: 1.8,
                  color: "var(--text-dark)",
                  fontStyle: "italic",
                  marginBottom: "1.5rem",
                }}
              >
                "{t.text}"
              </p>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "var(--text-dark)",
                    }}
                  >
                    {t.name}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#9a8aaa" }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
