import express from "express";
import { authMW } from "../middlewares/index.js";
import { authCons } from "../controllers/index.js";

const router = express.Router();

router.post(
  "/register",
  [authMW.isUsernameExists, authMW.isEmailExists],
  authCons.register
);

router.post(
  "/login",
  [authMW.isEmailExists, authMW.isPasswordCorrect, authMW.isUserActive],
  authCons.login
);

router.get("/logout", authCons.logout);

router.get(
  "/verifyToken",
  [authMW.verifyRefreshToken, authMW.verifyAccessToken],
  authCons.verifyToken
);

router.get("/verifyCode", authCons.verifyCode);

export default router;
