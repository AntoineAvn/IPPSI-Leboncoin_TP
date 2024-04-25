import { Document, Types } from "mongoose";

export default interface IAnnonces extends Document{
    title: string,
    description?: string,
    price: number,
    isSell: boolean,
    seller: Types.ObjectId | number,
    buyer?:  Types.ObjectId | number, 
    createdAt: Date,
    updatedAt: Date
}