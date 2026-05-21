import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/jwt";
import { blacklistToken } from "@/lib/tokenBlacklist";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    blacklistToken(authHeader.slice(7));
  }
  const cookie = request.cookies.get("auth_token")?.value;
  if (cookie) {
    blacklistToken(cookie);
  }
  const response = NextResponse.json({ success: true, message: "Signed out" });
  response.headers.set("Set-Cookie", clearAuthCookie());
  return response;
}
