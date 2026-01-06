import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Workspace } from "@/models/Workspace";
import { Board } from "@/models/Board";
import { Task } from "@/models/Task";
import { getAuthSession } from "@/lib/auth";

// ... existing imports

interface RouteParams {
    params: Promise<{
        workspaceId: string;
    }>;
}

export async function GET(req: Request, { params }: RouteParams) {
    try {
        const { workspaceId } = await params;
        await connectDB();
        const session = await getAuthSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const workspace = await Workspace.findOne({ _id: workspaceId, owner: session.userId });

        if (!workspace) {
            return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
        }

        return NextResponse.json(workspace);
    } catch (error) {
        console.error("Get workspace error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: RouteParams) {
    // ...
    try {
        const { workspaceId } = await params;
        await connectDB();
        const session = await getAuthSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, description } = await req.json();

        const workspace = await Workspace.findOne({ _id: workspaceId, owner: session.userId });

        if (!workspace) {
            return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
        }

        workspace.name = name || workspace.name;
        workspace.description = description === undefined ? workspace.description : description;
        await workspace.save();

        return NextResponse.json(workspace);
    } catch (error) {
        console.error("Update workspace error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: RouteParams) {
    try {
        const { workspaceId } = await params;
        await connectDB();
        const session = await getAuthSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const workspace = await Workspace.findOne({ _id: workspaceId, owner: session.userId });

        if (!workspace) {
            return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
        }

        // Delete associated resources
        // Find all boards
        const boards = await Board.find({ workspaceId: workspace._id });
        const boardIds = boards.map(b => b._id);

        // Delete tasks in those boards
        await Task.deleteMany({ boardId: { $in: boardIds } });

        // Delete boards
        await Board.deleteMany({ workspaceId: workspace._id });

        // Delete workspace
        await Workspace.deleteOne({ _id: workspace._id });

        return NextResponse.json({ message: "Workspace deleted" });
    } catch (error) {
        console.error("Delete workspace error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
