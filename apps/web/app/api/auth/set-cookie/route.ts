import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const headers = setAuthCookie(token);
    return NextResponse.json({ ok: true }, { headers });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
