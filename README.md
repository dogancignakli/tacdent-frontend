# TacDent Frontend

Marketing + appointment-booking site for the TacDent dental clinic. Thin client over the [.NET API](https://github.com/dogancignakli/tacdent-backend) — no database or business logic of its own.

## Quick start

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/tr` (default locale).

Make sure the backend API is running at `http://localhost:5065` (see `tacdent-backend` README).

## Internationalization (TR / EN)

- **Locales:** Turkish (`/tr`, default) and English (`/en`) via [next-intl](https://next-intl.dev)
- **Toggle:** Segmented `TR | EN` button in the header (and mobile menu), next to the theme toggle
- **Messages:** `messages/tr.json` and `messages/en.json` (namespaced keys)
- **Routing:** All pages live under `src/app/[locale]/`; BFF routes stay at `src/app/api/`
- **API contract unchanged:** Backend still receives English enum/string values (e.g. `Pending`, `General Checkup`)

## Pages

| Route | Purpose |
|-------|---------|
| `/tr` or `/en` | Landing page with hero, services carousel, testimonials |
| `/tr/services` | Service list from API (localized display names) |
| `/tr/about` | Team and clinic story |
| `/tr/contact` | Contact details |
| `/tr/appointments` | Public booking form |
| `/tr/admin/login` | Staff login |
| `/tr/admin` | Staff panel (status tabs, sorting, pagination) |

Patient data is **not** shown on the public site. Staff sign in to review bookings and contact patients by phone.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4
- **next-intl** for Turkish / English i18n
- **shadcn/ui** (Base UI) — components in `src/components/ui/`
- **react-hook-form** + **zod** for forms · **sonner** for toasts
- **embla-carousel** for sliders · **next-themes** for dark mode
- **lucide-react** icons

> Swiper is not used — carousels use the shadcn `Carousel` (Embla).

## Project layout

```
src/
├── app/
│   ├── [locale]/         # Localized page routes (tr, en)
│   ├── api/              # BFF route handlers (proxy to .NET API with httpOnly cookie)
│   └── layout.tsx        # Root passthrough layout
├── i18n/                 # next-intl routing, navigation, request config
├── components/
│   ├── ui/               # shadcn primitives (you own these files)
│   ├── layout/           # Header, Footer, theme toggle, language toggle
│   ├── home/             # Hero, carousels, CTA
│   ├── appointments/     # Public booking form
│   └── admin/            # Appointment list, user management, admin shell
├── lib/
│   ├── api.ts            # All HTTP calls to /api/* BFF (never fetch in components)
│   ├── auth.ts           # Client-side role cookie reader (Admin vs Staff)
│   ├── server/backend.ts # Server-only backend fetch + cookie helpers
│   ├── schemas/          # zod form schemas
│   └── utils.ts          # cn() helper
├── middleware.ts         # Redirects unauthenticated users away from /admin
└── types/index.ts        # API wire types (mirror backend JSON)
```

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Base URL of the .NET API (default `http://localhost:5065`) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Google reCAPTCHA v3 **site key** (public). Required for booking and staff login forms. Get keys at [Google reCAPTCHA admin](https://www.google.com/recaptcha/admin/create); add `localhost` to allowed domains. |

## React learning path

For a guided tour of the codebase, read **[LEARNING.md](./LEARNING.md)** — it is more up to date than this file for patterns and file-by-file walkthroughs.

Quick pointers:

1. `src/components/layout/Header.tsx` — navigation, mobile sheet, theme toggle
2. `src/components/home/Hero.tsx` — Server Component composition
3. `src/components/appointments/AppointmentForm.tsx` — react-hook-form + zod + sonner
4. `src/app/admin/login/page.tsx` — staff auth flow
5. `src/components/home/ServicesCarousel.tsx` — shadcn Carousel (Embla)

Official docs: [react.dev/learn](https://react.dev/learn) · [nextjs.org/docs](https://nextjs.org/docs) · [ui.shadcn.com](https://ui.shadcn.com)

## Backend contract

- JSON is **camelCase**; enums are **strings** (`Pending`, `Confirmed`, `Cancelled`, `Completed`)
- Dates: `"YYYY-MM-DD"` · Times: `"HH:mm"` or `"HH:mm:ss"`
- Public: `POST /api/appointments` (booking) — calls backend directly via `NEXT_PUBLIC_API_URL`; body includes `recaptchaToken` from reCAPTCHA v3 action `booking`
- Staff: browser calls **Next.js BFF** routes under `/api/*`; BFF forwards `Authorization: Bearer` from the `tacdent_session` httpOnly cookie
- Login: `POST /api/auth/login` (BFF) sets `tacdent_session` (httpOnly) and `tacdent_role` (readable by client for UI gating); body includes `recaptchaToken` from action `login`
- Appointments list returns a **paged envelope**: `{ items, page, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage }`
- Query params: `status`, `page`, `pageSize`, `sortBy` (`PreferredDate` | `CreatedAt` | `Status`), `sortDirection` (`Asc` | `Desc`)

Bootstrap admin credentials: set via backend .NET user-secrets (`Auth:AdminEmail`, `Auth:AdminPassword`). See `tacdent-backend` README.

## Security

Staff session is stored in an **httpOnly cookie** (`tacdent_session`) set by the BFF login route — not in `localStorage`. Role (`Admin` / `Staff`) is exposed via a separate `tacdent_role` cookie for client-side UI gating only. `src/middleware.ts` guards `/admin` routes.

Response headers are set in `next.config.ts` for all routes:

- **Content-Security-Policy** — restricts scripts, styles, images, and API `connect-src` to `NEXT_PUBLIC_API_URL`; allows Google reCAPTCHA v3 (`google.com`, `gstatic.com`)
- **X-Frame-Options: DENY** — clickjacking protection
- **X-Content-Type-Options: nosniff**
- **Referrer-Policy** and **Permissions-Policy**

See backend README for API-side login rate limits and role-based authorization.
