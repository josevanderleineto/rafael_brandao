import { ImageResponse } from "next/og";
import { SITE_CREDENTIALS, SITE_OWNER } from "@/lib/site-config";

/**
 * Imagem de compartilhamento (Open Graph / Twitter card) gerada em runtime.
 * Publicada em /opengraph-image e usada quando o site é linkado em
 * WhatsApp, Facebook, LinkedIn e no preview do Google.
 */

export const alt = `${SITE_OWNER} — Corretor de Imóveis em Salvador e Litoral Norte da Bahia`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(160deg, #12314D 0%, #0d2238 60%, #091929 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Faixa dourada do topo */}
        <div style={{ display: "flex", height: 6, width: 220, background: "#CEB99A" }} />

        {/* Identidade */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "#CEB99A",
              fontWeight: 600,
            }}
          >
            Desenvolvimento Imobiliário
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 82,
              lineHeight: 1.05,
              color: "#F7F7F5",
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            {SITE_OWNER}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 36,
              lineHeight: 1.25,
              color: "rgba(247,247,245,0.82)",
            }}
          >
            Corretor de imóveis em Salvador, Região Metropolitana e Litoral Norte da Bahia
          </div>
        </div>

        {/* Rodapé com serviços e credenciais */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderTop: "1px solid rgba(206,185,154,0.28)",
            paddingTop: 32,
          }}
        >
          <div style={{ display: "flex", fontSize: 28, color: "#F7F7F5", letterSpacing: 1 }}>
            Locação · Vendas · Administração · Avaliações · Regularização
          </div>

          <div style={{ display: "flex", marginTop: 18, gap: 24 }}>
            <span style={{ fontSize: 24, color: "#CEB99A", letterSpacing: 2 }}>
              {SITE_CREDENTIALS.creci}
            </span>
            <span style={{ fontSize: 24, color: "rgba(206,185,154,0.55)" }}>|</span>
            <span style={{ fontSize: 24, color: "#CEB99A", letterSpacing: 2 }}>
              {SITE_CREDENTIALS.cnai}
            </span>
            <span style={{ fontSize: 24, color: "rgba(206,185,154,0.55)" }}>|</span>
            <span style={{ fontSize: 24, color: "#CEB99A", letterSpacing: 2 }}>
              {SITE_CREDENTIALS.experienceYears}+ anos
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}