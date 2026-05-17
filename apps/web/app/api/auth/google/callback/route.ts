import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error || !code) {
      return NextResponse.redirect(
        new URL(`/auth/login?error=google`, request.url)
      );
    }

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.ziiy.fun"}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.redirect(
        new URL(`/auth/login?error=google`, request.url)
      );
    }

    // Get user info from Google
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userRes.json();
    if (!googleUser.email) {
      return NextResponse.redirect(
        new URL(`/auth/login?error=google`, request.url)
      );
    }

    // Find or create user
    let user = await db.user.findUnique({
      where: { email: googleUser.email },
    });
    if (!user) {
      user = await db.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || null,
          role: "CUSTOMER",
        },
      });
    }

    // Create JWT and set cookie
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const headers = setAuthCookie(token);
    const redirectUrl = state ? decodeURIComponent(state) : "/";
    return NextResponse.redirect(new URL(redirectUrl, request.url), { headers });
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(
      new URL(`/auth/login?error=google`, request.url)
    );
  }
}
