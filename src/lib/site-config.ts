/**
 * Configuração central do site — usada por metadata, sitemap.xml, robots.txt
 * e dados estruturados (JSON-LD).
 *
 * O telefone e o e-mail públicos ficam em `src/lib/data.ts` — o mesmo valor
 * usado no WhatsApp, no formulário de contato e no JSON-LD.
 */

/** Domínio canônico do site (sem barra final). */
export const SITE_URL = "https://www.rafaelbrandaoimoveis.com.br";

/** Nome curto da marca. */
export const SITE_NAME = "Rafael Brandão Imóveis";

/** Nome do profissional / corretor. */
export const SITE_OWNER = "Rafael Brandão";

/** Descrição padrão (fallback quando uma página não define a sua). */
export const SITE_DESCRIPTION =
  "Corretor de imóveis em Salvador, Região Metropolitana e Litoral Norte da Bahia. Locação, administração, vendas, avaliações, regularização e terrenos para incorporação. CRECI-BA 7691 | CNAI 47.907.";

/** Credenciais exibidas ao público. */
export const SITE_CREDENTIALS = {
  creci: "CRECI-BA 7691",
  cnai: "CNAI 47.907",
  experienceYears: 25,
} as const;

/** Cidades atendidas — usado no JSON-LD de área de atuação. */
export const SERVICE_AREAS = [
  "Salvador",
  "Região Metropolitana de Salvador",
  "Litoral Norte da Bahia",
] as const;

/** Monta uma URL absoluta do site a partir de um caminho relativo. */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}