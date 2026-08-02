import Link from "next/link";
import { Bath, BedDouble, Camera, MapPin, Maximize } from "lucide-react";
import type { Property } from "@/lib/data";

const badgeStyles: Record<Property["badge"], { bg: string; color: string }> = {
  Venda:      { bg: "#CEB99A",  color: "#12314D" },
  Aluguel:    { bg: "#12314D",  color: "#F7F7F5" },
  Lançamento: { bg: "#2B2B2B",  color: "#CEB99A" },
};

export default function PropertyCard({
  id,
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
  photos,
}: Property) {
  const extraPhotos = (photos ?? []).filter(Boolean).length;
  const bs = badgeStyles[badge];

  return (
    <Link href={`/imoveis/${id}`} className="group block property-card">
      <article
        className="overflow-hidden rounded-sm shadow-md"
        style={{
          background: "#fff",
          border: "1px solid rgba(18,49,77,0.10)",
        }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Badge */}
          <span
            className="absolute left-3 top-3 z-10 rounded-sm px-2.5 py-1 text-xs font-bold uppercase tracking-wider sm:left-4 sm:top-4 sm:px-3"
            style={{ background: bs.bg, color: bs.color }}
          >
            {badge}
          </span>
          {/* Gallery count */}
          {extraPhotos > 0 && (
            <span
              className="absolute bottom-2 right-2 z-10 inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm sm:bottom-3 sm:right-3 sm:gap-1.5 sm:px-2.5"
              style={{ background: "rgba(18,49,77,0.75)" }}
            >
              <Camera className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              +{extraPhotos}
            </span>
          )}
          {/* Bottom gradient */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16"
            style={{ background: "linear-gradient(to top, rgba(18,49,77,0.35), transparent)" }}
          />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#CEB99A" }}
          >
            {type}
          </p>
          <h3
            className="font-heading mt-1 text-sm font-semibold leading-snug sm:text-base"
            style={{ color: "#12314D" }}
          >
            {title}
          </h3>
          <p className="mt-1 inline-flex items-center gap-1 text-xs" style={{ color: "#4a4a4a" }}>
            <MapPin className="h-3 w-3 shrink-0" style={{ color: "#CEB99A" }} />
            {neighborhood}, {city}
          </p>

          <p
            className="font-heading mt-2.5 text-lg font-semibold sm:mt-3 sm:text-xl"
            style={{ color: "#12314D" }}
          >
            {price}
          </p>

          {/* Stats — wrap em telas muito pequenas */}
          <div
            className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t pt-3 text-xs sm:mt-4 sm:gap-4 sm:pt-4"
            style={{ borderColor: "rgba(18,49,77,0.10)", color: "#4a4a4a" }}
          >
            <span className="inline-flex items-center gap-1 sm:gap-1.5">
              <BedDouble className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: "#CEB99A" }} />
              {beds} Qtos
            </span>
            <span className="inline-flex items-center gap-1 sm:gap-1.5">
              <Bath className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: "#CEB99A" }} />
              {baths} Banh
            </span>
            <span className="inline-flex items-center gap-1 sm:gap-1.5">
              <Maximize className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: "#CEB99A" }} />
              {area} m²
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
