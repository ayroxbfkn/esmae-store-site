"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/b2b", label: "Dashboard", icon: "⊞", exact: true },
  { href: "/b2b/orders", label: "My Orders", icon: "📦" },
  { href: "/b2b/quotes", label: "Quotes", icon: "◈" },
  { href: "/b2b/account", label: "Account", icon: "◉" },
];

export function B2BSidebar({
  locale,
  user,
}: {
  locale: string;
  user: { name?: string | null; email: string; role: string };
}) {
  const pathname = usePathname();

  function isActive(href: string, exact = false) {
    const full = `/${locale}${href}`;
    return exact ? pathname === full : pathname.startsWith(full);
  }

  return (
    <aside
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "var(--deep-luxury)",
        borderRight: "1px solid rgba(180,151,214,0.12)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "1.5rem 1.5rem 1rem",
          borderBottom: "1px solid rgba(180,151,214,0.12)",
        }}
      >
        <Link href={`/${locale}`} style={{ textDecoration: "none" }}>
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
            B2B Portal
          </div>
        </Link>
      </div>

      {/* User info */}
      <div
        style={{
          padding: "1rem 1.5rem",
          borderBottom: "1px solid rgba(180,151,214,0.1)",
        }}
      >
        <div
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
            marginBottom: "0.2rem",
          }}
        >
          {user.name ?? user.email}
        </div>
        <div style={{ fontSize: "0.62rem", color: "rgba(180,151,214,0.5)" }}>
          {user.email}
        </div>
      </div>

      {/* Nav */}
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
                color: active ? "#fff" : "rgba(180,151,214,0.6)",
                textDecoration: "none",
                background: active ? "rgba(101,76,142,0.4)" : "transparent",
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
              <span style={{ fontSize: "1rem" }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div
        style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid rgba(180,151,214,0.12)",
        }}
      >
        <Link
          href={`/${locale}/quote-builder`}
          style={{
            display: "block",
            textAlign: "center",
            padding: "0.6rem",
            background: "var(--primary)",
            color: "#fff",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
            borderRadius: "2px",
            marginBottom: "0.75rem",
          }}
        >
          + New Quote
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
            display: "block",
            width: "100%",
            textAlign: "left",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ff8888")}
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
