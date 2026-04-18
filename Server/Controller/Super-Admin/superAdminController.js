import User from "../../Model/User/userSchema.js";



export const getAllOwners = async(req,res)=>{
  try {
      const ownersData = await User.find({role:"owner"});
      return res.status(200).json({message:"Owners fetched successfully", data:ownersData});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
}


export const updateMessOwner = async(req,res)=>{
  try {
    const { _id, name, email, phone, city, messName, messCode } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Owner ID is required" });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Update only the provided fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (city !== undefined) user.city = city;
    if (messName !== undefined) user.messName = messName;
    if (messCode !== undefined) user.messCode = messCode;

    await user.save();

    res.status(200).json({ message: "Owner updated successfully", data: user });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
}

export const deleteMessOwner = async(req,res)=>{

  try {
    const { ownerId } = req.params;
    if (!ownerId) {
      return res.status(400).json({ message: "Owner ID is required" });
    }
    const deleteUsr = await User.findByIdAndDelete(ownerId);
    if (!deleteUsr) {
      return res.status(404).json({ message: "Owner not found" });
    }
    res.status(200).json({ message: "Owner deleted successfully" });

  } catch (error) {
    console.log(error);
  }
  
}


export const UpdateMessStatus = async (req, res) => {
  console.log(req.body);
  try {
    const { ownerId, newStatus } = req.body;
    if (!ownerId || newStatus === undefined || newStatus === null) {
      return res.status(400).json({ message: "Owner ID and new status are required" });
    }

    const user = await User.findById(ownerId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isactive = newStatus;
    await user.save();

    res.status(200).json({ message: "Mess status updated successfully", data: user });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

