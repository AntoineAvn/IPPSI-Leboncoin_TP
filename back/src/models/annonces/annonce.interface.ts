import { Document, Types } from "mongoose";

export default interface IAnnonces extends Document{
    title: string,
    description?: string,
    price: number,
    isSell: boolean,
    seller: Types.ObjectId,
    buyer?:  Types.ObjectId, 
    createdAt: Date,
    updatedAt: Date
}