import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Coupon from "../model/Coupon.js";


// @desc  Create new Order
// @route POST /api/v1/orders
//@access Private/Admin

//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = asyncHandler(async(req, res)=>{
    //get coupon code
    const { coupon } = req?.query;
    const couponFound = await Coupon.findOne({
        code: coupon?.toUpperCase(),
    });
    if(couponFound?.isExpires) {
        throw new Error("Coupon has expired");
    }
    if(!couponFound) {
        throw new Error("Coupon does not exists");
    }

    //get discount
    const discount = couponFound?.discount / 100;

    //Get the payload (customer, orderItems, shippingAddress, totalPrice);
    const { orderItems, shippingAddress, totalPrice } = req.body;
    //find the user
    const user = await User.findById(req.userAuthId);

    //Check if user has shipping address
    if(!user?.hasShippingAddress){
        throw new Error("Please enter your shipping address");
    }

    //Check if order is not empty
    if(orderItems?.length <= 0){
        throw new Error("Cart empty");
    };
    //Place/create order - save into DB;
    const order = await Order.create({
       user: user?._id,
       orderItems,
       shippingAddress,
       totalPrice: couponFound ? totalPrice*(1-discount) : totalPrice,
    });
    
    //Update the product quantity
    // uses the map function to iterate over each order
    const products = await Product.find({_id:{$in:orderItems}}); //orderItems me productId bahut saari hogi wo har 1 id Product model me doondhega
    orderItems?.map(async (order)=>{
        const product = products?.find((product)=>{
            return product._id.toString() === order?._id.toString();
        });
        if(product){
            // console.log(`Updating product ${product._id}, totalSold: ${product.totalSold}, order.qty: ${order.totalQtyBuying}`);
            product.totalSold += order.totalQtyBuying;  // order.totalQtyBuying frontend se aayega (req.body se)
            // console.log(`After update, product ${product._id}, totalSold: ${product.totalSold}`);
        }
        await product.save();
    });

    // for(const order of orderItems){
    //     const product = products.find((p) => p._id.toString() === order._id.toString());
    //     if (product) {
    //         console.log(`Updating product ${product._id}, totalSold: ${product.totalSold}, order.qty: ${order.totalQtyBuying}`);
    //         product.totalSold += order.totalQtyBuying;  // order.totalQtyBuying frontend se aayega (req.body se)
    //         console.log(`After update, product ${product._id}, totalSold: ${product.totalSold}`);
    //         await product.save();
    //     }
    // }

    //push order into user
    user.orders.push(order?._id);
    await user.save();

    // make payment (stripe)

    // convert orderItems to have same structure that stripe need
    const convertedOrders = orderItems.map((item)=>{
        return{
           price_data:{
            currency: "usd",
            product_data:{
                name: item?.name,
                description: item?.description,
            },
            unit_amount: item?.price * 100,
           },
           quantity: item?. totalQtyBuying,
        };
    });
    const session = await stripe.checkout.sessions.create({
      line_items: convertedOrders,
      metadata:{ // taaki webhook update ke baad hamara database bhi update krne ke liye extra payload ki jaroorat hai
        orderId: JSON.stringify(order?._id), 
      },
      mode: "payment",
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
    res.send({url: session.url});
    //Payment webhook
    //Update the user order

    // res.json({
    //     success: true,
    //     message: "Order Created",
    //     order,
    //     user,
    // });
});

export const getAllOrdersCtrl = asyncHandler(async (req, res)=>{
   //find all orders
   const orders = await Order.find();

   //pagination baad me karunga (product jaisa hi)

   res.json({
    success: "All orders",
    orders,
   });
});

export const getSingleOrdersCtrl = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    const order = await Order.findById(id);
    res.json({
        success: "Your fetched order",
        order,
       });
});

//@desc update order to delivered
//@route PUT /api/v1/orders/update/:id
//@access private/admin

export const updateOrdersCtrl = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    //update
    const updateOrder = await Order.findByIdAndUpdate(id,
        {
            status: req.body.status,

        },
        {
            new: true,
        });

        res.status(200).json({
            success: true,
            message: "Order updated",
            updated,
        })
});

//@desc get sales sum of orders
//@route GET /api/v1/orders/sales/sum
//@access private/admin

export const getOrderStatsCtrl = asyncHandler(async(req, res)=>{
    //get order stats
    const orders = await Order.aggregate([
        {
            "$group":{
                _id:null,
                minimumSale:{
                    $min: "$totalPrice",
                },
                totalSales: {
                    $sum: "$totalPrice",
                },
                maxSale:{
                    $max:"$totalPrice",
                },
                avgSale:{
                    $avg:"$totalPrice",
                },
            },
        },
    ]);


    //get the date
    const date = new Date();
    const today = new Date(date.getFullYear(),  date.getMonth(), date.getDate());
    const salesToday = await Order.aggregate([
        {   //first we will match the order/sales with today
            $match: {
                createdAt: {
                    $gte: today,
                },
            },
        },
        {   //after that query i will sum up todays sales
            $group: {
                _id: null,
                totalSales: {
                    $sum: "$totalPrice",
                },
            },
        },
    ]);

    //send response
    res.status(200).json({
        success:true,
        message: "Sum of orders",
        orders,
        salesToday,
    });
});