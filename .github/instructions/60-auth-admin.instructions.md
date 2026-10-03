---
applyTo: "src/lib/auth.ts,src/app/**/admin/**/*.tsx,src/components/admin/**/*.tsx,src/middleware.ts"
---

# Admin auth and route guard

Staff log in with email and password. The BFF (`src/app/api/auth/login/route.ts`) exchanges them
for a JWT and stores it in the httpOnly cookie `tacdent_session`. The readable cookie
`tacdent_role` is only for UI gating. Patient data stays behind this area.

## What the client may read
- `src/lib/auth.ts` exposes `getRole()`, `isAuthenticated()`, and `isAdmin()` from `tacdent_role`.
- Do not put the JWT in `localStorage` or in client-readable state. The browser client sends
  `credentials: "include"`; it never attaches `Authorization` itself.

## Routes
- Pages live under `src/app/[locale]/admin/`. Login is `/[locale]/admin/login`.
- `src/middleware.ts` redirects `/admin` (except login) to the login page when `tacdent_session`
  is missing. That check is not authorization. The API still enforces `[Authorize]` and roles.
- Login uses react-hook-form/zod plus reCAPTCHA. On success, `toast.success` and
  `router.push("/admin")`. Logout calls the BFF `POST /api/auth/logout`, which clears the cookies.
- Management lists live in `src/components/admin/`. A `401` means the session expired; send the
  user back to login.

## Security
- Never render patient data on a public page. The booking form is public; the appointment list is not.
- Do not widen what an anonymous request can reach.
