import { cookies } from "next/headers";

export const SESSION_COOKIE = "tacdent_session";
export const ROLE_COOKIE = "tacdent_role";

export function getBackendUrl(): string {
  return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5065";
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
