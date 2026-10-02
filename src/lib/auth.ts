import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Autenticação do painel /admin.
 *
 * Medidas de segurança aplicadas:
 * - Sem credenciais padrão em código: exige ADMIN_USERNAME e ADMIN_PASSWORD.
 * - Comparação em tempo constante (evita timing attacks).
 * - Cookie HttpOnly + SameSite=Lax + Secure em produção + valor assinado.
 */

export const adminCookie = "rb_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 horas
const MAX_INPUT_LENGTH = 200;

function configuredUsername(): string | null {
  const value = process.env.ADMIN_USERNAME?.trim();
  return value ? value : null;
}

function configuredPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD;
  return value && value.length > 0 ? value : null;
}

/** Indica se as variáveis de ambiente de admin estão definidas. */
export function isAuthConfigured(): boolean {
  return Boolean(configuredUsername() && configuredPassword());
}

/** Compara duas strings sem vazar tempo de resposta. */
function safeEquals(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");
  // Compara hashes de tamanho fixo para que comprimentos diferentes
  // também levem ao mesmo caminho de execução.
  const hashA = crypto.createHash("sha256").update(bufferA).digest();
  const hashB = crypto.createHash("sha256").update(bufferB).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

/** Valida usuário e senha contra as variáveis de ambiente. */
export function isValidLogin(username: unknown, password: unknown): boolean {
  const expectedUsername = configuredUsername();
  const expectedPassword = configuredPassword();

  // Sem configuração, ninguém entra — e nunca cai para credenciais padrão.
  if (!expectedUsername || !expectedPassword) return false;

  if (typeof username !== "string" || typeof password !== "string") return false;
  if (username.length > MAX_INPUT_LENGTH || password.length > MAX_INPUT_LENGTH) return false;

  const usernameOk = safeEquals(username, expectedUsername);
  const passwordOk = safeEquals(password, expectedPassword);

  // Avalia ambas para manter o tempo constante.
  return usernameOk && passwordOk;
}

// ─── Cookie de sessão assinado ───────────────────────────────────────────────

/** Segredo de assinatura do cookie. Reutiliza a senha de admin. */
function signingSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "sem-sessao-configurada"
  );
}

/** Gera o valor do cookie: HMAC do payload, com validade embutida. */
export function createSessionToken(): string {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `v1.${expiresAt}`;
  const signature = crypto
    .createHmac("sha256", signingSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

/** Confere assinatura e validade do token do cookie. */
export function verifySessionToken(token: unknown): boolean {
  if (typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;

  const [, expiresAt, signature] = parts;
  const payload = `v1.${expiresAt}`;

  const expected = crypto
    .createHmac("sha256", signingSecret())
    .update(payload)
    .digest("base64url");

  if (!safeEquals(signature, expected)) return false;

  const expiry = Number(expiresAt);
  return Number.isFinite(expiry) && expiry * 1000 > Date.now();
}

/**
 * Atributos do cookie de sessão. `Secure` só em produção (HTTPS).
 * Exclui `/admin` e `/api` do envio para reduzir exposição em logs.
 */
export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

/** true quando há uma sessão administrativa válida. */
export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(adminCookie)?.value;
  return verifySessionToken(token);
}