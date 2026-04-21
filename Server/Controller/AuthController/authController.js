import User from "../../Model/User/userSchema.js";
import bcrypt from "bcrypt";

export const RegisterUser = async (req, res) => {
  try {
    const { name, email, password, phone, city, role, messName, messCode } = req.body;

    if (!name || !email || !password || !phone || !city || !role) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const existingUser = await User.findOne({ email });
    const existingMob  = await User.findOne({phone});

    if (existingUser || existingMob) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      phone,
      role,
      city,
      messName,
      messCode,
      payment:0,
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
        return res.status(400).json({ error: "invalid credentials" });
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
