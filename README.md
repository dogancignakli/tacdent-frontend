# TacDent Frontend

Marketing + appointment-booking site for **Diş Hekimi Tuğçe Aydın Çiğnaklı** (Dalaman, Muğla). Thin client over the [.NET API](https://github.com/dogancignakli/tacdent-backend) — no database or business logic of its own.

> **New to React?** Read **[LEARNING.md](./LEARNING.md)** first — it walks through the codebase file-by-file for backend developers learning UI.

## Quick start

```bash
npm install
cp .env.local.example .env.local   # fill in values (see Environment below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/tr` (default locale).

Make sure the backend API is running at `http://localhost:5065` (see `tacdent-backend` README).

**Production preview** (use this for Lighthouse / real performance scores — dev mode is slower):

```bash
npm run build && npm start
```

**VPS (Docker + Nginx):** see **[DEPLOY-VPS.md](./DEPLOY-VPS.md)**.

## Internationalization (TR / EN)

- **Locales:** Turkish (`/tr`, default) and English (`/en`) via [next-intl](https://next-intl.dev)
- **Toggle:** Segmented `TR | EN` button in the header (and mobile menu)
- **Messages:** `messages/tr.json` and `messages/en.json` (namespaced keys)
- **Routing:** All pages live under `src/app/[locale]/`; BFF routes stay at `src/app/api/`
- **SEO:** `alternates.languages` (hreflang) + per-locale canonical URLs in layout metadata
- **API contract unchanged:** Backend still receives English enum/string values (e.g. `Pending`, `General Checkup`)

## Pages

| Route | Purpose |
|-------|---------|
| `/tr` or `/en` | Landing page — hero, services carousel, testimonials |
| `/tr/services` | Service list from API (localized display names) |
| `/tr/about` | Dentist profile (Tuğçe Aydın Çiğnaklı) |
| `/tr/contact` | Contact details + click-to-load Google Maps |
| `/tr/appointments` | Public booking form |
| `/tr/kvkk/information` | KVKK / privacy notice |
| `/tr/kvkk/consent` | Explicit consent form |
| `/tr/health-tourism` | Health tourism info |
| `/tr/admin/login` | Staff login |
| `/tr/admin` | Staff panel (status tabs, sorting, pagination) |

Patient data is **not** shown on the public site. Staff sign in to review bookings and contact patients by phone.

## SEO & performance

| Feature | Location |
|---------|----------|
| `sitemap.xml` | `src/app/sitemap.ts` — public routes, tr/en hreflang |
| `robots.txt` | `src/app/robots.ts` — disallows `/admin`, `/api/` |
| Open Graph / Twitter cards | `generateMetadata` in `src/app/[locale]/layout.tsx` |
| JSON-LD (`Dentist` schema) | `src/components/seo/JsonLd.tsx` |
| Self-hosted images | `public/images/` (hero + service cards) — no external CDN |
| Favicon / apple icon | `src/app/icon.png`, `src/app/apple-icon.png`, `public/favicon.ico` |
| Web Vitals logging (dev) | `src/components/analytics/web-vitals.tsx` — console in `npm run dev` |
| Bundle analysis | `npm run analyze` — opens `@next/bundle-analyzer` report |

Images use `next/image` with `sizes` + AVIF/WebP (`next.config.ts`). Hero is a **Server Component** (less JS on first paint).

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4
- **next-intl** for Turkish / English i18n
- **shadcn/ui** (Base UI) — components in `src/components/ui/`
- **react-hook-form** + **zod** for forms · **sonner** for toasts
- **embla-carousel** for sliders · **next-themes** for dark mode
- **lucide-react** icons · **web-vitals** for Core Web Vitals reporting

> Carousels use the shadcn `Carousel` (Embla), not Swiper.

## Project layout

```
src/
├── app/
│   ├── [locale]/         # Localized page routes (tr, en)
│   ├── api/              # BFF route handlers (proxy to .NET API with httpOnly cookie)
│   ├── icon.png          # Favicon source (Next auto-generates routes)
│   ├── robots.ts         # robots.txt
│   ├── sitemap.ts        # sitemap.xml
│   └── layout.tsx        # Root passthrough layout
├── i18n/                 # next-intl routing, navigation, request config
├── components/
│   ├── ui/               # shadcn primitives (you own these files)
│   ├── layout/           # Header, Footer, theme toggle, language toggle
│   ├── home/             # Hero (RSC), carousels, CTA
│   ├── appointments/     # Public booking form
│   ├── admin/            # Appointment list, user management
│   ├── seo/              # JSON-LD structured data
│   ├── analytics/        # Web Vitals reporter
│   └── contact/          # Map click-to-load facade
├── lib/
│   ├── api.ts            # All HTTP calls to /api/* BFF (never fetch in components)
│   ├── auth.ts           # Client-side role cookie reader (Admin vs Staff)
│   ├── server/backend.ts # Server-only backend fetch + cookie helpers
│   ├── schemas/          # zod form schemas
│   └── utils.ts          # cn() helper
├── middleware.ts         # Redirects unauthenticated users away from /admin
└── types/index.ts        # API wire types (mirror backend JSON)

public/
├── images/               # Hero + service card photos (self-hosted)
├── logo/                 # Header logo
├── team/                 # About page dentist photo
└── og-image.jpg          # Open Graph preview image
```

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Public base URL of the .NET API (browser `connect-src`; default `http://localhost:5065`) |
| `API_URL` | Server-only backend URL used by BFF route handlers (default same as `NEXT_PUBLIC_API_URL`) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for metadata, sitemap, JSON-LD (default `http://localhost:3000`) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Google reCAPTCHA v3 **site key** (public). Required for booking and staff login. [Create keys](https://www.google.com/recaptcha/admin/create); add `localhost` to allowed domains. |
| `INTERNAL_API_KEY` | Shared secret sent by the BFF to the .NET API on `POST /api/appointments` and `POST /api/auth/login`. **Required in production** — must match backend `InternalApi:Key`. Leave empty locally to skip the check. |

## React learning path

Read **[LEARNING.md](./LEARNING.md)** — guided tour for backend developers, including Server vs Client Components, forms, i18n, and performance basics.

Quick pointers:

1. `src/components/layout/Header.tsx` — client nav, mobile sheet, theme + language toggles
2. `src/components/home/Hero.tsx` — **Server Component** (no `"use client"`)
3. `src/components/appointments/AppointmentForm.tsx` — react-hook-form + zod + reCAPTCHA + sonner
4. `src/app/[locale]/admin/login/page.tsx` — staff auth via BFF
5. `src/components/home/ServicesCarousel.tsx` — client carousel (Embla)

Official docs: [react.dev/learn](https://react.dev/learn) · [nextjs.org/docs](https://nextjs.org/docs) · [ui.shadcn.com](https://ui.shadcn.com)

## Backend contract

- JSON is **camelCase**; enums are **strings** (`Pending`, `Confirmed`, `Cancelled`, `Completed`)
- Dates: `"YYYY-MM-DD"` · Times: `"HH:mm"` or `"HH:mm:ss"`
- Public booking: browser → **Next.js BFF** `POST /api/appointments` → .NET API. Body includes `serviceId`, KVKK consent flags + text versions, and `recaptchaToken` (reCAPTCHA v3 action `booking`). The BFF forwards the visitor IP (`X-Forwarded-For`) and `X-Internal-Api-Key` when configured.
- Public reads: `GET /api/services` and `GET /api/testimonials` still call the .NET API directly (no auth).
- Staff: browser calls **Next.js BFF** routes under `/api/*`; BFF forwards `Authorization: Bearer` from the `tacdent_session` httpOnly cookie
- Login: `POST /api/auth/login` (BFF) sets `tacdent_session` (httpOnly) and `tacdent_role` (readable by client for UI gating); body includes `recaptchaToken` from action `login`
- Appointments list returns a **paged envelope**: `{ items, page, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage }`
- Query params: `status`, `page`, `pageSize`, `sortBy` (`PreferredDate` | `CreatedAt` | `Status`), `sortDirection` (`Asc` | `Desc`)

Bootstrap admin credentials: set via backend .NET user-secrets (`Auth:AdminEmail`, `Auth:AdminPassword`). See `tacdent-backend` README.

## Security

Staff session is stored in an **httpOnly cookie** (`tacdent_session`) set by the BFF login route — not in `localStorage`. Role (`Admin` / `Staff`) is exposed via a separate `tacdent_role` cookie for client-side UI gating only. `src/middleware.ts` guards `/admin` routes.

**Production checklist**

| Item | Frontend | Backend |
|------|----------|---------|
| BFF ↔ API shared secret | `INTERNAL_API_KEY` | `InternalApi:Key` (same value) |
| Trusted proxy IPs | — | `ForwardedHeaders:KnownProxies` (BFF / nginx IP) |
| Do not expose API publicly | BFF is the public edge | Firewall / bind API to private network |

The BFF derives the visitor IP from platform headers when available (`x-vercel-forwarded-for`, `cf-connecting-ip`, then `x-forwarded-for`) and forwards it to the API so KVKK consent rows store the real client IP. Direct calls to the .NET API for booking/login are rejected in production when `InternalApi:Key` is set.

Response headers are set in `next.config.ts` for all routes:

- **Content-Security-Policy** — restricts scripts, styles, images, and API `connect-src` to `NEXT_PUBLIC_API_URL`; allows Google reCAPTCHA v3 and Maps iframe (`google.com`, `gstatic.com`)
- **X-Frame-Options: DENY** — clickjacking protection
- **X-Content-Type-Options: nosniff**
- **Referrer-Policy** and **Permissions-Policy**

See backend README for API-side rate limits, KVKK consent storage, reCAPTCHA verification, role-based authorization, and forwarded-header configuration.
