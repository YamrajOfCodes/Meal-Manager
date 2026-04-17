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



export const UpdateMessStatus = async (req, res) => {
  try {
    const { ownerId, newStatus } = req.body;
    if (!ownerId || !newStatus) {
      return res.status(400).json({ message: "Owner ID and new status are required" });
    }

    const user = await User.findById(ownerId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.messStatus = newStatus;
    await user.save();

    res.status(200).json({ message: "Mess status updated successfully", data: user });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

