import "server-only";

import { cookies } from "next/headers";

export const adminCookie = "rb_admin";
const fallbackPassword = "admin2026";
const fallbackUsername = "rafaelbrandao";

export function isValidLogin(username: unknown, password: unknown) {
  return (
    typeof username === "string" &&
    typeof password === "string" &&
    username === (process.env.ADMIN_USERNAME || fallbackUsername) &&
    password === (process.env.ADMIN_PASSWORD || fallbackPassword)
  );
}

export async function isAdmin() {
  return (await cookies()).get(adminCookie)?.value === "authenticated";
}
