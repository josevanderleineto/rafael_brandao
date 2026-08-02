import { Mail, MapPin, MessageCircle } from "lucide-react";
import { siteData } from "@/lib/data";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section
      id="contato"
      className="py-20 sm:py-28"
      style={{
        background: "linear-gradient(160deg, #12314D 0%, #0d2238 60%, #091929 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Info side */}
          <div>
            <div className="brand-divider mb-6 max-w-[180px]">
              <p
                className="text-xs font-semibold uppercase tracking-[0.26em] whitespace-nowrap"
                style={{ color: "#CEB99A" }}
              >
                Contato
              </p>
            </div>

            <h2
              className="font-heading text-3xl font-semibold leading-tight tracking-wide sm:text-4xl"
              style={{ color: "#F7F7F5" }}
            >
              Vamos cuidar do seu próximo negócio?
            </h2>

            <div
              className="my-6 h-px w-16"
              style={{ background: "linear-gradient(to right, #CEB99A, transparent)" }}
            />

            <p className="text-base leading-relaxed" style={{ color: "rgba(247,247,245,0.75)" }}>
              Conte com uma equipe preparada para locação, administração,
              venda, avaliação ou regularização do seu imóvel.
            </p>

            <ul className="mt-10 space-y-6">
              <li>
                <a
                  href={siteData.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 transition-all"
                >
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm transition-all group-hover:scale-105"
                    style={{
                      background: "rgba(206,185,154,0.12)",
                      border: "1px solid rgba(206,185,154,0.30)",
                    }}
                  >
                    <MessageCircle className="h-5 w-5" style={{ color: "#CEB99A" }} />
                  </span>
                  <div>
                    <p className="font-semibold text-sm uppercase tracking-wider" style={{ color: "#CEB99A" }}>
                      WhatsApp
                    </p>
                    <p className="mt-0.5 text-base" style={{ color: "#F7F7F5" }}>
                      {siteData.phone}
                    </p>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${siteData.email}`}
                  className="group flex items-start gap-4 transition-all"
                >
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm transition-all group-hover:scale-105"
                    style={{
                      background: "rgba(206,185,154,0.12)",
                      border: "1px solid rgba(206,185,154,0.30)",
                    }}
                  >
                    <Mail className="h-5 w-5" style={{ color: "#CEB99A" }} />
                  </span>
                  <div>
                    <p className="font-semibold text-sm uppercase tracking-wider" style={{ color: "#CEB99A" }}>
                      E-mail
                    </p>
                    <p className="mt-0.5 text-base" style={{ color: "#F7F7F5" }}>
                      {siteData.email}
                    </p>
                  </div>
                </a>
              </li>

              <li className="flex items-start gap-4">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm"
                  style={{
                    background: "rgba(206,185,154,0.12)",
                    border: "1px solid rgba(206,185,154,0.30)",
                  }}
                >
                  <MapPin className="h-5 w-5" style={{ color: "#CEB99A" }} />
                </span>
                <div>
                  <p className="font-semibold text-sm uppercase tracking-wider" style={{ color: "#CEB99A" }}>
                    Localização
                  </p>
                  <p className="mt-0.5 text-base" style={{ color: "#F7F7F5" }}>
                    {siteData.address}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Form side */}
          <div
            className="rounded-sm p-6 sm:p-8"
            style={{
              background: "rgba(247,247,245,0.05)",
              border: "1px solid rgba(206,185,154,0.20)",
            }}
          >
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
