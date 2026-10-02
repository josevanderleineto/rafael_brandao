/**
 * Limitação de tentativas em memória, por chave (normalmente IP + rota).
 *
 * IMPORTANTE: em ambiente serverless (Vercel), cada instância tem seu próprio
 * memória, então o limite vale por instância e não é global. Ainda assim
 * derruba ataques simples e em rajada vinda de um único processo.
 *
 * Para um limite distribuído, troque o Map por um store compartilhado
 * (Upstash Redis, Neon, etc.).
 */

type Bucket = {
  /** contagem de tentativas */
  count: number;
  /** timestamp (ms) em que a janela reinicia */
  resetAt: number;
  /** timestamp (ms) até quando o bloqueio está ativo (opcional) */
  blockedUntil?: number;
};

const buckets = new Map<string, Bucket>();

/** Limpeza periódica para não crescer indefinidamente. */
const MAX_BUCKETS = 10_000;

function sweep(now: number) {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now && !(bucket.blockedUntil && bucket.blockedUntil > now)) {
      buckets.delete(key);
    }
  }
}

export type RateLimitResult = {
  /** Requisição liberada. */
  ok: boolean;
  /** Tentativas restantes na janela atual. */
  remaining: number;
  /** Segundos até a janela (ou o bloqueio) terminar. */
  retryAfter: number;
};

/**
 * Registra uma tentativa e informa se ela deve ser bloqueada.
 *
 * @param key       identificador da tentativa (ex.: "login:203.0.113.9")
 * @param limit     máximo de tentativas por janela
 * @param windowMs  tamanho da janela em milissegundos
 */
export function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);

  // Sem bucket, ou janela expirada: inicia uma nova.
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  // Bloqueio explícito ainda ativo.
  if (bucket.blockedUntil && bucket.blockedUntil > now) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.ceil((bucket.blockedUntil - now) / 1000),
    };
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    // Escalonamento progressivo: cada rodada de excesso dobra o bloqueio.
    const excess = bucket.count - limit;
    const blockMs = Math.min(15 * 60_000, 60_000 * 2 ** Math.min(excess - 1, 4));
    bucket.blockedUntil = now + blockMs;
    return { ok: false, remaining: 0, retryAfter: Math.ceil(blockMs / 1000) };
  }

  return {
    ok: true,
    remaining: limit - bucket.count,
    retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
  };
}

/** Libera o bucket após um login bem-sucedido. */
export function resetRateLimit(key: string) {
  buckets.delete(key);
}