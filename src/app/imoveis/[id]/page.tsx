import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/property-store";
import { JsonLd, propertyLd, propertyMetadata } from "@/lib/seo";
import PropertyDetailClient from "./PropertyDetailClient";

export const runtime = "nodejs";

/**
 * Gera metadata enriquecida por imóvel: canonical, Open Graph com as fotos
 * do anúncio e canonicalização para evitar conteúdo duplicado.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<ReturnType<typeof propertyMetadata>> {
  const { id } = await params;
  const property = await getPropertyById(Number(id));

  if (!property) {
    return {
      title: "Imóvel não encontrado",
      description: "Este imóvel não está mais disponível no catálogo.",
      robots: { index: false, follow: true },
    };
  }

  return propertyMetadata(property);
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(Number(id));
  if (!property) notFound();

  return (
    <>
      <JsonLd data={propertyLd(property)} />
      <PropertyDetailClient property={property} />
    </>
  );
}

