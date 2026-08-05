import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * Extracts the Cloudinary public_id from a secure URL.
 * e.g. https://res.cloudinary.com/{cloud}/image/upload/v123/rafael-brandao-imoveis/abc.jpg
 *   → "rafael-brandao-imoveis/abc"
 */
function extractPublicId(url: string): string | null {
  try {
    const u = new URL(url);
    // pathname: /{cloud}/image/upload/v1234567890/folder/filename.ext
    const parts = u.pathname.split("/");
    // Find "upload" segment index
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    // Everything after upload (skip version segment if present)
    let rest = parts.slice(uploadIndex + 1);
    // Skip version token (starts with "v" followed by digits)
    if (rest[0] && /^v\d+$/.test(rest[0])) rest = rest.slice(1);
    // Join back and strip extension
    const joined = rest.join("/");
    return joined.replace(/\.[^/.]+$/, ""); // remove extension
  } catch {
    return null;
  }
}

function isCloudinaryUrl(url: string): boolean {
  return url.startsWith("https://res.cloudinary.com");
}

function getResourceType(url: string): "image" | "video" {
  return /\.(mp4|webm|mov|avi|mkv)([\?#]|$)/i.test(url) ? "video" : "image";
}

async function deleteOne(
  cloudName: string,
  apiKey: string,
  apiSecret: string,
  url: string
): Promise<boolean> {
  const publicId = extractPublicId(url);
  if (!publicId) return false;

  const resourceType = getResourceType(url);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(paramsToSign + apiSecret);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const signature = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const destroyUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`;
  const body = new URLSearchParams({
    public_id: publicId,
    api_key: apiKey,
    timestamp,
    signature,
  });

  const res = await fetch(destroyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) return false;
  const result = (await res.json()) as { result?: string };
  return result.result === "ok" || result.result === "not found";
}

/**
 * DELETE /api/cloudinary-delete
 * Body: { urls: string[] }
 * Requires admin session.
 */
export async function DELETE(request: Request) {
  if (!(await isAdmin()))
    return Response.json({ error: "Não autorizado." }, { status: 401 });

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return Response.json(
      { error: "Cloudinary não configurado." },
      { status: 500 }
    );
  }

  let urls: string[] = [];
  try {
    const body = (await request.json()) as { urls?: unknown };
    if (Array.isArray(body.urls)) urls = body.urls.filter((u) => typeof u === "string" && isCloudinaryUrl(u));
  } catch {
    return Response.json({ error: "Body inválido." }, { status: 400 });
  }

  if (urls.length === 0) {
    return Response.json({ deleted: 0, errors: 0 });
  }

  const results = await Promise.allSettled(
    urls.map((url) => deleteOne(cloudName, apiKey, apiSecret, url))
  );

  const deleted = results.filter((r) => r.status === "fulfilled" && r.value).length;
  const errors = results.length - deleted;

  return Response.json({ deleted, errors });
}
