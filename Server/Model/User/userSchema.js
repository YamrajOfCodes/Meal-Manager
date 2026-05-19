import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();
const USER_SECRET = process.env.USER_SECRET

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required:true
  },

  payment:{
    type:Number,
  },

  paid:{
    type:Number,
    default:0
  },
  advance:{
   type:Number
  },

  city:{
    type:String,
    required:true
  },

  messName:{
    type:String
  },

  messCode:{
   type:String
  },

  address:{
    type:String,
    required:true
  },

  isactive:{
    type:Boolean
  },

 label: {
  labelName: {
    type: String,
    trim: true,
  },
  labelPrice: {
    type: Number,
  },
},

  role: {
    type: String,
    enum: ["superadmin", "owner", "customer"],
  },

 tokens: [
    {
      token: {
        type:String
      }
    }
  ],

});


userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});


userSchema.methods.generateToken = async function () {
  try {
    const token = jwt.sign(
      {
        _id: this._id,
        role: this.role,
        messCode: this.messCode
      },
      USER_SECRET
    );

    this.tokens = this.tokens.concat({ token });
    await this.save();

    return token;

  } catch (error) {
    console.log(error);
  }
};

export default mongoose.model("User", userSchema);