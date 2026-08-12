"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  Check, ChevronDown, ChevronUp, Globe, LogOut, Pencil, Play,
  Plus, Trash2, Upload, X, ImageIcon, Loader2
} from "lucide-react";
import { propertyBadges, propertyTypes, type Property } from "@/lib/data";
import { defaultSiteContent, type SiteContent } from "@/lib/site-content-defaults";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormProperty = Omit<Property, "id" | "price" | "description" | "photos" | "videoUrl"> & {
  description: string;
  photos: string[];
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
  photos: [],
  videoUrl: "",
};

// ─── Cloudinary deletion helper ───────────────────────────────────────────────

async function deleteCloudinaryUrls(urls: string[]) {
  const cloudinaryUrls = urls.filter((u) => u.startsWith("https://res.cloudinary.com"));
  if (!cloudinaryUrls.length) return;
  try {
    await fetch("/api/cloudinary-delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls: cloudinaryUrls }),
    });
  } catch {
    // non-critical
  }
}

// ─── Upload helper ────────────────────────────────────────────────────────────

async function uploadFile(file: File): Promise<{ url: string; type: string }> {
  // 1. Get signed credentials from Next.js server API
  const sigRes = await fetch("/api/upload", { method: "GET" });
  if (!sigRes.ok) {
    // If GET fails, try server POST fallback for smaller files
    const fdFallback = new FormData();
    fdFallback.append("file", file);
    const resFallback = await fetch("/api/upload", { method: "POST", body: fdFallback });
    if (!resFallback.ok) {
      const err = await resFallback.json().catch(() => ({})) as { error?: string };
      throw new Error(err.error ?? "Erro ao obter autorização de upload.");
    }
    return resFallback.json() as Promise<{ url: string; type: string }>;
  }

  const { uploadUrl, apiKey, timestamp, signature, folder } = (await sigRes.json()) as {
    uploadUrl: string;
    apiKey: string;
    timestamp: string;
    signature: string;
    folder: string;
  };

  // 2. Upload file directly from browser to Cloudinary (bypasses Vercel 4.5MB limit)
  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", apiKey);
  fd.append("timestamp", timestamp);
  fd.append("signature", signature);
  fd.append("folder", folder);

  const res = await fetch(uploadUrl, { method: "POST", body: fd });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(err?.error?.message ?? "Erro ao fazer upload para o Cloudinary.");
  }

  const result = (await res.json()) as { secure_url: string; resource_type: string };
  return { url: result.secure_url, type: result.resource_type };
}

// ─── Main Page ───────────────────────────────────────────────────────────────

