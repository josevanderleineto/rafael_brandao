import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

/** O painel nunca deve ser indexado nem aparecer em resultados de busca. */
export const metadata: Metadata = {
  ...noIndexMetadata,
  title: "Área administrativa",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
      {children}
    </>
  );
}