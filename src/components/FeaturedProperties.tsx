"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Property } from "@/lib/data";
import { defaultFilters, filterProperties } from "@/lib/property-utils";
import PropertyCard from "./PropertyCard";
import PropertySearchBar from "./PropertySearchBar";

const PAGE_SIZE = 6; // imóveis exibidos inicialmente

export default function FeaturedProperties() {
  const [filters, setFilters] = useState(defaultFilters);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProperties(data);
        }
      })
      .catch((err) => console.error("Erro ao carregar imóveis:", err))
      .finally(() => setLoading(false));
  }, []);

  // Reinicia paginação sempre que filtros mudarem
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters]);

  const filteredProperties = useMemo(
    () => filterProperties(properties, filters),
    [filters, properties]
  );

  const visibleProperties = filteredProperties.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProperties.length;
  const hasLess = visibleCount > PAGE_SIZE;

  function loadMore() {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }

  function collapse() {
    setVisibleCount(PAGE_SIZE);
    // Volta o scroll suavemente para o topo da seção
    document.getElementById("imoveis")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="imoveis" className="py-20 sm:py-28" style={{ backgroundColor: "#F7F7F5" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="brand-divider mb-6">
            <p
              className="text-xs font-semibold uppercase tracking-[0.28em] whitespace-nowrap"
              style={{ color: "#CEB99A" }}
            >
              Portfólio Exclusivo
            </p>
          </div>
          <h2
            className="font-heading text-3xl font-semibold tracking-wide sm:text-4xl"
            style={{ color: "#12314D" }}
          >
            Imóveis em Destaque
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: "#4a4a4a" }}>
            Oportunidades para morar, alugar, investir e desenvolver novos
            empreendimentos na Bahia.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mt-10">
          <PropertySearchBar
            filters={filters}
            onChange={setFilters}
            resultsCount={filteredProperties.length}
            totalCount={properties.length}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-80 animate-pulse rounded-sm"
                style={{ background: "rgba(18,49,77,0.07)" }}
              />
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>

            {/* Contador de exibição */}
            <p className="mt-6 text-center text-xs" style={{ color: "#4a4a4a" }}>
              Exibindo{" "}
              <span className="font-semibold" style={{ color: "#12314D" }}>
                {visibleProperties.length}
              </span>{" "}
              de{" "}
              <span className="font-semibold" style={{ color: "#12314D" }}>
                {filteredProperties.length}
              </span>{" "}
              imóveis
            </p>

            {/* Botões de paginação */}
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {hasMore && (
                <button
                  type="button"
                  onClick={loadMore}
                  className="inline-flex items-center gap-2 rounded-sm px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.1em] transition-all hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #CEB99A 0%, #b8a080 100%)",
                    color: "#12314D",
                    boxShadow: "0 4px 16px rgba(206,185,154,0.30)",
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                  Ver mais imóveis
                </button>
              )}

              {hasLess && (
                <button
                  type="button"
                  onClick={collapse}
                  className="inline-flex items-center gap-2 rounded-sm border px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.1em] transition-all hover:bg-white"
                  style={{
                    borderColor: "rgba(18,49,77,0.20)",
                    color: "#12314D",
                    background: "transparent",
                  }}
                >
                  <ChevronUp className="h-4 w-4" />
                  Ver menos
                </button>
              )}
            </div>
          </>
        ) : (
          <div
            className="mt-10 rounded-sm border-2 border-dashed px-6 py-16 text-center"
            style={{ borderColor: "rgba(18,49,77,0.15)", background: "#fff" }}
          >
            <p className="font-heading text-lg font-semibold" style={{ color: "#12314D" }}>
              Nenhum imóvel encontrado
            </p>
            <p className="mt-2 text-sm" style={{ color: "#4a4a4a" }}>
              Tente ajustar os filtros ou buscar por outro bairro ou tipo de imóvel.
            </p>
          </div>
        )}

        {/* CTA fixo no fundo */}
        <div className="mt-14 text-center">
          <a
            href="#contato"
            className="btn-navy inline-flex items-center justify-center rounded-sm px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.1em]"
          >
            Falar com o Corretor
          </a>
        </div>
      </div>
    </section>
  );
}
