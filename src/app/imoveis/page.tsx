import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertiesGrid from "@/components/PropertiesGrid";
import { getPropertiesCached } from "@/lib/property-store";
import { JsonLd, graphLd, organizationLd, propertyListLd } from "@/lib/seo";
import { SITE_DESCRIPTION } from "@/lib/site-config";

export const runtime = "nodejs";

/** Página de listagem: renderizada no servidor, com links rastreáveis. */
export const metadata: Metadata = {
  title: "Imóveis à venda e para alugar em Salvador e Bahia",
  description:
    "Catálogo de imóveis à venda e para alugar em Salvador, Região Metropolitana e Litoral Norte da Bahia. Casas, apartamentos, coberturas, terrenos e comerciais com assessoria completa do corretor.",
  alternates: { canonical: "/imoveis" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/imoveis",
    title: "Imóveis à venda e para alugar em Salvador e Bahia",
    description: SITE_DESCRIPTION,
  },
};

export default async function PropertiesPage() {
  let properties: Awaited<ReturnType<typeof getPropertiesCached>> = [];
  let failed = false;
  try {
    properties = await getPropertiesCached();
  } catch (error) {
    failed = true;
    console.warn("Listagem de imóveis: falha ao consultar o banco:", error);
  }

  return (
    <>
      <JsonLd data={graphLd([...organizationLd(), propertyListLd(properties)])} />
      <Header />

      <main className="pt-28 pb-20 sm:pt-32" style={{ backgroundColor: "#F7F7F5" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Link>

          <div className="mt-6 mx-auto max-w-3xl text-center">
            <p
              className="text-xs font-semibold uppercase tracking-[0.28em]"
              style={{ color: "#CEB99A" }}
            >
              Catálogo
            </p>
            <h1
              className="mt-4 text-3xl font-semibold tracking-wide sm:text-4xl"
              style={{ color: "#12314D" }}
            >
              Imóveis disponíveis
            </h1>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "#4a4a4a" }}>
              Casas, apartamentos, coberturas, terrenos e imóveis comerciais para morar,
              investir ou desenvolver em Salvador e região.
            </p>
          </div>

          {failed ? (
            <p className="mt-16 text-center text-sm text-red-700">
              Não foi possível carregar o catálogo agora. Tente novamente em instantes.
            </p>
          ) : (
            <PropertiesGrid initialProperties={properties} />
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}