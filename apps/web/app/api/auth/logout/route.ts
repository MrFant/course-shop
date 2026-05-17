import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  const headers = clearAuthCookie();
  // Also clear NextAuth session cookie
  const isProd = process.env.NODE_ENV === "production";
  const cookieFlags = `Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isProd ? "; Secure" : ""}`;
  headers["Set-Cookie"] += `, next-auth.session-token=; ${cookieFlags}`;
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL), { headers });
}
