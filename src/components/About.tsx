import Image from "next/image";
import { stats } from "@/lib/data";

export default function About() {
  return (
    <section id="sobre" className="py-20 sm:py-28" style={{ backgroundColor: "#F7F7F5" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Photo */}
          <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <div
              className="absolute -inset-3 rounded-2xl opacity-30"
              style={{ background: "linear-gradient(135deg, #CEB99A, #12314D)" }}
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/rafael-brandao.jpg"
                alt="Rafael Brandão - Corretor de Imóveis CRECI-BA 7691"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {/* CRECI badge on photo */}
              <div
                className="absolute bottom-5 left-5 rounded-sm px-4 py-2.5 backdrop-blur-sm"
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
          <div>
            <div className="brand-divider mb-6 max-w-[200px]">
              <p
                className="text-xs font-semibold uppercase tracking-[0.26em] whitespace-nowrap"
                style={{ color: "#CEB99A" }}
              >
                Nossa Atuação
              </p>
            </div>

            <h2
              className="font-heading text-3xl font-semibold leading-tight tracking-wide sm:text-4xl"
              style={{ color: "#12314D" }}
            >
              Experiência que protege o seu patrimônio
            </h2>

            <div
              className="my-6 h-px w-16"
              style={{ background: "linear-gradient(to right, #CEB99A, transparent)" }}
            />

            <p className="text-base leading-relaxed" style={{ color: "#4a4a4a" }}>
              Com mais de 25 anos de experiência no mercado imobiliário,
              oferecemos um atendimento pautado pela ética, transparência e
              compromisso com cada cliente. Cada negociação é conduzida com
              sigilo, discrição e segurança.
            </p>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "#4a4a4a" }}>
              Somos especialistas em locação e administração de imóveis,
              avaliação mercadológica, regularização documental e intermediação
              de terrenos para incorporação em Salvador, Região Metropolitana e
              Litoral Norte da Bahia.
            </p>

            {/* CNAI badge */}
            <div
              className="mt-6 inline-flex items-center gap-3 rounded-sm px-4 py-3"
              style={{ background: "rgba(18,49,77,0.06)", border: "1px solid rgba(18,49,77,0.12)" }}
            >
              <div
                className="h-8 w-8 rounded-sm flex items-center justify-center text-xs font-heading font-bold shrink-0"
                style={{ background: "linear-gradient(135deg, #CEB99A, #b8a080)", color: "#12314D" }}
              >
                RB
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#12314D" }}>
                  CNAI 47.907 · Avaliador de Imóveis
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "#4a4a4a" }}>
                  Salvador · Região Metropolitana · Litoral Norte da Bahia
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-5">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-sm p-6 shadow-sm transition-shadow hover:shadow-md"
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(18,49,77,0.10)",
                    borderTop: "3px solid #CEB99A",
                  }}
                >
                  <p
                    className="font-heading text-3xl font-semibold sm:text-4xl"
                    style={{ color: "#12314D" }}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider" style={{ color: "#4a4a4a" }}>
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
