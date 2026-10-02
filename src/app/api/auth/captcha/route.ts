import { createCaptcha } from "@/lib/captcha";

/**
 * GET /api/auth/captcha
 * Entrega um desafio de captcha para a tela de login do /admin.
 */
export async function GET() {
  const { token, question } = createCaptcha();
  return Response.json(
    { question, token },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}