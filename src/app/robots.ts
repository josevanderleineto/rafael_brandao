import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";

/**
 * robots.txt — https://www.rafaelbrandaoimoveis.com.br/robots.txt
 *
 * Mantém o catálogo público para indexação e bloqueia rotas internas
 * (painel administrativo e API), que nunca devem aparecer nos resultados.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}