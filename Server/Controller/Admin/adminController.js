import Menu from "../../Model/Menu/menuSchema.js";
import Orders from "../../Model/Orders/ordersSchema.js";
import Notice from "../../Model/Notice/noticeSchema.js";
import User from "../../Model/User/userSchema.js"
import Complaint from "../../Model/Complaints/complaintSchema.js"
import DiscountLabel  from "../../Model/Labels/DiscountLabelsSchema.js"

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

export const postNotice = async(req,res)=>{
   try {
      const {messCode, text, type,time} = req.body;
      if(!messCode || !text || !type) return res.status(400).json({error:"messCode, text and type are required"});

      const notice = await Notice.create({messCode, text, type,time});
      return res.status(201).json({message:"Notice posted successfully",data:notice});

   } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to post notice" });
   }
}

export const getNotices = async(req,res)=>{
  try {
     const getallNotices = await Notice.find({messCode:req.params.messCode}).sort({time:-1});
     return res.status(200).json({message:"Notices fetched successfully",data:getallNotices});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to fetch notices" });
  }
}

export const deleteNotice = async(req,res)=>{
  try {
     const notice = await Notice.findByIdAndDelete(req.params.id);
     if(!notice) return res.status(404).json({message:"Notice not found"});
     return res.status(200).json({message:"Notice deleted successfully"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to delete notice" });
  }
}

export const getallUsers = async(req,res)=>{
  try {
    const {messCode} = req.params;
    const getusers = await User.find({messCode,role:"customer"});
    return res.status(200).json({message:"users fetched successfully",data:getusers})
  } catch (error) {
    console.log(error);
    return res.status(400).json(({error}))
  }
}

export const updateUserPayment = async (req, res) => {

  console.log(req.body)
  try {
    const { userId,  letestDue } = req.body;

    if (!userId || !letestDue ) {
      return res.status(400).json({
        error: "userId and latestDue are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const paid = Math.abs(user.payment - letestDue);

    user.payment = letestDue;
    user.paid += paid; // if cumulative

    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Something went wrong while updating user",
    });
  }
};
export const updateComplaints = async(req,res)=>{
  try {
    const {complaintId,newStatus} = req.body;
    const updateComplaint = await Complaint.findById(complaintId);
    updateComplaint.status = newStatus;
    await updateComplaint.save();
    return res.status(200).json({message:"complaint resolved success",data:updateComplaint})
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({error});
  }
}

export const createLabel = async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      labelName,
      tier,
      discount,
      minOrderValue,
      description,
    } = req.body;


    if (!labelName) {
      return res.status(400).json({ error: "Label name is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    const existing = await DiscountLabel.findOne({
      userId,
      labelName,
    });

    if (existing) {
      return res.status(400).json({ error: "Label already exists" });
    }

    const label = new DiscountLabel({
      userId,
      labelName,
      tier,
      discount,
      minOrderValue,
      description,
    });

    await label.save();

    return res.status(201).json({
      message: "Label created successfully",
      data: label,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export const getallLables = async(req,res)=>{
  try {
    const {userId} = req.params;
    const getlabels = await DiscountLabel.find({userId:userId});
    console.log(getlabels);
    return res.status(200).json(getlabels);
  } catch (error) {
    console.log(error);
    return res.status(400).json({error});
  }
}

export const deleteLabel = async(req,res)=>{
  try {
    const {labelId} = req.params;
    const deleteLabel = await DiscountLabel.findOneAndDelete(labelId);
    if(deleteLabel){
      return res.status(200).json({message:"label is deleted",data:deleteLabel})
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({error});
  }
}

// ── Assign label to a user ──
export const AssignLabel = async (req, res) => {
  try {
    const { labelName, discount, userId } = req.body;

    if (!userId || !labelName || discount === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { "label.labelName": labelName, "label.labelPrice": Number(discount) } },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({ message: "Label assigned", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

// ── Remove label from a user ──
export const UnassignLabel = async (req, res) => {
  try {
    const { userId } = req.params; // ✅ from URL param

    if (!userId) return res.status(400).json({ error: "userId is required" });

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { "label.labelName": null, "label.labelPrice": 0 } },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({ message: "Label removed", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};