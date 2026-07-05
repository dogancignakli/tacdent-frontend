import { backendFetch } from "@/lib/server/backend";

export async function GET() {
  const backendResponse = await backendFetch("/api/testimonials/all");

  if (!backendResponse.ok) {
    const error = await backendResponse.json().catch(() => ({}));
    return Response.json(
      { message: error.message ?? "Could not load testimonials." },
      { status: backendResponse.status }
    );
  }

  return Response.json(await backendResponse.json());
}
