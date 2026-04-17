import express from "express";
import {UpdateMessStatus,getAllOwners} from "../../Controller/Super-Admin/superAdminController.js"
const router  = express.Router();


router.patch("/updateMessStatus", UpdateMessStatus);
router.get("/getAllOwners", getAllOwners);








export default router;