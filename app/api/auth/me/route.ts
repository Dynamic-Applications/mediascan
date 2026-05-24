import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/jwt";
import { findUserByEmail, findUserById } from "@/lib/users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request: NextRequest) {
    // check custom JWT first
    const payload = await getTokenFromRequest(request);
    if (payload) {
        const user = await findUserById(payload.sub);
        if (user) {
            return NextResponse.json({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatarUrl: user.avatarUrl,
                    createdAt: user.createdAt,
                },
            });
        }
    }

    // fall back to NextAuth session (Google)
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
        const user = await findUserByEmail(session.user.email);
        if (user) {
            return NextResponse.json({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatarUrl:
                        user.avatarUrl ?? session.user.image ?? undefined,
                    createdAt: user.createdAt,
                },
            });
        }
    }

    return NextResponse.json({ success: false }, { status: 401 });
}
