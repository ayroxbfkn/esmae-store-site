"use client";

import { useTranslations, useLocale } from "next-intl";

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    cat: "Wedding Suite",
    name: "Al-Rashid Invitation Collection",
    span: "col-span-2 row-span-2",
    bg: "from-[#2f2147] to-[#654c8e]",
    arabic: "أسماء",
  },
  {
    id: 2,
    cat: "Corporate Identity",
    name: "Maison Azur Rebrand",
    span: "",
    bg: "from-[#b497d6] to-[#8e6cc4]",
    arabic: null,
  },
  {
    id: 3,
    cat: "Luxury Packaging",
    name: "Dar Perfume Boxes",
    span: "",
    bg: "from-[#654c8e] to-[#2f2147]",
    arabic: null,
  },
  {
    id: 4,
    cat: "Magazine",
    name: "Sada Cultural Review",
    span: "",
    bg: "from-[#f3effa] to-[#b497d6]",
    arabic: null,
  },
  {
    id: 5,
    cat: "Special Finish",
    name: "Foil Business Cards",
    span: "",
    bg: "from-[#8e6cc4] to-[#654c8e]",
    arabic: null,
  },
  {
    id: 6,
    cat: "Large Format",
    name: "Exhibition Stand",
    span: "",
    bg: "from-[#2f2147] to-[#8e6cc4]",
    arabic: "ع",
  },
];

export function PortfolioSection() {
  const t = useTranslations("portfolio");
  const locale = useLocale();

  return (
    <section id="portfolio" style={{ paddingBlock: "var(--section-py)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div
          style={{
            paddingInline: "var(--section-px)",
            marginBottom: "3rem",
          }}
        >
          <div className="eyebrow">
            <span className="eyebrow-line" />
            <span className="eyebrow-text">{t("eyebrow")}</span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 300,
              color: "var(--deep-luxury)",
            }}
          >
            {t("title")}
          </h2>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridAutoRows: "280px",
            gap: "3px",
          }}
        >
          {PORTFOLIO_ITEMS.map((item) => (
            <PortfolioItem key={item.id} item={item} />
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            paddingTop: "3rem",
            paddingInline: "var(--section-px)",
          }}
        >
          <a href={`/${locale}/portfolio`} className="btn-ghost">
            {t("viewAll")}
          </a>
        </div>
      </div>
    </section>
  );
}

function PortfolioItem({
  item,
}: {
  item: (typeof PORTFOLIO_ITEMS)[number];
}) {
  const isWide = item.span.includes("col-span-2");
  const isTall = item.span.includes("row-span-2");

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        gridColumn: isWide ? "span 2" : undefined,
        gridRow: isTall ? "span 2" : undefined,
      }}
      onMouseEnter={(e) => {
        const overlay = e.currentTarget.querySelector<HTMLElement>(
          ".portfolio-overlay"
        );
        const bg = e.currentTarget.querySelector<HTMLElement>(".portfolio-bg");
        if (overlay) overlay.style.opacity = "1";
        if (bg) bg.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        const overlay = e.currentTarget.querySelector<HTMLElement>(
          ".portfolio-overlay"
        );
        const bg = e.currentTarget.querySelector<HTMLElement>(".portfolio-bg");
        if (overlay) overlay.style.opacity = "0";
        if (bg) bg.style.transform = "scale(1)";
      }}
    >
      {/* Background */}
      <div
        className="portfolio-bg"
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${item.bg
            .replace("from-[", "")
            .replace("] to-[", ", ")
            .replace("]", "")})`,
          transition: "transform 0.6s ease",
        }}
      />

      {/* Arabic watermark */}
      {item.arabic && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-noto-arabic)",
            fontSize: item.arabic.length > 2 ? "4rem" : "6rem",
            color: "rgba(255,255,255,0.12)",
            userSelect: "none",
          }}
        >
          {item.arabic}
        </div>
      )}

      {/* Hover overlay */}
      <div
        className="portfolio-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(47,33,71,0.92) 0%, transparent 55%)",
          opacity: 0,
          transition: "opacity 0.4s ease",
          display: "flex",
          alignItems: "flex-end",
          padding: "1.5rem",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--primary-soft)",
              marginBottom: "0.3rem",
            }}
          >
            {item.cat}
          </div>
          <div
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.1rem",
              fontWeight: 400,
              color: "#fff",
            }}
          >
            {item.name}
          </div>
        </div>
      </div>
    </div>
  );
}
