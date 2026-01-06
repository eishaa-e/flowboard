import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskActions } from "./task-actions"

export interface Task {
    _id: string
    title: string
    description?: string
    status: "todo" | "inProgress" | "done"
    position: number
}

import { cn } from "@/lib/utils"

// ...

export function TaskCard({ task, className }: { task: Task, className?: string }) {
    return (
        <Card className={cn("cursor-grab hover:shadow-md transition-shadow group relative", className)}>
            <CardHeader className="p-4 pb-2 space-y-0 flex flex-row items-start justify-between gap-2">
                <CardTitle className="text-sm font-medium leading-none pt-1">
                    {task.title}
                </CardTitle>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <TaskActions task={task} />
                </div>
            </CardHeader>
            {task.description && (
                <CardContent className="p-4 pt-0">
                    <p className="text-xs text-muted-foreground truncate">
                        {task.description}
                    </p>
                </CardContent>
            )}
        </Card>
    )
}
