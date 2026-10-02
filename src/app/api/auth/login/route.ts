import { NextResponse } from "next/server";
import {
  adminCookie,
  adminCookieOptions,
  createSessionToken,
  isValidLogin,
} from "@/lib/auth";
import { verifyCaptcha } from "@/lib/captcha";
import { consumeRateLimit, resetRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** Tentativas permitidas por janela de 15 minutos, por IP. */
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

/** Extrai o IP do cliente a partir dos cabeçalhos do proxy. */
function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Monta a resposta de erro com os mesmos cabeçalhos de segurança sempre. */
function errorResponse(message: string, status: number, retryAfter?: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}),
      },
    }
  );
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limitKey = `login:${ip}`;

  // Bloqueia antes de qualquer trabalho: evita custo de hash e flood.
  const limit = consumeRateLimit(limitKey, MAX_ATTEMPTS, WINDOW_MS);
  if (!limit.ok) {
    return errorResponse(
      `Muitas tentativas de acesso. Tente novamente em ${Math.ceil(limit.retryAfter / 60)} minuto(s).`,
      429,
      limit.retryAfter
    );
  }

  let body: { username?: unknown; password?: unknown; captchaToken?: unknown; captchaAnswer?: unknown };
  try {
    body = await request.json();
  } catch {
    return errorResponse("Requisição inválida.", 400);
  }

  // Captcha primeiro: falha rápida para bots, sem tocar nas credenciais.
  const captchaError = verifyCaptcha(body.captchaToken, body.captchaAnswer);
  if (captchaError) {
    return errorResponse(captchaError, 400);
  }

  if (!isValidLogin(body.username, body.password)) {
    // Resposta genérica: não revela se usuário ou senha estavam errados.
    return errorResponse("Usuário ou senha inválidos.", 401);
  }

  // Sucesso: zera o contador e emite a sessão assinada.
  resetRateLimit(limitKey);

  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );

  response.cookies.set(adminCookie, createSessionToken(), {
    ...adminCookieOptions(),
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}