import express from "express";
import { getMenu } from "../../Controller/Admin/adminController.js";
import customerAuthenticate from "../../MiddleWare/Customer/customerAuthenticate.js";
import { PlaceOrder,getMyOrders } from "../../Controller/User/userController.js";
const router  = express.Router();


router.get("/getMenu/:messCode",customerAuthenticate,getMenu);
router.post("/placeOrder",customerAuthenticate,PlaceOrder);
router.get("/getMyOrders/:userId",customerAuthenticate,getMyOrders);


export default router;