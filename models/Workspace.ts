import { Schema, model, models, Types } from "mongoose";

export interface IWorkspace {
    name: string;
    description?: string;
    owner: Types.ObjectId;
    createdAt: Date;
}

const workspaceSchema = new Schema<IWorkspace>({
    name: { type: String, required: true },
    description: String,
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
});

export const Workspace =
    models.Workspace || model<IWorkspace>("Workspace", workspaceSchema);
