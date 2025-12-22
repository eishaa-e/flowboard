import { connectDB } from "@/lib/db";
import { Board } from "@/models/Board";
import { Task } from "@/models/Task";
import { getAuthSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { TaskBoard } from "@/components/board/task-board"; // Client Component

// This is a Server Component
interface BoardPageProps {
    params: Promise<{
        boardId: string;
    }>;
}

export default async function BoardPage(props: BoardPageProps) {
    const params = await props.params;
    await connectDB();
    const session = await getAuthSession();

    if (!session) {
        redirect("/login");
    }

    const board = await Board.findById(params.boardId);

    if (!board) {
        notFound();
    }

    // Fetch tasks initially on server
    const tasks = await Task.find({ boardId: board._id }).sort({ position: 1 });

    // Serializable data
    const initialTasks = JSON.parse(JSON.stringify(tasks));
    const boardData = JSON.parse(JSON.stringify(board));

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b">
                <h1 className="text-2xl font-bold">{board.title}</h1>
            </div>
            <div className="flex-1 overflow-x-auto p-4">
                <TaskBoard board={boardData} initialTasks={initialTasks} />
            </div>
        </div>
    );
}
