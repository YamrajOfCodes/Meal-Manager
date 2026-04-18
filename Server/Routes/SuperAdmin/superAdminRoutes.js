import express from "express";
import {UpdateMessStatus,getAllOwners,updateMessOwner,deleteMessOwner} from "../../Controller/Super-Admin/superAdminController.js"
const router  = express.Router();


router.patch("/updateMessStatus", UpdateMessStatus);
router.get("/getAllOwners", getAllOwners);
router.patch("/updateMessOwner", updateMessOwner);
router.delete("/deleteMessOwner/:ownerId", deleteMessOwner);







export default router;