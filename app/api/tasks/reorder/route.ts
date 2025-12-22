import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Task } from "@/models/Task";
import { getAuthSession } from "@/lib/auth";

export async function PATCH(req: Request) {
    try {
        await connectDB();
        const session = await getAuthSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { items } = await req.json();

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        // Bulk write for performance
        const bulkOps = items.map((task: any) => ({
            updateOne: {
                filter: { _id: task._id },
                update: { $set: { position: task.position, status: task.status } },
            },
        }));

        if (bulkOps.length > 0) {
            await Task.bulkWrite(bulkOps);
        }

        return NextResponse.json({ message: "Tasks reordered successfully" });
    } catch (error) {
        console.error("Reorder tasks error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
