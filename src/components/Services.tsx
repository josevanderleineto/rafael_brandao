import { Building2, FileCheck2, KeyRound, LandPlot } from "lucide-react";

const services = [
  {
    icon: KeyRound,
    number: "01",
    title: "Locação e administração",
    text: "Gestão profissional para valorizar o patrimônio e trazer tranquilidade a proprietários e locatários.",
  },
  {
    icon: LandPlot,
    number: "02",
    title: "Terrenos para incorporação",
    text: "Oportunidades estratégicas e negociações confidenciais para investidores, incorporadoras e proprietários.",
  },
  {
    icon: FileCheck2,
    number: "03",
    title: "Avaliações e regularização",
    text: "Laudos técnicos e assessoria em documentos, escrituras e processos imobiliários.",
  },
  {
    icon: Building2,
    number: "04",
    title: "Vendas e consultoria",
    text: "Intermediação segura, análise de mercado e atendimento personalizado em todas as etapas.",
  },
];

export default function Services() {
  return (
    <section
      id="servicos"
      className="py-20 sm:py-28"
      style={{
        background: "linear-gradient(160deg, #12314D 0%, #0d2238 60%, #091929 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="brand-divider mb-6">
            <p
              className="text-xs font-semibold uppercase tracking-[0.28em] whitespace-nowrap"
              style={{ color: "#CEB99A" }}
            >
              Soluções Completas
            </p>
          </div>
          <h2
            className="font-heading text-3xl font-semibold leading-tight tracking-wide sm:text-4xl"
            style={{ color: "#F7F7F5" }}
          >
            Uma assessoria imobiliária pensada para{" "}
            <span style={{ color: "#CEB99A" }}>decisões seguras.</span>
          </h2>
          <p
            className="mt-5 text-base leading-relaxed"
            style={{ color: "rgba(247,247,245,0.70)" }}
          >
            Do primeiro contato à manutenção do imóvel, nossa equipe trabalha
            para simplificar cada etapa.
          </p>
        </div>

        {/* Cards */}
        <div
          className="mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-4 rounded-sm overflow-hidden"
          style={{ background: "rgba(206,185,154,0.15)" }}
        >
          {services.map(({ icon: Icon, number, title, text }) => (
            <article
              key={title}
              className="service-card flex flex-col p-8"
            >
              <span
                className="font-heading text-xs font-semibold tracking-widest"
                style={{ color: "#CEB99A" }}
              >
                {number}
              </span>

              <div
                className="mt-8 flex h-12 w-12 items-center justify-center rounded-sm"
                style={{
                  background: "rgba(206,185,154,0.12)",
                  border: "1px solid rgba(206,185,154,0.25)",
                }}
              >
                <Icon className="h-6 w-6" style={{ color: "#CEB99A" }} />
              </div>

              <h3
                className="font-heading mt-6 text-base font-semibold leading-snug tracking-wide"
                style={{ color: "#F7F7F5" }}
              >
                {title}
              </h3>

              <p
                className="mt-3 text-sm leading-6"
                style={{ color: "rgba(247,247,245,0.65)" }}
              >
                {text}
              </p>

              <div className="mt-6 service-card-line" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
