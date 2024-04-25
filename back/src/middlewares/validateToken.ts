import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import getErrorMessage from "../utils/getErrorMessage";

export default class ValidateToken {
    static async Validation(req: Request, res: Response, next: NextFunction){

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Bearer token missing' });
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT!); 
            (req as any).userId = (decoded as JwtPayload).userId;
            next();
        } catch (error: unknown) {
            res.status(500).json({ message: `Invalid token : ${getErrorMessage(error)}` });
        }
    }
}