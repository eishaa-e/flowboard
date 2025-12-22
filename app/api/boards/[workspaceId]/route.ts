import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Board } from "@/models/Board";
import { getAuthSession } from "@/lib/auth";

export async function GET(req: Request, props: { params: Promise<{ workspaceId: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const session = await getAuthSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { workspaceId } = params;

        const boards = await Board.find({ workspaceId }).sort({ position: 1 });

        return NextResponse.json(boards);
    } catch (error) {
        console.error("Get boards error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
