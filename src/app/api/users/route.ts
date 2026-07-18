import { backendFetch } from "@/lib/server/backend";

export async function GET(request: Request) {
  const backendResponse = await backendFetch("/api/users", undefined, request);

  if (!backendResponse.ok) {
    const error = await backendResponse.json().catch(() => ({}));
    return Response.json(
      { message: error.message ?? "Could not load users." },
      { status: backendResponse.status }
    );
  }

  const data = await backendResponse.json();
  return Response.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const backendResponse = await backendFetch(
    "/api/users",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    request
  );

  if (!backendResponse.ok) {
    const error = await backendResponse.json().catch(() => ({}));
    return Response.json(
      { message: error.message ?? "Could not create user." },
      { status: backendResponse.status }
    );
  }

  const data = await backendResponse.json();
  return Response.json(data, { status: backendResponse.status });
}
