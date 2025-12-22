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
import { EditBoardDialog } from "./edit-board-dialog"
import { api } from "@/lib/axios"

interface BoardActionsProps {
    board: {
        _id: string
        title: string
    }
}

export function BoardActions({ board }: BoardActionsProps) {
    const router = useRouter()
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this board? All tasks in it will be lost.")) {
            return
        }

        setLoading(true)
        try {
            await api.delete(`/boards/curr_id/${board._id}`)
            router.refresh()
        } catch (error) {
            console.error("Failed to delete board", error)
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

            <EditBoardDialog
                board={board}
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
            />
        </>
    )
}
