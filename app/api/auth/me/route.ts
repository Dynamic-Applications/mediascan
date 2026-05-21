import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/jwt";
import { findUserById } from "@/lib/users";

export async function GET(request: NextRequest) {
    const payload = await getTokenFromRequest(request);
    if (!payload) {
        return NextResponse.json({ success: false }, { status: 401 });
    }
    const user = findUserById(payload.sub);
    if (!user) {
        return NextResponse.json({ success: false }, { status: 401 });
    }
    return NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name },
    });
}
