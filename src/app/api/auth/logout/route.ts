import { adminCookie } from "@/lib/auth";

export async function POST() {
  const response = Response.json({ ok: true });
  response.headers.append("Set-Cookie", `${adminCookie}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
  return response;
}
