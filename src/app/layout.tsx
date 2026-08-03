import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rafael Brandão | Desenvolvimento Imobiliário",
  description:
    "Locação, administração, vendas, avaliações e assessoria imobiliária em Salvador, Região Metropolitana e Litoral Norte da Bahia. CRECI-BA 7691 | CNAI 47.907.",
  icons: {
    icon: "/rafael-logo.svg",
    shortcut: "/rafael-logo.svg",
    apple: "/rafael-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth antialiased" suppressHydrationWarning>
      <body className="min-h-screen font-sans" style={{ backgroundColor: "#F7F7F5", color: "#2B2B2B" }}>
        {children}
      </body>
    </html>
  );
}
