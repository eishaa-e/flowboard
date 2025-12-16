import { Schema, model, models } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    passwordHash: string;
}

const userSchema = new Schema<IUser>({
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
});

export const User = models.User || model<IUser>("User", userSchema);
