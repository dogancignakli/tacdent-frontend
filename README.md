# TacDent Frontend

Marketing + appointment-booking site for the TacDent dental clinic. Thin client over the [.NET API](https://github.com/dogancignakli/tacdent-backend) — no database or business logic of its own.

## Quick start

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Make sure the backend API is running at `http://localhost:5065` (see `tacdent-backend` README).

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page with hero, services carousel, testimonials |
| `/services` | Service list from API |
| `/about` | Team and clinic story |
| `/contact` | Contact details |
| `/appointments` | Public booking form (success toast only — no patient list) |
| `/admin/login` | Staff login |
| `/admin` | Staff panel — view and manage appointment requests |

Patient data is **not** shown on the public site. Staff sign in to review bookings and contact patients by phone.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4
- **shadcn/ui** (Base UI) — components in `src/components/ui/`
- **react-hook-form** + **zod** for forms · **sonner** for toasts
- **embla-carousel** for sliders · **next-themes** for dark mode
- **lucide-react** icons

> Swiper is not used — carousels use the shadcn `Carousel` (Embla).

## Project layout

```
src/
├── app/                  # Routes (App Router)
├── components/
│   ├── ui/               # shadcn primitives (you own these files)
│   ├── layout/           # Header, Footer, theme toggle
│   ├── home/             # Hero, carousels, CTA
│   ├── appointments/     # Public booking form
│   └── admin/            # Staff appointment list
├── lib/
│   ├── api.ts            # All HTTP calls (never fetch in components)
│   ├── auth.ts           # JWT token storage (staff)
│   ├── schemas/          # zod form schemas
│   └── utils.ts          # cn() helper
└── types/index.ts        # API wire types (mirror backend JSON)
```

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Base URL of the .NET API (default `http://localhost:5065`) |

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
- Public: `POST /api/appointments` (booking)
- Staff: `POST /api/auth/login` then `Bearer` token on appointment management endpoints

Dev staff password: set via backend .NET user-secrets (`Auth:AdminPassword`). See `tacdent-backend` README.

## Security

Response headers are set in `next.config.ts` for all routes:

- **Content-Security-Policy** — restricts scripts, styles, images, and API `connect-src` to `NEXT_PUBLIC_API_URL`
- **X-Frame-Options: DENY** — clickjacking protection
- **X-Content-Type-Options: nosniff**
- **Referrer-Policy** and **Permissions-Policy**

Staff JWT is stored in `localStorage` via `src/lib/auth.ts` (see backend README for login rate limits).
