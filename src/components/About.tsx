import Image from "next/image";
import { stats } from "@/lib/data";

export default function About() {
  return (
    <section id="sobre" className="py-16 sm:py-24" style={{ backgroundColor: "#F7F7F5" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          {/* Photo */}
          <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:mx-0 lg:max-w-none">
            <div
              className="absolute -inset-2 rounded-2xl opacity-30 sm:-inset-3"
              style={{ background: "linear-gradient(135deg, #CEB99A, #12314D)" }}
            />
            <div className="relative aspect-[4/4] overflow-hidden rounded-2xl shadow-2xl sm:aspect-[4/5]">
              <Image
                src="/rafael-brandao.jpg"
                alt="Rafael Brandão - Corretor de Imóveis CRECI-BA 7691"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
                priority
              />
              {/* CRECI badge on photo */}
              <div
                className="absolute bottom-4 left-4 rounded-sm px-3 py-2 backdrop-blur-sm sm:bottom-5 sm:left-5 sm:px-4 sm:py-2.5"
                style={{ background: "rgba(18,49,77,0.90)", border: "1px solid rgba(206,185,154,0.4)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#CEB99A" }}>
                  CRECI-BA 7691
                </p>
                <p className="text-[10px] mt-0.5 font-medium" style={{ color: "rgba(247,247,245,0.75)" }}>
                  Corretor de Imóveis
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-2 lg:mt-0">
            <div className="brand-divider mb-5 max-w-[200px] sm:mb-6">
              <p
                className="text-xs font-semibold uppercase tracking-[0.24em] sm:tracking-[0.26em]"
                style={{ color: "#CEB99A" }}
              >
                Nossa Atuação
              </p>
            </div>

            <h2
              className="font-heading text-2xl font-semibold leading-tight tracking-wide sm:text-3xl lg:text-4xl"
              style={{ color: "#12314D" }}
            >
              Experiência que protege o seu patrimônio
            </h2>

            <div
              className="my-5 h-px w-14 sm:my-6 sm:w-16"
              style={{ background: "linear-gradient(to right, #CEB99A, transparent)" }}
            />

            <p className="text-sm leading-relaxed sm:text-base" style={{ color: "#4a4a4a" }}>
              Com mais de 25 anos de experiência no mercado imobiliário,
              oferecemos um atendimento pautado pela ética, transparência e
              compromisso com cada cliente. Cada negociação é conduzida com
              sigilo, discrição e segurança.
            </p>
            <p className="mt-3 text-sm leading-relaxed sm:mt-4 sm:text-base" style={{ color: "#4a4a4a" }}>
              Somos especialistas em locação e administração de imóveis,
              avaliação mercadológica, regularização documental e intermediação
              de terrenos para incorporação em Salvador, Região Metropolitana e
              Litoral Norte da Bahia.
            </p>

            {/* CNAI badge */}
            <div
              className="mt-5 inline-flex items-center gap-3 rounded-sm px-3 py-2.5 sm:mt-6 sm:px-4 sm:py-3"
              style={{ background: "rgba(18,49,77,0.06)", border: "1px solid rgba(18,49,77,0.12)" }}
            >
              <div
                className="h-8 w-8 rounded-sm flex items-center justify-center text-xs font-heading font-bold shrink-0"
                style={{ background: "linear-gradient(135deg, #CEB99A, #b8a080)", color: "#12314D" }}
              >
                RB
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest sm:text-xs" style={{ color: "#12314D" }}>
                  CNAI 47.907 · Avaliador de Imóveis
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "#4a4a4a" }}>
                  Salvador · Região Metropolitana · Litoral Norte da Bahia
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-sm p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6"
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(18,49,77,0.10)",
                    borderTop: "3px solid #CEB99A",
                  }}
                >
                  <p
                    className="font-heading text-2xl font-semibold sm:text-3xl lg:text-4xl"
                    style={{ color: "#12314D" }}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wider sm:text-xs" style={{ color: "#4a4a4a" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
