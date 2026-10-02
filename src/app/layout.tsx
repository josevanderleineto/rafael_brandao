import type { Metadata, Viewport } from "next";
import "./globals.css";
import { homeMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...homeMetadata,
  icons: {
    icon: [
      { url: "/rafael-logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/rafael-logo.svg",
    apple: "/rafael-logo.svg",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#12314D",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
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