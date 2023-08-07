import express from "express";
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { categoryControlller, 
        createCategoryController, 
        deleteCategoryCOntroller, 
        singleCategoryController, 
        updateCategoryController, } from "../controllers/categoryController.js";

const router = express.Router()

// router create category
router.post("/create-category", requireSignIn, isAdmin, createCategoryController);

// router update category
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategoryController);

//router getALl category
router.get("/get-category", categoryControlller);

//router single category
router.get("/single-category/:slug", singleCategoryController);

//delete category
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategoryCOntroller);

export default router;