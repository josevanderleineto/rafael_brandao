"use client";

import { FormEvent, useState } from "react";
import { siteData } from "@/lib/data";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, message }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Não foi possível enviar sua mensagem.");
      }

      form.reset();
      setStatus("Sua mensagem foi enviada com sucesso!");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível enviar sua mensagem.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-sm border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2";
  const inputStyle = {
    background: "rgba(247,247,245,0.06)",
    borderColor: "rgba(206,185,154,0.25)",
    color: "#F7F7F5",
  };

  const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-wider";
  const labelStyle = { color: "rgba(206,185,154,0.80)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="contact-name" className={labelClass} style={labelStyle}>
          Nome
        </label>
        <input
          type="text"
          id="contact-name"
          name="name"
          required
          placeholder="Seu nome completo"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="contact-phone" className={labelClass} style={labelStyle}>
          Telefone
        </label>
        <input
          type="tel"
          id="contact-phone"
          name="phone"
          required
          placeholder={siteData.phone}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass} style={labelStyle}>
          Mensagem
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          placeholder="Conte-me sobre o imóvel que você procura..."
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-gold w-full rounded-sm px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.1em] disabled:opacity-70"
      >
        {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
      </button>
      {status && (
        <p aria-live="polite" className="text-sm" style={{ color: "rgba(247,247,245,0.8)" }}>
          {status}
        </p>
      )}
    </form>
  );
}
