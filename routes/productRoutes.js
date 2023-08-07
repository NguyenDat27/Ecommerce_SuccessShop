import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { brainTreePaymentController, braintreeTokenController, createProductController, 
        deleteProductController, 
        getProductController, 
        getSingleProductController,
        productCategoryController,
        productCountController,
        productFiltersController,
        productListController,
        productPhotoController,
        realtedProductController,
        searchProductController,
        updateProductController} from "../controllers/productCotroller.js";

import formidable from "express-formidable"


const router = express.Router()

//router create product
router.post("/create-product", requireSignIn, isAdmin, formidable(), createProductController)

//router get products
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//router get photo
router.get("/product-photo/:pid", productPhotoController);

//router delete rproduct
router.delete("/delete-product/:pid", requireSignIn, isAdmin, deleteProductController);

//router create product
router.put("/update-product/:pid", requireSignIn, isAdmin, formidable(), updateProductController)

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router