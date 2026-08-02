import "server-only";

import { neon } from "@neondatabase/serverless";
import { propertyBadges, propertyTypes, type Property, type PropertyInput } from "./data";
import { formatEmbedVideoUrl } from "./property-utils";

type PropertyRow = {
  id: number; title: string; price_value: number; badge: Property["badge"]; type: Property["type"];
  neighborhood: string; city: string; image: string; beds: number; baths: number; area: number;
  featured: boolean; description: string | null; photos?: string[] | null; video_url?: string | null;
};

function database() {
  let connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL não foi configurada. Adicione a conexão do Neon ao arquivo .env.local.");
  
  connectionString = connectionString
    .replace(/[?&]channel_binding=[^&]*/g, "")
    .replace(/[?&]sslmode=[^&]*/g, "");

  return neon(connectionString);
}

function formatPrice(value: number, badge: Property["badge"]) {
  if (!value) return "Sob consulta";
  const formatted = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
  return badge === "Aluguel" ? `${formatted}/mês` : formatted;
}

function toProperty(row: PropertyRow): Property {
  return {
    id: Number(row.id),
    title: row.title,
    price: formatPrice(Number(row.price_value), row.badge),
    priceValue: Number(row.price_value),
    badge: row.badge,
    type: row.type,
    neighborhood: row.neighborhood,
    city: row.city,
    image: row.image,
    beds: Number(row.beds),
    baths: Number(row.baths),
    area: Number(row.area),
    featured: Boolean(row.featured),
    description: row.description ?? "",
    photos: Array.isArray(row.photos) ? row.photos.filter(Boolean) : [],
    videoUrl: formatEmbedVideoUrl(row.video_url),
  };
}

function withTimeout<T>(promise: Promise<T>, timeoutMs = 1200): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout de conexão ao banco de dados")), timeoutMs)
    ),
  ]);
}

export async function getProperties(): Promise<Property[]> {
  try {
    const sql = database();
    const rows = (await withTimeout(sql`
      SELECT id, title, "priceValue" AS price_value, badge, type, neighborhood, city, image,
             beds, baths, area, featured, description, photos, video_url
      FROM properties
      ORDER BY featured DESC, id DESC
    `)) as PropertyRow[];
    return rows.map(toProperty);
  } catch (error) {
    console.warn("Consulta principal ao banco Neon falhou ou excedeu timeout:", error);
    try {
      const sql = database();
      const rows = (await withTimeout(sql`
        SELECT id, title, "priceValue" AS price_value, badge, type, neighborhood, city, image,
               beds, baths, area, featured, description
        FROM properties
        ORDER BY featured DESC, id DESC
      `, 800)) as PropertyRow[];
      return rows.map((row) => toProperty({ ...row, photos: [], video_url: "" }));
    } catch {
      return [];
    }
  }
}

export async function getPropertyById(id: number): Promise<Property | null> {
  try {
    const sql = database();
    const rows = (await withTimeout(sql`
      SELECT id, title, "priceValue" AS price_value, badge, type, neighborhood, city, image,
             beds, baths, area, featured, description, photos, video_url
      FROM properties
      WHERE id = ${id}
      LIMIT 1
    `)) as PropertyRow[];
    return rows[0] ? toProperty(rows[0]) : null;
  } catch (error) {
    console.warn("Consulta por ID falhou:", error);
    try {
      const sql = database();
      const rows = (await withTimeout(sql`
        SELECT id, title, "priceValue" AS price_value, badge, type, neighborhood, city, image,
               beds, baths, area, featured, description
        FROM properties
        WHERE id = ${id}
        LIMIT 1
      `, 800)) as PropertyRow[];
      return rows[0] ? toProperty({ ...rows[0], photos: [], video_url: "" }) : null;
    } catch {
      return null;
    }
  }
}

export function normalizeProperty(input: unknown): PropertyInput {
  const value = input as Record<string, unknown>;
  const requiredText = ["title", "neighborhood", "city", "image"] as const;
  for (const key of requiredText) if (typeof value[key] !== "string" || !value[key].trim()) throw new Error(`Informe ${key}.`);
  if (!propertyBadges.includes(value.badge as Property["badge"])) throw new Error("Finalidade inválida.");
  if (!propertyTypes.includes(value.type as Property["type"])) throw new Error("Tipo de imóvel inválido.");
  const numeric = (key: string) => { const number = Number(value[key]); if (!Number.isFinite(number) || number < 0) throw new Error(`Valor inválido para ${key}.`); return number; };
  const photos = Array.isArray(value.photos) ? (value.photos as string[]).map((u) => String(u).trim()).filter(Boolean) : [];
  const videoUrl = typeof value.videoUrl === "string" ? formatEmbedVideoUrl(value.videoUrl) : "";
  return {
    title: String(value.title).trim(),
    neighborhood: String(value.neighborhood).trim(),
    city: String(value.city).trim(),
    image: String(value.image).trim(),
    badge: value.badge as Property["badge"],
    type: value.type as Property["type"],
    priceValue: numeric("priceValue"),
    beds: numeric("beds"),
    baths: numeric("baths"),
    area: numeric("area"),
    featured: Boolean(value.featured),
    description: typeof value.description === "string" ? value.description.trim() : "",
    photos,
    videoUrl,
  };
}

export async function createProperty(input: PropertyInput) {
  const sql = database();
  const rows = (await sql`
    INSERT INTO properties (
      title, price, "priceValue", badge, type, neighborhood, city, image,
      beds, baths, area, featured, description, photos, video_url
    ) VALUES (
      ${input.title}, ${formatPrice(input.priceValue, input.badge)}, ${input.priceValue},
      ${input.badge}, ${input.type}, ${input.neighborhood}, ${input.city}, ${input.image},
      ${input.beds}, ${input.baths}, ${input.area}, ${input.featured}, ${input.description ?? ""},
      ${input.photos ?? []}, ${input.videoUrl ?? ""}
    )
    RETURNING
      id, title, "priceValue" AS price_value, badge, type, neighborhood, city, image,
      beds, baths, area, featured, description, photos, video_url
  `) as PropertyRow[];
  return toProperty(rows[0]);
}

export async function updateProperty(id: number, input: PropertyInput) {
  const sql = database();
  const rows = (await sql`
    UPDATE properties SET
      title        = ${input.title},
      price        = ${formatPrice(input.priceValue, input.badge)},
      "priceValue" = ${input.priceValue},
      badge        = ${input.badge},
      type         = ${input.type},
      neighborhood = ${input.neighborhood},
      city         = ${input.city},
      image        = ${input.image},
      beds         = ${input.beds},
      baths        = ${input.baths},
      area         = ${input.area},
      featured     = ${input.featured},
      description  = ${input.description ?? ""},
      photos       = ${input.photos ?? []},
      video_url    = ${input.videoUrl ?? ""},
      "updatedAt"  = NOW()
    WHERE id = ${id}
    RETURNING
      id, title, "priceValue" AS price_value, badge, type, neighborhood, city, image,
      beds, baths, area, featured, description, photos, video_url
  `) as PropertyRow[];
  return rows[0] ? toProperty(rows[0]) : null;
}

export async function deleteProperty(id: number) {
  const sql = database();
  const rows = await sql`DELETE FROM properties WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
