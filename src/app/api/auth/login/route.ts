import { adminCookie, isValidLogin } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (!isValidLogin(username, password)) return Response.json({ error: "Usuário ou senha inválidos." }, { status: 401 });
  const response = Response.json({ ok: true });
  response.headers.append("Set-Cookie", `${adminCookie}=authenticated; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200`);
  return response;
}
