---
applyTo: "**/*"
---

# TacDent Frontend — overview

Marketing + appointment-booking site for a dental clinic. It is a thin client over a
.NET API; it has no database or business logic of its own. Public visitors can only *book*;
clinic staff log into an admin area to view and manage requests.

## Stack (do not assume older versions)
- Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4.
- **shadcn/ui** for components (built on **Base UI**, not Radix) · **lucide-react** icons.
- **react-hook-form + zod** (`@hookform/resolvers`) for forms · **sonner** for toasts.
- **embla-carousel** for sliders · **next-themes** for dark mode.
- `cva` + `clsx` + `tailwind-merge` (`cn` helper) for class composition.
- Path alias: `@/*` -> `./src/*`.

## ⚠️ Next.js 16 is newer than your training data
Verify Next-specific code (routing, `params`/`searchParams`, caching, `next/image`, metadata)
against `node_modules/next/dist/docs/` or current docs. Don't "fix" to an older pattern.

## Non-negotiables
- **The browser never calls the .NET host.** Client code uses `src/lib/api.ts` with same-origin
  paths (`/api/...`). Server Components and BFF handlers use `src/lib/server/*` and `API_URL`.
- **All shared types live in `src/types/index.ts`** and must mirror the backend JSON contract.
- **Server Components by default.** Add `"use client"` only for hooks, handlers, or browser APIs.
- **Build UI from shadcn primitives in `src/components/ui/`** — don't hand-roll buttons, inputs,
  cards, dialogs with raw Tailwind.
- **Use semantic color tokens** (`bg-background`, `text-primary`, `text-muted-foreground`, …),
  never hardcoded palette values like `sky-600`.
- **Never render patient data on a public page.** The `/appointments` page is the booking form
  only; the appointment *list* lives behind the admin auth guard. (This was a real data leak.)

## Backend contract (the API this app talks to)
- Server-side base URL is `API_URL` (local `http://localhost:5065`, VPS `http://api:8080` on the
  `tacdent` Docker network). Routes are under `/api`.
- JSON is **camelCase**. Enums are **strings** (status `"Pending" | "Confirmed" | "Cancelled" | "Completed"`).
- Times are `"HH:mm"` / `"HH:mm:ss"`; dates are `"YYYY-MM-DD"`. `Appointment` has `createdAt` + `updatedAt`.
- Errors: `{ code, message }`; validation errors: `{ message, errors: { field: string[] } }`.
- **Auth:** the browser calls `POST /api/auth/login` on this app. The BFF stores the JWT in the
  httpOnly cookie `tacdent_session` and the role in `tacdent_role`. Management routes require that
  cookie; the BFF sends `Authorization: Bearer` to the API. A `401` means the session expired.
