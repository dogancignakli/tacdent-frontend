import { backendFetch } from "@/lib/server/backend";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const backendResponse = await backendFetch(`/api/testimonials/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  if (!backendResponse.ok) {
    const error = await backendResponse.json().catch(() => ({}));
    return Response.json(
      { message: error.message ?? "Could not update testimonial." },
      { status: backendResponse.status }
    );
  }

  return Response.json(await backendResponse.json());
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const backendResponse = await backendFetch(`/api/testimonials/${id}`, {
    method: "DELETE",
  });

  if (!backendResponse.ok) {
    const error = await backendResponse.json().catch(() => ({}));
    return Response.json(
      { message: error.message ?? "Could not delete testimonial." },
      { status: backendResponse.status }
    );
  }

  return new Response(null, { status: 204 });
}
