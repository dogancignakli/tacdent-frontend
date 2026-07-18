import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  anonymousBackendFetch,
  getClientIpFromRequest,
  ROLE_COOKIE,
  SESSION_COOKIE,
} from "@/lib/server/backend";

interface BackendLoginResponse {
  token: string;
  expiresAt: string;
  role: string;
}

export async function POST(request: Request) {
  const body = await request.json();
  const clientIp = getClientIpFromRequest(request);

  const backendResponse = await anonymousBackendFetch(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    clientIp,
    request
  );

  if (!backendResponse.ok) {
    const error = await backendResponse.json().catch(() => ({}));
    return NextResponse.json(
      { message: error.message ?? "Login failed." },
      { status: backendResponse.status }
    );
  }

  const data = (await backendResponse.json()) as BackendLoginResponse;
  const expiresAt = new Date(data.expiresAt);
  const maxAge = Math.max(
    0,
    Math.floor((expiresAt.getTime() - Date.now()) / 1000)
  );
  const isProduction = process.env.NODE_ENV === "production";

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, data.token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  cookieStore.set(ROLE_COOKIE, data.role, {
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return NextResponse.json({ role: data.role });
}
