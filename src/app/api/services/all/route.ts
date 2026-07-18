import { backendFetch } from "@/lib/server/backend";

export async function GET(request: Request) {
  const backendResponse = await backendFetch("/api/services/all", undefined, request);

  if (!backendResponse.ok) {
    const error = await backendResponse.json().catch(() => ({}));
    return Response.json(
      { message: error.message ?? "Could not load services." },
      { status: backendResponse.status }
    );
  }

  return Response.json(await backendResponse.json());
}
