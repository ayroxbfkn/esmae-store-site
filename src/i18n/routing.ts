import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["ar", "en", "fr"],
  defaultLocale: "ar",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/services": {
      ar: "/services",
      en: "/services",
      fr: "/services",
    },
    "/portfolio": {
      ar: "/portfolio",
      en: "/portfolio",
      fr: "/portfolio",
    },
    "/about": {
      ar: "/about",
      en: "/about",
      fr: "/about",
    },
    "/contact": {
      ar: "/contact",
      en: "/contact",
      fr: "/contact",
    },
    "/quote-builder": {
      ar: "/quote-builder",
      en: "/quote-builder",
      fr: "/quote-builder",
    },
    "/dashboard": {
      ar: "/dashboard",
      en: "/dashboard",
      fr: "/dashboard",
    },
    "/admin": {
      ar: "/admin",
      en: "/admin",
      fr: "/admin",
    },
  },
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
