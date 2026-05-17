import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";
import { decode } from "next-auth/jwt";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE_NAME = "course-shop-token";

export async function signToken(payload: { userId: string; email: string; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();

  // Check our custom JWT cookie first
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      const user = await db.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, name: true, role: true },
      });
      if (user) return user;
    }
  }

  // Check NextAuth session cookie
  const nextAuthToken = cookieStore.get("next-auth.session-token")?.value
    || cookieStore.get("__Secure-next-auth.session-token")?.value;
  if (nextAuthToken) {
    try {
      const decoded = await decode({
        token: nextAuthToken,
        secret: process.env.NEXTAUTH_SECRET!,
      });
      if (decoded?.email) {
        const user = await db.user.findUnique({
          where: { email: decoded.email as string },
          select: { id: true, email: true, name: true, role: true },
        });
        if (user) return user;
      }
    } catch {
      // Invalid NextAuth token
    }
  }

  return null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") throw new Error("Forbidden");
  return user;
}

export function setAuthCookie(token: string) {
  const isProd = process.env.NODE_ENV === "production";
  const flags = `Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${isProd ? "; Secure" : ""}`;
  return {
    "Set-Cookie": `${COOKIE_NAME}=${token}; ${flags}`,
  };
}

export function clearAuthCookie() {
  return {
    "Set-Cookie": `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  };
}
