import type { Request, Response, NextFunction } from "express";
import { isUserDataExists } from "../../services/index.js";

export default async function isUsernameExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username } = req.body as { username: string };

  const isExists = await isUserDataExists({ username });

  if (isExists) {
    return res.status(409).json({
      statusCode: 409,
      from: "middlewares/isUsernameExists",
      message: "An account with that username already exists.",
    });
  }

  next();
}
