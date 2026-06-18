"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "⊞", exact: true },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/products", label: "Products", icon: "◈" },
  { href: "/admin/pricing", label: "Pricing Rules", icon: "⚙" },
  { href: "/admin/portfolio", label: "Portfolio", icon: "◻" },
  { href: "/admin/users", label: "Users", icon: "◉" },
  { href: "/admin/analytics", label: "Analytics", icon: "▲" },
];

export function AdminSidebar({
  locale,
  role,
}: {
  locale: string;
  role: string;
}) {
  const pathname = usePathname();

  function isActive(href: string, exact = false) {
    const full = `/${locale}${href}`;
    return exact ? pathname === full : pathname.startsWith(full);
  }

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div
        style={{
          padding: "1.5rem 1.5rem 1rem",
          borderBottom: "1px solid rgba(180,151,214,0.12)",
        }}
      >
        <Link
          href={`/${locale}`}
          style={{
            textDecoration: "none",
            display: "block",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.4rem",
              fontWeight: 400,
              color: "#fff",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Esmae
          </div>
          <div
            style={{
              fontSize: "0.58rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--primary-soft)",
              opacity: 0.7,
              marginTop: "0.15rem",
            }}
          >
            Admin Panel
          </div>
        </Link>
      </div>

      {/* Role badge */}
      <div style={{ padding: "0.75rem 1.5rem" }}>
        <span
          style={{
            fontSize: "0.55rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--gold)",
            background: "rgba(201,169,110,0.12)",
            padding: "0.2rem 0.6rem",
            borderRadius: "2px",
          }}
        >
          {role.replace("_", " ")}
        </span>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "0.5rem 0" }}>
        {NAV_ITEMS.map(({ href, label, icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={`/${locale}${href}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.7rem 1.5rem",
                fontSize: "0.72rem",
                fontWeight: active ? 600 : 400,
                letterSpacing: "0.05em",
                color: active ? "#fff" : "rgba(180,151,214,0.6)",
                textDecoration: "none",
                background: active
                  ? "rgba(101,76,142,0.4)"
                  : "transparent",
                borderLeft: active
                  ? "2px solid var(--primary-soft)"
                  : "2px solid transparent",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(101,76,142,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "rgba(180,151,214,0.6)";
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "transparent";
                }
              }}
            >
              <span style={{ fontSize: "1rem", opacity: 0.9 }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div
        style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid rgba(180,151,214,0.12)",
        }}
      >
        <Link
          href={`/${locale}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            fontSize: "0.68rem",
            color: "rgba(180,151,214,0.5)",
            textDecoration: "none",
            marginBottom: "0.6rem",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--primary-soft)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(180,151,214,0.5)")
          }
        >
          ← View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: `/${locale}/sign-in` })}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "0.68rem",
            color: "rgba(180,151,214,0.5)",
            padding: 0,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "#ff8888")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(180,151,214,0.5)")
          }
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
