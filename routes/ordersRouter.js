// import express from 'express';
// import { createCategoryCtrl } from "../controllers/categoriesCtrl.js";
// import { isLoggedIn } from "../middlewares/isLoggedIn.js";


// const categoriesRouter = express.Router();

// categoriesRouter.post("/", createCategoryCtrl);

// export default categoriesRouter;

import express from 'express';
import { createOrderCtrl, getAllOrdersCtrl,getSingleOrdersCtrl, updateOrdersCtrl, getOrderStatsCtrl } from '../controllers/ordersCtrl.js';
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from '../middlewares/isAdmin.js';

const ordersRouter = express.Router();

ordersRouter.post('/', isLoggedIn, createOrderCtrl);
ordersRouter.get('/', isLoggedIn, getAllOrdersCtrl);
ordersRouter.get('/sales/stats', isLoggedIn, getOrderStatsCtrl);
ordersRouter.put('/update/:id', isLoggedIn, updateOrdersCtrl);
ordersRouter.get('/:id', isLoggedIn, getSingleOrdersCtrl);

export default ordersRouter;