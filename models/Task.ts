import { Schema, model, models, Types } from "mongoose";

export interface ITask {
    boardId: Types.ObjectId;
    title: string;
    description?: string;
    position: number;
    status: "todo" | "inProgress" | "done";
    createdAt: Date;
}

const taskSchema = new Schema<ITask>({
    boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    title: { type: String, required: true },
    description: String,
    position: { type: Number, default: 0 },
    status: { type: String, enum: ["todo", "inProgress", "done"], default: "todo" },
    createdAt: { type: Date, default: Date.now },
});

export const Task = models.Task || model<ITask>("Task", taskSchema);
