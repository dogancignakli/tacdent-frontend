import { backendFetch } from "@/lib/server/backend";

export async function GET() {
  const backendResponse = await backendFetch("/api/services/all");

  if (!backendResponse.ok) {
    const error = await backendResponse.json().catch(() => ({}));
    return Response.json(
      { message: error.message ?? "Could not load services." },
      { status: backendResponse.status }
    );
  }

  return Response.json(await backendResponse.json());
}
