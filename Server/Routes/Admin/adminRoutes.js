import express from "express";
const router  = express.Router();
import { addMenuItem, getMenu, deleteMenuItem, updateMenuItem } from "../../Controller/Admin/adminController.js";



router.post("/addMenu",addMenuItem);
router.get("/getMenu/:messCode",getMenu);
router.delete("/deleteMenu/:id",deleteMenuItem);
router.put("/updateMenu/:id",updateMenuItem);




export default router;