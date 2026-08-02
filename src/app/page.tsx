import About from "@/components/About";
import Contact from "@/components/Contact";
import FeaturedProperties from "@/components/FeaturedProperties";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedProperties />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
