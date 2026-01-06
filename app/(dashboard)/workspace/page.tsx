import { connectDB } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { WorkspaceActions } from "@/components/workspace/workspace-actions";
import { cn } from "@/lib/utils";
import { api } from "@/lib/axios";
import { cookies } from "next/headers";

interface Workspace {
    _id: string;
    name: string;
    description?: string;
    createdAt: string;
    owner: string;
}

// Server Component
export default async function WorkspacePage() {
    await connectDB();
    const session = await getAuthSession();

    if (!session) {
        redirect("/login");
    }

    const cookieStore = await cookies();
    const { data: workspaces } = await api.get<Workspace[]>("/workspaces", {
        headers: {
            Cookie: cookieStore.toString(),
        },
    });

    const pastelColors = [
        "bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20",
        "bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/10 dark:hover:bg-orange-900/20",
        "bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/10 dark:hover:bg-amber-900/20",
        "bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/10 dark:hover:bg-yellow-900/20",
        "bg-lime-50 hover:bg-lime-100 dark:bg-lime-900/10 dark:hover:bg-lime-900/20",
        "bg-green-50 hover:bg-green-100 dark:bg-green-900/10 dark:hover:bg-green-900/20",
        "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/10 dark:hover:bg-emerald-900/20",
        "bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/10 dark:hover:bg-teal-900/20",
        "bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-900/10 dark:hover:bg-cyan-900/20",
        "bg-sky-50 hover:bg-sky-100 dark:bg-sky-900/10 dark:hover:bg-sky-900/20",
        "bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/10 dark:hover:bg-blue-900/20",
        "bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/10 dark:hover:bg-indigo-900/20",
        "bg-violet-50 hover:bg-violet-100 dark:bg-violet-900/10 dark:hover:bg-violet-900/20",
        "bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/10 dark:hover:bg-purple-900/20",
        "bg-fuchsia-50 hover:bg-fuchsia-100 dark:bg-fuchsia-900/10 dark:hover:bg-fuchsia-900/20",
        "bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/10 dark:hover:bg-pink-900/20",
        "bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/10 dark:hover:bg-rose-900/20",
    ];

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
                {workspaces.map((workspace, index) => (
                    <Card key={workspace._id.toString()} className={cn("transition-colors", pastelColors[index % pastelColors.length])}>
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
                            <Button variant="outline" className="bg-white/50 hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/40" asChild>
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
