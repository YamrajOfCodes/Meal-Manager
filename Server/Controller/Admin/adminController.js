import Menu from "../../Model/Menu/menuSchema.js";
import Orders from "../../Model/Orders/ordersSchema.js";

export const addMenuItem = async (req, res) => {
  try {
    const { messCode, name, price, isVeg, mealTime } = req.body;

    if (!messCode || !name || !price || !mealTime) {
      return res.status(400).json({ message: "messCode, name, price and mealTime are required" });
    }

    const item = await Menu.create({ messCode, name, price, isVeg, mealTime });

    res.status(201).json({ message: "Menu item added successfully", data: item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/menu/:messCode
export const getMenu = async (req, res) => {
  try {
    const items = await Menu.find({ messCode: req.params.messCode });

    res.status(200).json({ message: "Menu fetched successfully", data: items });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/menu/:id
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await Menu.findByIdAndDelete(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/menu/:id
// body: { name, price, isVeg, mealTime }
export const updateMenuItem = async (req, res) => {
  try {
    const item = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!item) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ message: "Item updated successfully", data: item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getOrders = async(req,res)=>{
  try {
     const getAllOrders = await Orders.find({messCode:req.params.messCode}).populate("userId","name email");
      res.status(200).json({message:"Orders fetched successfully",data:getAllOrders})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
}