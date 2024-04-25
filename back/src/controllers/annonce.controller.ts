import { Request, Response } from "express";
import getErrorMessage from "../utils/getErrorMessage";
import Annonces from "../models/annonces/annonce.schema";
import IAnnonces from "../models/annonces/annonce.interface";
import User from "../models/users/user.schema";

export default class AnnonceController {

    private static async updateAnnouncesFields(annonceId: string, updateFields: Partial<IAnnonces>, res: Response){
        try{
            const annonce = await Annonces.findById(annonceId)
            if(!annonce){
                return res.status(404).json({message: "Announce not found"})
            }
    
            Object.assign(annonce, updateFields)
            const updatedAnnonce = await annonce.save()
            res.status(200).json({ message: "Announce updated",value: {updatedAnnonce}})

        } catch (error: unknown){
              res.status(400).json({ message: `Failed to update the announce: ${getErrorMessage(error)}`});
        }
    }

    private static async isOwnByUser(userId: string, annonceId: string): Promise<boolean | null> {
        try{
            const annonce = await Annonces.findById(annonceId)
            if(!annonce){
                return false
            }
            return annonce.seller.toString() === userId 
            
        } catch (error: unknown){
            return null
        }
    }

    static async getAllAnnonce(_: Request, res: Response){
        try{
            const annonces = await Annonces.find()
            if(!Annonces){
                return res.status(404).json({message: "Found any announces"})
            }
            res.status(200).json({value:{annonces}})
        } catch(error: unknown){
            res.status(400).json({ message: `Error: ${getErrorMessage(error)}`})
        }
    }

    static async getAnnonce(req: Request, res: Response){
        const {id:annonceId} = req.params
        try {
            const annonce = await Annonces.findById(annonceId)
            if(!annonce){
                return res.status(404).json({message: "Announce not found"})
            }
            res.status(200).json({value:{annonce}})
        } catch(error: unknown){
            res.status(400).json({ message: `Error: ${getErrorMessage(error)}`})
        }
    }

    static async createAnnounce(req: Request, res: Response){
        
        const { title, description, price } = req.body;
        const { userId } = req as any;
        
        try {

            const seller = userId;
            
            const newAnnounce = new Annonces({
                title,
                description,
                price,
                isSell: false,
                seller,
                createdAt: new Date()
            });

            const savedAnnounce = await newAnnounce.save();
            res.status(201).json({ message: "Announcement created", value: { announce: savedAnnounce } });
        } catch(error: unknown) {
            res.status(400).json({ message: `Failed to create the announcement: ${getErrorMessage(error)}` });
        }
    }

    static async updateAnnounces(req: Request, res: Response){
        const {id:annonceId} = req.params
        const { body } = req
        const { userId } = req as any
        
        try{

            const user = await User.findById(userId)
            const right = user?.isAdmin

            const isTheOwner = this.isOwnByUser(userId, annonceId)

            if(!isTheOwner && !right){
                return res.status(401).json({message: "You can't modify this announce"})
            }
            if(isTheOwner === null){
                return res.status(404).json({message: "Announce not found"})
            }

            await this.updateAnnouncesFields(annonceId, body, res)

        } catch(error: unknown){
            res.status(400).json({ message: `Failed to update the announce: ${getErrorMessage(error)}`});
        }
    }

    static async deleteAnnounce(req: Request, res: Response){
        const { userId } = req as any
        const { id:annonceId } = req.params

        try{

            const user = await User.findById(userId)
            const right = user?.isAdmin

            const isTheOwner = this.isOwnByUser(userId, annonceId)

            if(!isTheOwner && !right){
                return res.status(401).json({message: "You can't modify this announce"})
            }

            if(isTheOwner === null){
                return res.status(404).json({message: "Announce not found"})
            }

            const { id } = req.params
            const removeAnnonce = await Annonces.findByIdAndDelete(id)
            if(!removeAnnonce){
                return res.status(404).json({message: "Announce not found"})
            }

            res.status(200).json({message: "Announce deleted"})
        } catch(error: unknown){
            res.status(500).json({message: `Error: ${getErrorMessage(error)}`})
        }

    }

}