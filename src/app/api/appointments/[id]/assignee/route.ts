import { backendFetch } from "@/lib/server/backend";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();

  const backendResponse = await backendFetch(
    `/api/appointments/${id}/assignee`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
    request
  );

  if (!backendResponse.ok) {
    const error = await backendResponse.json().catch(() => ({}));
    return Response.json(
      { message: error.message ?? "Could not assign appointment." },
      { status: backendResponse.status }
    );
  }

  const data = await backendResponse.json();
  return Response.json(data);
}
