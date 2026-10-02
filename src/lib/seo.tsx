import type { Metadata } from "next";
import type { Property } from "./data";
import { siteData } from "./data";
import {
  SERVICE_AREAS,
  SITE_CREDENTIALS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OWNER,
  SITE_URL,
  absoluteUrl,
} from "./site-config";

/**
 * Helpers de SEO: metadata por rota e dados estruturados (schema.org).
 * Todas as URLs geradas usam o domínio canônico definido em `site-config.ts`.
 */

const OG_IMAGE = absoluteUrl("/opengraph-image");

/** Blocos de organização que valem para o site inteiro (aparece no JSON-LD de cada página). */
const ORGANIZATION_ID = absoluteUrl("/#organization");

/** Telefone em E.164 (sem espaços). Necessário para schema.org. */
function phoneE164() {
  return `+${siteData.phoneRaw}`;
}

/** Nome legível do tipo de imóvel, usado no schema.org. */
function residenceTypeLabel(property: Pick<Property, "type" | "badge">) {
  const purpose = property.badge === "Aluguel" ? "para alugar" : "à venda";
  return `${property.type} ${purpose}`;
}

/**
 * Metadata padrão da home. `page.tsx` reaproveita este objeto para
 * não duplicar title/description.
 */
export const homeMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_OWNER} | Corretor de Imóveis em Salvador e Litoral Norte da Bahia`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_OWNER, url: SITE_URL }],
  creator: SITE_OWNER,
  publisher: SITE_OWNER,
  category: "Imóveis",
  keywords: [
    "corretor de imóveis Salvador",
    "imóveis à venda Salvador",
    "imóveis para alugar Salvador",
    "administração de imóveis Bahia",
    "locação de imóveis Salvador",
    "avaliação de imóveis CRECI Bahia",
    "regularização de imóveis Bahia",
    "terrenos para incorporação Bahia",
    "Litoral Norte da Bahia imóveis",
    "CNAI avaliador de imóveis",
    "Rafael Brandão corretor",
  ],
  alternates: {
    canonical: "/",
  },
  // As imagens de compartilhamento são injetadas automaticamente pelo
  // arquivo de convenção `app/opengraph-image.tsx` — não declarar aqui para
  // não duplicar as tags og:image / twitter:image.
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_OWNER} | Corretor de Imóveis em Salvador e Litoral Norte da Bahia`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_OWNER} | Corretor de Imóveis em Salvador e Bahia`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: true, email: true, address: true },
};

/** Impede indexação de páginas internas (/admin, /api). */
export const noIndexMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

/** Descrição de até ~160 caracteres, quebrando em fronteira de palavra. */
export function buildMetaDescription(property: Property, max = 160): string {
  const facts = [
    property.type,
    property.badge === "Aluguel" ? "para alugar" : "à venda",
    `${property.beds} quarto${property.beds === 1 ? "" : "s"}`,
    `${property.baths} banheiro${property.baths === 1 ? "" : "s"}`,
    `${property.area} m²`,
  ].join(", ");

  const full =
    property.description?.trim() ||
    `${property.title}. ${facts}. ${property.neighborhood}, ${property.city} — Bahia.`;

  const withBrand = `${full} ${SITE_OWNER} ${SITE_CREDENTIALS.creci}.`;
  const text = withBrand.length <= max ? withBrand : `${full.slice(0, max - 1).trimEnd()}…`;
  return text.replace(/\s+/g, " ");
}

/** Metadata completa de uma página de imóvel. */
export function propertyMetadata(property: Property): Metadata {
  const description = buildMetaDescription(property);
  // Limita a 4 imagens no preview: mais que isso não agrega e infla o <head>.
  const images = Array.from(
    new Set([property.image, ...(property.photos ?? []).filter(Boolean)]),
  ).slice(0, 4);
  const ogImages = (images.length > 0 ? images : [OG_IMAGE]).map((url) => ({
    url,
    alt: property.title,
  }));

  return {
    title: `${property.title} — ${property.neighborhood}, ${property.city}`,
    description,
    alternates: { canonical: `/imoveis/${property.id}` },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: `/imoveis/${property.id}`,
      siteName: SITE_NAME,
      title: `${property.title} | ${property.price}`,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${property.title} | ${property.price}`,
      description,
      images: ogImages.map((i) => i.url),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

// ─── Dados estruturados (JSON-LD) ───────────────────────────────────────────

type Json = Record<string, unknown>;

