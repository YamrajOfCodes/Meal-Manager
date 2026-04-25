import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    messCode:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }
});


export default mongoose.model("ComplaintModel",complaintSchema);