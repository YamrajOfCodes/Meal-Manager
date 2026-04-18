

import User from "../../Model/User/userSchema.js";

export const getAllCustomers = async(req,res)=>{
    try {
        const {messCode} = req.query;
        console.log('Received messCode:', messCode);
        console.log('Request query:', req.query);

        if(!messCode){
            console.log('Mess code is missing');
            return res.status(400).json({message:"Mess code is required"});
        }

        const users = await User.find({messCode})
        console.log('Found users:', users);
        console.log('Number of users found:', users.length);

        return res.status(200).json({message:"Users fetched successfully", data:users});
    } catch (error) {
        console.log('Error in getAllCustomers:', error);
        return res.status(500).json({ message: "Server Error" });
    }
}