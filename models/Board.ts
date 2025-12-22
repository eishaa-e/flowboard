import { Schema, model, models, Types } from "mongoose";

export interface IBoard {
    title: string;
    workspaceId: Types.ObjectId;
    position: number;
    createdAt: Date;
}

const boardSchema = new Schema<IBoard>({
    title: { type: String, required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    position: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

export const Board = models.Board || model<IBoard>("Board", boardSchema);
