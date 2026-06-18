"use client";

const ITEMS = [
  "Business Cards",
  "Wedding Stationery",
  "Luxury Packaging",
  "Corporate Identity",
  "Large Format",
  "Embossed Print",
  "Foil Stamping",
  "بطاقات الأعمال",
  "طباعة فاخرة",
  "Impression de luxe",
  "Cartes de visite",

];

export function MarqueeSection() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div
      style={{
        background: "var(--deep-luxury)",
        padding: "1rem 0",
        overflow: "hidden",
      }}
    >
      <div
        className="animate-marquee"
        style={{
          display: "flex",
          gap: "3rem",
          alignItems: "center",
          whiteSpace: "nowrap",
          width: "max-content",
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--primary-soft)",
            }}
          >
            <span
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "var(--gold)",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
