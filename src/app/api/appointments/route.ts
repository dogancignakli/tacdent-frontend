import { backendFetch } from "@/lib/server/backend";

const FORWARDED_QUERY_PARAMS = [
  "status",
  "page",
  "pageSize",
  "sortBy",
  "sortDirection",
] as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forwarded = new URLSearchParams();

  for (const key of FORWARDED_QUERY_PARAMS) {
    const value = searchParams.get(key);
    if (value) {
      forwarded.set(key, value);
    }
  }

  const query = forwarded.toString();
  const backendResponse = await backendFetch(`/api/appointments${query ? `?${query}` : ""}`);

  if (!backendResponse.ok) {
    const error = await backendResponse.json().catch(() => ({}));
    return Response.json(
      { message: error.message ?? "Could not load appointments." },
      { status: backendResponse.status }
    );
  }

  const data = await backendResponse.json();
  return Response.json(data);
}
