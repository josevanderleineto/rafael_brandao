import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPropertyById } from "@/lib/property-store";
import PropertyDetailClient from "./PropertyDetailClient";

export const runtime = "nodejs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(Number(id));
  if (!property) return { title: "Imóvel não encontrado | Rafael Brandão Imóveis" };

  return {
    title: `${property.title} | Rafael Brandão Imóveis`,
    description:
      property.description?.slice(0, 155) ||
      `${property.type} para ${property.badge} em ${property.neighborhood}, ${property.city}. ${property.price}.`,
    openGraph: {
      title: property.title,
      images: property.image ? [{ url: property.image }] : [],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(Number(id));
  if (!property) notFound();

  return <PropertyDetailClient property={property} />;
}
