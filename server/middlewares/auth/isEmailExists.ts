import type { Request, Response, NextFunction } from "express";
import { userModel } from "../../models/index.js";
import type { AuthUserDocument } from "../../types/express.js";
import { isEmailBody } from "../../utils/requestBody.js";

export default async function (req: Request, res: Response, next: NextFunction) {
  if (!isEmailBody(req.body)) {
    return res.status(400).json({
      statusCode: 400,
      from: "middlewares/isEmailExists 0",
      message: "A valid email is required.",
    });
  }

  const { email } = req.body;

  const userData = await userModel
    .findOne({ email })
    .lean<AuthUserDocument | null>();

  if (req.url.includes("login")) {
    if (!userData) {
      return res.status(404).json({
        statusCode: 404,
        from: "middlewares/isEmailExists 1",
        message: "Either email or password is incorrect.",
      });
    }

    req.localData = userData;
  }
  else if (req.url.includes("register")) {
    if (userData) {
      return res.status(409).json({
        statusCode: 409,
        from: "middlewares/isEmailExists 2",
        message: "An account with that email already exists.",
      });
    }
  }

  next();
}
