import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import Category from "../model/Category.js";
import Brand from "../model/Brand.js";

// @desc Create new product
// @route POST /api/v1/products
//@access Private/Admin

export const createProductCtrl = asyncHandler(async(req, res)=>{

    // const convertedImages = files.map((file)=>file.path);
    // console.log(convertedImages);

    console.log(1);
    console.log(req.file);

    // const {name, description, category, sizes,
    // colors, price, totalQty, brand} = req.body;
    
    // //Product exists
    // const productExists = await Product.findOne({ name });
    // if(productExists){
    //     throw new Error("Product Already Exists");
    // }

    //  //find the brand
    //  const brandFound = await Brand.findOne({
    //     name: brand.toLowerCase(),
    // });
    // if(!brandFound){
    //     throw new Error("Brand not found, please create brand first");
    // };

    // //find the category
    // const categoryFound = await Category.findOne({
    //     name: category,
    // });
    // if(!categoryFound){
    //     throw new Error("Category not found, please create category first");
    // };
    // //create the product
    // const product = await Product.create({
    //     name,
    //     description,
    //     category,
    //     sizes,
    //     colors,
    //     user: req.userAuthId, // basically kis user ne product banaya hai
    //     price,
    //     totalQty,
    //     brand,
   
    // });

    // //push the product into the category
    // categoryFound.products.push(product._id);
    // //resave
    // await categoryFound.save();

    // brandFound.products.push(product._id);
    // await brandFound.save();
    
    // // const temp = await Category.findOne({name: "Men"}).exec();
    // // temp.products.push(product._id);
    // // await temp.save();

    // res.json({
    //     status: "success",
    //     message: "Product created successfully",
    //     product,
    // })
});

// @desc  Get all product
// @route GET /api/v1/products
//@access Public

export const getProductsCtrl = asyncHandler(async(req, res)=>{
    //query
    let productQuery = Product.find();
    
    //filter by name
    if(req.query.name){
//         If the condition is true (meaning the query parameter name        exists), it modifies the productQuery.
            // productQuery is assumed to be a MongoDB query object, possibly created earlier with Product.find().
            // The .find() method is used to filter the query based on the provided conditions inside the object.
            // Here, it's searching for documents where the name field matches a regular expression.
            // The regular expression ($regex: req.query.name) is constructed using the value of the name query parameter, and $options: 'i' ensures that the search is case-insensitive.

        productQuery = productQuery.find({
            name:{$regex: req.query.name, $options:'i'}
        });
    }

    //filter by brand
    if(req.query.brand){
        productQuery = productQuery.find({
            brand:{$regex: req.query.brand, $options:'i'}
        });
    }

    //filter by category
    if(req.query.category){
        productQuery = productQuery.find({
            category:{$regex: req.query.category, $options:'i'}
        });
    }

    //filter by colors
    if(req.query.colors){
        productQuery = productQuery.find({
            colors:{$regex: req.query.colors, $options:'i'}
        });
    }

    //filter by sizes
    if(req.query.sizes){
        productQuery = productQuery.find({
            sizes:{$regex: req.query.sizes, $options:'i'}
        });
    }

    //filter by price range
    if(req.query.price){
        const priceRange = req.query.price.split("-");
        // gte: greater than or equal to
        //lte: less than or equal to
        productQuery = productQuery.find({
            price:{$gte: priceRange[0], $lte: priceRange[1]},
        });
    }

    //pagination
    //page
    const page = parseInt(req.query.page) ? parseInt(req.query.page):1; 
    //limit
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit):10;
    //startIdx
    const startIdx = (page-1)*limit;
    //endIdx
    const endIdx = page*limit;
    //total
    const total = await Product.countDocuments();

    productQuery = productQuery.skip(startIdx).limit(limit);

    //pagination result
    const pagination={}
    if(endIdx < total){
        pagination.next = {
            page: page + 1,
            limit,
        };
    }
    if(startIdx > 0){
        pagination.prev= {
            page: page - 1,
            limit,
        };
    }

    //await the query
    const products = await productQuery.populate('reviews'); 

    res.json({
        status:"success",
        total,
        results: products.length,
        pagination,
        message: "Products fetched successfully",
        products,             
    })
});

// @desc  Get single product
// @route GET /api/v1/products/:id
//@access Public

export const getProductSingleCtrl = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id).populate('reviews');
    if(!product){
        throw new Error("Product not found");
    }
    res.json({
        status: "success",
        message: "Product fetched successfully",
        product,
    })
});

// @desc  update product
// @route PUT /api/v1/products/:id/update
//@access Private/Admin

export const updateProductCtrl = asyncHandler(async(req, res) =>{
    const {
        name,
        description, 
        category,
        sizes,
        colors,
        user,
        price,
        totalQty,
        brand,
    } = req.body;

    //update
    const product = await Product.findByIdAndUpdate(req.params.id, {
        name,
        description, 
        category,
        sizes,
        colors,
        user,
        price,
        totalQty,
        brand,
    },
    {
        new: true,
    }
 );
 res.json({
    status: "success",
    message: "Product updated successfully",
    product,
})
});

// @desc  delete product
// @route PUT /api/v1/products/:id/delete
//@access Private/Admin

export const deleteProductCtrl = asyncHandler(async(req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    res.json({
        status: "success",
        message: "Product deleted successfully",
    });
});