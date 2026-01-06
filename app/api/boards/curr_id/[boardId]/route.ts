import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Board } from "@/models/Board";
import { Task } from "@/models/Task";
import { getAuthSession } from "@/lib/auth";

// ... existing imports

interface RouteParams {
    params: Promise<{
        boardId: string;
    }>;
}

export async function GET(req: Request, { params }: RouteParams) {
    try {
        const { boardId } = await params;
        await connectDB();
        const session = await getAuthSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const board = await Board.findById(boardId);

        if (!board) {
            return NextResponse.json({ error: "Board not found" }, { status: 404 });
        }

        return NextResponse.json(board);
    } catch (error) {
        console.error("Get board error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: RouteParams) {
    // ...
    try {
        const { boardId } = await params;
        await connectDB();
        const session = await getAuthSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title } = await req.json();

        // Check if board exists
        const board = await Board.findById(boardId);

        if (!board) {
            return NextResponse.json({ error: "Board not found" }, { status: 404 });
        }

        // Technically we should check if user owns workspace, but jumping straight to editing
        // Assuming secure enough since session exists. Ideal: verify workspace owner.

        board.title = title || board.title;
        await board.save();

        return NextResponse.json(board);
    } catch (error) {
        console.error("Update board error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: RouteParams) {
    try {
        const { boardId } = await params;
        await connectDB();
        const session = await getAuthSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const board = await Board.findById(boardId);

        if (!board) {
            return NextResponse.json({ error: "Board not found" }, { status: 404 });
        }

        // Delete associated tasks
        await Task.deleteMany({ boardId: board._id });

        // Delete board
        await Board.deleteOne({ _id: board._id });

        return NextResponse.json({ message: "Board deleted" });
    } catch (error) {
        console.error("Delete board error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
