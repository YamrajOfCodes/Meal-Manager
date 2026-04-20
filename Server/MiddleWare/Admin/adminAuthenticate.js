import jwt from "jsonwebtoken"
import userDb from "../../Model/User/userSchema.js"
import dotenv from "dotenv"

dotenv.config();
const ADMIN_SECRET_KEY = process.env.USER_SECRET;

const adminauthenticate = async(req,res,next)=>{
  
    const token = req.headers.authorization;
    if(!token){
    return res.status(401).json({error:"token is required"})
    }
    
    // Strip 'Bearer ' prefix if present
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    console.log(cleanToken)
    
    try {
      const verifyToken = jwt.verify(cleanToken, ADMIN_SECRET_KEY);

      console.log(verifyToken);
      
      const rootUser = await userDb.findOne({_id:verifyToken._id});
      
      if(!rootUser){
        return res.status(404).json({error:"user not found"})
      }

      req.token = cleanToken
      req.rootUser = rootUser
      req.userId = rootUser._id

      if(rootUser.role !== "owner"){
        return res.status(403).json({error:"Access denied. Owners only."})
      }

      next();
    } catch (error) {
      return res.status(401).json({error:"Invalid or expired token", details: error.message})
    }
} 

export default adminauthenticate;