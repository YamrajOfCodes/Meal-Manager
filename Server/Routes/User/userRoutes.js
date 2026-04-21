import express from "express";
import { getMenu } from "../../Controller/Admin/adminController.js";
import customerAuthenticate from "../../MiddleWare/Customer/customerAuthenticate.js";
import { PlaceOrder } from "../../Controller/User/userController.js";
const router  = express.Router();


router.get("/getMenu/:messCode",customerAuthenticate,getMenu);
router.post("/placeOrder",customerAuthenticate,PlaceOrder);



export default router;