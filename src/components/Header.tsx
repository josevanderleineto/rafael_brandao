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

  return (
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* ── Logo ── */}
        <a href="#inicio" className="flex items-center gap-2 group" aria-label="Rafael Brandão Imóveis - Início">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/rafael-logo.svg"
            alt="Rafael Brandão Desenvolvimento Imobiliário"
            width={88}
            height={73}
            className="shrink-0 transition-transform duration-300 group-hover:scale-105"
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

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-sm p-2 transition-colors md:hidden"
            style={{ color: "#CEB99A" }}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {isOpen && (
        <div
          className="border-t px-4 py-6 md:hidden"
          style={{ background: "#12314D", borderColor: "rgba(206,185,154,0.2)" }}
        >
          <nav className="flex flex-col gap-5" aria-label="Navegação mobile">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="nav-link text-sm font-medium uppercase tracking-[0.14em] transition-colors"
                style={{ color: "rgba(247,247,245,0.85)" }}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 h-px" style={{ background: "rgba(206,185,154,0.2)" }} />
            <a
              href={siteData.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold inline-flex items-center justify-center gap-2 rounded-sm px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em]"
            >
              <MessageCircle className="h-4 w-4" />
              Falar no WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
