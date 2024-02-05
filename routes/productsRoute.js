import express from 'express';
import upload from '../config/fileUpload.js';
import { createProductCtrl, getProductSingleCtrl, getProductsCtrl, updateProductCtrl, deleteProductCtrl } from '../controllers/productCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';
const productsRouter = express.Router();

productsRouter.post("/", isLoggedIn, isAdmin, createProductCtrl); //upload multer ke through user se pic lega aur fir store karega cloudinary par single karna hai toh bhai upload.single use karo
productsRouter.get("/", isLoggedIn, getProductsCtrl); // no need to login as public
productsRouter.get("/:id", getProductSingleCtrl);
productsRouter.put("/:id", isLoggedIn, updateProductCtrl);
productsRouter.delete("/:id/delete", isLoggedIn, isAdmin, isLoggedIn, deleteProductCtrl);

export default productsRouter;


// upload.single("file"), 