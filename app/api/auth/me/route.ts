import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
    try {
        await connectDB();
        const session = await getAuthSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(session.userId).select("-passwordHash");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Get user error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
