import asyncHandler from "express-async-handler";
import Color from "../model/Color.js";

// @desc  Create new Color
// @route POST /api/v1/colors
//@access Private/Admin

export const createColorCtrl = asyncHandler(async(req, res) => {
    let { name } = req.body;
    // Check if brand exists
    name = name.toLowerCase();
    const colorFound = await Color.findOne({name});
    if(colorFound){
        throw new Error("Color already exists");
    }
    //Create
    const color = await Color.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });

    res.json({
        status: "success",
        message: "Color Created successfully",
        color,
    });
});

// @desc  Get all colors
// @route GET /api/v1/colors
//@access Public

export const getAllColorsCtrl = asyncHandler(async(req, res) => {
    const colors = await Color.find();

    res.json({
        status: "success",
        message: "colors fetched successfully",
        colors,
    });
});

// @desc  Get single colors
// @route GET /api/v1/categcolors/:id
//@access Public

export const getSignleColorsCtrl = asyncHandler(async(req, res) => {
    const colors = await Color.findById(req.params.id);

    res.json({
        status: "success",
        message: "Color fetched successfully",
        colors,
    });
});

// @desc  Update color
// @route PUT /api/v1/colors/:id
//@access Private/Admin

export const updateColorCtrl = asyncHandler(async(req, res) =>{
    const { name } = req.body;

    //update
    const color = await Color.findByIdAndUpdate(req.params.id, {
        name,
    },
    {
        new: true,
    }
 );
 res.json({
    status: "success",
    message: "Color updated successfully",
    color,
})
});

// @desc  delete color
// @route PUT /api/v1/colors/:id
//@access Private/Admin

export const deleteColorCtrl = asyncHandler(async(req, res) => {
    await Color.findByIdAndDelete(req.params.id);

    res.json({
        status: "success",
        message: "Color deleted successfully",
    });
});