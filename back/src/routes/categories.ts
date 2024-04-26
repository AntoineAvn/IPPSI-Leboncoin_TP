import express from "express";
import ValidateToken from "../middlewares/validateToken";
import VerifyAdmin from "../middlewares/checkPermission";
import CategoriesController from "../controllers/categories.controller";

const router = express.Router()

router.get('/categories', ValidateToken.Validation, VerifyAdmin.isAdmin, CategoriesController.getAllCategories)
router.get('/categorie/:id',  ValidateToken.Validation, VerifyAdmin.isAdmin, CategoriesController.getCategory)
router.post('/categorie',  ValidateToken.Validation, VerifyAdmin.isAdmin, CategoriesController.createCategory)
router.patch('/categorie/:id',  ValidateToken.Validation, VerifyAdmin.isAdmin, CategoriesController.updateCategory)
router.delete('/categorie',  ValidateToken.Validation, VerifyAdmin.isAdmin, CategoriesController.deleteCategory)

export default router