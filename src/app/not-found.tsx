import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * 404 — páginas que não existem (ou imóveis removidos).
 * Mantém o usuário no site e aponta para o catálogo.
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main
        className="flex min-h-screen items-center justify-center px-4 py-32"
        style={{ backgroundColor: "#F7F7F5" }}
      >
        <div className="max-w-xl text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.28em]"
            style={{ color: "#CEB99A" }}
          >
            Erro 404
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-wide sm:text-4xl" style={{ color: "#12314D" }}>
            Página não encontrada
          </h1>
          <p className="mt-4 text-base leading-relaxed" style={{ color: "#4a4a4a" }}>
            O endereço que você tentou acessar não existe ou o imóvel não está mais
            disponível. Veja o catálogo completo ou volte ao início.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/imoveis"
              className="btn-navy inline-flex items-center justify-center rounded-sm px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.1em]"
            >
              Ver imóveis
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-sm border px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white"
              style={{ borderColor: "rgba(18,49,77,0.20)", color: "#12314D" }}
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}