import { isAdmin } from "@/lib/auth";
import { deleteProperty, getPropertyById, normalizeProperty, updateProperty } from "@/lib/property-store";

export const runtime = "nodejs";

async function getId(params: Promise<{ id: string }>) {
  const id = Number((await params).id);
  return Number.isInteger(id) ? id : null;
}

/** Deletes all Cloudinary URLs associated with a property (fire-and-forget style) */
async function deleteCloudinaryAssets(
  request: Request,
  urls: (string | null | undefined)[]
) {
  const cloudinaryUrls = urls
    .filter((u): u is string => typeof u === "string" && u.startsWith("https://res.cloudinary.com"));
  if (cloudinaryUrls.length === 0) return;

  try {
    // Build an internal fetch to our own API using same origin
    const baseUrl = new URL(request.url).origin;
    await fetch(`${baseUrl}/api/cloudinary-delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        cookie: request.headers.get("cookie") ?? "",
      },
      body: JSON.stringify({ urls: cloudinaryUrls }),
    });
  } catch {
    // Non-critical: log and continue — DB record will still be deleted
    console.warn("Failed to delete Cloudinary assets for property");
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = await getId(params);
  if (!id) return Response.json({ error: "Imóvel não encontrado." }, { status: 404 });
  const property = await getPropertyById(id);
  return property ? Response.json(property) : Response.json({ error: "Imóvel não encontrado." }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const id = await getId(params);
  if (!id) return Response.json({ error: "Imóvel não encontrado." }, { status: 404 });
  try {
    const property = await updateProperty(id, normalizeProperty(await request.json()));
    return property ? Response.json(property) : Response.json({ error: "Imóvel não encontrado." }, { status: 404 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Dados inválidos." }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const id = await getId(params);
  if (!id) return Response.json({ error: "Imóvel não encontrado." }, { status: 404 });

  // Fetch the property first to collect all its media URLs
  const property = await getPropertyById(id);
  if (!property) return Response.json({ error: "Imóvel não encontrado." }, { status: 404 });

  // Delete from DB first
  const deleted = await deleteProperty(id);
  if (!deleted) return Response.json({ error: "Imóvel não encontrado." }, { status: 404 });

  // Then clean up Cloudinary assets (non-blocking for the response)
  const allUrls = [
    property.image,
    ...(property.photos ?? []),
    property.videoUrl ?? "",
  ];
  void deleteCloudinaryAssets(request, allUrls);

  return new Response(null, { status: 204 });
}
