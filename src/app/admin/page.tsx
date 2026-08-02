"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { propertyBadges, propertyTypes, type Property } from "@/lib/data";

type FormProperty = Omit<Property, "id" | "price" | "description" | "photos" | "videoUrl"> & {
  description: string;
  photosText: string; // uma URL por linha
  videoUrl: string;
};

const emptyProperty: FormProperty = {
  title: "",
  priceValue: 0,
  badge: "Venda",
  type: "Apartamento",
  neighborhood: "",
  city: "Salvador",
  image: "",
  beds: 0,
  baths: 0,
  area: 0,
  featured: false,
  description: "",
  photosText: "",
  videoUrl: "",
};

function formToPayload(form: FormProperty) {
  return {
    ...form,
    photos: form.photosText
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean),
    photosText: undefined,
  };
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("rafaelbrandao");
  const [password, setPassword] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState<FormProperty>(emptyProperty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function loadProperties() {
    const response = await fetch("/api/properties");
    if (response.ok) setProperties(await response.json());
  }

  useEffect(() => { void loadProperties(); }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) return setMessage("Usuário ou senha inválidos.");
    setAuthenticated(true); setMessage("");
  }

  function change<K extends keyof FormProperty>(key: K, value: FormProperty[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event: FormEvent) {
    event.preventDefault(); setMessage("");
    const payload = formToPayload(form);
    const response = await fetch(
      editingId ? `/api/properties/${editingId}` : "/api/properties",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const result = await response.json().catch(() => null);
    if (!response.ok) return setMessage(result?.error || "Não foi possível salvar.");
    await loadProperties();
    setForm(emptyProperty);
    setEditingId(null);
    setMessage("Imóvel salvo com sucesso.");
  }

  async function remove(id: number) {
    if (!window.confirm("Remover este imóvel do site?")) return;
    const response = await fetch(`/api/properties/${id}`, { method: "DELETE" });
    if (!response.ok) return setMessage("Não foi possível remover.");
    await loadProperties(); setMessage("Imóvel removido.");
  }

  function edit(property: Property) {
    setEditingId(property.id);
    setForm({
      title: property.title,
      priceValue: property.priceValue,
      badge: property.badge,
      type: property.type,
      neighborhood: property.neighborhood,
      city: property.city,
      image: property.image,
      beds: property.beds,
      baths: property.baths,
      area: property.area,
      featured: Boolean(property.featured),
      description: property.description ?? "",
      photosText: (property.photos ?? []).join("\n"),
      videoUrl: property.videoUrl ?? "",
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false); setPassword("");
  }

  if (!authenticated) {
    return (
      <LoginScreen
        username={username}
        password={password}
        message={message}
        onUsername={setUsername}
        onPassword={setPassword}
        onSubmit={login}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 pb-16">
      {/* Header */}
      <header className="bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-400">Painel de gestão</p>
            <h1 className="text-xl font-bold">Rafael Brandão Imóveis</h1>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[1.05fr_.95fr]">
        {/* Formulário */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">
                {editingId ? "Editar imóvel" : "Novo imóvel"}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {editingId ? "Atualize as informações" : "Publique uma oportunidade"}
              </h2>
            </div>
            {editingId && (
              <button
                onClick={() => { setEditingId(null); setForm(emptyProperty); }}
                className="text-sm font-medium text-slate-600"
              >
                Cancelar
              </button>
            )}
          </div>

          <form onSubmit={save} className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Título" value={form.title} onChange={(v) => change("title", v)} className="sm:col-span-2" required />
            <Select label="Finalidade" value={form.badge} options={propertyBadges} onChange={(v) => change("badge", v as FormProperty["badge"])} />
            <Select label="Tipo" value={form.type} options={propertyTypes} onChange={(v) => change("type", v as FormProperty["type"])} />
            <Field label="Bairro / região" value={form.neighborhood} onChange={(v) => change("neighborhood", v)} required />
            <Field label="Cidade" value={form.city} onChange={(v) => change("city", v)} required />
            <Field label="Valor (R$)" type="number" value={form.priceValue} onChange={(v) => change("priceValue", Number(v))} min="0" required />
            <Field label="Área (m²)" type="number" value={form.area} onChange={(v) => change("area", Number(v))} min="0" required />
            <Field label="Quartos" type="number" value={form.beds} onChange={(v) => change("beds", Number(v))} min="0" required />
            <Field label="Banheiros" type="number" value={form.baths} onChange={(v) => change("baths", Number(v))} min="0" required />
            <Field label="URL da imagem principal (capa)" value={form.image} onChange={(v) => change("image", v)} className="sm:col-span-2" required />

            {/* Fotos adicionais */}
            <label className="sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Fotos adicionais (uma URL por linha)</span>
              <textarea
                value={form.photosText}
                onChange={(e) => change("photosText", e.target.value)}
                rows={4}
                placeholder={"https://exemplo.com/foto1.jpg\nhttps://exemplo.com/foto2.jpg"}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-mono text-sm outline-none focus:border-amber-600"
              />
              <p className="mt-1 text-xs text-slate-400">
                Cole uma URL por linha. Essas fotos aparecerão na galeria da página do imóvel.
              </p>
            </label>

            {/* URL do vídeo */}
            <label className="sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">URL do vídeo do imóvel (YouTube / Vimeo)</span>
              <input
                type="text"
                value={form.videoUrl}
                onChange={(e) => change("videoUrl", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=SEU_VIDEO ou https://youtu.be/SEU_VIDEO"
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-amber-600"
              />
              <p className="mt-1 text-xs text-slate-400">
                Pode colar qualquer link do YouTube (ex: <code>https://www.youtube.com/watch?v=...</code> ou <code>https://youtu.be/...</code>). O sistema converte automaticamente para o player.
              </p>
            </label>

            {/* Descrição */}
            <label className="sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Descrição</span>
              <textarea
                value={form.description}
                onChange={(e) => change("description", e.target.value)}
                rows={3}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-amber-600"
              />
            </label>

            {/* Destaque */}
            <label className="sm:col-span-2 flex items-center gap-3 rounded-lg bg-amber-50 px-3 py-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => change("featured", e.target.checked)}
                className="h-4 w-4 accent-amber-600"
              />
              Exibir como imóvel em destaque
            </label>

            {message && (
              <p className="sm:col-span-2 text-sm font-medium text-emerald-700">{message}</p>
            )}

            <button className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-3.5 font-semibold text-white hover:bg-amber-700">
              <Check className="h-4 w-4" />
              {editingId ? "Salvar alterações" : "Publicar imóvel"}
            </button>
          </form>
        </section>

        {/* Catálogo */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">Catálogo</p>
              <h2 className="text-2xl font-bold text-slate-900">{properties.length} imóveis</h2>
            </div>
            <a href="/" target="_blank" className="text-sm font-semibold text-slate-700">Ver site ↗</a>
          </div>

          <div className="space-y-3">
            {properties.map((property) => (
              <article key={property.id} className="flex gap-4 rounded-xl bg-white p-4 shadow-sm">
                <img src={property.image} alt="" className="h-20 w-24 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">{property.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{property.neighborhood} · {property.price}</p>
                  {((property.photos ?? []).length > 0 || property.videoUrl) && (
                    <p className="mt-1 text-xs text-amber-600">
                      {(property.photos ?? []).length > 0 && `${property.photos!.length} foto(s) extra`}
                      {(property.photos ?? []).length > 0 && property.videoUrl && " · "}
                      {property.videoUrl && "com vídeo"}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => edit(property)}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </button>
                    <button
                      onClick={() => remove(property.id)}
                      className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remover
                    </button>
                    <a
                      href={`/imoveis/${property.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700"
                    >
                      Ver página ↗
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button
            onClick={() => { setForm(emptyProperty); setEditingId(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-700"
          >
            <Plus className="h-4 w-4" /> Adicionar imóvel
          </button>
        </section>
      </div>
    </main>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function LoginScreen({
  username, password, message, onUsername, onPassword, onSubmit,
}: {
  username: string; password: string; message: string;
  onUsername: (v: string) => void; onPassword: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-5">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[.2em] text-amber-600">Rafael Brandão Imóveis</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Área administrativa</h1>
        <p className="mt-3 text-slate-600">Acesse para publicar e atualizar os imóveis do site.</p>
        <Field label="Usuário" value={username} onChange={onUsername} required />
        <Field label="Senha" value={password} onChange={onPassword} type="password" required />
        {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
        <button className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white">Entrar</button>
        <a href="/" className="mt-5 block text-center text-sm text-slate-500">Voltar para o site</a>
      </form>
    </main>
  );
}

function Field({
  label, value, onChange, className = "", ...props
}: {
  label: string; value: string | number; onChange: (v: string) => void;
  className?: string; type?: string; min?: string; required?: boolean;
}) {
  return (
    <label className={`mt-4 block ${className}`}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-amber-600"
      />
    </label>
  );
}

function Select({
  label, value, options, onChange,
}: {
  label: string; value: string; options: readonly string[]; onChange: (v: string) => void;
}) {
  return (
    <label>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-amber-600"
      >
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}