type AdminTab = "imoveis" | "site";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("rafaelbrandao");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("imoveis");

  // Properties state
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState<FormProperty>(emptyProperty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState<"ok" | "err">("ok");

  // Upload states
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Site content state
  const [siteContent, setSiteContent] = useState<SiteContent>({ ...defaultSiteContent });
  const [siteMsg, setSiteMsg] = useState("");
  const [siteMsgType, setSiteMsgType] = useState<"ok" | "err">("ok");
  const [savingSite, setSavingSite] = useState(false);

  async function loadProperties() {
    const response = await fetch("/api/properties");
    if (response.ok) setProperties(await response.json());
  }

  async function loadSiteContent() {
    const res = await fetch("/api/site-content");
    if (res.ok) setSiteContent(await res.json());
  }

  useEffect(() => { void loadProperties(); void loadSiteContent(); }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) return notify("Usuário ou senha inválidos.", "err");
    setAuthenticated(true);
    setMessage("");
  }

  function notify(msg: string, type: "ok" | "err" = "ok") {
    setMessage(msg);
    setMsgType(type);
  }

  function change<K extends keyof FormProperty>(key: K, value: FormProperty[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  // ── Cover image upload ─────────────────────────────────────────────────────

  async function handleCoverFile(file: File) {
    setUploadingCover(true);
    try {
      const { url } = await uploadFile(file);
      change("image", url);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Erro ao enviar capa.", "err");
    } finally {
      setUploadingCover(false);
    }
  }

  // ── Additional photos upload ───────────────────────────────────────────────

  async function handleAdditionalFiles(files: File[]) {
    if (!files.length) return;
    setUploadingPhotos(true);
    try {
      const results = await Promise.all(files.map(uploadFile));
      change("photos", [...form.photos, ...results.map((r) => r.url)]);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Erro ao enviar fotos.", "err");
    } finally {
      setUploadingPhotos(false);
    }
  }

  // ── Video upload ───────────────────────────────────────────────────────────

  async function handleVideoFile(file: File) {
    setUploadingVideo(true);
    try {
      const { url } = await uploadFile(file);
      change("videoUrl", url);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Erro ao enviar vídeo.", "err");
    } finally {
      setUploadingVideo(false);
    }
  }

  // ── Remove photo (delete from Cloudinary too) ─────────────────────────────

  async function removePhoto(index: number) {
    const url = form.photos[index];
    change("photos", form.photos.filter((_, i) => i !== index));
    void deleteCloudinaryUrls([url]);
  }

  // ── Remove video (delete from Cloudinary too) ─────────────────────────────

  async function removeVideo() {
    const url = form.videoUrl;
    change("videoUrl", "");
    void deleteCloudinaryUrls([url]);
  }

  // ── Save property ─────────────────────────────────────────────────────────

  async function save(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const response = await fetch(
      editingId ? `/api/properties/${editingId}` : "/api/properties",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );
    const result = await response.json().catch(() => null);
    if (!response.ok) return notify(result?.error || "Não foi possível salvar.", "err");
    await loadProperties();
    setForm(emptyProperty);
    setEditingId(null);
    notify("Imóvel salvo com sucesso.");
  }

  // ── Remove property (also deletes Cloudinary assets via server) ───────────

  async function remove(id: number) {
    if (!window.confirm("Remover este imóvel do site? As fotos e vídeos também serão apagados do Cloudinary.")) return;
    const response = await fetch(`/api/properties/${id}`, { method: "DELETE" });
    if (!response.ok) return notify("Não foi possível remover.", "err");
    await loadProperties();
    notify("Imóvel e mídias removidos.");
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
      photos: property.photos ?? [],
      videoUrl: property.videoUrl ?? "",
    });
    setMessage("");
    setActiveTab("imoveis");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false);
    setPassword("");
  }

  // ── Site content save ─────────────────────────────────────────────────────

  async function saveSiteContent() {
    setSavingSite(true);
    setSiteMsg("");
    try {
      const res = await fetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: siteContent }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        setSiteMsg(err.error ?? "Erro ao salvar.");
        setSiteMsgType("err");
      } else {
        setSiteMsg("Conteúdo salvo! As alterações já aparecem no site.");
        setSiteMsgType("ok");
      }
    } catch {
      setSiteMsg("Erro de conexão.");
      setSiteMsgType("err");
    } finally {
      setSavingSite(false);
    }
  }

  function sc(key: string): string {
    return siteContent[key] ?? defaultSiteContent[key] ?? "";
  }

  function setSC(key: string, value: string) {
    setSiteContent((prev) => ({ ...prev, [key]: value }));
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

  const uploading = uploadingCover || uploadingPhotos || uploadingVideo;

  return (
    <main className="min-h-screen bg-slate-100 pb-16">
      {/* Header */}
      <header className="bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-400">Painel de gestão</p>
            <h1 className="text-xl font-bold">Rafael Brandão Imóveis</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-sm font-semibold text-slate-300 hover:text-white">
              Ver site ↗
            </a>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-7xl px-5 flex gap-1 border-t border-white/10">
          <button
            onClick={() => setActiveTab("imoveis")}
            className={`px-5 py-3 text-sm font-semibold transition-colors ${activeTab === "imoveis" ? "border-b-2 border-amber-400 text-amber-400" : "text-slate-400 hover:text-white"}`}
          >
            Imóveis
          </button>
          <button
            onClick={() => setActiveTab("site")}
            className={`px-5 py-3 text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === "site" ? "border-b-2 border-amber-400 text-amber-400" : "text-slate-400 hover:text-white"}`}
          >
            <Globe className="h-4 w-4" /> Conteúdo do Site
          </button>
        </div>
      </header>

      {/* ── Tab: Imóveis ────────────────────────────────────────────────── */}
      {activeTab === "imoveis" && (
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

              {/* Imagem de capa */}
              <div className="sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">Foto de capa</span>
                <ImageUploadBox
                  url={form.image}
                  uploading={uploadingCover}
                  label="Clique ou arraste a foto de capa"
                  onFile={handleCoverFile}
                  onUrlChange={(v) => change("image", v)}
                  required
                />
              </div>

              {/* Fotos adicionais */}
              <div className="sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">Fotos adicionais da galeria</span>
                <MultiImageUpload
                  photos={form.photos}
                  uploading={uploadingPhotos}
                  onFiles={handleAdditionalFiles}
                  onRemove={removePhoto}
                />
              </div>

              {/* Vídeo */}
              <div className="sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">Vídeo do imóvel</span>
                <VideoUpload
                  url={form.videoUrl}
                  uploading={uploadingVideo}
                  onFile={handleVideoFile}
                  onUrlChange={(v) => change("videoUrl", v)}
                  onRemove={removeVideo}
                />
              </div>

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
                <p className={`sm:col-span-2 text-sm font-medium ${msgType === "err" ? "text-red-600" : "text-emerald-700"}`}>
                  {message}
                </p>
              )}

              <button
                disabled={uploading}
                className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-3.5 font-semibold text-white hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {uploading ? "Enviando fotos…" : editingId ? "Salvar alterações" : "Publicar imóvel"}
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
            </div>

            <div className="space-y-3">
              {properties.map((property) => (
                <article key={property.id} className="flex gap-4 rounded-xl bg-white p-4 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
      )}

      {/* ── Tab: Conteúdo do Site ───────────────────────────────────────── */}
      {activeTab === "site" && (
        <div className="mx-auto max-w-4xl px-5 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">Editor</p>
              <h2 className="text-2xl font-bold text-slate-900">Conteúdo do Site</h2>
            </div>
            <button
              onClick={saveSiteContent}
              disabled={savingSite}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {savingSite ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {savingSite ? "Salvando…" : "Salvar alterações"}
            </button>
          </div>

          {siteMsg && (
            <p className={`text-sm font-medium ${siteMsgType === "err" ? "text-red-600" : "text-emerald-700"}`}>
              {siteMsg}
            </p>
          )}

          {/* ── Hero ── */}
          <ContentSection title="Seção Início (Hero)" defaultOpen>
            <SiteField label="Eyebrow (texto acima do título)" value={sc("hero.eyebrow")} onChange={(v) => setSC("hero.eyebrow", v)} />
            <SiteField label="Título principal" value={sc("hero.title")} onChange={(v) => setSC("hero.title", v)} />
            <SiteField label="Palavra em destaque (dourado)" value={sc("hero.titleHighlight")} onChange={(v) => setSC("hero.titleHighlight", v)} hint="Deve aparecer exatamente como está no título acima" />
            <SiteField label="Subtítulo" value={sc("hero.subtitle")} onChange={(v) => setSC("hero.subtitle", v)} multiline />
            <SiteField label="Texto do botão principal" value={sc("hero.cta1")} onChange={(v) => setSC("hero.cta1", v)} />
            <SiteField label="Texto do botão secundário" value={sc("hero.cta2")} onChange={(v) => setSC("hero.cta2", v)} />
            <SiteField label="Tag 1" value={sc("hero.tag1")} onChange={(v) => setSC("hero.tag1", v)} />
            <SiteField label="Tag 2" value={sc("hero.tag2")} onChange={(v) => setSC("hero.tag2", v)} />
            <SiteField label="Tag 3" value={sc("hero.tag3")} onChange={(v) => setSC("hero.tag3", v)} />
            <SiteField label="Tag 4" value={sc("hero.tag4")} onChange={(v) => setSC("hero.tag4", v)} />
            <div>
              <span className="text-sm font-medium text-slate-700">Imagem de fundo</span>
              <SiteMediaUpload
                currentUrl={sc("hero.bgImage")}
                accept="image/*"
                label="Clique para trocar a imagem de fundo"
                onUrl={(v) => setSC("hero.bgImage", v)}
                onRemove={() => setSC("hero.bgImage", defaultSiteContent["hero.bgImage"] ?? "")}
              />
            </div>
          </ContentSection>

          {/* ── Sobre ── */}
          <ContentSection title="Seção Sobre">
            <SiteField label="Eyebrow" value={sc("about.eyebrow")} onChange={(v) => setSC("about.eyebrow", v)} />
            <SiteField label="Título" value={sc("about.title")} onChange={(v) => setSC("about.title", v)} />
            <SiteField label="Parágrafo 1" value={sc("about.paragraph1")} onChange={(v) => setSC("about.paragraph1", v)} multiline />
            <SiteField label="Parágrafo 2" value={sc("about.paragraph2")} onChange={(v) => setSC("about.paragraph2", v)} multiline />
            <SiteField label="CRECI" value={sc("about.creci")} onChange={(v) => setSC("about.creci", v)} />
            <SiteField label="CNAI" value={sc("about.cnai")} onChange={(v) => setSC("about.cnai", v)} />
            <SiteField label="Região de atuação" value={sc("about.cnaiRegion")} onChange={(v) => setSC("about.cnaiRegion", v)} />
            <div className="grid grid-cols-2 gap-4">
              <SiteField label="Stat 1 — Valor" value={sc("about.stat1.value")} onChange={(v) => setSC("about.stat1.value", v)} />
              <SiteField label="Stat 1 — Rótulo" value={sc("about.stat1.label")} onChange={(v) => setSC("about.stat1.label", v)} />
              <SiteField label="Stat 2 — Valor" value={sc("about.stat2.value")} onChange={(v) => setSC("about.stat2.value", v)} />
              <SiteField label="Stat 2 — Rótulo" value={sc("about.stat2.label")} onChange={(v) => setSC("about.stat2.label", v)} />
            </div>
            <div>
              <span className="text-sm font-medium text-slate-700">Foto do corretor</span>
              <SiteMediaUpload
                currentUrl={sc("about.photo")}
                accept="image/*"
                label="Trocar foto do corretor"
                onUrl={(v) => setSC("about.photo", v)}
                onRemove={() => setSC("about.photo", "/rafael-brandao.jpg")}
                previousUrl={siteContent["about.photo"]}
              />
            </div>
          </ContentSection>

          {/* ── Serviços ── */}
          <ContentSection title="Seção Serviços">
            <SiteField label="Eyebrow" value={sc("services.eyebrow")} onChange={(v) => setSC("services.eyebrow", v)} />
            <SiteField label="Título" value={sc("services.title")} onChange={(v) => setSC("services.title", v)} />
            <SiteField label="Palavra em destaque" value={sc("services.titleHighlight")} onChange={(v) => setSC("services.titleHighlight", v)} hint="Deve aparecer exatamente como está no título acima" />
            <SiteField label="Subtítulo" value={sc("services.subtitle")} onChange={(v) => setSC("services.subtitle", v)} multiline />
            <div className="border-t pt-4 grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="rounded-lg border border-slate-200 p-3">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-600">Card {n}</p>
                  <SiteField label="Título" value={sc(`services.card${n}.title`)} onChange={(v) => setSC(`services.card${n}.title`, v)} />
                  <SiteField label="Descrição" value={sc(`services.card${n}.text`)} onChange={(v) => setSC(`services.card${n}.text`, v)} multiline />
                </div>
              ))}
            </div>

            {/* Video section */}
            <div className="border-t pt-5">
              <p className="mb-1 text-sm font-semibold text-slate-800">Vídeo institucional</p>
              <p className="mb-4 text-xs text-slate-400">Opcional — aparece abaixo dos cards de serviços. Pode ser um vídeo do Cloudinary, YouTube ou Vimeo.</p>
              <SiteField label="Título do vídeo" value={sc("services.video.title")} onChange={(v) => setSC("services.video.title", v)} />
              <SiteField label="Subtítulo do vídeo" value={sc("services.video.subtitle")} onChange={(v) => setSC("services.video.subtitle", v)} />
              <div className="mt-3">
                <span className="text-sm font-medium text-slate-700">Vídeo</span>
                <SiteMediaUpload
                  currentUrl={sc("services.video")}
                  accept="video/*"
                  label="Adicionar vídeo institucional"
                  isVideo
                  onUrl={(v) => setSC("services.video", v)}
                  onRemove={() => setSC("services.video", "")}
                  previousUrl={siteContent["services.video"]}
                  allowUrlInput
                  urlPlaceholder="Cole um link do YouTube ou Vimeo"
                />
              </div>
            </div>
          </ContentSection>

          {/* ── Rodapé ── */}
          <ContentSection title="Rodapé">
            <SiteField label="Texto de copyright" value={sc("footer.copyright")} onChange={(v) => setSC("footer.copyright", v)} />
            <SiteField label="URL do Instagram" value={sc("footer.instagram")} onChange={(v) => setSC("footer.instagram", v)} type="url" />
            <SiteField label="URL do LinkedIn" value={sc("footer.linkedin")} onChange={(v) => setSC("footer.linkedin", v)} type="url" />
          </ContentSection>

          <div className="pt-2 flex justify-end">
            <button
              onClick={saveSiteContent}
              disabled={savingSite}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-8 py-3 font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {savingSite ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {savingSite ? "Salvando…" : "Salvar todas as alterações"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// ─── ContentSection (collapsible) ─────────────────────────────────────────────

function ContentSection({
  title, children, defaultOpen = false,
}: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>
      {open && <div className="border-t border-slate-100 px-6 py-5 space-y-4">{children}</div>}
    </div>
  );
}

// ─── SiteField ────────────────────────────────────────────────────────────────

function SiteField({
  label, value, onChange, multiline = false, hint, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; hint?: string; type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {hint && <span className="ml-2 text-xs text-slate-400">({hint})</span>}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-amber-600"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-amber-600"
        />
      )}
    </label>
  );
}

// ─── SiteMediaUpload ──────────────────────────────────────────────────────────

function SiteMediaUpload({
  currentUrl, accept, label, isVideo = false, onUrl, onRemove, previousUrl, allowUrlInput, urlPlaceholder,
}: {
  currentUrl: string;
  accept: string;
  label: string;
  isVideo?: boolean;
  onUrl: (v: string) => void;
  onRemove: () => void;
  previousUrl?: string;
  allowUrlInput?: boolean;
  urlPlaceholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const isDirectVideo = isVideo && currentUrl &&
    (currentUrl.startsWith("https://res.cloudinary.com") || /\.(mp4|webm|mov)(\?|$)/i.test(currentUrl));
  const isExternalVideo = isVideo && currentUrl && !isDirectVideo;
  const isImage = !isVideo && currentUrl;

  async function handleFile(file: File) {
    setUploading(true);
    try {
      // If replacing, delete old one from Cloudinary
      if (previousUrl && previousUrl.startsWith("https://res.cloudinary.com")) {
        void deleteCloudinaryUrls([previousUrl]);
      }
      const { url } = await uploadFile(file);
      onUrl(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao enviar arquivo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mt-1.5 space-y-2">
      {/* Preview */}
      {currentUrl && (
        <div className="relative rounded-xl overflow-hidden border border-slate-200">
          {isImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentUrl} alt="" className="max-h-48 w-full object-cover" />
          )}
          {isDirectVideo && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video src={currentUrl} controls className="w-full max-h-48 rounded-xl" />
          )}
          {isExternalVideo && (
            <div className="flex items-center gap-3 p-4 bg-slate-50">
              <Play className="h-8 w-8 text-amber-500 shrink-0" />
              <p className="text-sm text-slate-600 truncate">{currentUrl}</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              if (previousUrl && previousUrl.startsWith("https://res.cloudinary.com")) {
                void deleteCloudinaryUrls([previousUrl]);
              }
              onRemove();
            }}
            className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white"
          >
            <X className="h-3 w-3" /> Remover
          </button>
        </div>
      )}

      {/* Upload button */}
      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-5 hover:border-amber-400 hover:bg-amber-50/40 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f); }}
        />
        {uploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
        ) : (
          <Upload className="h-6 w-6 text-slate-400" />
        )}
        <p className="text-sm font-medium text-slate-600">
          {uploading ? "Enviando…" : currentUrl ? "Clique para trocar" : label}
        </p>
      </div>

      {/* URL input (for videos: YouTube/Vimeo) */}
      {allowUrlInput && (
        <>
          <button
            type="button"
            onClick={() => setShowUrlInput((v) => !v)}
            className="text-xs text-slate-400 hover:text-amber-600 underline-offset-2 hover:underline"
          >
            {showUrlInput ? "Ocultar campo de URL" : "Ou cole um link do YouTube / Vimeo"}
          </button>
          {showUrlInput && (
            <input
              type="url"
              value={currentUrl}
              onChange={(e) => onUrl(e.target.value)}
              placeholder={urlPlaceholder ?? "https://..."}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-amber-600"
            />
          )}
        </>
      )}
    </div>
  );
}

