import mongoose from "mongoose";
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        // Define the 'user' field properties here
        type: mongoose.Schema.Types.ObjectId, // Assuming it's an ObjectId
        ref: "User", // Assuming it references a 'User' model
        required: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
     },
   ],
 },
 { timestamps: true }
);

const BrandModel = mongoose.model('Brand', BrandSchema);

export default BrandModel;