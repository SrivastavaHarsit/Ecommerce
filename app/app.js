import express from 'express';
import Stripe from "stripe";
import dotenv from 'dotenv';
import dbConnect from '../config/dbConnect.js';
import userRoutes from '../routes/usersRoute.js';
import { globalErrhandler, notFound } from '../middlewares/globalErrHandler.js';
import productsRouter from '../routes/productsRoute.js';
import categoriesRouter from '../routes/categoriesRoute.js';
import brandsRouter from '../routes/brandsRouter.js';
import colorsRouter from '../routes/colorsRouter.js';
import reviewRouter from '../routes/reviewRouter.js';
import ordersRouter from '../routes/ordersRouter.js';
import couponsRouter from '../routes/couponsRouter.js';
import Order from '../model/Order.js';



dotenv.config();

const app = express();

// Ensure that the MongoDB connection is established before starting the server
dbConnect();

//Stripe webhook
//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_7003ea3571f4973c7629f6c888fb6f26ed37afcd6128a9e6d24c492d5a0dd631";

app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log("event");
  } catch (err) {
    console.log("err", err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // // Handle the event
  // switch (event.type) {
  //   case 'payment_intent.succeeded':
  //     const paymentIntentSucceeded = event.data.object;
  //     // Then define and call a function to handle the event payment_intent.succeeded
  //     break;
  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  if(event.type === "checkout.session.completed"){
    // update the order
    const session = event.data.object // details of the payment (ki fail/pass kya hua)
    const { orderId } = session.metadata;
    const paymentStatus = session.payment_status;
    const paymentMethod = session.payment_method_types[0];
    const totalAmount = session.amount_total;
    const currency = session.currency;
    
    //find the order
    const order = await Order.findByIdAndUpdate(JSON.parse(orderId),
    {
      totalPrice: totalAmount/100,
      currency, paymentMethod, paymentStatus,
    },
    {
      new: true,
    });
    console.log(order);
  } else{
    return;
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

//pass incoming data
app.use(express.json());

//routes
app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/products/', productsRouter);
app.use('/api/v1/categories/', categoriesRouter);
app.use('/api/v1/brands/', brandsRouter);
app.use('/api/v1/colors/', colorsRouter);
app.use('/api/v1/reviews/', reviewRouter);
app.use('/api/v1/orders/', ordersRouter);
app.use('/api/v1/coupons/', couponsRouter);



//err middleware
app.use(notFound);
app.use(globalErrhandler);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

export default app;
