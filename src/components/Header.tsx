"use client";

import { useState, useEffect } from "react";
import { Menu, MessageCircle, X } from "lucide-react";
import { navLinks, siteData } from "@/lib/data";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha menu ao redimensionar para desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(18, 49, 77, 0.97)"
            : "rgba(18, 49, 77, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: scrolled ? "1px solid rgba(206,185,154,0.25)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.25)" : "none",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
          {/* ── Logo ── */}
          <a href="#inicio" className="flex items-center gap-2 group" aria-label="Rafael Brandão Imóveis - Início">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/rafael-logo.svg"
              alt="Rafael Brandão Desenvolvimento Imobiliário"
              className="shrink-0 transition-transform duration-300 group-hover:scale-105"
              style={{ width: "clamp(60px, 10vw, 88px)", height: "auto" }}
            />
          </a>

          {/* ── Desktop Nav ── */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-xs font-medium uppercase tracking-[0.14em] transition-colors"
                style={{ color: "rgba(247,247,245,0.85)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ── CTA + Mobile toggle ── */}
          <div className="flex items-center gap-3">
            <a
              href={siteData.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold hidden items-center gap-2 rounded-sm px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] sm:inline-flex"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>

            {/* Botão hamburger — maior área de toque, ícone maior */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md transition-all duration-200 md:hidden"
              style={{
                color: "#CEB99A",
                padding: "10px",
                minWidth: "44px",
                minHeight: "44px",
                background: isOpen ? "rgba(206,185,154,0.15)" : "rgba(206,185,154,0.08)",
                border: "1px solid rgba(206,185,154,0.25)",
              }}
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      <div
        className="fixed inset-0 z-40 md:hidden"
        style={{
          pointerEvents: isOpen ? "auto" : "none",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.25s ease",
          background: "rgba(7, 18, 28, 0.6)",
          backdropFilter: "blur(4px)",
        }}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile Menu Drawer ── */}
      <div
        className="fixed inset-x-0 top-0 z-40 md:hidden"
        style={{
          transform: isOpen ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          background: "#0d2238",
          borderBottom: "1px solid rgba(206,185,154,0.25)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.45)",
          paddingTop: "80px", // espaço para o header fixo
        }}
      >
        <nav className="flex flex-col px-6 py-6" aria-label="Navegação mobile">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center font-medium uppercase"
              style={{
                color: "rgba(247,247,245,0.9)",
                fontSize: "0.95rem",
                letterSpacing: "0.14em",
                padding: "16px 0",
                borderBottom: i < navLinks.length - 1 ? "1px solid rgba(206,185,154,0.12)" : "none",
                transition: "color 0.2s ease, padding-left 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#CEB99A";
                (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "8px";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(247,247,245,0.9)";
                (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "0";
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#CEB99A",
                  marginRight: "14px",
                  flexShrink: 0,
                  opacity: 0.7,
                }}
              />
              {link.label}
            </a>
          ))}

          {/* Divider */}
          <div className="my-5" style={{ height: "1px", background: "rgba(206,185,154,0.2)" }} />

          {/* WhatsApp CTA */}
          <a
            href={siteData.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center justify-center gap-3 rounded-sm font-semibold uppercase"
            style={{
              padding: "16px 24px",
              fontSize: "0.875rem",
              letterSpacing: "0.1em",
              width: "100%",
            }}
          >
            <MessageCircle className="h-5 w-5" />
            Falar no WhatsApp
          </a>

          {/* Pequeno espaço inferior */}
          <div className="h-4" />
        </nav>
      </div>
    </>
  );
}
