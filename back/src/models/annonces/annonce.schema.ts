import { Schema, Types, model } from "mongoose";
import IAnnonces from "./annonce.interface";

const annonceSchema = new Schema({
    title: { type: String, require: true },
    description: { type: String },
    price: { type: Number, require: true },
    isSell: { type: Boolean, default: false, require: true },
    seller: { type: Types.ObjectId, ref: 'User', require: true },
    buyer: { type: Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: new Date(), require: true },
    updatedAt: { type: Date },
})

const Annonces = model<IAnnonces>('Annonces', annonceSchema)

export default Annonces