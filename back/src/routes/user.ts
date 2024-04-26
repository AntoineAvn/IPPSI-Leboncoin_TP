import express from "express";
import ValidateToken from "../middlewares/validateToken";
import UserController from "../controllers/user.controller";

const router = express.Router()

router.get('/users', UserController.getAllUser)
router.get('/user/:id?', ValidateToken.Validation, UserController.getUser)
router.get('/user/announces/:id?', ValidateToken.Validation, UserController.getAnnouncesOfUser)
router.patch('/user/:id?', ValidateToken.Validation, UserController.updateUser)
router.delete('/user/:id?', ValidateToken.Validation, UserController.deleteUser)

export default router