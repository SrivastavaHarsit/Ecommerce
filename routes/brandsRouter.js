// import express from 'express';
// import { createCategoryCtrl } from "../controllers/categoriesCtrl.js";
// import { isLoggedIn } from "../middlewares/isLoggedIn.js";


// const categoriesRouter = express.Router();

// categoriesRouter.post("/", createCategoryCtrl);

// export default categoriesRouter;

import express from 'express';
import { createBrandCtrl,deleteBrandsCtrl, getAllBrandsCtrl, updateBrandsCtrl, getSignleBrandsCtrl,} from '../controllers/brandsCtrl.js';

import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from '../middlewares/isAdmin.js';

const brandsRouter = express.Router();

brandsRouter.post('/', isLoggedIn, isAdmin, createBrandCtrl);
brandsRouter.get('/', getAllBrandsCtrl);
brandsRouter.get('/:id', getSignleBrandsCtrl);
brandsRouter.delete('/:id', isLoggedIn, isAdmin, deleteBrandsCtrl);
brandsRouter.put('/:id', isLoggedIn, isAdmin, updateBrandsCtrl);

export default brandsRouter;