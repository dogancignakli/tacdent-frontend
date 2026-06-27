import { backendFetch } from "@/lib/server/backend";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();

  const backendResponse = await backendFetch(`/api/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  if (!backendResponse.ok) {
    const error = await backendResponse.json().catch(() => ({}));
    return Response.json(
      { message: error.message ?? "Could not update user role." },
      { status: backendResponse.status }
    );
  }

  const data = await backendResponse.json();
  return Response.json(data);
}
