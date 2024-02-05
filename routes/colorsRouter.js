// import express from 'express';
// import { createCategoryCtrl } from "../controllers/categoriesCtrl.js";
// import { isLoggedIn } from "../middlewares/isLoggedIn.js";


// const categoriesRouter = express.Router();

// categoriesRouter.post("/", createCategoryCtrl);

// export default categoriesRouter;

import express from 'express';
import { createColorCtrl, getAllColorsCtrl, getSignleColorsCtrl, deleteColorCtrl, updateColorCtrl} from '../controllers/colorsCtrl.js';

import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from '../middlewares/isAdmin.js';

const colorsRouter = express.Router();

colorsRouter.post('/', isLoggedIn, createColorCtrl);
colorsRouter.get('/', getAllColorsCtrl);
colorsRouter.get('/:id', getSignleColorsCtrl);
colorsRouter.delete('/:id', isLoggedIn, isAdmin, deleteColorCtrl);
colorsRouter.put('/:id', isLoggedIn, updateColorCtrl);

export default colorsRouter;