import { useTranslations } from "next-intl";

const VALUE_KEYS = ["precision", "craft", "integrity", "heritage"] as const;

export function AboutSection() {
  const t = useTranslations("about");

  return (
    <section
      id="about"
      className="section-wrapper"
      style={{ background: "var(--light-section)" }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5rem",
          alignItems: "center",
        }}
      >
        {/* Visual */}
        <div style={{ position: "relative", height: "500px" }}>
          {/* Main card */}
          <div
            style={{
              width: "320px",
              height: "400px",
              background:
                "linear-gradient(160deg, var(--primary) 0%, var(--deep-luxury) 100%)",
              borderRadius: "4px",
              position: "absolute",
              left: 0,
              top: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-noto-arabic)",
                fontSize: "4rem",
                color: "rgba(255,255,255,0.2)",
                lineHeight: 1,
              }}
            >
              أسماء
            </div>
            <div
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "0.85rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                marginTop: "1rem",
              }}
            >
              Est. 2026
            </div>
          </div>

          {/* Accent card */}
          <div
            style={{
              width: "200px",
              height: "250px",
              background: "var(--white)",
              border: "2px solid var(--primary-soft)",
              borderRadius: "4px",
              position: "absolute",
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
              padding: "1.5rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "3rem",
                fontWeight: 300,
                color: "var(--primary)",
                lineHeight: 1,
              }}
            >
              1
            </div>
            <div
              style={{
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#9a8aaa",
                marginTop: "0.3rem",
              }}
            >
              Year of mastery
            </div>
            <div
              style={{
                width: "30px",
                height: "1px",
                background: "var(--primary)",
                margin: "1rem auto",
              }}
            />
            <div
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "2rem",
                fontWeight: 300,
                color: "var(--primary)",
                lineHeight: 1,
              }}
            >
              5+
            </div>
            <div
              style={{
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#9a8aaa",
                marginTop: "0.3rem",
              }}
            >
              B2B Partners
            </div>
          </div>

          {/* Year badge */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "40px",
              background: "var(--gold)",
              color: "var(--deep-luxury)",
              fontSize: "0.62rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              padding: "0.35rem 0.9rem",
              borderRadius: "2px",
              textTransform: "uppercase",
            }}
          >
            Since 2026
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            <span className="eyebrow-text">{t("eyebrow")}</span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2rem, 3vw, 2.8rem)",
              fontWeight: 300,
              color: "var(--deep-luxury)",
            }}
          >
            {t("title")}
          </h2>
          <p
            style={{
              fontSize: "0.82rem",
              color: "#4a4460",
              lineHeight: 1.85,
              fontWeight: 300,
              marginTop: "1.2rem",
            }}
          >
            {t("body1")}
          </p>
          <p
            style={{
              fontSize: "0.82rem",
              color: "#4a4460",
              lineHeight: 1.85,
              fontWeight: 300,
              marginTop: "1rem",
            }}
          >
            {t("body2")}
          </p>

          {/* Values */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginTop: "2.5rem",
            }}
          >
            {VALUE_KEYS.map((key) => (
              <div
                key={key}
                style={{
                  padding: "1.2rem",
                  background: "var(--white)",
                  borderLeft: "2px solid var(--primary)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--primary)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {t(`values.${key}.title`)}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#6a5a7a",
                    lineHeight: 1.7,
                    fontWeight: 300,
                  }}
                >
                  {t(`values.${key}.text`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
