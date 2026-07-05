import { cookies } from "next/headers";

export const SESSION_COOKIE = "tacdent_session";
export const ROLE_COOKIE = "tacdent_role";
const INTERNAL_API_KEY_HEADER = "X-Internal-Api-Key";

export function getBackendUrl(): string {
  return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5065";
}

function getInternalApiKey(): string | undefined {
  return process.env.INTERNAL_API_KEY?.trim() || undefined;
}

/**
 * Prefer platform-set forwarding headers over client-supplied values when available.
 */
export function getClientIpFromRequest(request: Request): string | undefined {
  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    return vercelIp.split(",")[0]?.trim() || undefined;
  }

  const cloudflareIp = request.headers.get("cf-connecting-ip");
  if (cloudflareIp) {
    return cloudflareIp.trim();
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || undefined;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return undefined;
}

function buildForwardedIpHeaders(clientIp?: string): HeadersInit | undefined {
  if (!clientIp) {
    return undefined;
  }

  return {
    "X-Forwarded-For": clientIp,
    "X-Real-IP": clientIp,
  };
}

function applyInternalApiKey(headers: Headers): void {
  const internalApiKey = getInternalApiKey();
  if (internalApiKey) {
    headers.set(INTERNAL_API_KEY_HEADER, internalApiKey);
  }
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

export function unauthorizedResponse(): Response {
  return Response.json(
    { message: "Your session has expired. Please log in again." },
    { status: 401 }
  );
}

export async function backendFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const token = await getSessionToken();

  if (!token) {
    return unauthorizedResponse();
  }

  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${getBackendUrl()}${path}`, {
    ...init,
    headers,
  });
}

export async function anonymousBackendFetch(
  path: string,
  init?: RequestInit,
  clientIp?: string
): Promise<Response> {
  const headers = new Headers(init?.headers);
  const forwardedHeaders = buildForwardedIpHeaders(clientIp);

  if (forwardedHeaders) {
    for (const [key, value] of Object.entries(forwardedHeaders)) {
      headers.set(key, value);
    }
  }

  applyInternalApiKey(headers);

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${getBackendUrl()}${path}`, {
    ...init,
    headers,
  });
}
