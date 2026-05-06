import Order from "../../Model/Orders/ordersSchema.js"
import User from "../../Model/User/userSchema.js";
import Complaint from "../../Model/Complaints/complaintSchema.js";

export const PlaceOrder = async (req, res) => {
 
    console.log(req.body);
    try {
        const { isVeg, mealTime, messCode,userId,items } = req.body;
        const user = await User.findOne({_id:userId});

        if(!user){
            return res.status(404).json({ error: "User not found" });
        }

        const {advance} = user;

        if(advance > items[0].price){
            user.advance -= items[0].price;
        }else{
            let data = items[0].price - advance;
            user.advance = 0
            user.payment += data;
        }

        
        await user.save();
   

    //    console.log("items",items)
    //    console.log("items",items[0].name)


        const newOrder = new Order({
            name:items[0].name,
            price:items[0].price,
            messCode,
            userId,
            mealTime,
        });

        await newOrder.save();
        return res.status(201).json({ message: "Order placed successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to place order" });
    }

}


export const getMyOrders = async(req,res)=>{

     const {userId} = req.params;

    try {
        const orders = await Order.find({userId}).populate("userId","name email payment");
        return res.status(200).json({ message: "Orders fetched successfully", data: orders });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to fetch orders" });
    }
}

export const postComplaints = async (req, res) => {
    try {
        const { userId, messCode, desc, cat, status, date } = req.body;

        if (!userId || !messCode || !desc || !date || !cat || !status) {
            return res.status(400).json({ error: "all fields are required" });
        }

        const complaint = new Complaint({
            userId,
            category: cat,
            details: desc,
            messCode,
            status,
            date: new Date(date)
        });

        await complaint.save();

        return res.status(200).json({ message: "Your voice is raised successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

export const getAllComplaints = async(req,res)=>{

    const {messCode} = req.params;
    try {
        const complaints = await Complaint.find({messCode});
        return res.status(200).json({message:"complaints fetched successfully",data:complaints})
    } catch (error) {
        console.log(error);
        return res.status(400).json({error:"something went wrong while getting complaints"})
    }
}