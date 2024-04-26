import { Request, Response } from "express"
import jwt, { JwtPayload } from 'jsonwebtoken'
import SecurityService from "../utils/hash"
import User from "../models/users/user.schema"
import { generateUsername } from "../models/users/user.interface"
import getErrorMessage from "../utils/getErrorMessage"

export default class AuthController{

    static async login(req: Request, res: Response){

        try{
            const { email, password } = req.body 
            const user = await User.findOne({email})
            if(!user){
                return res.status(401).json({message:"Authentification failled, user not found"})
            }   
            const matchPassword = SecurityService.comparePasword(password, user.password)
            if(!matchPassword){
                return res.status(401).json({message: "Authentification failled, wrong password"})
            }
            const token = jwt.sign({userId: user.id}, process.env.SECRET_KEY_JWT!, {
                expiresIn: "4h",
            })
            res.status(200).json({message: "Authentification sucessful", value: {token: token, userId: user.id} })
        } catch(error : unknown){
            res.status(500).json({message: `Error: ${getErrorMessage(error)}`})
        }

    }

    static async register(req: Request, res: Response){

        try{
            const { email, password, username } = req.body
            const checkUser =  await User.findOne({email})
            if(checkUser){
                return res.status(409).json({message: "A account with this email already exist"})
            }
            const hashPassword = await SecurityService.sha256(password, process.env.SALT!)
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
            res.status(201).json({message: "The account has been created.", value: { token, userId: user.id }})
        
        } catch (error: unknown) {
            res.status(500).json({message: `Error: ${getErrorMessage(error)}`})
        }
        
    }

    static async checkToken(req: Request, res: Response){

        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' })
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'Bearer token missing' })
        }

        try {
            const decoded = (jwt.verify(token, process.env.SECRET_KEY_JWT!) as JwtPayload).exp
            const now = new Date()
            if(!decoded){
                return res.status(401).json({ message: 'Invalid token' })
            }
            if(now.getTime() > decoded * 1000){
                return res.status(401).json({ message: 'Token expired' })
            }

            res.status(200).json({message: "Ok"})

        } catch (error: unknown) {
            res.status(500).json({ message: `Invalid token : ${getErrorMessage(error)}` })
        }

    }
}

