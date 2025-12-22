import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Workspace } from "@/models/Workspace";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getAuthSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, description } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const workspace = await Workspace.create({
            name,
            description,
            owner: session.userId,
        });

        return NextResponse.json(workspace, { status: 201 });
    } catch (error) {
        console.error("Create workspace error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const session = await getAuthSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const workspaces = await Workspace.find({ owner: session.userId }).sort({ createdAt: -1 });

        return NextResponse.json(workspaces);
    } catch (error) {
        console.error("Get workspaces error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
