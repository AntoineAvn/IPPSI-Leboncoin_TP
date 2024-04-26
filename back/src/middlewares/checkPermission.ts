import { Response, Request, NextFunction } from "express";
import User from "../models/users/user.schema";
import getErrorMessage from "../utils/getErrorMessage";

export default class VerifyAdmin {
    static async isAdmin(req: Request, res: Response, next: NextFunction) {
        const { userId } = req as any;

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (!user.isAdmin) {
                return res.status(403).json({ message: "User is not an admin" });
            }

            next(); 
        } catch(error: unknown) {
            res.status(500).json({ message: `Error verifying admin status: ${getErrorMessage(error)}` });
        }
    }
}
