import express from "express";
import ValidateToken from "../middlewares/validateToken";
import AnnonceController from "../controllers/annonce.controller";

const router  = express.Router()

router.get('/announces', AnnonceController.getAllAnnonce)
router.get('/announce/:id', AnnonceController.getAnnonce)
router.post('/announce', ValidateToken.Validation, AnnonceController.createAnnounce) 
router.patch('/announce/:id', ValidateToken.Validation, AnnonceController.updateAnnounces)
router.delete('/announce/:id', ValidateToken.Validation, AnnonceController.deleteAnnounce)

export default router