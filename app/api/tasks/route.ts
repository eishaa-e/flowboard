import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Task } from "@/models/Task";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getAuthSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, boardId, status } = await req.json();

        if (!title || !boardId) {
            return NextResponse.json({ error: "Title and Board ID are required" }, { status: 400 });
        }

        const task = await Task.create({
            title,
            boardId,
            status: status || "todo",
            position: 0,
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error("Create task error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
