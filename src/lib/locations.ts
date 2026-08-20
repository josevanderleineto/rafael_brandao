/**
 * Estrutura hierárquica de localidades:
 * Região → Cidade → Categoria → Bairros / Localidades
 */

export type LocationCategory = {
  category: string;
  neighborhoods: string[];
};

export type CityLocation = {
  city: string;
  region: string;
  categories: LocationCategory[];
};

// ─── Dados ────────────────────────────────────────────────────────────────────

export const locationData: CityLocation[] = [
  // ── Salvador ──────────────────────────────────────────────────────────────
  {
    city: "Salvador",
    region: "Salvador",
    categories: [
      {
        category: "Orla e bairros litorâneos",
        neighborhoods: [
          "Amaralina",
          "Armação",
          "Barra",
          "Boca do Rio",
          "Caminho das Árvores",
          "Costa Azul",
          "Graça",
          "Itapuã",
          "Jardim Armação",
          "Jardim de Alah",
          "Ondina",
          "Patamares",
          "Pituba",
          "Piatã",
          "Pituaçu",
          "Praia do Flamengo",
          "Rio Vermelho",
          "Stella Maris",
          "Stiep",
          "Vitória",
        ],
      },
      {
        category: "Região central e tradicional",
        neighborhoods: [
          "Barbalho",
          "Barris",
          "Brotas",
          "Campo Grande",
          "Canela",
          "Centro",
          "Comércio",
          "Federação",
          "Garcia",
          "Horto Florestal",
          "Lapinha",
          "Nazaré",
          "Pelourinho",
          "Santo Antônio Além do Carmo",
          "Saúde",
          "Tororó",
        ],
      },
      {
        category: "Região residencial e empresarial",
        neighborhoods: [
          "Acupe de Brotas",
          "Alphaville I",
          "Alphaville II",
          "Cabula",
          "Caminho das Árvores",
          "Candeal",
          "Cidade Jardim",
          "Doron",
          "Engenho Velho da Federação",
          "Greenville",
          "Imbuí",
          "Itaigara",
          "Jardim Apipema",
          "Matatu",
          "Paralela",
          "Resgate",
          "Saboeiro",
          "Santa Cruz",
          "São Marcos",
          "Sussuarana",
          "Trobogy",
          "Vila Laura",
        ],
      },
      {
        category: "Cidade Baixa e Subúrbio",
        neighborhoods: [
          "Boa Viagem",
          "Bonfim",
          "Calçada",
          "Caminho de Areia",
          "Itapagipe",
          "Liberdade",
          "Massaranduba",
          "Monte Serrat",
          "Paripe",
          "Periperi",
          "Plataforma",
          "Ribeira",
          "Roma",
          "São Caetano",
          "Uruguai",
        ],
      },
    ],
  },

  // ── Região Metropolitana ───────────────────────────────────────────────────
  {
    city: "Camaçari",
    region: "Região Metropolitana",
    categories: [
      {
        category: "Orla de Camaçari",
        neighborhoods: [
          "Abrantes",
          "Arembepe",
          "Areias",
          "Barra do Jacuípe",
          "Barra do Pojuca",
          "Busca Vida",
          "Catu de Abrantes",
          "Guarajuba",
          "Interlagos",
          "Itacimirim",
          "Jauá",
          "Monte Gordo",
          "Vila de Abrantes",
        ],
      },
    ],
  },

  // ── Litoral Norte — Mata de São João ──────────────────────────────────────
  {
    city: "Mata de São João",
    region: "Litoral Norte",
    categories: [
      {
        category: "Localidades litorâneas",
        neighborhoods: [
          "Praia do Forte",
          "Açuzinho",
          "Açu da Torre",
          "Campinas de Malhadas",
          "Diogo",
          "Imbassaí",
          "Malhadas",
          "Porto de Sauípe",
          "Santo Antônio",
          "Sauípe",
          "Vila Sauípe",
        ],
      },
    ],
  },

  // ── Litoral Norte — Entre Rios ────────────────────────────────────────────
  {
    city: "Entre Rios",
    region: "Litoral Norte",
    categories: [
      {
        category: "Localidades litorâneas",
        neighborhoods: ["Massarandupió", "Porto de Sauípe", "Subaúma"],
      },
    ],
  },

  // ── Litoral Norte — Esplanada ─────────────────────────────────────────────
  {
    city: "Esplanada",
    region: "Litoral Norte",
    categories: [
      {
        category: "Localidades litorâneas",
        neighborhoods: ["Palame", "Praia do Baixio"],
      },
    ],
  },

  // ── Litoral Norte — Conde ─────────────────────────────────────────────────
  {
    city: "Conde",
    region: "Litoral Norte",
    categories: [
      {
        category: "Localidades litorâneas",
        neighborhoods: [
          "Barra do Itariri",
          "Conde",
          "Poças",
          "Sítio do Conde",
          "Siribinha",
        ],
      },
    ],
  },

  // ── Litoral Norte — Jandaíra ──────────────────────────────────────────────
  {
    city: "Jandaíra",
    region: "Litoral Norte",
    categories: [
      {
        category: "Localidades litorâneas",
        neighborhoods: ["Abadia", "Costa Azul", "Coqueiro", "Mangue Seco"],
      },
    ],
  },

  // ── Litoral Norte — Localidades estratégicas ──────────────────────────────
  {
    city: "Região",
    region: "Litoral Norte",
    categories: [
      {
        category: "Localidades estratégicas",
        neighborhoods: [
          "Costa do Sauípe",
          "Imbassaí",
          "Praia do Forte",
          "Linha Verde",
          "Reserva Sapiranga",
          "Iberostate",
          "Quintas de Sauípe",
        ],
      },
    ],
  },
];

// ─── Helpers derivados ────────────────────────────────────────────────────────

/** Lista de cidades */
export const cities = locationData.map((l) => l.city);

/** Cidades agrupadas por região */
export const citiesByRegion: Record<string, string[]> = locationData.reduce(
  (acc, loc) => {
    if (!acc[loc.region]) acc[loc.region] = [];
    acc[loc.region].push(loc.city);
    return acc;
  },
  {} as Record<string, string[]>,
);

/** Categorias e bairros de uma cidade */
export function getCategoriesForCity(city: string): LocationCategory[] {
  return locationData.find((l) => l.city === city)?.categories ?? [];
}

/** Todos os bairros de uma cidade (lista plana) */
export function getNeighborhoodsForCity(city: string): string[] {
  return getCategoriesForCity(city).flatMap((c) => c.neighborhoods);
}

/** Mapeamento cidade → bairros (compatibilidade) */
export const cityNeighborhoods: Record<string, string[]> = Object.fromEntries(
  locationData.map((l) => [
    l.city,
    l.categories.flatMap((c) => c.neighborhoods),
  ]),
);
