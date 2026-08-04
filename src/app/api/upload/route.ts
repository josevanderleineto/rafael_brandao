import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200 MB

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return Response.json(
      { error: "Cloudinary não configurado. Verifique as variáveis de ambiente." },
      { status: 500 }
    );
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return Response.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof Blob)) {
    return Response.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  if (!isImage && !isVideo) {
    return Response.json({ error: "Apenas imagens e vídeos são permitidos." }, { status: 400 });
  }

  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    const limit = isVideo ? "200 MB" : "10 MB";
    return Response.json({ error: `Arquivo muito grande. Máximo ${limit}.` }, { status: 400 });
  }

  // Use "auto" so Cloudinary handles both images and videos with one endpoint
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = "rafael-brandao-imoveis";
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;

  // Generate SHA-1 signature
  const encoder = new TextEncoder();
  const data = encoder.encode(paramsToSign + apiSecret);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  const cloud = new FormData();
  cloud.append("file", file);
  cloud.append("api_key", apiKey);
  cloud.append("timestamp", timestamp);
  cloud.append("signature", signature);
  cloud.append("folder", folder);

  const response = await fetch(uploadUrl, { method: "POST", body: cloud });

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { error?: { message?: string } };
    return Response.json(
      { error: err?.error?.message ?? "Erro ao fazer upload para Cloudinary." },
      { status: 502 }
    );
  }

  const result = await response.json() as { secure_url: string; resource_type: string };
  return Response.json({ url: result.secure_url, type: result.resource_type });
}
