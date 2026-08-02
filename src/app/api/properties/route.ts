import { isAdmin } from "@/lib/auth";
import { createProperty, getProperties, normalizeProperty } from "@/lib/property-store";

export const runtime = "nodejs";

export async function GET() {
  return Response.json(await getProperties());
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Não autorizado." }, { status: 401 });
  try {
    return Response.json(await createProperty(normalizeProperty(await request.json())), { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Dados inválidos." }, { status: 400 });
  }
}
