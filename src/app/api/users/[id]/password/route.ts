import { backendFetch } from "@/lib/server/backend";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();

  const backendResponse = await backendFetch(
    `/api/users/${id}/password`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    request
  );

  if (!backendResponse.ok) {
    const error = await backendResponse.json().catch(() => ({}));
    return Response.json(
      { message: error.message ?? "Could not reset password." },
      { status: backendResponse.status }
    );
  }

  return new Response(null, { status: 204 });
}
