"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { propertyBadges, propertyTypes } from "@/lib/data";
import {
  bedFilterOptions,
  defaultFilters,
  hasActiveFilters,
  priceFilterOptions,
  type PropertyFilters,
} from "@/lib/property-utils";

type PropertySearchBarProps = {
  filters: PropertyFilters;
  onChange: (filters: PropertyFilters) => void;
  resultsCount: number;
  totalCount: number;
};

export default function PropertySearchBar({
  filters,
  onChange,
  resultsCount,
  totalCount,
}: PropertySearchBarProps) {
  function updateFilter<K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K],
  ) {
    onChange({ ...filters, [key]: value });
  }

  function clearFilters() {
    onChange(defaultFilters);
  }

  const active = hasActiveFilters(filters);

  const selectClass =
    "w-full rounded-sm border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2";
  const selectStyle = {
    borderColor: "rgba(18,49,77,0.18)",
    color: "#2B2B2B",
  };

  return (
    <div
      className="rounded-sm p-4 sm:p-6"
      style={{
        background: "#fff",
        border: "1px solid rgba(18,49,77,0.12)",
        boxShadow: "0 2px 12px rgba(18,49,77,0.06)",
      }}
    >
      {/* Search */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
          style={{ color: "#CEB99A" }}
        />
        <input
          type="search"
          value={filters.query}
          onChange={(e) => updateFilter("query", e.target.value)}
          placeholder="Buscar por bairro ou tipo..."
          className="w-full rounded-sm border py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 sm:py-3.5"
          style={{
            borderColor: "rgba(18,49,77,0.18)",
            color: "#2B2B2B",
            // @ts-expect-error – CSS custom property for focus ring
            "--tw-ring-color": "rgba(206,185,154,0.35)",
          }}
          aria-label="Buscar imóveis"
        />
      </div>

      {/* Filter label */}
      <div
        className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest"
        style={{ color: "#12314D" }}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" style={{ color: "#CEB99A" }} />
        Filtros
      </div>

      {/* Selects — 2x2 grid on mobile, 4 cols on desktop */}
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <label className="flex flex-col gap-1.5">
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "#4a4a4a" }}
          >
            Negócio
          </span>
          <select
            value={filters.badge}
            onChange={(e) => updateFilter("badge", e.target.value as PropertyFilters["badge"])}
            className={selectClass}
            style={selectStyle}
          >
            <option value="Todos">Todos</option>
            {propertyBadges.map((badge) => (
              <option key={badge} value={badge}>{badge}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "#4a4a4a" }}
          >
            Tipo
          </span>
          <select
            value={filters.type}
            onChange={(e) => updateFilter("type", e.target.value as PropertyFilters["type"])}
            className={selectClass}
            style={selectStyle}
          >
            <option value="Todos">Todos</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "#4a4a4a" }}
          >
            Quartos
          </span>
          <select
            value={filters.minBeds}
            onChange={(e) => updateFilter("minBeds", Number(e.target.value))}
            className={selectClass}
            style={selectStyle}
          >
            {bedFilterOptions.map((option) => (
              <option key={option.label} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "#4a4a4a" }}
          >
            Preço
          </span>
          <select
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              updateFilter("maxPrice", e.target.value === "" ? null : Number(e.target.value))
            }
            className={selectClass}
            style={selectStyle}
          >
            {priceFilterOptions.map((option) => (
              <option key={option.label} value={option.value ?? ""}>{option.label}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Footer */}
      <div
        className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: "rgba(18,49,77,0.10)" }}
      >
        <p className="text-sm" style={{ color: "#4a4a4a" }}>
          <span className="font-semibold" style={{ color: "#12314D" }}>{resultsCount}</span>{" "}
          {resultsCount === 1 ? "imóvel encontrado" : "imóveis encontrados"} de {totalCount}
        </p>

        {active && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-2 rounded-sm border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-gray-50"
            style={{ borderColor: "rgba(18,49,77,0.20)", color: "#12314D" }}
          >
            <X className="h-3.5 w-3.5" />
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
}
