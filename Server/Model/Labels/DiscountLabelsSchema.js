import mongoose from "mongoose";

const labelSchema = new mongoose.Schema(
  {
    userId:{
     type:String,
     required:true
    },

    labelName: {
      type: String,
      required: true,
      trim: true,
    },

    tier: {
      type: String,
      enum: ["basic", "silver", "gold","vip","custom"],
      default: "basic",
    },

    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    minOrderValue: {
      type: Number,
      min: 0,
      default: 0,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Label", labelSchema);