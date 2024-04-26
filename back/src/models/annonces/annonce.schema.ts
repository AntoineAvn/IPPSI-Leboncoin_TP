import { Schema, Types, model } from "mongoose";
import IAnnonces from "./annonce.interface";

const annonceSchema = new Schema({
    title: { type: String, require: true },
    description: { type: String },
    price: { type: Number, require: true },
    isSell: { type: Boolean, default: false, require: true },
    seller: { type: Types.ObjectId, ref: 'User', require: true },
    buyer: { type: Types.ObjectId, ref: 'User' },
    categories: { type: Array<Types.ObjectId>, ref: 'Categories', default: [] },
    createdAt: { type: Date, default: new Date(), require: true },
    updatedAt: { type: Date },
})

// Delete en cascade les categories dans annonces
annonceSchema.pre('findOneAndUpdate', async function(next) {
    const update: any = this.getUpdate();
    const categoryIdToDelete = update?.$pull?.categories;

    if (categoryIdToDelete) {
        try {
            await this.model.updateMany(
                { categories: categoryIdToDelete },
                { $pull: { categories: categoryIdToDelete } }
            );
        } catch (error) {
            console.error(`Error deleting category reference from annonces: ${error}`);
        }
    }

    next();
});

const Annonces = model<IAnnonces>('Annonces', annonceSchema)

export default Annonces