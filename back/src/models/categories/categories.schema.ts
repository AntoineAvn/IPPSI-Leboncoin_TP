import { Schema, model } from "mongoose";
import ICategories from "./categories.interface";

const categoriesSchema = new Schema({
    title: { type: String, require: true },
    createdAt: { type: Date, default: new Date(), require: true },
    updatedAt: { type: Date },
})

const Categories = model<ICategories>('Categories', categoriesSchema)

export default Categories