import type { Request, Response, NextFunction } from "express";
import { helpers } from "../../utils/index.js";
import { isLoginBody } from "../../utils/requestBody.js";

export default async function (req: Request, res: Response, next: NextFunction) {
  const userData = req.localData;

  if (!isLoginBody(req.body)) {
    return res.status(400).json({
      statusCode: 400,
      from: "middlewares/auth/isPasswordsCorrect",
      message: "Either email or password is incorrect.",
    });
  }

  const { password } = req.body;

  if (!userData || !("password" in userData)) {
    return res.status(409).json({
      statusCode: 409,
      from: "middlewares/auth/isPasswordsCorrect",
      message: "Either email or password is incorrect.",
    });
  }

  const isCorrect = await helpers.verifyBcrypt(password, userData.password);

  if (!isCorrect) {
    return res.status(409).json({
      statusCode: 409,
      from: "middlewares/auth/isPasswordsCorrect",
      message: "Either email or password is incorrect.",
    });
  }

  next();
}
