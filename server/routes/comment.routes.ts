import express from "express";
import { authMW, dbMW } from "../middlewares/index.js";
import { commentCons as comment } from "../controllers/index.js";

const router = express.Router();

//GET
router.get("/getALl", [dbMW.isValid, dbMW.isCommentsExist], comment.getAll);

//POST
router.post(
  "/create",
  [authMW.verifyRefreshToken, authMW.verifyAccessToken],
  comment.create
);

//PATCH
router.patch(
  "/like",
  [authMW.verifyRefreshToken, authMW.verifyAccessToken, dbMW.isValid],
  comment.like
);
router.patch(
  "/update",
  [authMW.verifyRefreshToken, authMW.verifyAccessToken, dbMW.isValid],
  comment.update
);

//DELETE
router.delete(
  "/delete",
  [authMW.verifyRefreshToken, authMW.verifyAccessToken, dbMW.isValid],
  comment._delete
);

export default router;