// ─── ImageUploadBox ───────────────────────────────────────────────────────────

function ImageUploadBox({
  url, uploading, label, onFile, onUrlChange, required,
}: {
  url: string; uploading: boolean; label: string;
  onFile: (f: File) => void; onUrlChange: (v: string) => void; required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);

  function pick(file: File) { if (!file.type.startsWith("image/")) return; onFile(file); }

  return (
    <div className="mt-1.5">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const file = e.dataTransfer.files[0]; if (file) pick(file); }}
        onClick={() => inputRef.current?.click()}
        className={`relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors
          ${dragging ? "border-amber-500 bg-amber-50" : "border-slate-200 bg-slate-50 hover:border-amber-400 hover:bg-amber-50/40"}`}
      >
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" required={required && !url}
          onChange={(e) => { const file = e.target.files?.[0]; if (file) pick(file); }} />
        {uploading ? (
          <><Loader2 className="h-8 w-8 animate-spin text-amber-500" /><p className="text-sm font-medium text-amber-600">Enviando…</p></>
        ) : url ? (
          <><img src={url} alt="Capa" className="h-32 w-full rounded-lg object-cover" />{/* eslint-disable-line @next/next/no-img-element */}
            <p className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white">Clique para trocar</p></>
        ) : (
          <><Upload className="h-8 w-8 text-slate-400" /><p className="text-sm font-medium text-slate-600">{label}</p>
            <p className="text-xs text-slate-400">PNG, JPG, WEBP • máx. 10 MB</p></>
        )}
      </div>
      <button type="button" onClick={() => setShowUrlField((v) => !v)}
        className="mt-1.5 text-xs text-slate-400 underline-offset-2 hover:text-amber-600 hover:underline">
        {showUrlField ? "Ocultar campo de URL" : "Ou cole uma URL de imagem"}
      </button>
      {showUrlField && (
        <input type="url" value={url} onChange={(e) => onUrlChange(e.target.value)} placeholder="https://..."
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-amber-600" />
      )}
    </div>
  );
}

