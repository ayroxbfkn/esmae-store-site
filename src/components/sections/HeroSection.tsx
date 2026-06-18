"use client";

import { useTranslations, useLocale } from "next-intl";

export function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        paddingTop: "72px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative circles */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(180,151,214,0.12) 0%, transparent 70%)",
            top: "-100px",
            right: "-100px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(101,76,142,0.07) 0%, transparent 70%)",
            bottom: "80px",
            left: "20%",
          }}
        />
      </div>

      {/* Left / Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "5rem clamp(1.5rem,4vw,5rem) 5rem clamp(1.5rem,5vw,6rem)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Eyebrow */}
        <div className="eyebrow animate-fade-up">
          <span className="eyebrow-line" />
          <span className="eyebrow-text">{t("eyebrow")}</span>
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-up animate-delay-1"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(2.8rem, 5vw, 5rem)",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "var(--deep-luxury)",
            marginBottom: "0.4rem",
          }}
        >
          {t("titleLine1")}{" "}
          <em style={{ fontStyle: "italic", color: "var(--primary)" }}>
            {t("titleLine2")}
          </em>
        </h1>

        {/* Arabic subtitle */}
        <div
          className="animate-fade-up animate-delay-2"
          style={{
            fontFamily: "var(--font-noto-arabic)",
            fontSize: "clamp(1.8rem, 3.5vw, 3.2rem)",
            fontWeight: 400,
            color: "var(--accent)",
            direction: "rtl",
            marginBottom: "1.8rem",
            opacity: 0.85,
          }}
        >
          {t("arabic")}
        </div>

        {/* Subtitle */}
        <p
          className="animate-fade-up animate-delay-2"
          style={{
            fontSize: "0.85rem",
            lineHeight: 1.9,
            fontWeight: 300,
            color: "#4a4460",
            maxWidth: "420px",
            marginBottom: "2.5rem",
          }}
        >
          {t("subtitle")}
        </p>

        {/* CTA Buttons */}
        <div
          className="animate-fade-up animate-delay-3"
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
        >
          <a href={`/${locale}/quote-builder`} className="btn-primary">
            {t("ctaPrimary")}
          </a>
          <a href={`/${locale}/#portfolio`} className="btn-ghost">
            {t("ctaSecondary")}
          </a>
        </div>

        {/* Stats */}
        <div
          className="animate-fade-up animate-delay-4"
          style={{
            display: "flex",
            gap: "3rem",
            marginTop: "3.5rem",
            paddingTop: "2.5rem",
            borderTop: "1px solid var(--primary-20)",
            flexWrap: "wrap",
          }}
        >
          {[
            { val: t("stat1Value"), label: t("stat1Label") },
            { val: t("stat2Value"), label: t("stat2Label") },
            { val: t("stat3Value"), label: t("stat3Label") },
          ].map(({ val, label }) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "2rem",
                  fontWeight: 500,
                  color: "var(--primary)",
                  lineHeight: 1,
                }}
              >
                {val}
              </div>
              <div
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#7a6b8a",
                  marginTop: "0.3rem",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right / Visual */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--light-section)",
          position: "relative",
          overflow: "hidden",
          minHeight: "500px",
        }}
      >
        {/* Decorative card stack */}
        <div style={{ position: "relative", width: "320px", height: "420px" }}>
          {/* Back card */}
          <div
            style={{
              position: "absolute",
              width: "260px",
              height: "330px",
              background: "var(--deep-luxury)",
              borderRadius: "4px",
              top: "50px",
              left: "30px",
              transform: "rotate(-3deg)",
              boxShadow: "0 20px 60px rgba(47,33,71,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "80%",
                height: "80%",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "3rem",
                  opacity: 0.4,
                }}
              >
                🦋
              </span>
              <span
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                Luxury Print
              </span>
            </div>
          </div>

          {/* Front card */}
          <div
            style={{
              position: "absolute",
              width: "220px",
              height: "280px",
              background:
                "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
              borderRadius: "4px",
              top: "80px",
              left: "80px",
              transform: "rotate(2deg)",
              boxShadow: "0 16px 48px rgba(101,76,142,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "80%",
                height: "80%",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "0.5rem",
                textAlign: "center",
                padding: "1rem",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-noto-arabic)",
                  fontSize: "1.8rem",
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 400,
                }}
              >
                أسماء
              </div>
              <div
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                ESMAE Store
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div
            style={{
              position: "absolute",
              bottom: "30px",
              right: "0px",
              background: "var(--white)",
              border: "1px solid var(--primary-20)",
              borderRadius: "4px",
              padding: "0.8rem 1.2rem",
              boxShadow: "0 8px 24px rgba(47,33,71,0.1)",
            }}
          >
            <div
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--primary)",
                marginBottom: "0.3rem",
              }}
            >
              Premium Quality
            </div>
            <div
              style={{ color: "var(--gold)", fontSize: "0.8rem", letterSpacing: "2px" }}
            >
              ★★★★★
            </div>
            <div
              style={{ fontSize: "0.6rem", color: "#9a8aaa", marginTop: "0.2rem" }}
            >
              Certified Excellence
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
