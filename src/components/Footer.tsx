import { MessageCircle } from "lucide-react";
import { siteData } from "@/lib/data";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "LinkedIn",  href: "https://linkedin.com",  icon: LinkedinIcon   },
  { label: "WhatsApp",  href: siteData.whatsappUrl,    icon: MessageCircle  },
];

export default function Footer() {
  return (
    <footer
      className="border-t py-10"
      style={{
        background: "#0d2238",
        borderColor: "rgba(206,185,154,0.18)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top row — logo + socials */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/rafael-logo.svg"
              alt="Rafael Brandão Desenvolvimento Imobiliário"
              width={66}
              height={55}
              className="shrink-0"
            />
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="social-icon flex h-9 w-9 items-center justify-center rounded-sm"
              >
                <Icon className="h-4 w-4 shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          className="my-7 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(206,185,154,0.25), transparent)" }}
        />

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="text-xs" style={{ color: "rgba(247,247,245,0.45)" }}>
            © 2026 Rafael Brandão · Desenvolvimento Imobiliário. Todos os direitos reservados.
          </p>
          <p className="text-xs" style={{ color: "rgba(247,247,245,0.35)" }}>
            CRECI-BA {siteData.creci} · CNAI 47.907 · Desenvolvido por{" "}
            <a
              href="https://github.com/vanderleineto"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors hover:text-amber-400"
              style={{ color: "rgba(206,185,154,0.55)" }}
            >
              Vanderlei Neto
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