/** Escapa `<` para evitar que o JSON feche a tag <script>. */
function serializeLd(data: Json | Json[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Junta vários nós em um único grafo schema.org.
 * Evita arrays aninhados no <script>, que alguns validadores não aceitam.
 */
export function graphLd(nodes: (Json | null | undefined)[]): Json {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean) as Json[],
  };
}

/** Envolve o JSON-LD na tag <script> esperada pelos buscadores. */
export function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeLd(data) }}
    />
  );
}

/** Bloco principal: RealEstateAgent + WebSite com SearchAction. */
export function organizationLd(): Json[] {
  const areaServed = SERVICE_AREAS.map((name) => ({ "@type": "Place", name }));

  const realEstateAgent: Json = {
    "@type": "RealEstateAgent",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: `${SITE_OWNER} Desenvolvimento Imobiliário`,
    url: SITE_URL,
    logo: absoluteUrl("/rafael-logo.svg"),
    image: OG_IMAGE,
    description: SITE_DESCRIPTION,
    telephone: phoneE164(),
    email: siteData.email,
    priceRange: "$$$",
    foundingDate: String(new Date().getFullYear() - SITE_CREDENTIALS.experienceYears),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Salvador",
      addressRegion: "BA",
      addressCountry: "BR",
    },
    areaServed,
    knowsLanguage: "pt-BR",
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", name: SITE_CREDENTIALS.creci },
      { "@type": "EducationalOccupationalCredential", name: SITE_CREDENTIALS.cnai },
    ],
    sameAs: [],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: phoneE164(),
        contactType: "sales",
        areaServed: "BR",
        availableLanguage: "Portuguese",
      },
    ],
  };

  const website: Json = {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "pt-BR",
    publisher: { "@id": ORGANIZATION_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/imoveis?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return [realEstateAgent, website];
}

/** Lista de imóveis (ItemList) usada na home e na página /imoveis. */
export function propertyListLd(properties: Property[]): Json | null {
  if (properties.length === 0) return null;

  return {
    "@type": "ItemList",
    "@id": absoluteUrl("/imoveis#lista"),
    name: "Imóveis disponíveis",
    numberOfItems: properties.length,
    itemListElement: properties.map((property, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/imoveis/${property.id}`),
      name: property.title,
    })),
  };
}

/** JSON-LD completo de uma página de imóvel. */
export function propertyLd(property: Property): Json {
  const url = absoluteUrl(`/imoveis/${property.id}`);
  const images = Array.from(
    new Set([property.image, ...(property.photos ?? []).filter(Boolean)]),
  );

  const floorSize = {
    "@type": "QuantitativeValue",
    value: property.area,
    unitCode: "MTK",
  };

  const accommodation: Json = {
    "@type": "Accommodation",
    occupancy: { "@type": "QuantitativeValue", value: property.beds, unitCode: "C6BED" },
    numberOfBathroomsTotal: property.baths,
    floorSize,
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: `${property.beds} quartos`, value: true },
      { "@type": "LocationFeatureSpecification", name: `${property.baths} banheiros`, value: true },
      { "@type": "LocationFeatureSpecification", name: `${property.area} m² de área`, value: true },
    ],
  };

  const residence: Json = {
    "@type": "SingleFamilyResidence",
    "@id": `${url}#imovel`,
    name: property.title,
    alternateName: residenceTypeLabel(property),
    description: property.description?.trim() || undefined,
    url,
    image: images,
    numberOfRooms: property.beds,
    numberOfBathroomsTotal: property.baths,
    floorSize,
    petsAllowed: true,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city,
      addressRegion: "BA",
      addressCountry: "BR",
      streetAddress: property.neighborhood,
    },
    geo: undefined,
    containsPlace: accommodation,
  };

  const offer: Json = {
    "@type": "Offer",
    "@id": `${url}#oferta`,
    url,
    price: property.priceValue || undefined,
    priceCurrency: "BRL",
    availability:
      property.badge === "Lançamento"
        ? "https://schema.org/PreOrder"
        : "https://schema.org/InStock",
    businessFunction:
      property.badge === "Aluguel"
        ? "https://purl.org/goodrelations/v1#LeaseOut"
        : "https://purl.org/goodrelations/v1#Sell",
    seller: { "@id": ORGANIZATION_ID },
    areaOfInterest: SERVICE_AREAS.map((name) => ({ "@type": "Place", name })),
  };

  const breadcrumb: Json = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Imóveis", item: absoluteUrl("/imoveis") },
      { "@type": "ListItem", position: 3, name: property.title, item: url },
    ],
  };

  return graphLd([residence, offer, breadcrumb, ...organizationLd()]);
}

