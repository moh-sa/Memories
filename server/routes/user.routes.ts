import express from "express";
import { dbMW } from "../middlewares/index.js";
import { userCons as user } from "../controllers/index.js";

const router = express.Router();

//GET
router.get("/getProfile/:username", dbMW.isUsernameExist, user.getProfile);

export default router;
