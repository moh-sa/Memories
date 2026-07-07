import express from "express";
import { authMW, dbMW } from "../middlewares/index.js";
import { memoryCons as memory } from "../controllers/index.js";

const router = express.Router();

//GET
router.get("/getALl", dbMW.isUsernameExist, memory.getAll);
router.get("/getTags", memory.getTags);
router.get(
  "/getSingle/:_id",
  [dbMW.isValid, dbMW.isMemoryExist],
  memory.getSingle
);

//POST
router.post(
  "/create",
  [authMW.verifyRefreshToken, authMW.verifyAccessToken],
  memory.create
);

//PATCH
router.patch(
  "/like",
  [authMW.verifyRefreshToken, authMW.verifyAccessToken, dbMW.isValid],
  memory.like
);
router.patch(
  "/update",
  [authMW.verifyRefreshToken, authMW.verifyAccessToken, dbMW.isValid],
  memory.update
);

//DELETE
router.delete(
  "/delete",
  [authMW.verifyRefreshToken, authMW.verifyAccessToken, dbMW.isValid],
  memory._delete
);

export default router;
