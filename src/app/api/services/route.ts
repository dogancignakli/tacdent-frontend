import { anonymousBackendFetch, backendFetch } from "@/lib/server/backend";

export async function GET(request: Request) {
  const backendResponse = await anonymousBackendFetch(
    "/api/services",
    undefined,
    undefined,
    request
  );

  if (!backendResponse.ok) {
    const error = await backendResponse.json().catch(() => ({}));
    return Response.json(
      { message: error.message ?? "Could not load services." },
      { status: backendResponse.status }
    );
  }

  return Response.json(await backendResponse.json());
}

export async function POST(request: Request) {
  const body = await request.json();
  const backendResponse = await backendFetch(
    "/api/services",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    request
  );

  if (!backendResponse.ok) {
    const error = await backendResponse.json().catch(() => ({}));
    return Response.json(
      { message: error.message ?? "Could not create service." },
      { status: backendResponse.status }
    );
  }

  const data = await backendResponse.json();
  return Response.json(data, { status: backendResponse.status });
}
