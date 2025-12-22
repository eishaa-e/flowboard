"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditWorkspaceDialog } from "./edit-workspace-dialog"
import { api } from "@/lib/axios"

interface WorkspaceActionsProps {
    workspace: {
        _id: string
        name: string
        description?: string
    }
}

export function WorkspaceActions({ workspace }: WorkspaceActionsProps) {
    const router = useRouter()
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this workspace? This action cannot be undone.")) {
            return
        }

        setLoading(true)
        try {
            await api.delete(`/workspaces/${workspace._id}`)
            router.refresh()
        } catch (error) {
            console.error("Failed to delete workspace", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
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

            <EditWorkspaceDialog
                workspace={workspace}
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
            />
        </>
    )
}
