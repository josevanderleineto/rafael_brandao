import "server-only";

/**
 * CAPTCHA aritmético sem dependências externas.
 *
 * Objetivo: travar ataques automatizados de força bruta contra /api/auth/login.
 * Não substitui um serviço como Cloudflare Turnstile, mas cobre o caso
 * comum de bots simples sem exigir chaves de API nem widgets de terceiros.
 *
 * O desafio é assinado com HMAC usando ADMIN_PASSWORD como segredo, portanto
 * não há estado no servidor: o servidor só precisa recalcular a assinatura.
 */

import crypto from "node:crypto";

export const CAPTCHA_TTL_SECONDS = 300; // 5 minutos

type CaptchaPayload = {
  /** nonce aleatório — impede que o mesmo desafio seja reaproveitado */
  n: string;
  /** resposta correta (número) */
  a: number;
  /** validade em segundos desde a emissão */
  e: number;
};

function secret(): string {
  const raw =
    process.env.CAPTCHA_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.ADMIN_USERNAME ||
    "rafael-brandao-fallback";
  return raw;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

function randomInt(min: number, max: number): number {
  return crypto.randomInt(min, max + 1);
}

/** Monta a pergunta e assina o desafio. */
export function createCaptcha(): { token: string; question: string } {
  // Soma e subtração com números de 1 a 9 — fácil para humanos, sem ambiguidade.
  const isSum = crypto.randomInt(0, 2) === 1;
  const a = randomInt(1, 9);
  const b = randomInt(1, 9);
  const answer = isSum ? a + b : a - b;
  const question = isSum ? `Quanto é ${a} + ${b}?` : `Quanto é ${a} - ${b}?`;

  const payload: CaptchaPayload = {
    n: crypto.randomBytes(16).toString("base64url"),
    a: answer,
    e: Math.floor(Date.now() / 1000) + CAPTCHA_TTL_SECONDS,
  };

  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return { token: `${encoded}.${sign(encoded)}`, question };
}

/**
 * Valida a resposta do usuário contra o token assinado.
 * Retorna um motivo em português quando inválido, ou null quando válido.
 */
export function verifyCaptcha(token: unknown, answer: unknown): string | null {
  if (typeof token !== "string" || !token.includes(".")) {
    return "Captcha inválido. Recarregue a página.";
  }
  if (typeof answer !== "string" && typeof answer !== "number") {
    return "Informe o resultado do captcha.";
  }

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return "Captcha inválido. Recarregue a página.";

  const expected = sign(encoded);
  const provided = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);

  // Compara em tempo constante para não vazar informação por timing.
  if (
    provided.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(provided, expectedBuf)
  ) {
    return "Captcha inválido. Recarregue a página.";
  }

  let payload: CaptchaPayload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as CaptchaPayload;
  } catch {
    return "Captcha inválido. Recarregue a página.";
  }

  if (!payload || typeof payload.a !== "number" || typeof payload.e !== "number") {
    return "Captcha inválido. Recarregue a página.";
  }

  if (payload.e * 1000 < Date.now()) {
    return "Captcha expirado. Tente novamente.";
  }

  const normalized = String(answer).trim();
  if (!/^-?\d{1,3}$/.test(normalized)) return "Resposta do captcha inválida.";

  if (Number(normalized) !== payload.a) return "Resposta do captcha incorreta.";

  return null;
}

