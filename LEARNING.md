# TacDent Frontend — Learning Guide

This project is your practice ground for building client websites with **Next.js + React + Tailwind + shadcn/ui**.

## How to run

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Backend API: [http://localhost:5065](http://localhost:5065).

---

## Read these files in order

| # | File | What you'll learn |
|---|------|-------------------|
| 1 | `src/components/layout/Header.tsx` | Client components, shadcn `Button`, `Sheet`, `NavigationMenu` |
| 2 | `src/components/home/Hero.tsx` | Server components, composing UI from shadcn pieces |
| 3 | `src/components/appointments/AppointmentForm.tsx` | `react-hook-form` + `zod` validation + shadcn inputs |
| 4 | `src/app/appointments/page.tsx` | Lifting state (`refreshKey`) to refresh a sibling list |
| 5 | `src/components/home/ServicesCarousel.tsx` | shadcn `Carousel` (Embla) instead of Swiper |
| 6 | `src/app/globals.css` | Theme tokens — change brand color in one place |
| 7 | `src/components/providers/theme-provider.tsx` | Dark mode with `next-themes` |

---

## Core concepts (backend-dev friendly)

### React component
A function that returns UI. Example: `Header`, `Hero`, `AppointmentForm`.

### Props
Inputs passed into a component: `onCreated` on `AppointmentForm`.

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

See `AppointmentForm.tsx` for the full pattern.

---

## Official docs

- [react.dev/learn](https://react.dev/learn)
- [nextjs.org/docs](https://nextjs.org/docs)
- [ui.shadcn.com](https://ui.shadcn.com)
- [tailwindcss.com/docs](https://tailwindcss.com/docs)
