import Order from "../../Model/Orders/ordersSchema.js"


export const PlaceOrder = async (req, res) => {
 
    console.log(req.body);
    try {
        const { isVeg, mealTime, messCode,userId,items } = req.body;
   

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