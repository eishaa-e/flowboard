"use client"

import * as React from "react"
import { useState } from "react"
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    pointerWithin,
    useDroppable,
} from "@dnd-kit/core"
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/axios"
import { TaskCard, Task } from "@/components/task/task-card"
import { EditTaskDialog } from "@/components/task/edit-task-dialog"
import { cn } from "@/lib/utils"

interface Board {
    _id: string
    title: string
}

const columns = [
    { id: "todo", title: "To Do" },
    { id: "inProgress", title: "In Progress" },
    { id: "done", title: "Done" },
]

export function TaskBoard({ board, initialTasks }: { board: Board; initialTasks: Task[] }) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [activeId, setActiveId] = useState<string | null>(null)
    const [newTaskTitle, setNewTaskTitle] = useState("")
    const [addingToColumn, setAddingToColumn] = useState<string | null>(null)

    // Edit Dialog state
    const [editTask, setEditTask] = useState<Task | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

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

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleCreateTask = async (status: string) => {
        if (!newTaskTitle.trim()) return

        try {
            const res = await api.post("/tasks", {
                title: newTaskTitle,
                boardId: board._id,
                status: status,
            })
            setTasks([...tasks, res.data])
            setNewTaskTitle("")
            setAddingToColumn(null)
        } catch (error) {
            console.error("Failed to create task", error)
        }
    }

    const findContainer = (id: string) => {
        if (columns.find((col) => col.id === id)) {
            return id
        }
        return tasks.find((task) => task._id === id)?.status
    }

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        const overId = over?.id

        if (!overId || active.id === overId) return

        const activeContainer = findContainer(active.id as string)
        const overContainer = findContainer(overId as string)

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return
        }

        setTasks((prev) => {
            const activeItems = prev.filter((t) => t.status === activeContainer)
            const overItems = prev.filter((t) => t.status === overContainer)
            const activeIndex = prev.findIndex((t) => t._id === active.id)
            const overIndex = prev.findIndex((t) => t._id === overId)

            let newIndex
            if (columns.find((c) => c.id === overId)) {
                newIndex = overItems.length + 1
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height
                const modifier = isBelowOverItem ? 1 : 0
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1
            }

            return prev.map((t) => {
                if (t._id === active.id) {
                    return { ...t, status: overContainer as any }
                }
                return t
            })
        })
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        const activeContainer = findContainer(active.id as string)
        const overContainer = over ? findContainer(over.id as string) : null

        if (
            activeContainer &&
            overContainer &&
            activeContainer === overContainer
        ) {
            const activeIndex = tasks.findIndex((t) => t._id === active.id)
            const overIndex = tasks.findIndex((t) => t._id === over!.id)

            if (activeIndex !== overIndex) {
                const newTasks = arrayMove(tasks, activeIndex, overIndex)
                setTasks(newTasks)

                const updates = newTasks.map((t, i) => ({
                    _id: t._id,
                    status: t.status,
                    position: i
                }))

                try {
                    await api.patch("/tasks/reorder", { items: updates })
                } catch (error) {
                    console.error("Failed to save reorder", error)
                }
            } else {
                const updates = tasks.map((t, i) => ({
                    _id: t._id,
                    status: t.status,
                    position: i
                }))
                try {
                    await api.patch("/tasks/reorder", { items: updates })
                } catch (error) {
                    console.error("Failed to save reorder", error)
                }
            }
        }

        setActiveId(null)
    }

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: "0.5",
                },
            },
        }),
    }

    // Handle click to open edit dialog
    const handleTaskClick = (task: Task) => {
        setEditTask(task)
        setIsEditDialogOpen(true)
    }

    return (
        <div className="flex h-full gap-4 overflow-x-auto">
            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {columns.map((col) => (
                    <BoardColumn
                        key={col.id}
                        column={col}
                        tasks={tasks.filter((t) => t.status === col.id)}
                        addingToColumn={addingToColumn}
                        setAddingToColumn={setAddingToColumn}
                        newTaskTitle={newTaskTitle}
                        setNewTaskTitle={setNewTaskTitle}
                        handleCreateTask={handleCreateTask}
                        onTaskClick={handleTaskClick}
                    />
                ))}

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeId ? (
                        <TaskCard task={tasks.find((t) => t._id === activeId)!} />
                    ) : null}
                </DragOverlay>
            </DndContext>

            {editTask && (
                <EditTaskDialog
                    task={editTask}
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                />
            )}
        </div>
    )
}

function BoardColumn({
    column,
    tasks,
    addingToColumn,
    setAddingToColumn,
    newTaskTitle,
    setNewTaskTitle,
    handleCreateTask,
    onTaskClick
}: any) {
    const { setNodeRef } = useDroppable({
        id: column.id,
    })

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
        <div
            ref={setNodeRef}
            className="w-80 shrink-0 flex flex-col bg-sidebar-accent/50 rounded-lg p-4 h-full"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{column.title}</h3>
                <span className="text-xs bg-sidebar-border px-2 py-1 rounded-full text-sidebar-foreground">
                    {tasks.length}
                </span>
            </div>

            <SortableContext
                items={tasks.map((t: any) => t._id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col gap-2 flex-1 overflow-y-auto min-h-[100px]">
                    {tasks.map((task: any, index: number) => (
                        <SortableTaskItem
                            key={task._id}
                            task={task}
                            onClick={() => onTaskClick(task)}
                            className={pastelColors[index % pastelColors.length]}
                        />
                    ))}
                </div>
            </SortableContext>

            {addingToColumn === column.id ? (
                <div className="mt-2 p-2 bg-background rounded border">
                    <Input
                        autoFocus
                        placeholder="Task title..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleCreateTask(column.id)
                        }}
                    />
                    <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={() => handleCreateTask(column.id)}>Add</Button>
                        <Button size="sm" variant="ghost" onClick={() => {
                            setAddingToColumn(null)
                            setNewTaskTitle("")
                        }}>Cancel</Button>
                    </div>
                </div>
            ) : (
                <Button
                    variant="ghost"
                    className="mt-2 w-full justify-start text-muted-foreground"
                    onClick={() => setAddingToColumn(column.id)}
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
            )}
        </div>
    )
}

function SortableTaskItem({ task, onClick, className }: { task: Task, onClick: () => void, className?: string }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task._id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
            <TaskCard task={task} className={className} />
        </div>
    )
}
