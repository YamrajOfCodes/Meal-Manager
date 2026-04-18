import mongoose from "mongoose"
import bcrypt from "bcrypt"
const USER_SECRET = "sdoskdok"
import jwt from "jsonwebtoken"

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

  isactive:{
    type:Boolean
  },

  role: {
    type: String,
    enum: ["superadmin", "owner", "user"],
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
      USER_SECRET,
      { expiresIn: "1d" }
    );

    this.tokens = this.tokens.concat({ token });
    await this.save();

    return token;

  } catch (error) {
    console.log(error);
  }
};

export default mongoose.model("User", userSchema);