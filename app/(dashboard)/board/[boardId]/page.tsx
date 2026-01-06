import { connectDB } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { TaskBoard } from "@/components/board/task-board"; // Client Component
import { api } from "@/lib/axios";
import { cookies } from "next/headers";

// This is a Server Component
interface BoardPageProps {
    params: Promise<{
        boardId: string;
    }>;
}

interface Board {
    _id: string;
    title: string;
    workspaceId: string;
    position: number;
}

interface Task {
    _id: string;
    title: string;
    description?: string;
    status: "todo" | "inProgress" | "done";
    position: number;
}


export default async function BoardPage(props: BoardPageProps) {
    const params = await props.params;
    await connectDB();
    const session = await getAuthSession();

    if (!session) {
        redirect("/login");
    }

    const cookieStore = await cookies();
    let board: Board;
    let tasks: Task[];

    try {
        const { data: b } = await api.get<Board>(`/boards/curr_id/${params.boardId}`, {
            headers: { Cookie: cookieStore.toString() },
        });
        board = b;

        const { data: t } = await api.get<Task[]>(`/tasks/board/${params.boardId}`, {
            headers: { Cookie: cookieStore.toString() },
        });
        tasks = t;
    } catch (error) {
        return notFound();
    }

    if (!board) {
        notFound();
    }

    // Serializable data (Axios returns plain objects)
    const initialTasks = tasks;
    const boardData = board;

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
