export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <img
        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
        alt="Imóvel residencial contemporâneo"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />

      {/* Overlay naval com gradiente */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, rgba(18,49,77,0.88) 0%, rgba(9,25,41,0.82) 60%, rgba(13,34,56,0.90) 100%)",
        }}
      />

      {/* Linha decorativa dourada */}
      <div
        className="absolute left-0 top-0 h-1 w-full"
        style={{ background: "linear-gradient(to right, transparent, #CEB99A, transparent)" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 py-28 text-center sm:px-6 sm:py-36 lg:px-8">
        {/* Eyebrow */}
        <div className="brand-divider mx-auto mb-5 max-w-[340px] sm:max-w-md">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.22em] sm:text-xs sm:tracking-[0.26em]"
            style={{ color: "#CEB99A" }}
          >
            Corretor de Imóveis · Soluções Imobiliárias na Bahia
          </p>
        </div>

        {/* Heading */}
        <h1
          className="font-heading text-3xl font-semibold leading-tight tracking-wide sm:text-5xl lg:text-6xl"
          style={{ color: "#F7F7F5" }}
        >
          Segurança para o seu imóvel.{" "}
          <span style={{ color: "#CEB99A" }}>Tranquilidade</span>{" "}
          para a sua vida.
        </h1>

        {/* Supporting text */}
        <p
          className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed sm:mt-7 sm:text-base sm:text-lg"
          style={{ color: "rgba(247,247,245,0.85)" }}
        >
          Administração, locação, vendas, avaliações e assessoria documental
          conduzidas com ética, transparência e atenção a cada detalhe.
        </p>

        {/* Tags de Atuação Direta */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span
            className="inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{
              background: "rgba(206,185,154,0.15)",
              color: "#CEB99A",
              border: "1px solid rgba(206,185,154,0.3)",
              backdropFilter: "blur(4px)",
            }}
          >
            🔑 Locação
          </span>
          <span
            className="inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{
              background: "rgba(206,185,154,0.15)",
              color: "#CEB99A",
              border: "1px solid rgba(206,185,154,0.3)",
              backdropFilter: "blur(4px)",
            }}
          >
            🏠 Vendas
          </span>
          <span
            className="inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{
              background: "rgba(206,185,154,0.15)",
              color: "#CEB99A",
              border: "1px solid rgba(206,185,154,0.3)",
              backdropFilter: "blur(4px)",
            }}
          >
            🏢 Administração
          </span>
          <span
            className="inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{
              background: "rgba(206,185,154,0.15)",
              color: "#CEB99A",
              border: "1px solid rgba(206,185,154,0.3)",
              backdropFilter: "blur(4px)",
            }}
          >
            📋 Avaliações & Regularização
          </span>
        </div>

        {/* Credenciais */}
        <div className="mt-6 flex items-center justify-center gap-4 sm:gap-6">
          <span
            className="text-[10px] font-medium uppercase tracking-widest sm:text-xs"
            style={{ color: "rgba(206,185,154,0.75)" }}
          >
            CRECI-BA 7691
          </span>
          <div className="h-3 w-px" style={{ background: "rgba(206,185,154,0.35)" }} />
          <span
            className="text-[10px] font-medium uppercase tracking-widest sm:text-xs"
            style={{ color: "rgba(206,185,154,0.75)" }}
          >
            CNAI 47.907
          </span>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
          <a
            href="#imoveis"
            className="btn-gold inline-flex w-full items-center justify-center rounded-sm px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.1em] sm:w-auto"
          >
            Ver Imóveis Disponíveis
          </a>
          <a
            href="#contato"
            className="inline-flex w-full items-center justify-center rounded-sm border px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.1em] transition-all hover:bg-white/10 sm:w-auto"
            style={{ borderColor: "rgba(206,185,154,0.6)", color: "#F7F7F5" }}
          >
            Falar com o Corretor
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-60">
        <div className="h-10 w-px" style={{ background: "linear-gradient(to bottom, #CEB99A, transparent)" }} />
      </div>
    </section>
  );
}
