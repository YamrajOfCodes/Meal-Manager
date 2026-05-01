import express from "express";
const router  = express.Router();
import { 
    addMenuItem, 
    getMenu, 
    deleteMenuItem, 
    updateMenuItem,
    getOrders,
    deleteNotice,
    getNotices,
    postNotice,
    getallUsers,
    updateUserPayment,
    updateComplaints
   } from "../../Controller/Admin/adminController.js";
import adminauthenticate from "../../MiddleWare/Admin/adminAuthenticate.js";



router.post("/addMenu",adminauthenticate,addMenuItem);
router.get("/getMenu/:messCode",adminauthenticate,getMenu);
router.delete("/deleteMenu/:id",adminauthenticate,deleteMenuItem);
router.put("/updateMenu/:id",adminauthenticate,updateMenuItem);

router.get("/getOrders/:messCode",adminauthenticate,getOrders);
router.post("/postNotice",adminauthenticate,postNotice);
router.get("/getNotices/:messCode",getNotices);
router.delete("/deleteNotice/:id",adminauthenticate,deleteNotice);

router.get("/getallusers/:messCode",adminauthenticate,getallUsers);
router.put("/updateUserPayment",adminauthenticate,updateUserPayment)

router.patch("/updateComplaint",adminauthenticate,updateComplaints);




export default router;