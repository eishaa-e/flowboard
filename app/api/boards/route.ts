import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Board } from "@/models/Board";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getAuthSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, workspaceId } = await req.json();

        if (!title || !workspaceId) {
            return NextResponse.json({ error: "Title and Workspace ID are required" }, { status: 400 });
        }

        const board = await Board.create({
            title,
            workspaceId,
            position: 0, // Logic to calculate position can be added later
        });

        return NextResponse.json(board, { status: 201 });
    } catch (error) {
        console.error("Create board error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
