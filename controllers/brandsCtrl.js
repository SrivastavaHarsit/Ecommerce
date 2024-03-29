import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";

// @desc  Create new Brand
// @route POST /api/v1/brands
//@access Private/Admin

export const createBrandCtrl = asyncHandler(async(req, res) => {
    let { name } = req.body;
    name = name.toLowerCase();
    // Check if brand exists
    const brandFound = await Brand.findOne({name});
    if(brandFound){
        throw new Error("Brand already exists");
    }
    //Create
    const brand = await Brand.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });

    res.json({
        status: "success",
        message: "Brand Created successfully",
        brand,
    });
});

// @desc  Get all brands
// @route GET /api/v1/brands
//@access Public

export const getAllBrandsCtrl = asyncHandler(async(req, res) => {
    const brands = await Brand.find();

    res.json({
        status: "success",
        message: "Brands fetched successfully",
        brands,
    });
});

// @desc  Get single brand
// @route GET /api/v1/categoeies/:id
//@access Public

export const getSignleBrandsCtrl = asyncHandler(async(req, res) => {
    const brand = await Brand.findById(req.params.id);

    res.json({
        status: "success",
        message: "Brand fetched successfully",
        brand,
    });
});

// @desc  Update brand
// @route PUT /api/v1/categories/:id
//@access Private/Admin

export const updateBrandsCtrl = asyncHandler(async(req, res) =>{
    const { name } = req.body;

    //update
    const brand = await Brand.findByIdAndUpdate(req.params.id, {
        name,
    },
    {
        new: true,
    }
 );
 res.json({
    status: "success",
    message: "brand updated successfully",
    brand,
})
});

// @desc  delete brand
// @route PUT /api/v1/brands/:id
//@access Private/Admin

export const deleteBrandsCtrl = asyncHandler(async(req, res) => {
    await Brand.findByIdAndDelete(req.params.id);

    res.json({
        status: "success",
        message: "Brand deleted successfully",
    });
});