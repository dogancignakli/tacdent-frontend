# TacDent Frontend

Next.js + React + TypeScript + Tailwind CSS website for the TacDent dental clinic.

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
| `/` | Landing page with hero, service swiper, testimonials |
| `/services` | Service list from API |
| `/about` | Team and clinic story |
| `/contact` | Contact details |
| `/appointments` | Book and manage appointments |

## React learning path (start here)

If you are new to React, read the comments in these files in order:

1. `src/components/layout/Header.tsx` — **Components** and JSX
2. `src/components/home/Hero.tsx` — composing UI with HTML-like syntax
3. `src/components/appointments/AppointmentForm.tsx` — **state** (`useState`) and **effects** (`useEffect`)
4. `src/app/appointments/page.tsx` — lifting state to refresh a sibling list
5. `src/components/home/ServicesSwiper.tsx` — **Client Components** (`"use client"`)

### Core ideas

- **Component**: a reusable function that returns UI (e.g. `Header`, `Hero`).
- **Props**: inputs passed into a component (e.g. `onCreated` on `AppointmentForm`).
- **State**: data that changes over time; updating state triggers a re-render.
- **Server vs Client**: files in `app/` are Server Components by default; add `"use client"` when you need browser APIs, hooks, or event handlers.

Official docs: [react.dev/learn](https://react.dev/learn) and [nextjs.org/docs](https://nextjs.org/docs).

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Swiper (carousels)

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Base URL of the .NET API (default `http://localhost:5065`) |
