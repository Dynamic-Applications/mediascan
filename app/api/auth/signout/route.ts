import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/jwt";
import { blacklistToken } from "@/lib/tokenBlacklist";

export async function POST(request: NextRequest) {
    const cookie = request.cookies.get("auth_token")?.value;
    if (cookie) {
        await blacklistToken(cookie);
    }

    const response = NextResponse.json({
        success: true,
        message: "Signed out",
    });

    // clear custom JWT cookie
    response.headers.set("Set-Cookie", clearAuthCookie());

    // also clear NextAuth cookies
    response.cookies.delete("next-auth.session-token");
    response.cookies.delete("__Secure-next-auth.session-token");
    response.cookies.delete("next-auth.csrf-token");
    response.cookies.delete("__Host-next-auth.csrf-token");
    response.cookies.delete("next-auth.callback-url");

    return response;
}
