import express from "express";
const router  = express.Router();
import { addMenuItem, getMenu, deleteMenuItem, updateMenuItem,getOrders } from "../../Controller/Admin/adminController.js";
import adminauthenticate from "../../MiddleWare/Admin/adminAuthenticate.js";



router.post("/addMenu",adminauthenticate,addMenuItem);
router.get("/getMenu/:messCode",adminauthenticate,getMenu);
router.delete("/deleteMenu/:id",adminauthenticate,deleteMenuItem);
router.put("/updateMenu/:id",adminauthenticate,updateMenuItem);

router.get("/getOrders/:messCode",adminauthenticate,getOrders);




export default router;