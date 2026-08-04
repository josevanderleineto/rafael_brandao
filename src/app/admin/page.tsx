"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Check, LogOut, Pencil, Play, Plus, Trash2, Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { propertyBadges, propertyTypes, type Property } from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormProperty = Omit<Property, "id" | "price" | "description" | "photos" | "videoUrl"> & {
  description: string;
  photos: string[];   // URLs finais (pós-upload)
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

// ─── Upload helper ────────────────────────────────────────────────────────────

async function uploadFile(file: File): Promise<{ url: string; type: string }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? "Erro ao fazer upload.");
  }
  return res.json() as Promise<{ url: string; type: string }>;
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("rafaelbrandao");
  const [password, setPassword] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState<FormProperty>(emptyProperty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState<"ok" | "err">("ok");

  // Upload states
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

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

  function removePhoto(index: number) {
    change("photos", form.photos.filter((_, i) => i !== index));
  }

  // ── Save ──────────────────────────────────────────────────────────────────

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

  async function remove(id: number) {
    if (!window.confirm("Remover este imóvel do site?")) return;
    const response = await fetch(`/api/properties/${id}`, { method: "DELETE" });
    if (!response.ok) return notify("Não foi possível remover.", "err");
    await loadProperties();
    notify("Imóvel removido.");
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false);
    setPassword("");
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
            <a href="/" target="_blank" className="text-sm font-semibold text-slate-700">Ver site ↗</a>
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
    </main>
  );
}

// ─── ImageUploadBox ────────────────────────────────────────────────────────────
// Single image upload with preview and URL fallback

function ImageUploadBox({
  url, uploading, label, onFile, onUrlChange, required,
}: {
  url: string;
  uploading: boolean;
  label: string;
  onFile: (f: File) => void;
  onUrlChange: (v: string) => void;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);

  function pick(file: File) {
    if (!file.type.startsWith("image/")) return;
    onFile(file);
  }

  return (
    <div className="mt-1.5">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) pick(file);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors
          ${dragging ? "border-amber-500 bg-amber-50" : "border-slate-200 bg-slate-50 hover:border-amber-400 hover:bg-amber-50/40"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          required={required && !url}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) pick(file);
          }}
        />

        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-sm font-medium text-amber-600">Enviando…</p>
          </>
        ) : url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="Capa" className="h-32 w-full rounded-lg object-cover" />
            <p className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white">
              Clique para trocar
            </p>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-slate-400" />
            <p className="text-sm font-medium text-slate-600">{label}</p>
            <p className="text-xs text-slate-400">PNG, JPG, WEBP • máx. 10 MB</p>
          </>
        )}
      </div>

      {/* URL fallback toggle */}
      <button
        type="button"
        onClick={() => setShowUrlField((v) => !v)}
        className="mt-1.5 text-xs text-slate-400 underline-offset-2 hover:text-amber-600 hover:underline"
      >
        {showUrlField ? "Ocultar campo de URL" : "Ou cole uma URL de imagem"}
      </button>
      {showUrlField && (
        <input
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://..."
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-amber-600"
        />
      )}
    </div>
  );
}

// ─── MultiImageUpload ─────────────────────────────────────────────────────────
// Multiple image upload with thumbnails grid

