import { isAdmin } from "@/lib/auth";
import { getSiteContent, updateSiteContentBatch } from "@/lib/site-content-store";

export const runtime = "nodejs";

/** GET /api/site-content — public, returns all site content */
export async function GET() {
  try {
    const content = await getSiteContent();
    return Response.json(content);
  } catch (error) {
    return Response.json({ error: "Erro ao carregar conteúdo." }, { status: 500 });
  }
}

/** PUT /api/site-content — admin only, batch update */
export async function PUT(request: Request) {
  if (!(await isAdmin()))
    return Response.json({ error: "Não autorizado." }, { status: 401 });

  try {
    const body = (await request.json()) as { updates?: unknown };
    if (!body.updates || typeof body.updates !== "object" || Array.isArray(body.updates)) {
      return Response.json({ error: "Formato inválido." }, { status: 400 });
    }
    // Sanitize: only string values
    const updates: Record<string, string> = {};
    for (const [k, v] of Object.entries(body.updates as Record<string, unknown>)) {
      if (typeof v === "string") updates[k] = v;
    }
    await updateSiteContentBatch(updates);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Erro ao salvar." },
      { status: 500 }
    );
  }
}
