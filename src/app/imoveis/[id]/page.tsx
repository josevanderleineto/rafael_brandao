import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPropertyByIdCached } from "@/lib/property-store";
import { JsonLd, propertyLd, propertyMetadata } from "@/lib/seo";
import PropertyDetailClient from "./PropertyDetailClient";
import PropertyDetailSkeleton from "./PropertyDetailSkeleton";

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
  const property = await getPropertyByIdCached(Number(id));

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
  const property = await getPropertyByIdCached(Number(id));
  if (!property) notFound();

  return (
    <>
      <JsonLd data={propertyLd(property)} />
      {/*
        Suspense aqui, e não via loading.tsx no segmento: uma barreira no
        segmento deixa o React fechar o <head> antes da metadata, e title,
        canonical e og:image saem transmitidos depois do </head> — invisíveis
        para o Googlebot e para os previews de redes sociais.
      */}
      <Suspense fallback={<PropertyDetailSkeleton />}>
        <PropertyDetailClient property={property} />
      </Suspense>
    </>
  );
}

