import { Document, Types } from "mongoose";
import { randomUUID } from "node:crypto";

export default interface IUser extends Document {
    email: string,
    password: string,
    username: string,
    createdAt: Date,
    updatedAt: Date,
    annonces: Types.ObjectId[],
    isAdmin: boolean
}

export function generateUsername(): string {
    return `Username-${randomUUID()}`;
}