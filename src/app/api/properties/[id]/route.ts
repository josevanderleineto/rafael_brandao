import { isAdmin } from "@/lib/auth";
import { deleteProperty, getPropertyById, normalizeProperty, updateProperty } from "@/lib/property-store";

export const runtime = "nodejs";

async function getId(params: Promise<{ id: string }>) {
  const id = Number((await params).id);
  return Number.isInteger(id) ? id : null;
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

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const id = await getId(params);
  if (!id || !(await deleteProperty(id))) return Response.json({ error: "Imóvel não encontrado." }, { status: 404 });
  return new Response(null, { status: 204 });
}
