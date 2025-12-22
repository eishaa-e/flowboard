import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Task } from "@/models/Task";
import { getAuthSession } from "@/lib/auth";

export async function GET(req: Request, props: { params: Promise<{ boardId: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const session = await getAuthSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { boardId } = params;

        const tasks = await Task.find({ boardId }).sort({ position: 1 });

        return NextResponse.json(tasks);
    } catch (error) {
        console.error("Get tasks error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
