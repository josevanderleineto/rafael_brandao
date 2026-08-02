"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Camera,
  ChevronLeft,
  ChevronRight,
  FileText,
  MapPin,
  Maximize,
  Play,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import type { Property } from "@/lib/data";
import { siteData } from "@/lib/data";
import { formatEmbedVideoUrl } from "@/lib/property-utils";

const badgeColors: Record<Property["badge"], string> = {
  Venda: "bg-amber-500",
  Aluguel: "bg-blue-600",
  Lançamento: "bg-emerald-500",
};

type MediaItem =
  | { type: "image"; src: string }
  | { type: "video"; src: string };

// ─── Lightbox Modal / Carrossel ─────────────────────────────────────────────
function Lightbox({
  items,
  index,
  onClose,
  onSelect,
}: {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onSelect: (i: number) => void;
}) {
  const currentItem = items[index];

  // Bloqueia a rolagem da página enquanto a foto/vídeo está aberta
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) {
        onSelect(index - 1);
      }
      if (e.key === "ArrowRight" && index < items.length - 1) {
        onSelect(index + 1);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, items.length, onClose, onSelect]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 p-2 sm:p-4 select-none overflow-hidden"
      onClick={onClose}
    >
      {/* Barra Superior */}
      <div
        className="flex items-center justify-between text-white z-20 px-2 py-1"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-slate-200 backdrop-blur-md">
          {currentItem.type === "video"
            ? "Vídeo do Imóvel"
            : `Foto ${index + 1} de ${items.filter((i) => i.type === "image").length}`}
        </span>

        <button
          onClick={onClose}
          className="rounded-full bg-white/10 p-2.5 text-slate-300 hover:bg-white/20 hover:text-white transition-colors"
          aria-label="Fechar galeria"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Conteúdo Principal do Carrossel (Foto ou Vídeo) */}
      <div
        className="relative flex flex-1 w-full h-full items-center justify-center overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {items.length > 1 && (
          <button
            onClick={() => onSelect(Math.max(0, index - 1))}
            disabled={index === 0}
            className="absolute left-2 sm:left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/70 p-3 text-white backdrop-blur-md transition-all hover:bg-black hover:scale-110 disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-7 w-7 sm:h-9 sm:w-9" />
          </button>
        )}

        {currentItem.type === "image" ? (
          <img
            src={currentItem.src}
            alt={`Mídia ${index + 1}`}
            className="h-full w-full max-h-[85vh] sm:max-h-[90vh] max-w-full object-contain transition-all duration-300"
          />
        ) : (
          <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
            <iframe
              src={formatEmbedVideoUrl(currentItem.src)}
              title="Vídeo do imóvel"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        )}

        {items.length > 1 && (
          <button
            onClick={() => onSelect(Math.min(items.length - 1, index + 1))}
            disabled={index === items.length - 1}
            className="absolute right-2 sm:right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/70 p-3 text-white backdrop-blur-md transition-all hover:bg-black hover:scale-110 disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Próximo"
          >
            <ChevronRight className="h-7 w-7 sm:h-9 sm:w-9" />
          </button>
        )}
      </div>

      {/* Faixa Inferior de Miniaturas */}
      {items.length > 1 && (
        <div
          className="flex justify-center py-2 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex max-w-full gap-2 overflow-x-auto rounded-2xl bg-black/50 p-2 backdrop-blur-md">
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => onSelect(i)}
                className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-200 ${
                  i === index
                    ? "ring-2 ring-amber-500 opacity-100 scale-105"
                    : "opacity-40 hover:opacity-80"
                }`}
              >
                {item.type === "image" ? (
                  <img src={item.src} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-800 text-amber-400">
                    <Play className="h-6 w-6" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Galeria da Página ───────────────────────────────────────────────────────
function Gallery({ items }: { items: MediaItem[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  const main = items[0];
  const thumbs = items.slice(1, 5);
  const remaining = items.length - 5;

  const photosCount = items.filter((i) => i.type === "image").length;
  const hasVideo = items.some((i) => i.type === "video");

  return (
    <>
      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onSelect={(i) => setLightboxIndex(i)}
        />
      )}

      <div className="relative overflow-hidden rounded-3xl bg-slate-200 shadow-md">
        <div className="grid grid-cols-4 gap-2">
          {/* Item Principal (Foto 1) */}
          <button
            className={`group relative col-span-4 overflow-hidden ${
              thumbs.length > 0
                ? "aspect-[16/10] md:col-span-2 md:aspect-[4/3]"
                : "aspect-[16/9] md:aspect-[21/9]"
            }`}
            onClick={() => setLightboxIndex(0)}
          >
            {main.type === "image" ? (
              <img
                src={main.src}
                alt="Foto principal"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-900 text-amber-400">
                <Play className="h-12 w-12" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
              <Camera className="h-4 w-4 text-amber-400" />
              Ver galeria ({photosCount} {photosCount === 1 ? "foto" : "fotos"}
              {hasVideo ? " + vídeo" : ""})
            </span>
          </button>

          {/* Grid de Miniaturas (Fotos + Vídeo se houver) */}
          {thumbs.length > 0 && (
            <div className="col-span-4 grid grid-cols-2 gap-2 md:col-span-2">
              {thumbs.map((item, i) => (
                <button
                  key={i}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer"
                  onClick={() => setLightboxIndex(i + 1)}
                >
                  {item.type === "image" ? (
                    <img
                      src={item.src}
                      alt={`Mídia ${i + 2}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="relative flex h-full w-full items-center justify-center bg-slate-900 text-white">
                      <img
                        src={items[0].src}
                        alt="Vídeo"
                        className="h-full w-full object-cover opacity-50"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px]">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg transition-transform group-hover:scale-110">
                          <Play className="h-5 w-5 fill-current ml-0.5" />
                        </div>
                        <span className="mt-1 text-[11px] font-bold tracking-wider uppercase text-white">
                          Vídeo
                        </span>
                      </div>
                    </div>
                  )}

                  {i === thumbs.length - 1 && remaining > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white backdrop-blur-[2px]">
                      <span className="text-xl font-bold">+{remaining + 1} mídias</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Componente Principal de Detalhes ──────────────────────────────────────
export default function PropertyDetailClient({ property }: { property: Property }) {
  const {
    title,
    price,
    badge,
    type,
    neighborhood,
    city,
    image,
    beds,
    baths,
    area,
    description,
    photos,
    videoUrl,
  } = property;

  const allImages = Array.from(new Set([image, ...(photos ?? []).filter(Boolean)]));
  const mediaItems: MediaItem[] = allImages.map((src) => ({ type: "image", src }));
  if (videoUrl) {
    mediaItems.push({ type: "video", src: videoUrl });
  }

  const whatsappText = encodeURIComponent(
    `Olá! Vi o imóvel "${title}" no site e gostaria de mais informações.`
  );

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      alert("Link copiado para a área de transferência!");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Barra Superior Náutica / Clean */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link
            href="/#imoveis"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos imóveis
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 shadow-sm"
          >
            <Share2 className="h-4 w-4 text-amber-600" />
            Compartilhar
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Galeria Unificada de Fotos e Vídeo */}
        <Gallery items={mediaItems} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Coluna Principal de Conteúdo */}
          <div className="space-y-8">
            {/* Cabeçalho do Imóvel */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm ${badgeColors[badge]}`}
                >
                  {badge}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                  {type}
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {title}
              </h1>

              <p className="mt-2 inline-flex items-center gap-1.5 text-base font-medium text-slate-600">
                <MapPin className="h-4 w-4 text-amber-500" />
                {neighborhood}, {city}
              </p>
            </div>

            {/* Destaques de Características */}
            <div className="grid grid-cols-3 gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80 sm:gap-4 sm:p-6">
              <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 sm:h-11 sm:w-11">
                  <BedDouble className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-lg font-bold text-slate-900 sm:text-xl">{beds}</p>
                  <p className="text-[10px] font-medium text-slate-500 sm:text-xs">Quartos</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 sm:h-11 sm:w-11">
                  <Bath className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-lg font-bold text-slate-900 sm:text-xl">{baths}</p>
                  <p className="text-[10px] font-medium text-slate-500 sm:text-xs">Banheiros</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 sm:h-11 sm:w-11">
                  <Maximize className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-lg font-bold text-slate-900 sm:text-xl">{area}</p>
                  <p className="text-[10px] font-medium text-slate-500 sm:text-xs">m² de área</p>
                </div>
              </div>
            </div>

            {/* Descrição Detalhada do Imóvel */}
            <section className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200/80">
              <h2 className="flex items-center gap-2.5 text-xl font-bold text-slate-900">
                <FileText className="h-5 w-5 text-amber-500" />
                Descrição do imóvel
              </h2>
              {description ? (
                <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-slate-700">
                  {description}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500 italic">
                  Nenhuma descrição fornecida para este imóvel. Entre em contato para saber mais detalhes!
                </p>
              )}
            </section>
          </div>

          {/* Sidebar de Valor e Contato */}
          <aside>
            <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200/80 sm:p-7 lg:sticky lg:top-24">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
                Valor do investimento
              </span>
              <p className="mt-1 text-3xl font-extrabold text-slate-900 sm:text-4xl">{price}</p>

              <div className="mt-6 space-y-3">
                <a
                  href={`${siteData.whatsappUrl}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-5 py-4 font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Falar no WhatsApp
                </a>

                <a
                  href="/#contato"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Enviar mensagem
                </a>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="text-center text-xs font-medium text-slate-400">
                  {siteData.name}
                  <br />
                  {siteData.creci}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
