# TacDent Frontend — Learning Guide

This project is your practice ground for building client websites with **Next.js + React + Tailwind + shadcn/ui**.

## How to run

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000/tr](http://localhost:3000/tr). Backend API: [http://localhost:5065](http://localhost:5065).

---

## Read these files in order

| # | File | What you'll learn |
|---|------|-------------------|
| 1 | `src/components/layout/Header.tsx` | Nav, mobile sheet, **TR \| EN language toggle**, theme toggle |
| 1b | `src/components/layout/language-toggle.tsx` | Segmented locale switcher with `useRouter` + `usePathname` |
| 2 | `src/components/home/Hero.tsx` | Client components with `useTranslations` |
| 3 | `src/components/appointments/AppointmentForm.tsx` | `react-hook-form` + locale-aware zod + sonner toasts |
| 4 | `src/app/[locale]/appointments/page.tsx` | Public booking page |
| 5 | `src/app/[locale]/admin/login/page.tsx` | Staff login via BFF |
| 6 | `src/components/admin/AdminAppointmentList.tsx` | Status tabs, sorting, pagination |
| 6b | `src/components/admin/AdminUserManagement.tsx` | Admin-only staff account management |
| 7 | `src/components/home/ServicesCarousel.tsx` | shadcn `Carousel` (Embla) |
| 8 | `messages/tr.json` | Translation keys (mirror in `en.json`) |
| 9 | `src/app/globals.css` | Theme tokens |

---

## Core concepts (backend-dev friendly)

### React component
A function that returns UI. Example: `Header`, `Hero`, `AppointmentForm`.

### Props
Inputs passed into a component — e.g. optional `onCreated` on `AppointmentForm`, or `onUnauthorized` on `AdminAppointmentList`.

### State (`useState`)
Data that changes over time. Updating state re-renders the component.

### Effects (`useEffect`)
Side effects after render — e.g. fetching services from the API on mount.

### Server vs Client
- Files in `app/` are **Server Components** by default (no hooks, no browser APIs).
- Add `"use client"` at the top when you need hooks, events, or browser APIs.

---

## shadcn/ui mental model

shadcn is **not** an npm UI library. The CLI **copies component source** into `src/components/ui/`. You own and can edit every file.

Common pieces:
- **`Button`** — actions and links (`render={<Link href="..." />}`)
- **`Card`** — content containers (services, appointments, team)
- **`Input` / `Label` / `Textarea` / `Select`** — form fields
- **`Badge`** — status labels (Pending, Confirmed, …)
- **`Dialog`** — confirm destructive actions (delete appointment)
- **`Sheet`** — mobile slide-out menu
- **`Carousel`** — sliders (services, testimonials)
- **`sonner`** — toast notifications (success/error messages)

Add more components anytime:
```bash
npx shadcn@latest add tabs accordion avatar
```

---

## Theming for client work

Brand color lives in `src/app/globals.css` under `:root` and `.dark`:

```css
--primary: oklch(0.588 0.158 241.966); /* TacDent sky blue */
```

To re-theme for a new client (e.g. law firm navy, restaurant warm orange), change `--primary`, `--ring`, and optionally `--accent`. Every `Button`, `Badge`, and link using `text-primary` updates automatically.

---

## Forms pattern (reuse on every client site)

1. Define schema in `src/lib/schemas/` with **zod**
2. `useForm({ resolver: zodResolver(schema) })` from **react-hook-form**
3. Wire fields with `register()` or `Controller` (for Select)
4. Show errors from `form.formState.errors`
5. On success: `toast.success()` from **sonner**

See `AppointmentForm.tsx` and `src/app/admin/login/page.tsx` for the full patterns.

---

## API access

All HTTP calls go through `src/lib/api.ts` — never `fetch` inside a component. Staff routes hit the **Next.js BFF** (`/api/*`).

## Adding translations

1. Add the key to both `messages/tr.json` and `messages/en.json` under the right namespace (`common`, `home`, `admin`, …).
2. In Server Components: `const t = await getTranslations('namespace')` then `t('key')`.
3. In Client Components: `const t = useTranslations('namespace')` then `t('key')`.
4. For links, use `Link` from `@/i18n/navigation` (not `next/link`) so the locale prefix is preserved.
5. Form validation: use schema factories in `src/lib/schemas/` that accept a `t` function from `useTranslations('validation')`.

---

## Official docs

- [react.dev/learn](https://react.dev/learn)
- [nextjs.org/docs](https://nextjs.org/docs)
- [ui.shadcn.com](https://ui.shadcn.com)
- [tailwindcss.com/docs](https://tailwindcss.com/docs)
