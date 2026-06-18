"use client";

import { useState } from "react";
import { adminDeleteProduct } from "@/lib/actions/products";

interface Product {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  category: string;
  basePrice: any;
  isActive: boolean;
  options: Array<{ id: string }>;
  _count: { orderItems: number };
}

export function AdminProductsTable({ products }: { products: Product[] }) {
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Deactivate this product?")) return;
    setDeleting(id);
    await adminDeleteProduct(id);
    setDeleting(null);
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--primary-20)",
        borderRadius: "6px",
        overflow: "hidden",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#faf9fc" }}>
              {["Product", "Category", "Base Price", "Options", "Orders", "Status", "Actions"].map(
                (h) => (
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
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                style={{
                  borderBottom: "1px solid rgba(101,76,142,0.06)",
                  opacity: deleting === product.id ? 0.4 : 1,
                }}
              >
                <td style={{ padding: "0.9rem 1.25rem" }}>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "var(--deep-luxury)",
                    }}
                  >
                    {product.nameEn}
                  </div>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      color: "#9a8aaa",
                      fontFamily: "var(--font-noto-arabic)",
                    }}
                  >
                    {product.nameAr}
                  </div>
                </td>
                <td
                  style={{
                    padding: "0.9rem 1.25rem",
                    fontSize: "0.72rem",
                    color: "#7a6b8a",
                  }}
                >
                  {product.category.replace(/_/g, " ")}
                </td>
                <td
                  style={{
                    padding: "0.9rem 1.25rem",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "var(--deep-luxury)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {Number(product.basePrice).toLocaleString()} DZD
                </td>
                <td
                  style={{
                    padding: "0.9rem 1.25rem",
                    fontSize: "0.78rem",
                    color: "#7a6b8a",
                    textAlign: "center",
                  }}
                >
                  {product.options.length}
                </td>
                <td
                  style={{
                    padding: "0.9rem 1.25rem",
                    fontSize: "0.78rem",
                    color: "#7a6b8a",
                    textAlign: "center",
                  }}
                >
                  {product._count.orderItems}
                </td>
                <td style={{ padding: "0.9rem 1.25rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "2px",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      background: product.isActive ? "#e8f5e9" : "#fce4e4",
                      color: product.isActive ? "#2e7d32" : "#c62828",
                    }}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ padding: "0.9rem 1.25rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <a
                      href={`admin/products/${product.id}/edit`}
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        color: "var(--primary)",
                        textDecoration: "none",
                        padding: "0.25rem 0.6rem",
                        border: "1px solid var(--primary-40)",
                        borderRadius: "2px",
                      }}
                    >
                      Edit
                    </a>
                    {product.isActive && (
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deleting === product.id}
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 600,
                          color: "#c62828",
                          background: "none",
                          border: "1px solid #fcc",
                          borderRadius: "2px",
                          padding: "0.25rem 0.6rem",
                          cursor: "pointer",
                        }}
                      >
                        Deactivate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
