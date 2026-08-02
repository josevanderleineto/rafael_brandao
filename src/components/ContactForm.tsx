"use client";

import { FormEvent, useState } from "react";
import { siteData } from "@/lib/data";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;

    const text = encodeURIComponent(
      `Olá! Meu nome é ${name}.\nTelefone: ${phone}\n\n${message}`,
    );

    window.open(`${siteData.whatsappUrl}?text=${text}`, "_blank");
    setIsSubmitting(false);
    event.currentTarget.reset();
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
    </form>
  );
}
