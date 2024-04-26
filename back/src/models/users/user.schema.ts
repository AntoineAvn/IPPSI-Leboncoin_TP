import { Schema, Types, model } from "mongoose";
import IUser, { generateUsername } from "./user.interface";

const userSchema = new Schema({
    email: { type: String, require: true },
    password: { type: String, require: true },
    username: { type: String, default: generateUsername() },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date },
    annonces: { type: Array<Types.ObjectId>, ref: 'Annonces', default: [] },
    isAdmin: { type: Boolean, default: false, require: true }
})

// Pour delete en cascade
userSchema.pre('findOneAndUpdate', async function(next) {
    const update : any = this.getUpdate();
    const annonceIdToDelete = update?.$pull?.annonces;

    if (annonceIdToDelete) {
        try {
            await this.model.updateMany(
                { annonces: annonceIdToDelete },
                { $pull: { annonces: annonceIdToDelete } } 
            );
        } catch (error) {
            console.error(`Error deleting annonce reference from users: ${error}`);
        }
    }

    next();
});

const User = model<IUser>('User', userSchema)

export default User