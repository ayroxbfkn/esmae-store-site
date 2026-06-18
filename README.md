# أَسْـٰمَێَ — Esmae Studio

Premium multilingual printing studio platform. Built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and Stripe.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS Variables |
| i18n | next-intl (AR/EN/FR) |
| Database | PostgreSQL + Prisma ORM |
| Cache | Redis (ioredis) |
| Auth | NextAuth v5 (Credentials + OAuth) |
| Payments | Stripe |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Storage | S3-compatible (AWS / Cloudflare R2) |

---

## Quick Start

### 1. Clone & Install

```bash
git clone <repo>
cd esmae
npm install
```

### 2. Environment Variables

Copy `.env.local` and fill in:

```bash
cp .env.local .env.local.backup
```

Required variables:
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection string
- `NEXTAUTH_SECRET` — Generate: `openssl rand -base64 32`
- `NEXTAUTH_URL` — Your app URL
- `STRIPE_SECRET_KEY` — From Stripe dashboard
- `STRIPE_PUBLISHABLE_KEY` — From Stripe dashboard
- `STRIPE_WEBHOOK_SECRET` — From Stripe webhook settings
- `WHATSAPP_ACCESS_TOKEN` — Meta WhatsApp Cloud API access token
- `WHATSAPP_PHONE_NUMBER_ID` — Meta WhatsApp sender phone number ID
- `WHATSAPP_TO_NUMBER` — Notification recipient, defaults to `213672744323`
- `WHATSAPP_GRAPH_API_VERSION` — Optional, defaults to `v20.0`

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed
```

### 4. Development

```bash
npm run dev
```

App runs at `http://localhost:3000`

### 5. Stripe Webhooks (local)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Project Structure

```
src/
├── app/
│   ├── [locale]/              # All locale-aware pages
│   │   ├── page.tsx           # Homepage (AR/EN/FR)
│   │   ├── layout.tsx         # Locale layout (RTL/LTR)
│   │   ├── admin/             # Admin panel (SUPER_ADMIN, STAFF)
│   │   │   ├── page.tsx       # Dashboard with stats
│   │   │   ├── orders/        # Order management + CSV export
│   │   │   ├── products/      # Product CRUD
│   │   │   ├── pricing/       # Pricing rules & quantity tiers
│   │   │   ├── portfolio/     # Portfolio CMS
│   │   │   ├── users/         # User management
│   │   │   └── analytics/     # Revenue analytics
│   │   ├── b2b/               # B2B portal (B2B_CLIENT)
│   │   │   ├── page.tsx       # B2B dashboard
│   │   │   ├── orders/        # Order history with tracking
│   │   │   ├── quotes/        # Quote management
│   │   │   └── account/       # Account details
│   │   ├── dashboard/         # Customer dashboard
│   │   ├── quote-builder/     # 5-step quote builder
│   │   ├── sign-in/
│   │   └── sign-up/
│   └── api/
│       ├── auth/              # NextAuth handlers
│       ├── pricing/           # Price calculation endpoint
│       ├── products/          # Products API
│       ├── orders/            # Order creation + listing
│       ├── upload/            # File upload handler
│       ├── admin/orders/      # Admin CSV export
│       └── webhooks/stripe/   # Stripe webhook handler
├── components/
│   ├── layout/                # Navbar, Footer
│   ├── sections/              # Hero, Services, Portfolio, About, etc.
│   ├── forms/                 # QuoteBuilderForm, SignInForm, SignUpForm, ContactSection
│   ├── admin/                 # All admin UI components
│   ├── b2b/                   # B2B sidebar
│   └── shared/                # OrderStatusBadge, etc.
├── lib/
│   ├── prisma/client.ts       # Singleton Prisma client
│   ├── redis/client.ts        # Redis client + cache helpers
│   ├── auth/config.ts         # NextAuth configuration
│   ├── stripe/client.ts       # Stripe helpers
│   ├── pricing/engine.ts      # Dynamic pricing engine
│   ├── storage/upload.ts      # File upload utilities
│   ├── validators/schemas.ts  # Zod schemas
│   ├── actions/               # Server actions
│   │   ├── auth.ts            # Register, update profile
│   │   ├── contact.ts         # Contact form
│   │   ├── orders.ts          # Order CRUD
│   │   ├── pricing.ts         # Price calculation, quote creation
│   │   └── products.ts        # Product CRUD
│   └── utils/helpers.ts       # Utility functions
├── i18n/
│   ├── routing.ts             # next-intl routing config
│   └── request.ts             # Server request config
├── store/index.ts             # Zustand stores (cart, UI)
├── hooks/
│   ├── usePrice.ts            # Price calculation hook
│   └── useLocaleInfo.ts       # RTL/LTR detection hook
├── types/index.ts             # TypeScript types
└── middleware.ts              # Locale + auth middleware
messages/
├── ar.json                    # Arabic translations
├── en.json                    # English translations
└── fr.json                    # French translations
prisma/
├── schema.prisma              # Full database schema
└── seed.ts                    # Demo data seeder
```

---

## Role System

| Role | Access |
|------|--------|
| `SUPER_ADMIN` | Full admin panel, all features |
| `STAFF` | Admin panel (no user role changes) |
| `B2B_CLIENT` | B2B portal, custom pricing |
| `CUSTOMER` | Customer dashboard, quotes |

---

## Demo Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@esmae.dz | Admin@esmae2025! |
| B2B Client | b2b@example.dz | B2B@client2025! |

---

## Pricing Engine

The pricing engine (`src/lib/pricing/engine.ts`) calculates prices **server-side only**:

1. Base product price
2. Option multipliers (paper weight, finish, sides)
3. Added option costs
4. Quantity-based discount tiers (5% / 10% / 15% / 20%)
5. B2B discount tiers (0% / 5% / 10% / 15% / 20%)
6. Active pricing rules (seasonal, promotional)
7. Tax (19% TVA Algeria)
8. Delivery (free above 15,000 DZD)

Results are cached in Redis for 5 minutes.

---

## Languages & RTL

- `/ar` — Arabic (RTL, Noto Naskh Arabic font)
- `/en` — English (LTR, Montserrat font)
- `/fr` — French (LTR, Montserrat font)

Locale detection via middleware with cookie persistence. `dir` attribute set on `<html>` tag.

---

## Stripe Integration

1. Products are priced in DZD
2. Checkout sessions created server-side
3. Webhook at `/api/webhooks/stripe` handles:
   - `checkout.session.completed` → marks order PAID + CONFIRMED
   - `payment_intent.payment_failed` → keeps order PENDING
   - `charge.refunded` → marks order REFUNDED

---

## Production Deployment

```bash
# Build
npm run build

# Set up Stripe webhook endpoint
stripe listen --forward-to https://yourdomain.com/api/webhooks/stripe

# Run migrations
npm run db:migrate
```

Recommended: Vercel (frontend) + Supabase (PostgreSQL) + Upstash (Redis)
