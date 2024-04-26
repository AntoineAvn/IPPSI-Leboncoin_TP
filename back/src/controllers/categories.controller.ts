import { Request, Response } from "express";
import getErrorMessage from "../utils/getErrorMessage";
import Categories from "../models/categories/categories.schema";

export default class CategoriesController {

    static async getAllCategories(_: Request, res: Response){
        try {
            const categories = await Categories.find();
            res.status(200).json({ value: { categories } });
        } catch(error: unknown){
            res.status(400).json({ message: `Error: ${getErrorMessage(error)}` });
        }
    }

    static async getCategory(req: Request, res: Response){
        const { id: categoryId } = req.params;
        try {
            const category = await Categories.findById(categoryId);
            if(!category){
                return res.status(404).json({ message: "Category not found" });
            }
            res.status(200).json({ value: { category } });
        } catch(error: unknown){
            res.status(400).json({ message: `Error: ${getErrorMessage(error)}` });
        }
    }

    static async createCategory(req: Request, res: Response){
        const { title } = req.body;
        try {
            const newCategory = new Categories({
                title,
                createdAt: new Date()
            });
            const savedCategory = await newCategory.save();
            res.status(201).json({ message: "Category created", value: { category: savedCategory } });
        } catch(error: unknown) {
            res.status(400).json({ message: `Failed to create the category: ${getErrorMessage(error)}` });
        }
    }

    static async updateCategory(req: Request, res: Response){
        const { id: categoryId } = req.params;
        const { body } = req;
        try {
            const updatedCategory = await Categories.findByIdAndUpdate(categoryId, body, { new: true });
            if(!updatedCategory){
                return res.status(404).json({ message: "Category not found" });
            }
            res.status(200).json({ message: "Category updated", value: { category: updatedCategory } });
        } catch(error: unknown){
            res.status(400).json({ message: `Failed to update the category: ${getErrorMessage(error)}` });
        }
    }

    static async deleteCategory(req: Request, res: Response){
        const { id: categoryId } = req.params;
        try {
            const deletedCategory = await Categories.findByIdAndDelete(categoryId);
            if(!deletedCategory){
                return res.status(404).json({ message: "Category not found" });
            }
            res.status(200).json({ message: "Category deleted" });
        } catch(error: unknown){
            res.status(400).json({ message: `Failed to delete the category: ${getErrorMessage(error)}` });
        }
    }
}
