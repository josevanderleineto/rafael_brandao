import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_OWNER } from "@/lib/site-config";

/**
 * manifest.webmanifest — improves instalação em Android/iOS e o resultado
 * "Site Name" em resultados de busca de apps.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_OWNER} | ${SITE_NAME}`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    lang: "pt-BR",
    dir: "ltr",
    background_color: "#F7F7F5",
    theme_color: "#12314D",
    categories: ["business", "lifestyle", "shopping"],
    icons: [
      { src: "/rafael-logo.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}