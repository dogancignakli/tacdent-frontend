import { backendFetch } from "@/lib/server/backend";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const backendResponse = await backendFetch(
    `/api/appointments/${id}`,
    {
      method: "DELETE",
    },
    request
  );

  if (!backendResponse.ok) {
    const error = await backendResponse.json().catch(() => ({}));
    return Response.json(
      { message: error.message ?? "Could not delete appointment." },
      { status: backendResponse.status }
    );
  }

  return new Response(null, { status: 204 });
}