// ─── MultiImageUpload ─────────────────────────────────────────────────────────

function MultiImageUpload({
  photos, uploading, onFiles, onRemove,
}: {
  photos: string[]; uploading: boolean;
  onFiles: (files: File[]) => void; onRemove: (index: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function pick(fileList: FileList | null) {
    if (!fileList) return;
    const valid = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (valid.length) onFiles(valid);
  }

  return (
    <div className="mt-1.5">
      {photos.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((url, i) => (
            <div key={url + i} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="aspect-square w-full rounded-lg object-cover" />
              <button type="button" onClick={() => onRemove(i)}
                className="absolute right-1 top-1 hidden rounded-full bg-red-600 p-0.5 text-white group-hover:flex">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`flex min-h-[100px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors
          ${dragging ? "border-amber-500 bg-amber-50" : "border-slate-200 bg-slate-50 hover:border-amber-400 hover:bg-amber-50/40"}`}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => pick(e.target.files)} />
        {uploading ? (
          <><Loader2 className="h-7 w-7 animate-spin text-amber-500" /><p className="text-sm font-medium text-amber-600">Enviando fotos…</p></>
        ) : (
          <><ImageIcon className="h-7 w-7 text-slate-400" />
            <p className="text-sm font-medium text-slate-600">{photos.length > 0 ? "Adicionar mais fotos" : "Clique ou arraste fotos da galeria"}</p>
            <p className="text-xs text-slate-400">Selecione várias de uma vez • PNG, JPG, WEBP • máx. 10 MB cada</p></>
        )}
      </div>
    </div>
  );
}

// ─── VideoUpload ──────────────────────────────────────────────────────────────

function VideoUpload({
  url, uploading, onFile, onUrlChange, onRemove,
}: {
  url: string; uploading: boolean;
  onFile: (f: File) => void; onUrlChange: (v: string) => void; onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);

  const isDirectVideo = url
    ? url.startsWith("https://res.cloudinary.com") || /\.(mp4|webm|mov|avi)(\?|$)/i.test(url)
    : false;

  function pick(file: File) { if (!file.type.startsWith("video/")) return; onFile(file); }

  return (
    <div className="mt-1.5">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const file = e.dataTransfer.files[0]; if (file) pick(file); }}
        onClick={() => !url && inputRef.current?.click()}
        className={`relative flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors
          ${url ? "cursor-default border-slate-200 bg-slate-50" : "cursor-pointer " + (dragging ? "border-amber-500 bg-amber-50" : "border-slate-200 bg-slate-50 hover:border-amber-400 hover:bg-amber-50/40")}`}
      >
        <input ref={inputRef} type="file" accept="video/*" className="sr-only"
          onChange={(e) => { const file = e.target.files?.[0]; if (file) pick(file); }} />
        {uploading ? (
          <><Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-sm font-medium text-amber-600">Enviando vídeo…</p>
            <p className="text-xs text-slate-400">Pode demorar alguns segundos</p></>
        ) : url && isDirectVideo ? (
          <div className="w-full px-2 pb-2 pt-2">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video src={url} controls className="w-full rounded-lg" style={{ maxHeight: 220 }} />
            <div className="mt-2 flex gap-2 justify-end">
              <button type="button" onClick={() => inputRef.current?.click()}
                className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                Trocar vídeo
              </button>
              <button type="button" onClick={onRemove}
                className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100">
                Remover
              </button>
            </div>
          </div>
        ) : url && !isDirectVideo ? (
          <div className="flex flex-col items-center gap-2 p-4">
            <Play className="h-10 w-10 text-amber-500" />
            <p className="text-sm font-semibold text-slate-700">Vídeo externo configurado</p>
            <p className="max-w-xs truncate text-xs text-slate-400">{url}</p>
            <button type="button" onClick={onRemove}
              className="mt-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100">
              Remover
            </button>
          </div>
        ) : (
          <><Upload className="h-8 w-8 text-slate-400" />
            <p className="text-sm font-medium text-slate-600">Clique ou arraste um vídeo</p>
            <p className="text-xs text-slate-400">MP4, MOV, WEBM • máx. 200 MB</p></>
        )}
      </div>
      <button type="button" onClick={() => setShowUrlField((v) => !v)}
        className="mt-1.5 text-xs text-slate-400 underline-offset-2 hover:text-amber-600 hover:underline">
        {showUrlField ? "Ocultar campo de URL" : "Ou cole um link do YouTube / Vimeo"}
      </button>
      {showUrlField && (
        <input type="url" value={isDirectVideo ? "" : url} onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-amber-600" />
      )}
    </div>
  );
}

// ─── LoginScreen ──────────────────────────────────────────────────────────────

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

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  label, value, onChange, className = "", ...props
}: {
  label: string; value: string | number; onChange: (v: string) => void;
  className?: string; type?: string; min?: string; required?: boolean;
}) {
  return (
    <label className={`mt-4 block ${className}`}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input {...props} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-amber-600" />
    </label>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────

function Select({
  label, value, options, onChange,
}: {
  label: string; value: string; options: readonly string[]; onChange: (v: string) => void;
}) {
  return (
    <label>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-amber-600">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}
