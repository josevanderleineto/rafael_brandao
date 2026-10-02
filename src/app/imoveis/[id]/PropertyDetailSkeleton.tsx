/**
 * Esqueleto de carregamento da página de imóvel.
 *
 * Antes isto era um `loading.tsx` no segmento. Funcionava, porém quebrava o
 * SEO: a barreira Suspense do segmento permitia ao React fechar o <head>
 * antes de a metadata ser resolvida, e title/canonical/og:image acabavam
 * transmitidos num chunk posterior ao </head> — fora do <head>, onde o
 * Googlebot e os rastreadores de redes sociais (WhatsApp, Facebook, LinkedIn)
 * procuram. Confirmado em produção: as páginas de imóvel saíam sem nenhuma
 * dessas tags.
 *
 * Agora o esqueleto é usado como `fallback` de um <Suspense> interno ao
 * componente de página, deixando a metadata (que vem de `generateMetadata`,
 * fora da barreira) resolvida antes do shell.
 */
export default function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra superior skeleton */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="h-5 w-32 animate-pulse rounded-full bg-slate-200" />
          <div className="h-8 w-28 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Galeria skeleton */}
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-4 aspect-[4/3] animate-pulse rounded-xl bg-slate-200 md:col-span-2" />
          <div className="col-span-4 grid grid-cols-2 gap-2 md:col-span-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Coluna principal skeleton */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="h-10 w-3/4 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-5 w-48 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-6 h-24 animate-pulse rounded-2xl bg-slate-200" />
            <div className="mt-8 space-y-2">
              <div className="h-6 w-40 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded-lg bg-slate-200" />
              <div className="h-4 w-5/6 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-4 w-4/6 animate-pulse rounded-lg bg-slate-200" />
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}