import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/auth/login?error=invalid", request.url));
    }

    const magicToken = await db.magicLinkToken.findUnique({ where: { token } });

    if (!magicToken) {
      return NextResponse.redirect(new URL("/auth/login?error=invalid", request.url));
    }

    if (new Date() > magicToken.expiresAt) {
      await db.magicLinkToken.delete({ where: { id: magicToken.id } });
      return NextResponse.redirect(new URL("/auth/login?error=expired", request.url));
    }

    const email = magicToken.email;

    await db.magicLinkToken.delete({ where: { id: magicToken.id } });

    let user = await db.user.findUnique({ where: { email } });
    if (!user) {
      user = await db.user.create({
        data: { email, role: "CUSTOMER" },
      });
    }

    const jwtToken = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const headers = setAuthCookie(jwtToken);
    return NextResponse.redirect(new URL("/", request.url), { headers });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.redirect(new URL("/auth/login?error=failed", request.url));
  }
}
