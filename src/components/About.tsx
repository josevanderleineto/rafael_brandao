import Image from "next/image";
import type { SiteContent } from "@/lib/site-content-defaults";
import { defaultSiteContent } from "@/lib/site-content-defaults";

function c(content: SiteContent, key: string): string {
  return content[key] ?? defaultSiteContent[key] ?? "";
}

export default function About({ content = {} }: { content?: SiteContent }) {
  const eyebrow = c(content, "about.eyebrow");
  const title = c(content, "about.title");
  const paragraph1 = c(content, "about.paragraph1");
  const paragraph2 = c(content, "about.paragraph2");
  const creci = c(content, "about.creci");
  const cnai = c(content, "about.cnai");
  const cnaiRegion = c(content, "about.cnaiRegion");
  const photo = c(content, "about.photo") || "/rafael-brandao.jpg";

  const stat1Value = c(content, "about.stat1.value");
  const stat1Label = c(content, "about.stat1.label");
  const stat2Value = c(content, "about.stat2.value");
  const stat2Label = c(content, "about.stat2.label");

  const stats = [
    { value: stat1Value, label: stat1Label },
    { value: stat2Value, label: stat2Label },
  ].filter((s) => s.value);

  const isPhotoFromCloudinary = photo.startsWith("https://res.cloudinary.com");

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
              {isPhotoFromCloudinary ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt={creci} className="w-full h-full object-cover" />
              ) : (
                <Image
                  src={photo}
                  alt={`Rafael Brandão - Corretor de Imóveis ${creci}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
                  priority
                />
              )}
              {/* CRECI badge */}
              <div
                className="absolute bottom-4 left-4 rounded-sm px-3 py-2 backdrop-blur-sm sm:bottom-5 sm:left-5 sm:px-4 sm:py-2.5"
                style={{ background: "rgba(18,49,77,0.90)", border: "1px solid rgba(206,185,154,0.4)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#CEB99A" }}>
                  {creci}
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
                {eyebrow}
              </p>
            </div>

            <h2
              className="font-heading text-2xl font-semibold leading-tight tracking-wide sm:text-3xl lg:text-4xl"
              style={{ color: "#12314D" }}
            >
              {title}
            </h2>

            <div
              className="my-5 h-px w-14 sm:my-6 sm:w-16"
              style={{ background: "linear-gradient(to right, #CEB99A, transparent)" }}
            />

            <p className="text-sm leading-relaxed sm:text-base" style={{ color: "#4a4a4a" }}>
              {paragraph1}
            </p>
            <p className="mt-3 text-sm leading-relaxed sm:mt-4 sm:text-base" style={{ color: "#4a4a4a" }}>
              {paragraph2}
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
                  {cnai}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "#4a4a4a" }}>
                  {cnaiRegion}
                </p>
              </div>
            </div>

            {/* Stats */}
            {stats.length > 0 && (
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
                    <p
                      className="mt-1 text-[10px] font-medium uppercase tracking-wider sm:text-xs"
                      style={{ color: "#4a4a4a" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
