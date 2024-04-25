import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import SecurityService from "../utils/hash";
import User from "../models/users/user.schema";
import { generateUsername } from "../models/users/user.interface";
import getErrorMessage from "../utils/getErrorMessage";

export default class AuthController{
    static async login(req: Request, res: Response){

        try{
            const { email, password } = req.body 
            const user = await User.findOne({email})
            console.log(user, email)
            if(!user){
                return res.status(401).json({message:"Authentification failled, user not found"})
            }   
            const matchPassWord = SecurityService.comparePasword(password, user.password)
            if(!matchPassWord){
                return res.status(401).json({message: "Authentification failled, wrong password"})
            }
            const token = jwt.sign({userId: user.id}, process.env.SECRET_KEY_JWT!, {
                expiresIn: "4h",
            })
            res.status(200).json({message: "Authentification sucessful", token})
        } catch(error : unknown){
            res.status(500).json({message: `Error: ${getErrorMessage(error)}`})
        }
    }

    static async register(req: Request, res: Response){

        try{
            const { email, password, username } = req.body
            const hashPassword = await SecurityService.sha256(password, process.env.SALT)
            const user = new User(
                {
                    email: email,
                    password: hashPassword,
                    username: username ? username : generateUsername(),
                    createdAt: new Date(),
                    isAdmin: false
                }
            )
            await user.save()
            const token = jwt.sign({userId: user.id}, process.env.SECRET_KEY_JWT!, {
                expiresIn: '4h'
            })
            res.status(201).json({message: "The account has been created.", value: { token }})
        
        } catch (error: unknown) {
            res.status(500).json({message: `Error: ${getErrorMessage(error)}`})
        }
        
        
    }

    static async checkToken(req: Request, res: Response){

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Bearer token missing' });
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY!);
            (req as any).userId = (decoded as JwtPayload).userId;

        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
}