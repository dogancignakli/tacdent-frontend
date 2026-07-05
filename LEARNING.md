# TacDent Frontend — Learning Guide

This project is your practice ground for **Next.js + React + Tailwind + shadcn/ui**.

You already know backend: HTTP, DTOs, auth, validation, layered architecture. The frontend here mirrors those ideas with different names — this guide maps them for you.

## How to run

```bash
npm install
cp .env.local.example .env.local   # set API URL, site URL, reCAPTCHA key
npm run dev
```

Open [http://localhost:3000/tr](http://localhost:3000/tr). Backend API: [http://localhost:5065](http://localhost:5065).

**Important:** Performance numbers from `npm run dev` are misleading (React dev mode is slow). For real scores:

```bash
npm run build && npm start
# then Chrome DevTools → Lighthouse (Mobile)
```

Web Vitals (`FCP`, `LCP`, `CLS`) log to the **browser console** only in dev — see `src/components/analytics/web-vitals.tsx`.

---

## Backend ↔ Frontend cheat sheet

| Backend (you know) | Frontend (this project) |
|--------------------|---------------------------|
| Controller | Page in `src/app/[locale]/.../page.tsx` or BFF in `src/app/api/` |
| ViewModel / DTO | Types in `src/types/index.ts` + zod schemas in `src/lib/schemas/` |
| FluentValidation | zod + `@hookform/resolvers` in forms |
| Service layer | `src/lib/api.ts` (client) or `src/lib/server/backend.ts` (server) |
| Result / Error | Try/catch + toast errors; API returns `{ code, message }` |
| Middleware / auth filter | `src/middleware.ts` + httpOnly cookie |
| appsettings / env | `.env.local` (`NEXT_PUBLIC_*`) |
| i18n resource files | `messages/tr.json`, `messages/en.json` |

---

## Read these files in order

| # | File | What you'll learn |
|---|------|-------------------|
| 1 | `src/components/layout/Header.tsx` | **Client component** — nav, mobile sheet, theme + language toggles |
| 1b | `src/components/layout/language-toggle.tsx` | Locale switch without losing the current path |
| 2 | `src/components/home/Hero.tsx` | **Server component** — no hooks, renders on the server, less JS |
| 3 | `src/components/appointments/AppointmentForm.tsx` | Forms: zod validation, reCAPTCHA, API call, toast feedback |
| 4 | `src/app/[locale]/appointments/page.tsx` | Thin page wrapper — composes a client form |
| 5 | `src/app/[locale]/admin/login/page.tsx` | Staff login via BFF (`/api/auth/login`) |
| 6 | `src/components/admin/AdminAppointmentList.tsx` | Tabs, sorting, pagination (like your paged API) |
| 6b | `src/components/admin/AdminUserManagement.tsx` | Admin-only CRUD UI |
| 7 | `src/components/home/ServicesCarousel.tsx` | Client carousel (Embla) — needs browser interactivity |
| 8 | `src/app/[locale]/layout.tsx` | Root layout: fonts, metadata, JSON-LD, providers |
| 9 | `src/lib/api.ts` | Single place for all HTTP — never `fetch` in components |
| 10 | `messages/tr.json` | Translation keys (mirror in `en.json`) |
| 11 | `src/app/globals.css` | Design tokens (colors, radius) — change once, update everywhere |

---

## Core concepts (backend-dev friendly)

### React component

A function that returns UI (HTML-like JSX). Think of it as a small, reusable view template.

```tsx
export function Greeting({ name }: { name: string }) {
  return <p>Hello, {name}</p>;
}
```

`name` is a **prop** — like a constructor parameter or method argument.

### JSX

HTML-ish syntax inside JavaScript. `{expression}` embeds values:

```tsx
<h1>{t("title")}</h1>
```

### Server vs Client — the most important Next.js idea

| | Server Component | Client Component |
|---|------------------|------------------|
| File marker | *(default — no marker)* | `"use client"` at top |
| Runs where | Node.js (server) | Browser |
| Can use hooks (`useState`, `useEffect`) | No | Yes |
| Can use browser APIs | No | Yes |
| Ships JS to browser | No (HTML only) | Yes |
| Example in this repo | `Hero.tsx`, `about/page.tsx` | `Header.tsx`, `AppointmentForm.tsx` |

**Rule of thumb:** Start as Server Component. Add `"use client"` only when you need interactivity (clicks, form state, carousel, theme toggle).

Why it matters for performance: every Client Component adds JavaScript the browser must download, parse, and run before the page feels ready (**FCP**).

### State (`useState`)

Data that changes and triggers a re-render. Like a field on a ViewModel that the UI watches.

```tsx
const [count, setCount] = useState(0);
// setCount(1) → component re-renders with count === 1
```

### Effects (`useEffect`)

Run code *after* render — fetching data, subscribing to events. Like hooking into `OnInitialized` in Blazor, or a background task after page load.

```tsx
useEffect(() => {
  fetchServices().then(setServices);
}, []); // [] = run once on mount
```

Prefer **Server Components + async page** for initial data when possible (see `services/page.tsx` — fetches on the server, no `useEffect` needed).

### Props

Inputs passed from parent to child. Optional callbacks are common:

```tsx
<AppointmentForm onCreated={() => router.push("/")} />
```

---

## shadcn/ui mental model

shadcn is **not** an npm UI library you import blindly. The CLI **copies component source** into `src/components/ui/`. You own every file — edit freely.

Common pieces in this project:

| Component | Use |
|-----------|-----|
| `Button` | Actions; pass `render={<Link href="..." />}` for navigation |
| `Card` | Content containers |
| `Input` / `Label` / `Textarea` / `Select` | Form fields |
| `Badge` | Status labels |
| `Dialog` | Confirm delete |
| `Sheet` | Mobile slide-out menu |
| `Carousel` | Sliders (Embla under the hood) |
| `sonner` | Toast notifications |

Add more anytime:

```bash
npx shadcn@latest add tabs accordion avatar
```

---

## Forms pattern (reuse on every client site)

Same flow as backend validation, but split across three layers:

1. **Schema** — `src/lib/schemas/` with **zod** (like FluentValidation rules)
2. **Form state** — `useForm({ resolver: zodResolver(schema) })` from **react-hook-form**
3. **UI** — wire fields with `register()` or `Controller`; show `form.formState.errors`
4. **Submit** — call `src/lib/api.ts`; on success `toast.success()`, on error `toast.error()`

Full examples: `AppointmentForm.tsx`, `admin/login/page.tsx`.

reCAPTCHA v3 runs before submit — token goes in the request body; backend verifies with Google (same idea as your `RecaptchaValidator`).

---

## API access — never fetch in a component

All HTTP goes through `src/lib/api.ts`. Components call typed functions:

```tsx
await createAppointment(data);  // not fetch("/api/...")
```

**Why?** Single place for URLs, error handling, and types — like a repository or API client in .NET.

**BFF pattern:** Staff routes hit Next.js `/api/*` handlers, which read the httpOnly cookie and forward `Authorization: Bearer` to the .NET API. The browser never sees the JWT — similar to a gateway or reverse proxy adding auth headers.

---

## Internationalization (i18n)

1. Add keys to **both** `messages/tr.json` and `messages/en.json`.
2. **Server Components:** `const t = await getTranslations("namespace")` → `t("key")`
3. **Client Components:** `const t = useTranslations("namespace")` → `t("key")`
4. **Links:** use `Link` from `@/i18n/navigation` (keeps `/tr` or `/en` prefix)
5. **Validation messages:** schema factories accept a `t` function from `useTranslations("validation")`

---

## Theming

Brand colors live in `src/app/globals.css` under `:root` and `.dark`:

```css
--primary: oklch(0.588 0.158 241.966);
```

Components use semantic tokens (`bg-primary`, `text-muted-foreground`) — never hardcode `sky-600`. Change tokens once; the whole site updates.

Dark mode: `next-themes` + `ThemeProvider` in layout. `ThemeToggle` is a client component that toggles the `dark` class on `<html>`.

---

## Images & performance (FCP / LCP)

Core Web Vitals — Google's page-speed metrics:

| Metric | What it measures | Good target |
|--------|------------------|-------------|
| **FCP** | First text/image appears | ≤ 1.8 s |
| **LCP** | Largest element (usually hero image) fully visible | ≤ 2.5 s |
| **CLS** | Layout shift (elements jumping) | ≤ 0.1 |

What this project does:

- **`next/image`** — auto-resizes, lazy-loads, serves AVIF/WebP
- **`sizes` attribute** — tells the browser which width to download (mobile gets smaller files)
- **`priority`** — only on LCP image (hero); everything else lazy-loads
- **Self-hosted images** in `public/images/` — no extra DNS hop to Unsplash
- **Hero as Server Component** — less JS before first paint

Images in `public/` are referenced by path: `src="/images/hero.jpg"`. Next optimizes them at build/runtime.

**Measure:**

| Tool | When |
|------|------|
| Console `[Web Vitals]` logs | `npm run dev` only |
| Chrome Lighthouse | `npm run build && npm start` |
| `npm run analyze` | JS bundle size breakdown |
| [PageSpeed Insights](https://pagespeed.web.dev) | After deploy (real user data) |

---

## SEO basics (what we added)

| Piece | File | Purpose |
|-------|------|---------|
| `sitemap.ts` | `src/app/sitemap.ts` | Tells Google all public URLs (tr + en) |
| `robots.ts` | `src/app/robots.ts` | Blocks crawlers from `/admin`, `/api/` |
| `generateMetadata` | `layout.tsx` | Title, description, Open Graph, Twitter card, hreflang |
| `JsonLd.tsx` | `src/components/seo/JsonLd.tsx` | Structured data (`Dentist` schema) for Google Maps / rich results |
| `og-image.jpg` | `public/` | Preview image when link is shared on social media |

Metadata is like `<meta>` tags you'd set in a Razor layout — but typed and generated per locale in Next.js.

---

## Common mistakes (when coming from backend)

1. **Adding `"use client"` everywhere** — default to Server Components; only opt in when needed.
2. **`fetch` inside a component** — use `src/lib/api.ts` instead.
3. **Trusting `npm run dev` performance** — always test with production build for Lighthouse.
4. **Hardcoded colors** — use `text-primary`, `bg-muted`, not Tailwind palette names.
5. **Using `next/link` for locale routes** — use `@/i18n/navigation` Link.
6. **Rendering patient data on public pages** — appointment lists are admin-only behind auth.

---

## Suggested learning path

1. **Week 1 — Read & tweak copy:** Change text in `messages/tr.json`, see it update. Open `Header.tsx` and follow a link.
2. **Week 2 — Server vs Client:** Compare `Hero.tsx` (server) vs `ServicesCarousel.tsx` (client). Try removing `"use client"` from a client file and read the error.
3. **Week 3 — Forms:** Trace `AppointmentForm.tsx` from zod schema → input → submit → API → toast.
4. **Week 4 — New page:** Add a simple `/faq` page (Server Component + i18n keys in both JSON files).
5. **Ongoing:** [react.dev/learn](https://react.dev/learn) Tutorial + [Next.js App Router docs](https://nextjs.org/docs/app).

---

## Official docs

- [react.dev/learn](https://react.dev/learn) — start here for React fundamentals
- [nextjs.org/docs/app](https://nextjs.org/docs/app) — App Router, Server Components, metadata
- [ui.shadcn.com](https://ui.shadcn.com) — component reference
- [next-intl.dev](https://next-intl.dev) — i18n in this project
- [tailwindcss.com/docs](https://tailwindcss.com/docs) — utility CSS
- [web.dev/vitals](https://web.dev/vitals/) — Core Web Vitals explained
