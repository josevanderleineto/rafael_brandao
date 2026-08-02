"use client";

import { useMemo, useState } from "react";
import type { Property } from "@/lib/data";
import { defaultFilters, filterProperties } from "@/lib/property-utils";
import PropertyCard from "./PropertyCard";
import PropertySearchBar from "./PropertySearchBar";

export default function PropertiesGrid({ initialProperties }: { initialProperties: Property[] }) {
  const [filters, setFilters] = useState(defaultFilters);

  const filtered = useMemo(
    () => filterProperties(initialProperties, filters),
    [filters, initialProperties],
  );

  return (
    <>
      <div className="mt-10">
        <PropertySearchBar
          filters={filters}
          onChange={setFilters}
          resultsCount={filtered.length}
          totalCount={initialProperties.length}
        />
      </div>

      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-gray-50 px-6 py-16 text-center">
          <p className="text-lg font-semibold text-slate-900">Nenhum imóvel encontrado</p>
          <p className="mt-2 text-slate-600">
            Tente ajustar os filtros ou buscar por outro bairro ou tipo de imóvel.
          </p>
        </div>
      )}
    </>
  );
}
