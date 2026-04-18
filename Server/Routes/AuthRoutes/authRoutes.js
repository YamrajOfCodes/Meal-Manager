import express from "express";
const router = express.Router();
import {RegisterUser,Login,getUserData} from "../../Controller/AuthController/authController.js"

router.post("/insertUser",RegisterUser);
router.post("/login",Login);
router.get("/getUserData/:userId", getUserData);


export default router;