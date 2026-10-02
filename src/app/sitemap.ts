import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { getPropertiesCached } from "@/lib/property-store";
import { absoluteUrl } from "@/lib/site-config";

/**
 * sitemap.xml — https://www.rafaelbrandaoimoveis.com.br/sitemap.xml
 *
 * Inclui a home, a listagem de imóveis e cada página individual de imóvel
 * (com as imagens, o que ajuda a indexação no Google Imagens).
 *
 * Reexecuta a cada 30 minutos porque o catálogo muda pelo painel /admin.
 */
export const revalidate = 1800;

/** Cache próprio do catálogo para a lista, isolado do `unstable_cache` interno. */
const cachedList = unstable_cache(
  async () => getPropertiesCached(),
  ["sitemap", "properties"],
  { revalidate: 1800, tags: ["properties"] }
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const base: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/imoveis"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  let properties: Awaited<ReturnType<typeof getPropertiesCached>> = [];
  try {
    properties = await cachedList();
  } catch (error) {
    console.warn("sitemap: falha ao carregar imóveis, emitindo apenas URLs estáticas:", error);
  }

  const propertyEntries: MetadataRoute.Sitemap = properties.map((property) => {
    const images = Array.from(
      new Set([property.image, ...(property.photos ?? []).filter(Boolean)]),
    ).filter((url) => url.startsWith("http"));

    return {
      url: absoluteUrl(`/imoveis/${property.id}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      // Imóveis em destaque recebem prioridade maior.
      priority: property.featured ? 0.9 : 0.7,
      ...(images.length > 0 ? { images } : {}),
    };
  });

  return [...base, ...propertyEntries];
}