import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        userId: {
            type: String,
            ref:"User",
            required: true
        },

        price: {
            type: Number,
            required: true,
        },

        mealTime: {
            type: String,
            required: true,
        },
        address:{
            type:String,
            required:true
        },

        messCode: {
            type: String,
            required: true,
        },

    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Order", orderSchema);