// import express from 'express';
// import { createCategoryCtrl } from "../controllers/categoriesCtrl.js";
// import { isLoggedIn } from "../middlewares/isLoggedIn.js";


// const categoriesRouter = express.Router();

// categoriesRouter.post("/", createCategoryCtrl);

// export default categoriesRouter;

import express from 'express';
import { createCategoryCtrl, deleteCategoryCtrl, getAllCategoriesCtrl, getSignleCategoryCtrl, updateCategoryCtrl } from "../controllers/categoriesCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from '../middlewares/isAdmin.js';

const categoriesRouter = express.Router();

categoriesRouter.post('/', isLoggedIn, createCategoryCtrl);
categoriesRouter.get('/', getAllCategoriesCtrl);
categoriesRouter.get('/:id', getSignleCategoryCtrl);
categoriesRouter.delete('/:id', isLoggedIn, isAdmin, deleteCategoryCtrl);
categoriesRouter.put('/:id', isLoggedIn, updateCategoryCtrl);

export default categoriesRouter;