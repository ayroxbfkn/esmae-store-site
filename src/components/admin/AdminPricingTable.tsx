"use client";

import { useState } from "react";

interface PricingRule {
  id: string;
  name: string;
  ruleType: string;
  priority: number;
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
  conditionJson: any;
  actionJson: any;
  product: { nameEn: string; slug: string } | null;
}

interface QuantityTier {
  id: string;
  productId: string | null;
  minQty: number;
  maxQty: number | null;
  discountPct: any;
  label: string | null;
}

export function AdminPricingTable({
  rules,
  tiers,
  products,
}: {
  rules: PricingRule[];
  tiers: QuantityTier[];
  products: Array<{ id: string; nameEn: string; slug: string }>;
}) {
  const [tab, setTab] = useState<"rules" | "tiers">("rules");

  return (
    <div>
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: "1.5rem",
          borderBottom: "1px solid var(--primary-20)",
        }}
      >
        {(["rules", "tiers"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "0.7rem 1.5rem",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: "none",
              background: "none",
              cursor: "pointer",
              color: tab === t ? "var(--primary)" : "#9a8aaa",
              borderBottom: tab === t ? "2px solid var(--primary)" : "2px solid transparent",
              marginBottom: "-1px",
              transition: "all 0.2s",
            }}
          >
            {t === "rules" ? "Pricing Rules" : "Quantity Tiers"}
          </button>
        ))}
      </div>

      {tab === "rules" && (
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--primary-20)",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#faf9fc" }}>
                {["Name", "Type", "Product", "Priority", "Action", "Active", "Dates"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0.8rem 1.25rem",
                      textAlign: "left",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#9a8aaa",
                      borderBottom: "1px solid var(--primary-20)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr
                  key={rule.id}
                  style={{ borderBottom: "1px solid rgba(101,76,142,0.06)" }}
                >
                  <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.78rem", fontWeight: 600, color: "var(--deep-luxury)" }}>
                    {rule.name}
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem" }}>
                    <span style={{
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "2px",
                      background: "var(--primary-10)",
                      color: "var(--primary)",
                    }}>
                      {rule.ruleType.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.75rem", color: "#7a6b8a" }}>
                    {rule.product?.nameEn ?? "All Products"}
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.78rem", color: "#7a6b8a", textAlign: "center" }}>
                    {rule.priority}
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.75rem", color: "#7a6b8a", fontFamily: "monospace" }}>
                    {JSON.stringify(rule.actionJson)}
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "2px",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      background: rule.isActive ? "#e8f5e9" : "#fce4e4",
                      color: rule.isActive ? "#2e7d32" : "#c62828",
                    }}>
                      {rule.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.68rem", color: "#9a8aaa" }}>
                    {rule.startsAt ? new Date(rule.startsAt).toLocaleDateString("en-GB") : "—"}
                    {" → "}
                    {rule.endsAt ? new Date(rule.endsAt).toLocaleDateString("en-GB") : "∞"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "tiers" && (
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--primary-20)",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#faf9fc" }}>
                {["Label", "Min Qty", "Max Qty", "Discount %", "Product"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0.8rem 1.25rem",
                      textAlign: "left",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#9a8aaa",
                      borderBottom: "1px solid var(--primary-20)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier) => {
                const product = products.find((p) => p.id === tier.productId);
                return (
                  <tr key={tier.id} style={{ borderBottom: "1px solid rgba(101,76,142,0.06)" }}>
                    <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.78rem", fontWeight: 600, color: "var(--deep-luxury)" }}>
                      {tier.label ?? "Unnamed tier"}
                    </td>
                    <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.78rem", color: "#7a6b8a" }}>
                      {tier.minQty.toLocaleString()}
                    </td>
                    <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.78rem", color: "#7a6b8a" }}>
                      {tier.maxQty?.toLocaleString() ?? "∞"}
                    </td>
                    <td style={{ padding: "0.9rem 1.25rem" }}>
                      <span style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "var(--primary)",
                      }}>
                        {Number(tier.discountPct)}%
                      </span>
                    </td>
                    <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.75rem", color: "#7a6b8a" }}>
                      {product?.nameEn ?? "All Products"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
