import { NextResponse } from "next/server";
import { adminCookie, adminCookieOptions } from "@/lib/auth";

export const runtime = "nodejs";

/** Limpa o cookie de sessão com os mesmos atributos usados no login. */
export async function POST() {
  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );

  response.cookies.set(adminCookie, "", {
    ...adminCookieOptions(),
    path: "/",
    maxAge: 0,
  });

  return response;
}