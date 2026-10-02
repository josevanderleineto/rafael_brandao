import About from "@/components/About";
import Contact from "@/components/Contact";
import FeaturedProperties from "@/components/FeaturedProperties";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import { getPropertiesCached } from "@/lib/property-store";
import { JsonLd, graphLd, organizationLd, propertyListLd } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content-store";

export default async function Home() {
  const content = await getSiteContent();

  // Catálogo buscado no servidor: alimenta tanto o JSON-LD quanto os cards
  // renderizados no HTML inicial (necessário para o rastreamento).
  let properties: Awaited<ReturnType<typeof getPropertiesCached>> = [];
  try {
    properties = await getPropertiesCached();
  } catch (error) {
    console.warn("Home: falha ao carregar imóveis do catálogo:", error);
  }

  return (
    <>
      <JsonLd data={graphLd([...organizationLd(), propertyListLd(properties)])} />
      <Header />
      <main>
        <Hero content={content} />
        <FeaturedProperties initialProperties={properties} />
        <Services content={content} />
        <About content={content} />
        <Contact />
      </main>
      <Footer content={content} />
    </>
  );
}