import Order from "../../Model/Orders/ordersSchema.js"
import User from "../../Model/User/userSchema.js";


export const PlaceOrder = async (req, res) => {
 
    console.log(req.body);
    try {
        const { isVeg, mealTime, messCode,userId,items } = req.body;
        const user = await User.findOne({_id:userId});

        if(!user){
            return res.status(404).json({ error: "User not found" });
        }

        user.payment += items[0].price;;
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