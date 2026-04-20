import express from "express";
import {UpdateMessStatus,getAllOwners,updateMessOwner,deleteMessOwner} from "../../Controller/Super-Admin/superAdminController.js"
import superAdminAuthenticate from "../../MiddleWare/SuperAdmin/superAdminAuthenticate.js";
const router  = express.Router();


router.patch("/updateMessStatus", superAdminAuthenticate, UpdateMessStatus);
router.get("/getAllOwners", superAdminAuthenticate, getAllOwners);
router.patch("/updateMessOwner", superAdminAuthenticate, updateMessOwner);
router.delete("/deleteMessOwner/:ownerId", superAdminAuthenticate, deleteMessOwner);



export default router;