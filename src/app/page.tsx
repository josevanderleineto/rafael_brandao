import About from "@/components/About";
import Contact from "@/components/Contact";
import FeaturedProperties from "@/components/FeaturedProperties";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import { getSiteContent } from "@/lib/site-content-store";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <>
      <Header />
      <main>
        <Hero content={content} />
        <FeaturedProperties />
        <Services content={content} />
        <About content={content} />
        <Contact />
      </main>
      <Footer content={content} />
    </>
  );
}
