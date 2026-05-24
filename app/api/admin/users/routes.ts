import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/jwt";
import { findUserById, getAllUsers } from "@/lib/users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { findUserByEmail } from "@/lib/users";

async function getRequestingUser(request: NextRequest) {
    const payload = await getTokenFromRequest(request);
    if (payload) return findUserById(payload.sub);
    const session = await getServerSession(authOptions);
    if (session?.user?.email) return findUserByEmail(session.user.email);
    return null;
}

export async function GET(request: NextRequest) {
    const requester = await getRequestingUser(request);
    if (!requester || requester.role !== "superadmin") {
        return NextResponse.json(
            { success: false, error: "Forbidden" },
            { status: 403 },
        );
    }
    const users = await getAllUsers();
    return NextResponse.json({ success: true, data: users });
}
