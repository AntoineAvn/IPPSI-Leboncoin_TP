import { Schema, Types, model } from "mongoose";
import IUser, { generateUsername } from "./user.interface";

const userSchema = new Schema({
    email: { type: String, require: true },
    password: { type: String, require: true },
    username: { type: String, default: generateUsername() },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date },
    annonces: { type: Array<Types.ObjectId>, ref: 'Annonces' },
    isAdmin: { type: Boolean, default: false, require: true }
})

const User = model<IUser>('User', userSchema)

export default User