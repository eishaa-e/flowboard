"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreVertical, Pencil, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditTaskDialog } from "./edit-task-dialog"
import { api } from "@/lib/axios"
import { Task } from "./task-card"

interface TaskActionsProps {
    task: Task
}

export function TaskActions({ task }: TaskActionsProps) {
    const router = useRouter()
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this task?")) {
            return
        }

        setLoading(true)
        try {
            await api.delete(`/tasks/${task._id}`)
            router.refresh()
            // Force refresh to update the list, but DND context might need manual update if not full reload
            // Ideally we pass a callback to remove it from parent state, but router.refresh works for server components
            window.location.reload()
        } catch (error) {
            console.error("Failed to delete task", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-6 w-6 p-0 hover:bg-muted">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-3 w-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onSelect={handleDelete}
                        disabled={loading}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditTaskDialog
                task={task}
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
            />
        </div>
    )
}
