import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/constants";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (!password || password !== process.env.PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
