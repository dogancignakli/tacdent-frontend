import { backendFetch } from "@/lib/server/backend";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const backendResponse = await backendFetch(
    `/api/services/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
    request
  );

  if (!backendResponse.ok) {
    const error = await backendResponse.json().catch(() => ({}));
    return Response.json(
      { message: error.message ?? "Could not update service." },
      { status: backendResponse.status }
    );
  }

  return Response.json(await backendResponse.json());
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const backendResponse = await backendFetch(
    `/api/services/${id}`,
    {
      method: "DELETE",
    },
    request
  );

  if (!backendResponse.ok) {
    const error = await backendResponse.json().catch(() => ({}));
    return Response.json(
      { message: error.message ?? "Could not delete service." },
      { status: backendResponse.status }
    );
  }

  return new Response(null, { status: 204 });
}
