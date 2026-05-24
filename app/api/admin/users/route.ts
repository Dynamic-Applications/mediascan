import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/jwt";
import { getAllUsers, findUserById, findUserByEmail } from "@/lib/users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

async function getRequestingUser(request: NextRequest) {
    const payload = await getTokenFromRequest(request);
    console.log("JWT payload:", payload);
    if (payload) {
        const user = await findUserById(payload.sub);
        console.log("User from JWT:", user);
        return user;
    }
    const session = await getServerSession(authOptions);
    console.log("NextAuth session:", session);
    if (session?.user?.email) {
        const user = await findUserByEmail(session.user.email);
        console.log("User from session:", user);
        return user;
    }
    return null;
}

export async function GET(request: NextRequest) {
    const requester = await getRequestingUser(request);
    console.log("Requester:", requester);
    if (!requester || requester.role !== "SuperAdmin") {
        return NextResponse.json(
            { success: false, error: "Forbidden" },
            { status: 403 },
        );
    }
    const users = await getAllUsers();
    return NextResponse.json({ success: true, data: users });
}
