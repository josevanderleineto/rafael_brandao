import { Building2, FileCheck2, KeyRound, LandPlot, Play } from "lucide-react";
import type { SiteContent } from "@/lib/site-content-defaults";
import { defaultSiteContent } from "@/lib/site-content-defaults";

function c(content: SiteContent, key: string): string {
  return content[key] ?? defaultSiteContent[key] ?? "";
}

const icons = [KeyRound, LandPlot, FileCheck2, Building2];
const numbers = ["01", "02", "03", "04"];

function getVideoEmbed(url: string): { type: "direct" | "youtube" | "vimeo" | "unknown"; embedUrl: string } | null {
  if (!url) return null;
  if (url.startsWith("https://res.cloudinary.com") || /\.(mp4|webm|mov)(\?|$)/i.test(url)) {
    return { type: "direct", embedUrl: url };
  }
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  if (yt) return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1` };
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return { type: "vimeo", embedUrl: `https://player.vimeo.com/video/${vm[1]}?title=0&byline=0&portrait=0` };
  return null;
}

export default function Services({ content = {} }: { content?: SiteContent }) {
  const eyebrow = c(content, "services.eyebrow");
  const title = c(content, "services.title");
  const highlight = c(content, "services.titleHighlight");
  const subtitle = c(content, "services.subtitle");
  const videoUrl = c(content, "services.video");
  const videoTitle = c(content, "services.video.title");
  const videoSubtitle = c(content, "services.video.subtitle");

  const cards = [1, 2, 3, 4].map((n) => ({
    number: numbers[n - 1],
    icon: icons[n - 1],
    title: c(content, `services.card${n}.title`),
    text: c(content, `services.card${n}.text`),
  }));

  // Split title for highlight span
  const titleParts =
    highlight && title.includes(highlight) ? title.split(highlight) : [title, ""];

  const videoInfo = getVideoEmbed(videoUrl);

  return (
    <section
      id="servicos"
      className="py-16 sm:py-24"
      style={{
        background: "linear-gradient(160deg, #12314D 0%, #0d2238 60%, #091929 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="brand-divider mb-6">
            <p
              className="text-xs font-semibold uppercase tracking-[0.24em] sm:tracking-[0.28em]"
              style={{ color: "#CEB99A" }}
            >
              {eyebrow}
            </p>
          </div>
          <h2
            className="font-heading text-2xl font-semibold leading-tight tracking-wide sm:text-3xl lg:text-4xl"
            style={{ color: "#F7F7F5" }}
          >
            {highlight ? (
              <>
                {titleParts[0]}
                <span style={{ color: "#CEB99A" }}>{highlight}</span>
                {titleParts[1]}
              </>
            ) : (
              title
            )}
          </h2>
          <p
            className="mt-4 text-sm leading-relaxed sm:mt-5 sm:text-base"
            style={{ color: "rgba(247,247,245,0.70)" }}
          >
            {subtitle}
          </p>
        </div>

        {/* Cards */}
        <div
          className="mt-10 grid gap-px grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-sm overflow-hidden sm:mt-14"
          style={{ background: "rgba(206,185,154,0.15)" }}
        >
          {cards.map(({ icon: Icon, number, title: cardTitle, text }) => (
            <article key={number} className="service-card flex flex-col p-6 sm:p-8">
              <span
                className="font-heading text-xs font-semibold tracking-widest"
                style={{ color: "#CEB99A" }}
              >
                {number}
              </span>

              <div
                className="mt-6 flex h-11 w-11 items-center justify-center rounded-sm sm:mt-8 sm:h-12 sm:w-12"
                style={{
                  background: "rgba(206,185,154,0.12)",
                  border: "1px solid rgba(206,185,154,0.25)",
                }}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "#CEB99A" }} />
              </div>

              <h3
                className="font-heading mt-5 text-sm font-semibold leading-snug tracking-wide sm:mt-6 sm:text-base"
                style={{ color: "#F7F7F5" }}
              >
                {cardTitle}
              </h3>

              <p className="mt-2 text-sm leading-6" style={{ color: "rgba(247,247,245,0.65)" }}>
                {text}
              </p>

              <div className="mt-6 service-card-line" />
            </article>
          ))}
        </div>

        {/* ── Video section — only shown if set ─────────────────────────────── */}
        {videoInfo && (
          <div className="mt-16 sm:mt-20">
            {/* Divider */}
            <div
              className="mx-auto mb-10 h-px max-w-xs sm:mb-12"
              style={{ background: "linear-gradient(to right, transparent, rgba(206,185,154,0.3), transparent)" }}
            />

            {/* Text above video */}
            <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
              {videoTitle && (
                <h3
                  className="font-heading text-xl font-semibold tracking-wide sm:text-2xl"
                  style={{ color: "#F7F7F5" }}
                >
                  {videoTitle}
                </h3>
              )}
              {videoSubtitle && (
                <p
                  className="mt-3 text-sm leading-relaxed sm:text-base"
                  style={{ color: "rgba(247,247,245,0.60)" }}
                >
                  {videoSubtitle}
                </p>
              )}
            </div>

            {/* Video player */}
            <div
              className="mx-auto max-w-4xl overflow-hidden rounded-2xl shadow-2xl"
              style={{ border: "1px solid rgba(206,185,154,0.20)" }}
            >
              {videoInfo.type === "direct" ? (
                /* Cloudinary / direct MP4 */
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  src={videoInfo.embedUrl}
                  controls
                  className="w-full"
                  style={{ aspectRatio: "16/9", background: "#000", display: "block" }}
                />
              ) : (
                /* YouTube / Vimeo embed */
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                  <iframe
                    src={videoInfo.embedUrl}
                    title={videoTitle || "Vídeo institucional"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                      display: "block",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Gold accent line below */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="h-px w-12 sm:w-16" style={{ background: "rgba(206,185,154,0.35)" }} />
              <Play className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "rgba(206,185,154,0.50)" }} />
              <div className="h-px w-12 sm:w-16" style={{ background: "rgba(206,185,154,0.35)" }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
