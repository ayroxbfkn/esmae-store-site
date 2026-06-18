"use client";

import { useTranslations } from "next-intl";

const SERVICE_KEYS = [
  "stationery",
  "wedding",
  "packaging",
  "largeFormat",
  "publishing",
  "finishes",
] as const;

export function ServicesSection() {
  const t = useTranslations("services");

  return (
    <section id="services" className="section-wrapper">
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ marginBottom: "3.5rem" }}>
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
              maxWidth: "600px",
            }}
          >
            {t("title")}
          </h2>
          <p
            style={{
              fontSize: "0.82rem",
              color: "#7a6b8a",
              lineHeight: 1.8,
              maxWidth: "480px",
              marginTop: "1rem",
              fontWeight: 300,
            }}
          >
            {t("subtitle")}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2px",
          }}
        >
          {SERVICE_KEYS.map((key, i) => (
            <ServiceCard
              key={key}
              num={String(i + 1).padStart(2, "0")}
              title={t(`items.${key}.title`)}
              desc={t(`items.${key}.desc`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  num,
  title,
  desc,
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div
      style={{
        background: "var(--white)",
        padding: "2.5rem 2rem",
        border: "1px solid var(--primary-20)",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.4s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = "var(--deep-luxury)";
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 16px 48px rgba(47,33,71,0.2)";
        const numEl = el.querySelector<HTMLElement>(".svc-num");
        const titleEl = el.querySelector<HTMLElement>(".svc-title");
        const descEl = el.querySelector<HTMLElement>(".svc-desc");
        if (numEl) numEl.style.color = "rgba(255,255,255,0.1)";
        if (titleEl) titleEl.style.color = "#fff";
        if (descEl) descEl.style.color = "rgba(180,151,214,0.7)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = "var(--white)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
        const numEl = el.querySelector<HTMLElement>(".svc-num");
        const titleEl = el.querySelector<HTMLElement>(".svc-title");
        const descEl = el.querySelector<HTMLElement>(".svc-desc");
        if (numEl) numEl.style.color = "rgba(101,76,142,0.08)";
        if (titleEl) titleEl.style.color = "var(--deep-luxury)";
        if (descEl) descEl.style.color = "#7a6b8a";
      }}
    >
      {/* Number watermark */}
      <div
        className="svc-num"
        style={{
          position: "absolute",
          top: "1rem",
          right: "1.5rem",
          fontFamily: "var(--font-cormorant)",
          fontSize: "4rem",
          fontWeight: 300,
          color: "rgba(101,76,142,0.08)",
          lineHeight: 1,
          transition: "color 0.4s",
          userSelect: "none",
        }}
      >
        {num}
      </div>

      {/* Icon */}
      <div
        style={{
          width: "36px",
          height: "36px",
          border: "1px solid var(--primary-40)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}
      >
        <span style={{ color: "var(--primary)", fontSize: "1rem" }}>◈</span>
      </div>

      <h3
        className="svc-title"
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "1.4rem",
          fontWeight: 500,
          color: "var(--deep-luxury)",
          marginBottom: "0.8rem",
          lineHeight: 1.2,
          transition: "color 0.4s",
        }}
      >
        {title}
      </h3>

      <p
        className="svc-desc"
        style={{
          fontSize: "0.78rem",
          lineHeight: 1.8,
          color: "#7a6b8a",
          fontWeight: 300,
          transition: "color 0.4s",
        }}
      >
        {desc}
      </p>
    </div>
  );
}
