import User from "../model/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/veriftToken.js";

// @description Register User
// @route       POST /api/v1/users/register
// @access      Private/Admin
export const registerUserCtrl = asyncHandler(async(req, res)=> {
    const { fullname, email, password } = req.body;
    // Check user exists
    const userExists = await User.findOne({ email });
    if(userExists){
        //throw
        // res.json({
        //     msg: 'User already exists',
        // });

        throw new Error("User already exists");
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create the user
    const user = await User.create({
        fullname, 
        email,
        password: hashedPassword,
    });
    res.status(201).json({
        status: "success",
        message: "User Registered Successfully",
        data: user,
    });
});

// @description Login User
// @route       POST /api/v1/users/login
// @access      Public
export const loginUserCtrl = asyncHandler(async(req, res)=>{
    const { email, password } = req.body;
    //Find the user in db by email only
    const userFound = await User.findOne({
        email,
    });
    if(userFound && (await bcrypt.compare(password, userFound?.password))){
        res.json({
            status:"success",
            message:"User login successful",
            userFound,
            token: generateToken(userFound?._id),
        });
    }else{
        throw new Error('Invalid login credentials');
    }
});

// @description Get user profile
// @route       GET /api/v1/users/profile
// @access      Private
export const getUserProfileCtrl = asyncHandler(async (req, res)=>{
   //find the user
   const user = await User.findById(req.userAuthId).populate('orders');
   res.json({
    status: 'success',
    message: 'User profile fetched  successfully!',
    user,
   });
});

// @description Update user shipping address
// @route       PUT /api/v1/users/update/shipping
// @access      Private
export const updateShippingAddressCtrl = asyncHandler(async (req, res)=>{
    const { firstName, lastName, address, city, 
    postalCode, province, phone } = req.body;

    const user = await User.findByIdAndUpdate(req.userAuthId, {
        shippingAddress: {
            firstName,
            lastName,
            address,
            city,
            postalCode,
            province,
            phone,
        },
        hasShippingAddress: true,
    },
    {
        new: true,
    });

    res.json({
        status: "success",
        message: "User shipping address updated successfully",
        user,
    })
});

