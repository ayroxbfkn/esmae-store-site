"use client";

import { useState } from "react";
import { prisma } from "@/lib/prisma/client";

interface PortfolioItem {
  id: string;
  titleEn: string;
  titleAr: string;
  titleFr: string;
  category: string;
  imageUrl: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: Date;
}

export function AdminPortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const filtered = items.filter((i) => {
    if (filter === "published") return i.isPublished;
    if (filter === "draft") return !i.isPublished;
    return true;
  });

  return (
    <div>
      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: "1.5rem",
          borderBottom: "1px solid var(--primary-20)",
        }}
      >
        {(["all", "published", "draft"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "0.6rem 1.25rem",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: "none",
              background: "none",
              cursor: "pointer",
              color: filter === f ? "var(--primary)" : "#9a8aaa",
              borderBottom:
                filter === f ? "2px solid var(--primary)" : "2px solid transparent",
              marginBottom: "-1px",
              transition: "all 0.2s",
            }}
          >
            {f === "all" ? `All (${items.length})` : f === "published" ? `Published (${items.filter((i) => i.isPublished).length})` : `Drafts (${items.filter((i) => !i.isPublished).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
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
          No portfolio items found.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#fff",
                border: "1px solid var(--primary-20)",
                borderRadius: "6px",
                overflow: "hidden",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 8px 24px rgba(101,76,142,0.1)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.boxShadow = "none")
              }
            >
              {/* Image placeholder */}
              <div
                style={{
                  height: "180px",
                  background: "linear-gradient(135deg, var(--primary) 0%, var(--deep-luxury) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-noto-arabic)",
                    fontSize: "3rem",
                    color: "rgba(255,255,255,0.15)",
                  }}
                >
                  ◈
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    right: "0.75rem",
                    background: item.isPublished ? "#e8f5e9" : "#fff8e1",
                    color: item.isPublished ? "#2e7d32" : "#f57f17",
                    fontSize: "0.58rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "2px",
                  }}
                >
                  {item.isPublished ? "Published" : "Draft"}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "1rem" }}>
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "var(--deep-luxury)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {item.titleEn}
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    color: "#9a8aaa",
                    marginBottom: "0.75rem",
                  }}
                >
                  {item.category.replace(/_/g, " ")} ·{" "}
                  {new Date(item.createdAt).toLocaleDateString("en-GB")}
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    style={{
                      flex: 1,
                      fontSize: "0.62rem",
                      fontWeight: 600,
                      color: "var(--primary)",
                      border: "1px solid var(--primary-40)",
                      background: "none",
                      padding: "0.35rem",
                      borderRadius: "2px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      flex: 1,
                      fontSize: "0.62rem",
                      fontWeight: 600,
                      color: item.isPublished ? "#f57f17" : "#2e7d32",
                      border: `1px solid ${item.isPublished ? "#ffe0b2" : "#c8e6c9"}`,
                      background: "none",
                      padding: "0.35rem",
                      borderRadius: "2px",
                      cursor: "pointer",
                    }}
                  >
                    {item.isPublished ? "Unpublish" : "Publish"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
