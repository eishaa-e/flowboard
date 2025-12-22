import { connectDB } from "@/lib/db";
import { Board } from "@/models/Board";
import { Workspace } from "@/models/Workspace";
import { getAuthSession } from "@/lib/auth";
import { CreateBoardDialog } from "@/components/board/create-board-dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { notFound, redirect } from "next/navigation";
import { BoardActions } from "@/components/board/board-actions";

interface WorkspaceProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

export default async function WorkspaceBoardsPage(props: WorkspaceProps) {
    const params = await props.params;
    await connectDB();
    const session = await getAuthSession();

    if (!session) {
        redirect("/login");
    }

    const workspace = await Workspace.findOne({
        _id: params.workspaceId,
        owner: session.userId,
    });

    if (!workspace) {
        notFound();
    }

    const boards = await Board.find({ workspaceId: workspace._id }).sort({ position: 1 });

    return (
        <div className="flex flex-col gap-8 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{workspace.name}</h1>
                    <p className="text-muted-foreground">
                        {workspace.description || "Manage your boards here."}
                    </p>
                </div>
                <CreateBoardDialog workspaceId={workspace._id.toString()} />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {boards.map((board) => (
                    <Card key={board._id.toString()}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-semibold">{board.title}</CardTitle>
                            <BoardActions board={JSON.parse(JSON.stringify(board))} />
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground mt-2">
                                Created {format(new Date(board.createdAt), "PPP")}
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" asChild>
                                <Link href={`/board/${board._id.toString()}`}>View Tasks</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {boards.length === 0 && (
                    <div className="col-span-full flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
                        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                            <h3 className="mt-4 text-lg font-semibold">No boards created</h3>
                            <p className="mb-4 mt-2 text-sm text-muted-foreground">
                                You haven&apos;t created any boards yet. Create one to get started.
                            </p>
                            <CreateBoardDialog workspaceId={workspace._id.toString()} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
