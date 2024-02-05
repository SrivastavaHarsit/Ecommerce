import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";

// @desc  Create new Category
// @route POST /api/v1/categoeies
//@access Private/Admin

export const createCategoryCtrl = asyncHandler(async(req, res) => {
    let { name } = req.body;
    name = name.toLowerCase();
    // Check if category exists
    const categoryFound = await Category.findOne({name});
    if(categoryFound){
        throw new Error("Category already exists");
    }
    //Create
    const category = await Category.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });

    res.json({
        status: "success",
        message: "Category Created successfully",
        category,
    });
});

// @desc  Get all categories
// @route GET /api/v1/categoeies
//@access Public

export const getAllCategoriesCtrl = asyncHandler(async(req, res) => {
    const categories = await Category.find();

    res.json({
        status: "success",
        message: "Categories fetched successfully",
        categories,
    });
});

// @desc  Get single category
// @route GET /api/v1/categoeies/:id
//@access Public

export const getSignleCategoryCtrl = asyncHandler(async(req, res) => {
    const category = await Category.findById(req.params.id);

    res.json({
        status: "success",
        message: "Category fetched successfully",
        category,
    });
});

// @desc  Update category
// @route PUT /api/v1/categories/:id
//@access Private/Admin

export const updateCategoryCtrl = asyncHandler(async(req, res) =>{
    const { name } = req.body;

    //update
    const category = await Category.findByIdAndUpdate(req.params.id, {
        name,
    },
    {
        new: true,
    }
 );
 res.json({
    status: "success",
    message: "Category updated successfully",
    category,
})
});

// @desc  delete category
// @route PUT /api/v1/categories/:id/delete
//@access Private/Admin

export const deleteCategoryCtrl = asyncHandler(async(req, res) => {
    const product = await Category.findByIdAndDelete(req.params.id);

    res.json({
        status: "success",
        message: "Category deleted successfully",
    });
});