"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/#services", key: "services" },
  { href: "/#portfolio", key: "portfolio" },
  { href: "/#about", key: "about" },
  { href: "/#pricing", key: "pricing" },
  { href: "/#contact", key: "contact" },
] as const;

const LOCALES = [
  { code: "ar", label: "AR", dir: "rtl" },
  { code: "en", label: "EN", dir: "ltr" },
  { code: "fr", label: "FR", dir: "ltr" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale as "ar" | "en" | "fr" });
  }

  const isRTL = locale === "ar";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(101,76,142,0.15)",
        transition: "all 0.3s ease",
        boxShadow: scrolled ? "0 2px 20px rgba(47,33,71,0.08)" : "none",
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(1.5rem,5vw,4rem)",
          height: "72px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          locale={locale as "ar" | "en" | "fr"}
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
          aria-label="ESMAE home"
        >
          <Image
            src="/LOGO_PNG.png"
            alt="ESMAE"
            width={128}
            height={45}
            priority
            style={{
              width: "128px",
              height: "auto",
              display: "block",
            }}
          />
        </Link>

        {/* Desktop Nav Links */}
        <ul
          style={{
            display: "flex",
            gap: "2.5rem",
            listStyle: "none",
            alignItems: "center",
          }}
          className="hidden md:flex"
        >
          {NAV_LINKS.map(({ href, key }) => (
            <li key={key}>
              <a
                href={`/${locale}${href}`}
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--text-dark)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-dark)")
                }
              >
                {t(key)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: Lang switcher + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          {/* Language Switcher */}
          <div style={{ display: "flex", gap: "0.3rem" }}>
            {LOCALES.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => switchLocale(code)}
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  background: locale === code ? "var(--primary)" : "none",
                  border: "1px solid",
                  borderColor:
                    locale === code ? "var(--primary)" : "rgba(101,76,142,0.3)",
                  color: locale === code ? "#fff" : "var(--primary)",
                  padding: "0.25rem 0.55rem",
                  borderRadius: "2px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <a
            href={`/${locale}/quote-builder`}
            className="btn-primary"
            style={{ padding: "0.6rem 1.4rem", fontSize: "0.65rem" }}
          >
            {t("getQuote")}
          </a>
        </div>
      </nav>
    </header>
  );
}
