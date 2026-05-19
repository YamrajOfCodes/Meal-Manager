import User from "../../Model/User/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const RegisterUser = async (req, res) => {
  try {
    const { name, email, password, phone, city, role, messName, messCode,address,advance } = req.body;

    if (!name || !email || !password || !phone || !city || !role || !address) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const presentmessCode = await User.findOne({ messCode });

    if(presentmessCode){
      return res.status(400).json({message:"Code already exists, please choose a different one"})
    }

    if(phone.length < 10 || phone.length>10){
      return res.status(400).json({error:"please enter valid phone number"});
    }
    if (role == "customer") {
      const findMessCode = await User.findOne({
        role: "owner",
        messCode,
      });
      if (!findMessCode) {
        return res.status(400).json({ error: "invalid mess Code" });
      }
    }



    const existingUser = await User.findOne({ email });
    const existingMob  = await User.findOne({phone});

    if (existingUser) {
      return res.status(400).json({ message: "email already exists" });
    } 

    if(existingMob){
      return res.status(400).json({message:"phone number already exists"})
    }

    const newUser = new User({
      name,
      email,
      address,
      password,
      phone,
      role,
      city,
      messName,
      messCode,
      payment:0,
      advance:advance ||0,
      label:{
       labelName:"",
       labelPrice:""
      },
      isactive: role === "owner" ? false : true
    });

    await newUser.save();

    const userData = newUser.toObject();
    delete userData.password;

    if(role === "owner"){
      return res.status(200).json({
        message: "We Successfully registered you as an owner, please wait for admin approval",
        data: userData,
      });
    }

    res.status(201).json({
      message: "User registered successfully",
      data: userData,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};


 export  const Login = async (req,res) => {

    try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Both fields are required" });
    }

    const validUser = await User.findOne({ email });
    if (!validUser) {
        return res.status(400).json({ error: "user is not exists, please register first" });
    }

    const validpassword = await bcrypt.compare(password, validUser.password);
    console.log('Password comparison result:', validpassword);

    if (!validpassword) {
        return res.status(400).json({ error: "Password is incorrect" });
    }


    if (!validUser.isactive) {
        return res.status(400).json({ error: "Your account is not yet approved" });
    }


    const access_token = await validUser.generateToken();
    
    const result = {
        validUser,
        access_token
    };

    res.status(200).json(result);
} catch (error) {
    console.error('Error during login process:', error);
    res.status(500).json({ error: "Internal Server Error" });
}
 }

 export const getUserData = async(req,res)=>{  

  try {
     const {userId} = req.params;
     const findUsre = await User.findById(userId);
      if(!findUsre){
        return res.status(404).json({ error: "User not found" });
      }
      const userData = findUsre.toObject();
      delete userData.password;
      res.status(200).json({message:"User data fetched successfully", data:userData});
  } catch (error) {
    console.log(error)
  }

  }


export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.USER_SECRET);

    // Find user by decoded id
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the token
    user.tokens = user.tokens.filter((element) => {
      return element.token !== token;
    });

    await user.save();

    return res.status(200).json({ message: "User is logged out" });

  } catch (error) {
    return res.status(500).json({ message: "Server error during logout" });
  }
};
