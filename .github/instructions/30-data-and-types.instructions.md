---
applyTo: "src/lib/api.ts,src/lib/auth.ts,src/types/**/*.ts"
---

# API client & types

## Browser HTTP goes through `src/lib/api.ts`
- `request<T>` is the authenticated wrapper. It `fetch`es a same-origin path with
  `credentials: "include"` (the session cookie). It does not attach a Bearer token; the BFF does.
- On `401` (unless `skipAuthHandling`) it throws "session expired". Other non-2xx throw
  `new Error(error.message ?? "…")`. `204` returns `undefined as T`.
- `publicRequest` is the anonymous same-origin wrapper (the booking form's service list).
- One named function per endpoint. `login` passes `skipAuthHandling: true`. Let errors throw so
  callers can `toast.error`.
- Paths start with `/api/...`. Do not prefix them with `API_URL` or a public API host.

## Server HTTP
- BFF route handlers and Server Components call the .NET API through `src/lib/server/backend.ts`
  (`getBackendUrl()` reads `API_URL`, default `http://localhost:5065`).

## `src/types/index.ts` mirrors the backend
- Entities as `interface` (`DentalService`, `Appointment`); enums as string-literal unions; request
  bodies as separate `interface XPayload`. Auth types: `LoginPayload { email, password, recaptchaToken }`,
  `LoginResponse { role }` (the BFF keeps the token).
- Field names are **camelCase** and must match the backend exactly. Services `id` = `number`,
  appointments `id` = `string` (GUID). Update this file first when a DTO changes, then `api.ts`.

## Two kinds of "types" — keep them distinct
- **`src/types/`** = the API/wire contract. **`src/lib/schemas/`** = zod form schemas + their
  `z.infer` types (UI input shape). Map between them at submit time.
