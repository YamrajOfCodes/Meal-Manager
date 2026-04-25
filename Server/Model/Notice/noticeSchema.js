import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true,
        enum:["info","payment","menu","urgent"]
    },
    time:{
        type:Date,
        default:Date.now
    },
    messCode:{
        type:String,
        required:true
    }
});


export default mongoose.model("NoticeModel",noticeSchema);