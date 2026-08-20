import type { Property, PropertyBadge, PropertyType } from "./data";

export type PropertyFilters = {
  query: string;
  badge: PropertyBadge | "Todos";
  type: PropertyType | "Todos";
  minBeds: number;
  maxPrice: number | null;
  city: string;
  neighborhood: string;
};

export const defaultFilters: PropertyFilters = {
  query: "",
  badge: "Todos",
  type: "Todos",
  minBeds: 0,
  maxPrice: null,
  city: "Todas",
  neighborhood: "Todos",
};

export const priceFilterOptions = [
  { label: "Qualquer preço", value: null },
  { label: "Até R$ 2 milhões", value: 2000000 },
  { label: "Até R$ 4 milhões", value: 4000000 },
  { label: "Até R$ 6 milhões", value: 6000000 },
  { label: "Acima de R$ 6 milhões", value: 6000001 },
];

export const bedFilterOptions = [
  { label: "Qualquer", value: 0 },
  { label: "1+", value: 1 },
  { label: "2+", value: 2 },
  { label: "3+", value: 3 },
  { label: "4+", value: 4 },
];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function filterProperties(
  properties: Property[],
  filters: PropertyFilters,
): Property[] {
  const query = normalizeText(filters.query.trim());

  return properties.filter((property) => {
    const searchableText = normalizeText(
      `${property.title} ${property.neighborhood} ${property.city} ${property.type} ${property.badge}`,
    );

    if (query && !searchableText.includes(query)) {
      return false;
    }

    if (filters.city !== "Todas" && normalizeText(property.city) !== normalizeText(filters.city)) {
      return false;
    }

    if (
      filters.neighborhood !== "Todos" &&
      normalizeText(property.neighborhood) !== normalizeText(filters.neighborhood)
    ) {
      return false;
    }

    if (filters.badge !== "Todos" && property.badge !== filters.badge) {
      return false;
    }

    if (filters.type !== "Todos" && property.type !== filters.type) {
      return false;
    }

    if (filters.minBeds > 0 && property.beds < filters.minBeds) {
      return false;
    }

    if (filters.maxPrice !== null) {
      if (property.badge === "Aluguel") {
        return false;
      }

      if (filters.maxPrice === 6000001) {
        return property.priceValue > 6000000;
      }

      if (property.priceValue > filters.maxPrice) {
        return false;
      }
    }

    return true;
  });
}

export function hasActiveFilters(filters: PropertyFilters) {
  return (
    filters.query.trim() !== "" ||
    filters.city !== "Todas" ||
    filters.neighborhood !== "Todos" ||
    filters.badge !== "Todos" ||
    filters.type !== "Todos" ||
    filters.minBeds > 0 ||
    filters.maxPrice !== null
  );
}

export function formatEmbedVideoUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();

  // YouTube match: watch?v=ID, youtu.be/ID, shorts/ID, embed/ID
  const youtubeMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );

  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo match: vimeo.com/123456789 or player.vimeo.com/video/123456789
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return trimmed;
}

