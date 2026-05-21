import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, JWTPayload } from "@/lib/jwt";

type Handler = (req: NextRequest, ctx: { params: Record<string, string>; user: JWTPayload }) => Promise<NextResponse>;

/** Wraps a route handler and injects the authenticated user, or returns 401. */
export function withAuth(handler: Handler) {
  return async (req: NextRequest, ctx: { params: Record<string, string> }) => {
    const user = await getTokenFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized — please sign in" }, { status: 401 });
    }
    return handler(req, { ...ctx, user });
  };
}
