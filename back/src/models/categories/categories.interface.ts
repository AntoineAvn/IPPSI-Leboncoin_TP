import { Document } from "mongoose";

export default interface ICategories extends Document{
    title: string,
    createdAt: Date,
    updatedAt?: Date
}