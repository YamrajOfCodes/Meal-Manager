import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    messCode: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    date:{
      type: String,
      required:true
    },
    mealTime: {
      type: String,
      required: true,
      enum: ["Breakfast", "Lunch", "Dinner"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Menu", menuSchema);