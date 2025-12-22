import { connectDB } from "@/lib/db";
import { Workspace } from "@/models/Workspace";
import { getAuthSession } from "@/lib/auth";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { WorkspaceActions } from "@/components/workspace/workspace-actions";

// Server Component
export default async function WorkspacePage() {
    await connectDB();
    const session = await getAuthSession();

    if (!session) {
        redirect("/login");
    }

    // Fetch data directly on the server
    const workspaces = await Workspace.find({ owner: session.userId }).sort({ createdAt: -1 });

    return (
        <div className="flex flex-col gap-8 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
                    <p className="text-muted-foreground">
                        Manage your workspaces and boards.
                    </p>
                </div>
                <CreateWorkspaceDialog />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {workspaces.map((workspace) => (
                    <Card key={workspace._id.toString()}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-semibold">{workspace.name}</CardTitle>
                            <WorkspaceActions workspace={JSON.parse(JSON.stringify(workspace))} />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground truncate">
                                {workspace.description || "No description"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Created {format(new Date(workspace.createdAt), "PPP")}
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" asChild>
                                <Link href={`/workspace/${workspace._id.toString()}`}>View Boards</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {workspaces.length === 0 && (
                    <div className="col-span-full flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
                        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                            <h3 className="mt-4 text-lg font-semibold">No workspaces created</h3>
                            <p className="mb-4 mt-2 text-sm text-muted-foreground">
                                You haven&apos;t created any workspaces yet. Create one to get started.
                            </p>
                            <CreateWorkspaceDialog />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
