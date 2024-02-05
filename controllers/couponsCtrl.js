import asyncHandler from "express-async-handler";
import Coupons from "../model/Coupon.js";
import Coupon from "../model/Coupon.js";

// @desc  Create new Coupon
// @route POST /api/v1/coupons
//@access Private/Admin

export const createCouponCtrl = asyncHandler(async (req, res)=>{
    const { code, startDate, endDate, discount } = req.body;
    //check if admin

    //check if coupon already exist
    const couponsExists = await Coupons.findOne({
        code
    });
    if(couponsExists) {
        throw new Error("Coupuns already exists");
    }

    //check if valus is a number
    if(isNaN(discount)) {
        throw new Error("Discount should be a number")
    }
    //create coupon
    const coupon = await Coupons.create({
        code: code.toUpperCase(), 
        startDate,
        endDate,
        discount,
    });
    //send the response
    res.status(201).json({
        status: "succeed",
        messafe: "Coupon created successfully",
        coupon,
    })
});

// @desc  Get all coupuns
// @route POST /api/v1/coupons
//@access Private/Admin

export const getAllCouponsCtrl = asyncHandler(async(req, res)=>{
    const coupons = await Coupons.find();

    res.status(200).json({
        status: "success",
        message: "All coupons",
        coupons,
    });
});

// @desc  Get single coupun
// @route POST /api/v1/coupons
//@access Private/Admin

export const getSingleCouponCtrl = asyncHandler(async (req, res)=>{
    const coupon = await Coupon.findById(req.params.id);
    res.json({
        status: "success",
        message: "Coupon fetched",
        coupon,
    });
});


export const updateCouponCtrl = asyncHandler(async (req, res)=>{
    const { code, startDate, endDate, discount } = req.body;
    const coupon = await Coupon.findByIdAndUpdate(
        req.params.id,
        {
            code: code?.toUpperCase(),
            discount,
            startDate,
            endDate
        },
        {
            new: true,
        }
    );
    res.json({
        status:"success",
        message: "Coupon updated successfully",
        coupon,
    });
});


export const deleteCouponCtrl = asyncHandler(async (req, res)=>{
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    res.json({
        status:"success",
        message: "Coupon deleted successfully",
    });
});