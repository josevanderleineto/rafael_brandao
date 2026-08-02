import { Mail, MapPin, MessageCircle } from "lucide-react";
import { siteData } from "@/lib/data";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section
      id="contato"
      className="py-16 sm:py-24"
      style={{
        background: "linear-gradient(160deg, #12314D 0%, #0d2238 60%, #091929 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Info side */}
          <div>
            <div className="brand-divider mb-5 max-w-[180px] sm:mb-6">
              <p
                className="text-xs font-semibold uppercase tracking-[0.24em] sm:tracking-[0.26em]"
                style={{ color: "#CEB99A" }}
              >
                Contato
              </p>
            </div>

            <h2
              className="font-heading text-2xl font-semibold leading-tight tracking-wide sm:text-3xl lg:text-4xl"
              style={{ color: "#F7F7F5" }}
            >
              Vamos cuidar do seu próximo negócio?
            </h2>

            <div
              className="my-5 h-px w-14 sm:my-6 sm:w-16"
              style={{ background: "linear-gradient(to right, #CEB99A, transparent)" }}
            />

            <p className="text-sm leading-relaxed sm:text-base" style={{ color: "rgba(247,247,245,0.75)" }}>
              Conte com uma equipe preparada para locação, administração,
              venda, avaliação ou regularização do seu imóvel.
            </p>

            <ul className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
              <li>
                <a
                  href={siteData.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 transition-all sm:gap-4"
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm transition-all group-hover:scale-105 sm:h-12 sm:w-12"
                    style={{
                      background: "rgba(206,185,154,0.12)",
                      border: "1px solid rgba(206,185,154,0.30)",
                    }}
                  >
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "#CEB99A" }} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-xs uppercase tracking-wider sm:text-sm" style={{ color: "#CEB99A" }}>
                      WhatsApp
                    </p>
                    <p className="mt-0.5 text-sm sm:text-base" style={{ color: "#F7F7F5" }}>
                      {siteData.phone}
                    </p>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${siteData.email}`}
                  className="group flex items-start gap-3 transition-all sm:gap-4"
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm transition-all group-hover:scale-105 sm:h-12 sm:w-12"
                    style={{
                      background: "rgba(206,185,154,0.12)",
                      border: "1px solid rgba(206,185,154,0.30)",
                    }}
                  >
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "#CEB99A" }} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-xs uppercase tracking-wider sm:text-sm" style={{ color: "#CEB99A" }}>
                      E-mail
                    </p>
                    {/* break-all evita que email longo transborde em mobile */}
                    <p className="mt-0.5 break-all text-sm sm:text-base" style={{ color: "#F7F7F5" }}>
                      {siteData.email}
                    </p>
                  </div>
                </a>
              </li>

              <li className="flex items-start gap-3 sm:gap-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm sm:h-12 sm:w-12"
                  style={{
                    background: "rgba(206,185,154,0.12)",
                    border: "1px solid rgba(206,185,154,0.30)",
                  }}
                >
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "#CEB99A" }} />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-xs uppercase tracking-wider sm:text-sm" style={{ color: "#CEB99A" }}>
                    Localização
                  </p>
                  <p className="mt-0.5 text-sm sm:text-base" style={{ color: "#F7F7F5" }}>
                    {siteData.address}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Form side */}
          <div
            className="rounded-sm p-5 sm:p-8"
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
