import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Task } from "@/models/Task";
import { getAuthSession } from "@/lib/auth";

interface RouteParams {
    params: Promise<{
        taskId: string;
    }>;
}

export async function PUT(req: Request, { params }: RouteParams) {
    try {
        const { taskId } = await params;
        await connectDB();
        const session = await getAuthSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, description } = await req.json();

        // Check if task exists
        const task = await Task.findById(taskId);

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        task.title = title || task.title;
        task.description = description === undefined ? task.description : description;
        await task.save();

        return NextResponse.json(task);
    } catch (error) {
        console.error("Update task error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: RouteParams) {
    try {
        const { taskId } = await params;
        await connectDB();
        const session = await getAuthSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        await Task.deleteOne({ _id: task._id });

        return NextResponse.json({ message: "Task deleted" });
    } catch (error) {
        console.error("Delete task error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