function MultiImageUpload({
  photos, uploading, onFiles, onRemove,
}: {
  photos: string[];
  uploading: boolean;
  onFiles: (files: File[]) => void;
  onRemove: (index: number) => void;
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
      {/* Thumbnails */}
      {photos.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((url, i) => (
            <div key={url + i} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="aspect-square w-full rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute right-1 top-1 hidden rounded-full bg-red-600 p-0.5 text-white group-hover:flex"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragging(false);
          pick(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex min-h-[100px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors
          ${dragging ? "border-amber-500 bg-amber-50" : "border-slate-200 bg-slate-50 hover:border-amber-400 hover:bg-amber-50/40"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => pick(e.target.files)}
        />
        {uploading ? (
          <>
            <Loader2 className="h-7 w-7 animate-spin text-amber-500" />
            <p className="text-sm font-medium text-amber-600">Enviando fotos…</p>
          </>
        ) : (
          <>
            <ImageIcon className="h-7 w-7 text-slate-400" />
            <p className="text-sm font-medium text-slate-600">
              {photos.length > 0 ? "Adicionar mais fotos" : "Clique ou arraste fotos da galeria"}
            </p>
            <p className="text-xs text-slate-400">Selecione várias de uma vez • PNG, JPG, WEBP • máx. 10 MB cada</p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── VideoUpload ──────────────────────────────────────────────────────────────
// Upload direto de vídeo com preview HTML5 + fallback de URL YouTube/Vimeo

function VideoUpload({
  url, uploading, onFile, onUrlChange,
}: {
  url: string;
  uploading: boolean;
  onFile: (f: File) => void;
  onUrlChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);

  // Detecta se é URL direta de vídeo (Cloudinary) ou link externo (YouTube/Vimeo)
  const isDirectVideo = url
    ? url.startsWith("https://res.cloudinary.com") || /\.(mp4|webm|mov|avi)(\?|$)/i.test(url)
    : false;

  function pick(file: File) {
    if (!file.type.startsWith("video/")) return;
    onFile(file);
  }

  return (
    <div className="mt-1.5">
      {/* Drop zone / Preview */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) pick(file);
        }}
        onClick={() => !url && inputRef.current?.click()}
        className={`relative flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors
          ${url ? "cursor-default border-slate-200 bg-slate-50" : "cursor-pointer " + (dragging ? "border-amber-500 bg-amber-50" : "border-slate-200 bg-slate-50 hover:border-amber-400 hover:bg-amber-50/40")}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) pick(file);
          }}
        />

        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-sm font-medium text-amber-600">Enviando vídeo…</p>
            <p className="text-xs text-slate-400">Pode demorar alguns segundos</p>
          </>
        ) : url && isDirectVideo ? (
          /* Preview de vídeo direto (Cloudinary) */
          <div className="w-full px-2 pb-2 pt-2">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={url}
              controls
              className="w-full rounded-lg"
              style={{ maxHeight: 220 }}
            />
            <div className="mt-2 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Trocar vídeo
              </button>
              <button
                type="button"
                onClick={() => onUrlChange("")}
                className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
              >
                Remover
              </button>
            </div>
          </div>
        ) : url && !isDirectVideo ? (
          /* Link externo (YouTube/Vimeo) — mostra ícone + texto */
          <div className="flex flex-col items-center gap-2 p-4">
            <Play className="h-10 w-10 text-amber-500" />
            <p className="text-sm font-semibold text-slate-700">Vídeo externo configurado</p>
            <p className="max-w-xs truncate text-xs text-slate-400">{url}</p>
            <button
              type="button"
              onClick={() => onUrlChange("")}
              className="mt-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
            >
              Remover
            </button>
          </div>
        ) : (
          /* Estado vazio */
          <>
            <Upload className="h-8 w-8 text-slate-400" />
            <p className="text-sm font-medium text-slate-600">Clique ou arraste um vídeo</p>
            <p className="text-xs text-slate-400">MP4, MOV, WEBM • máx. 200 MB</p>
          </>
        )}
      </div>

      {/* Fallback: link YouTube / Vimeo */}
      <button
        type="button"
        onClick={() => setShowUrlField((v) => !v)}
        className="mt-1.5 text-xs text-slate-400 underline-offset-2 hover:text-amber-600 hover:underline"
      >
        {showUrlField ? "Ocultar campo de URL" : "Ou cole um link do YouTube / Vimeo"}
      </button>
      {showUrlField && (
        <input
          type="url"
          value={isDirectVideo ? "" : url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-amber-600"
        />
      )}
    </div>
  );
}


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
