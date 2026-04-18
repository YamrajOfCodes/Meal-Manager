import express from "express";
const router  = express.Router();
import {getAllCustomers} from "../../Controller/Admin/adminController.js"

router.get("/getAllCustomers", getAllCustomers);




export default router;