import { Request, Response } from "express";
import User from "../models/users/user.schema";
import getErrorMessage from "../utils/getErrorMessage";
import IUser from "../models/users/user.interface";
import SecurityService from "../utils/hash";

export default class UserController {

    private static async updateUserFields(userId: string, updateFields: Partial<IUser>, res: Response) {
        
        try {
            const user = await User.findById(userId);
        
            if (!user) {
              return null;
            }
            for (const key of Object.keys(updateFields)) {
                
                // Typescript renvoie une erreur comme quoi key ne peut pas etre utiliser
                // comment field puisqu'il est de type string, et peut donc avoir une valeur 
                // qui ne correspond pas a un field de l'object updateFields
                const field = key as keyof IUser;
            
                if (field === 'password') {
                    const newPassword = updateFields[field] as string;
                    const hashPassword = await SecurityService.sha256(newPassword, process.env.SALT);
                    user.password = hashPassword;
                } else {
                    // TS dit que user[field] est un any alors qu'il est defini comme un IUser
                    // TODO : Essayer de voir pouquoi user[field] est un any
                    // @ts-ignore
                    user[field] = updateFields[field];
                }
            }
        
            user.updatedAt = new Date();
        
            const updatedUser = await user.save();
        
            return res.status(200).json({ message: "User updated",value: {updatedUser}});
          } catch (error: unknown) {
            res.status(400).json({ message: `Failed to update the user: ${getErrorMessage(error)}`});
          }

    }

    static async getAllUser(req: Request, res: Response){

        try {
            const users = await User.find()
            if(!users) {
                return res.status(404).json({message: "Found any user"})
            }

            res.status(200).json({value:{users}})
        } catch(error: unknown){
            res.status(500).json({message: `Error: ${getErrorMessage(error)}`})
        }

    }

    static async getUser(req: Request, res: Response){

        try {
            const { userId } = req as any
            const user = await User.findById(userId)
            if(!user){
                return res.status(404).json({message: "User not found"})
            }

            res.status(200).json({value:{user}})

        } catch(error: unknown){
            res.status(500).json({message: `Error: ${getErrorMessage(error)}`})
        }

    }

    static async updateUser(req: Request, res: Response){

        const { userId } = req as any
        const { body } = req
        const { id } = req.params

        const user = await User.findById(userId)
        const right = user?.isAdmin

        try {
            if(!right){
                await this.updateUserFields(userId, body, res)
            }
            else{
                await this.updateUserFields(id, body, res)
            }
        } catch(error: unknown){
            res.status(500).json({message: `Error: ${getErrorMessage(error)}`})
        } 

    }

    static async deleteUser(req: Request, res: Response){

        try{
            const { userId } = req as any
            const user = await User.findById(userId)
            const right = user?.isAdmin

            if(!right){
                return res.status(403).json({message: "You don't have the right to delete a user"})
            }

            const { id } = req.params
            const removeUser = await User.findByIdAndDelete(id)
            if(!removeUser){
                return res.status(404).json({message: "User not found"})
            }

            res.status(200).json({message: "User deleted"})
        } catch(error: unknown){
            res.status(500).json({message: `Error: ${getErrorMessage(error)}`})
        }

    }
}