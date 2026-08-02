export const siteData = {
  name: "Rafael Brandão Imóveis",
  creci: "CRECI-BA sob consulta",
  phone: "(71) 99999-9999",
  phoneRaw: "5571999999999",
  email: "contato@rafaelbrandaoimoveis.com.br",
  address: "Salvador, Região Metropolitana e Litoral Norte da Bahia",
  whatsappUrl: "https://wa.me/5571999999999",
};

export const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Imóveis", href: "#imoveis" },
  { label: "Serviços", href: "#servicos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

export const propertyBadges = ["Venda", "Aluguel", "Lançamento"] as const;
export const propertyTypes = [
  "Casa",
  "Apartamento",
  "Cobertura",
  "Terreno",
  "Comercial",
] as const;

export type PropertyBadge = (typeof propertyBadges)[number];
export type PropertyType = (typeof propertyTypes)[number];

export type Property = {
  id: number;
  title: string;
  price: string;
  priceValue: number;
  badge: PropertyBadge;
  type: PropertyType;
  neighborhood: string;
  city: string;
  image: string;
  beds: number;
  baths: number;
  area: number;
  featured?: boolean;
  description?: string;
  photos?: string[];
  videoUrl?: string;
};

export type PropertyInput = Omit<Property, "id" | "price"> & { price?: string };

export const stats = [
  { value: "25+", label: "anos de experiência" },
  { value: "100%", label: "sigilo e discrição" },
];
